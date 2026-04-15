import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, FXAA } from "@react-three/postprocessing";
import { Environment } from "@react-three/drei";
import { Tween, Group as TweenGroup } from "@tweenjs/tween.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

RectAreaLightUniformsLib.init();

const CUBES_PER_SIDE = 3;

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function createRoundedBoxGeometry() {
  const width = 1, height = 1, depth = 1, radius0 = 0.09, smoothness = 40;
  const shape = new THREE.Shape();
  const eps = 0.00001;
  const radius = radius0 - eps;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true);
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness,
  });
  geometry.center();
  return geometry;
}

function startLayerRotation(cubesGroup, tweenGroup, timeouts, delay = 2000) {
  if (!cubesGroup || !cubesGroup.children.length) return;

  if (Math.random() > 0.5) {
    cubesGroup.rotateY(Math.PI / 2);
  } else {
    cubesGroup.rotateZ(Math.PI / 2);
  }

  const sideIndex = Math.floor(Math.random() * CUBES_PER_SIDE);
  const side = cubesGroup.children[sideIndex];
  if (!side) return;

  const angleX = Math.random() > 0.5 ? -Math.PI : Math.PI;
  const pause = Math.random() * 1000;

  new Tween(side.rotation, tweenGroup)
    .delay(pause)
    .to({ x: side.rotation.x + angleX, y: side.rotation.y, z: side.rotation.z }, delay)
    .onComplete(() => {
      const id = setTimeout(() => startLayerRotation(cubesGroup, tweenGroup, timeouts, delay), pause);
      timeouts.push(id);
    })
    .start();
}

function CubeSceneContents({ outerRef }) {
  const innerRef = useRef();
  const cubesRef = useRef();
  const keyLightRef = useRef();
  const fillLightRef = useRef();
  const tweenGroupRef = useRef(new TweenGroup());
  const timeoutsRef = useRef([]);

  const geometry = useMemo(() => createRoundedBoxGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 1.0,
        // 0.07 gives a broad-enough specular lobe to avoid clipped rim spikes
        // while keeping the dark metallic look
        roughness: 0.07,
      }),
    []
  );

  const layerPositions = useMemo(() => {
    const offset = (CUBES_PER_SIDE - 1) / 2;
    return Array.from({ length: CUBES_PER_SIDE }, (_, i) =>
      Array.from({ length: CUBES_PER_SIDE }, (_, j) =>
        Array.from({ length: CUBES_PER_SIDE }, (_, k) => [
          (i - offset) * 1.03,
          (j - offset) * 1.03,
          (k - offset) * 1.03,
        ])
      ).flat()
    );
  }, []);

  useEffect(() => {
    const keyLight = keyLightRef.current;
    const fillLight = fillLightRef.current;
    const cubesGroup = cubesRef.current;
    const tweenGroup = tweenGroupRef.current;
    const timeouts = timeoutsRef.current;

    // Aim both rect area lights at the origin so emission direction is correct
    if (keyLight) keyLight.lookAt(0, 0, 0);
    if (fillLight) fillLight.lookAt(0, 0, 0);

    if (!cubesGroup) return;
    startLayerRotation(cubesGroup, tweenGroup, timeouts, 2000);
    return () => {
      tweenGroup.removeAll();
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;
    };
  }, []);

  useFrame(() => {
    if (innerRef.current) {
      innerRef.current.rotation.x += 0.005;
      innerRef.current.rotation.y += 0.005;
      innerRef.current.rotation.z += 0.005;
    }
    tweenGroupRef.current.update();
  });

  return (
    <>
      {/*
        Key light: upper-right-front. intensity 35 (was 100) prevents rim clipping.
        lookAt(0,0,0) called in useEffect so it actually illuminates the cube.
      */}
      <rectAreaLight ref={keyLightRef} intensity={35} width={20} height={20} position={[8, 12, 5]} />
      {/*
        Fill light: lower-left-front. intensity 22 (was 5) lifts midtones and
        prevents crushed darks on the opposite faces.
      */}
      <rectAreaLight ref={fillLightRef} intensity={22} width={20} height={20} position={[-6, -8, 5]} />
      {/* Lifts absolute blacks so shadowed faces show detail */}
      <ambientLight intensity={0.05} />
      {/*
        Studio env map: gives metalness=1.0 material something to reflect uniformly
        across all faces, fixing the uneven face response.
        background=false keeps the canvas transparent.
      */}
      <Environment preset="studio" background={false} />
      <group ref={outerRef}>
        <group ref={innerRef}>
          <group ref={cubesRef}>
            {layerPositions.map((positions, i) => (
              <group key={i}>
                {positions.map((pos, j) => (
                  <mesh key={j} position={pos} geometry={geometry} material={material} />
                ))}
              </group>
            ))}
          </group>
        </group>
      </group>
    </>
  );
}

export default function RubiksCubeScene() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [isGrabbing, setIsGrabbing] = useState(false);
  const containerRef = useRef(null);
  const outerRef = useRef();
  const dragRef = useRef({ isDragging: false, prevX: 0, prevY: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", checkMobile);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) return null;

  function handlePointerDown(e) {
    dragRef.current.isDragging = true;
    setIsGrabbing(true);
    const src = e.touches ? e.touches[0] : e;
    dragRef.current.prevX = src.clientX;
    dragRef.current.prevY = src.clientY;
  }

  function handlePointerMove(e) {
    if (!dragRef.current.isDragging || !outerRef.current) return;
    const src = e.touches ? e.touches[0] : e;
    const sensitivity = e.touches ? 0.5 : 1.0;
    const dx = src.clientX - dragRef.current.prevX;
    const dy = src.clientY - dragRef.current.prevY;
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(toRadians(dy * sensitivity), toRadians(dx * sensitivity), 0, "XYZ")
    );
    outerRef.current.quaternion.multiplyQuaternions(q, outerRef.current.quaternion);
    dragRef.current.prevX = src.clientX;
    dragRef.current.prevY = src.clientY;
  }

  function handlePointerUp() {
    dragRef.current.isDragging = false;
    setIsGrabbing(false);
  }

  return (
    <div
      ref={containerRef}
      className="lg:w-[45%] h-[400px] lg:h-[800px] w-full relative overflow-hidden"
      style={{ cursor: isGrabbing ? "grabbing" : "grab" }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) rotate(-50deg)",
            width: "100%",
            height: "350px",
            filter: "blur(60px)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to right, rgba(255,255,255,0.03), rgba(255,255,255,0.08) 34%, rgba(255,255,255,0.14) 56%, rgba(255,255,255,0.1) 78%, rgba(255,255,255,0.03))",
              maskImage:
                "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.8) 25%, rgba(0,0,0,1) 52%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0))",
              WebkitMaskImage:
                "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.8) 25%, rgba(0,0,0,1) 52%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0))",
              mixBlendMode: "screen",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0) 46%, rgba(0,0,0,0.1) 72%, rgba(0,0,0,0.22) 100%)",
          }}
        />
      </div>

      {isVisible && (
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 6] }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            // Reinhard is gentler than ACESFilmic (R3F default) — prevents
            // the over-aggressive contrast that crushes darks and clips highlights
            toneMapping: THREE.ReinhardToneMapping,
            toneMappingExposure: 0.85,
          }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <CubeSceneContents outerRef={outerRef} />
          <EffectComposer>
            {/* Tighter threshold/smoothing = only genuinely hot pixels bloom, not edges */}
            <Bloom luminanceThreshold={0.95} luminanceSmoothing={0.3} intensity={0.3} radius={0.05} />
            <FXAA />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}
