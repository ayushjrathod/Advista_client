import { mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import process from "node:process";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const tempDir = path.join(projectRoot, ".tmp", "cube-video");
const tempVideoDir = path.join(tempDir, "playwright-video");
const outputPath = path.join(publicDir, "cube2.mp4");
const temporaryMp4Path = path.join(tempDir, "cube2.mp4");

const trimStartSeconds = Number(process.env.CUBE_VIDEO_TRIM_START_SECONDS || 2);
const loopDurationSeconds = Number(process.env.CUBE_VIDEO_LOOP_DURATION_SECONDS || 12);
const durationMs = Number(process.env.CUBE_VIDEO_DURATION_MS || (trimStartSeconds + loopDurationSeconds + 1) * 1000);
const settleDelayMs = Number(process.env.CUBE_VIDEO_SETTLE_MS || 1500);
const viewportSize = Number(process.env.CUBE_VIDEO_SIZE || 1080);
const port = Number(process.env.CUBE_VIDEO_PORT || 4178);
const recorderUrl = `http://127.0.0.1:${port}/cube-recorder`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: options.stdio ?? "pipe",
      env: { ...process.env, ...options.env },
    });

    let stdout = "";
    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}\n${stderr || stdout}`));
    });
  });
}

async function ensureFfmpeg() {
  try {
    await runCommand("ffmpeg", ["-version"]);
  } catch {
    throw new Error(
      "ffmpeg is required to create cube2.mp4. Install it first with `brew install ffmpeg`, then rerun `npm run export:cube-video`."
    );
  }
}

async function startVitePreview() {
  const child = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port)], {
    cwd: projectRoot,
    env: process.env,
    stdio: "pipe",
  });

  let combinedOutput = "";
  let ready = false;

  const handleOutput = (chunk) => {
    combinedOutput += chunk.toString();
  };

  child.stdout.on("data", handleOutput);
  child.stderr.on("data", handleOutput);

  for (let attempt = 0; attempt < 60; attempt += 1) {
    await wait(500);

    if (/http:\/\/127\.0\.0\.1:/i.test(combinedOutput)) {
      ready = true;
      break;
    }

    if (child.exitCode != null) {
      break;
    }
  }

  if (!ready) {
    child.kill("SIGTERM");
    throw new Error(`Vite preview did not start successfully.\n${combinedOutput}`);
  }

  return child;
}

async function exportCubeVideo() {
  await ensureFfmpeg();
  await mkdir(tempVideoDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  console.log("Building the app for recording...");
  await runCommand("npm", ["run", "build"], { cwd: projectRoot, stdio: "inherit" });

  console.log("Starting preview server...");
  const previewProcess = await startVitePreview();

  let browser;

  try {
    console.log("Recording cube animation...");
    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      throw new Error(
        `Playwright Chromium is not installed. Run \`npx playwright install chromium\` and try again.\n${error.message}`
      );
    }

    const context = await browser.newContext({
      viewport: { width: viewportSize, height: viewportSize },
      recordVideo: {
        dir: tempVideoDir,
        size: { width: viewportSize, height: viewportSize },
      },
      deviceScaleFactor: 1,
      colorScheme: "dark",
    });

    const page = await context.newPage();
    await page.goto(recorderUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__ADVISTA_CUBE_RECORDER_READY__ === true, undefined, { timeout: 15000 });
    await wait(settleDelayMs);
    await wait(durationMs);

    const video = page.video();
    await page.close();
    await context.close();

    const recordedPath = await video.path();

    console.log("Converting recording to mp4...");
    await runCommand("ffmpeg", [
      "-y",
      "-ss",
      String(trimStartSeconds),
      "-t",
      String(loopDurationSeconds),
      "-i",
      recordedPath,
      "-an",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      temporaryMp4Path,
    ], { stdio: "inherit" });

    await rename(temporaryMp4Path, outputPath);
    console.log(`Saved ${outputPath}`);
  } finally {
    if (browser) {
      await browser.close();
    }

    previewProcess.kill("SIGTERM");
    await rm(tempDir, { recursive: true, force: true });
  }
}

exportCubeVideo().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
