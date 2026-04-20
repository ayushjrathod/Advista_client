import RubiksCubeScene from "@/components/landing/RubiksCube";
import { useEffect } from "react";

const LOOP_DURATION_MS = 12000;
const LOOP_START_DELAY_MS = 2000;

export default function CubeRecorderPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__ADVISTA_CUBE_IS_TURNING__ = false;
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#050506]">
      <div className="relative h-screen w-screen">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,248,248,0.1),rgba(5,5,6,0)_55%)]" />
        <div className="absolute inset-0 flex items-center justify-center p-12 sm:p-16">
          <RubiksCubeScene
            forceVisible
            interactive={false}
            className="h-full w-full max-h-[960px] max-w-[960px]"
            cameraPosition={[0, 0, 7.4]}
            sceneScale={0.9}
            loopMode
            loopDurationMs={LOOP_DURATION_MS}
            loopStartDelayMs={LOOP_START_DELAY_MS}
            onSceneReady={() => {
              if (typeof window !== "undefined") {
                window.__ADVISTA_CUBE_RECORDER_READY__ = true;
              }
            }}
          />
        </div>
      </div>
    </main>
  );
}
