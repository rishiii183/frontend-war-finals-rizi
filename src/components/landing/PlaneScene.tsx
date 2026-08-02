import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { Sparkles } from "@react-three/drei";
import { PlaneModel } from "./PlaneModel";

interface PlaneSceneProps {
  progress: MotionValue<number>;
}

/**
 * Subscribes to the framer-motion MotionValue and calls invalidate()
 * so frameloop="demand" actually redraws on each scroll update.
 */
function ScrollDriver({ progress }: { progress: MotionValue<number> }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const unsub = progress.on("change", () => invalidate());
    return unsub;
  }, [progress, invalidate]);

  return null;
}

/** Animates the airplane position / rotation based on scroll progress 0→1. */
function AnimatedPlane({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(() => {
    const p = progress.get();
    const g = ref.current;

    // Smoothstep for vertical descent: slow → fast → slow (landing flare)
    const yEased = p * p * (3 - 2 * p);

    g.position.x = THREE.MathUtils.lerp(4.5, -3.5, p);
    g.position.y = THREE.MathUtils.lerp(3.8, 0.25, yEased);
    g.position.z = THREE.MathUtils.lerp(-1.5, 0.8, p);

    // Bank reduces as plane levels out
    g.rotation.z = THREE.MathUtils.lerp(-0.35, 0, p);

    // Pitch: nose-down during descent, nose-up flare near ground
    g.rotation.x =
      p < 0.8
        ? THREE.MathUtils.lerp(-0.08, -0.02, p / 0.8)
        : THREE.MathUtils.lerp(-0.02, 0.08, (p - 0.8) / 0.2);

    // Slight yaw shift for cinematic camera angle
    g.rotation.y = THREE.MathUtils.lerp(0.18, -0.08, p);
  });

  return (
    <group ref={ref}>
      <PlaneModel scale={1.1} />
      {/* Engine point light */}
      <pointLight position={[-0.8, -0.2, 0]} color="#38bdf8" intensity={2.5} distance={4} />
    </group>
  );
}

/** Camera gently tracks the plane's descent. */
function AnimatedCamera({ progress }: { progress: MotionValue<number> }) {
  const lookTarget = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    const p = progress.get();

    camera.position.x = THREE.MathUtils.lerp(0, -1.2, p);
    camera.position.y = THREE.MathUtils.lerp(3.5, 1.4, p);
    camera.position.z = THREE.MathUtils.lerp(10, 7.5, p);

    lookTarget.current.set(
      THREE.MathUtils.lerp(2.8, -1.8, p),
      THREE.MathUtils.lerp(2.8, 0.4, p),
      0,
    );
    camera.lookAt(lookTarget.current);
  });

  return null;
}

/** 3D Runway lights on ground plane that fade in as the jet lands */
function RunwayGround3D({ progress }: { progress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    const p = progress.get();
    if (groupRef.current) {
      // Fade in ground runway elements as scroll nears landing phase
      const opacity = THREE.MathUtils.clamp((p - 0.5) / 0.3, 0, 1);
      groupRef.current.position.y = THREE.MathUtils.lerp(-1, -0.1, opacity);
    }
  });

  return (
    <group ref={groupRef} position={[-4, -0.1, 0]}>
      {/* 3D Runway strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[16, 2.5]} />
        <meshStandardMaterial color="#0b1329" roughness={0.9} />
      </mesh>

      {/* Runway Edge Lights (Left & Right green/cyan dots) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <group key={i} position={[(i - 6) * 1.3, 0, 0]}>
          <mesh position={[0, 0, 1.3]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, 0, -1.3]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* Runway Centerline dashes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[(i - 2.5) * 2.4, 0.01, 0]}>
          <planeGeometry args={[1.2, 0.08]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
      ))}
    </group>
  );
}

export function PlaneScene({ progress }: PlaneSceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 48, near: 0.1, far: 100, position: [0, 3.5, 10] }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ScrollDriver progress={progress} />

      {/* Rich Multi-Directional Lighting */}
      <ambientLight intensity={0.45} color="#0f172a" />
      <directionalLight position={[6, 10, 5]} intensity={1.5} color="#e0f2fe" />
      <directionalLight position={[-6, -4, -5]} intensity={0.8} color="#0284c7" />
      <pointLight position={[0, 5, -2]} intensity={1.2} color="#38bdf8" />

      {/* Atmospheric Star / Dust Sparkles */}
      <Sparkles
        count={70}
        scale={[18, 12, 18]}
        size={2.5}
        speed={0.4}
        color="#38bdf8"
        opacity={0.65}
      />

      <Suspense fallback={null}>
        <AnimatedPlane progress={progress} />
        <AnimatedCamera progress={progress} />
        <RunwayGround3D progress={progress} />
      </Suspense>
    </Canvas>
  );
}
