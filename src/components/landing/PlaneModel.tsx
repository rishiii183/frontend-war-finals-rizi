import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Sleek, high-tech procedural jet aircraft built from Three.js geometry primitives.
 * Features:
 * - Swept-back aerodynamic wings with winglets
 * - Dual jet engines with cyan emissive thruster exhaust glow
 * - Glass cockpit canopy with specular reflections
 * - Glowing wingtip navigation lights (Red port, Green starboard, White tail beacon)
 * - Metallic Ocean-Deep palette (--primary / --accent) matching AOCC theme
 */

interface PlaneModelProps {
  scale?: number;
}

export function PlaneModel({ scale = 1 }: PlaneModelProps) {
  const beaconRef = useRef<THREE.MeshBasicMaterial>(null!);

  // Flashing tail beacon light
  useFrame(({ clock }) => {
    if (beaconRef.current) {
      beaconRef.current.opacity = (Math.sin(clock.getElapsedTime() * 6) + 1) / 2;
    }
  });

  return (
    <group scale={scale} dispose={null}>
      {/* ── Main Fuselage (Aerodynamic tapered body) ── */}
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.22, 3.4, 16]} />
        <meshStandardMaterial
          color="#1e3a8a"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* ── Nose Cone (Sleek supersonic point) ── */}
      <mesh position={[2.0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.11, 0.8, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* ── Cockpit Glass Canopy (Translucent cyan tint) ── */}
      <mesh position={[0.9, 0.16, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* ── Main Swept Wings (Left & Right) ── */}
      {/* Port / Left Wing */}
      <group position={[0.1, 0.02, 1.25]} rotation={[0, -0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.95, 0.03, 2.3]} />
          <meshStandardMaterial
            color="#0284c7"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Winglet */}
        <mesh position={[-0.3, 0.2, 1.15]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.3, 0.4, 0.03]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} />
        </mesh>
        {/* Port Nav Light (Red) */}
        <mesh position={[-0.3, 0.02, 1.18]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Starboard / Right Wing */}
      <group position={[0.1, 0.02, -1.25]} rotation={[0, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.95, 0.03, 2.3]} />
          <meshStandardMaterial
            color="#0284c7"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Winglet */}
        <mesh position={[-0.3, 0.2, -1.15]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.3, 0.4, 0.03]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} />
        </mesh>
        {/* Starboard Nav Light (Green) */}
        <mesh position={[-0.3, 0.02, -1.18]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* ── Twin Jet Engines ── */}
      {/* Left Engine Nacelle */}
      <group position={[-0.2, -0.15, 0.65]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.12, 1.2, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} />
        </mesh>
        {/* Thruster Exhaust Glow */}
        <mesh position={[-0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.09, 0.3, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Right Engine Nacelle */}
      <group position={[-0.2, -0.15, -0.65]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.12, 1.2, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} />
        </mesh>
        {/* Thruster Exhaust Glow */}
        <mesh position={[-0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.09, 0.3, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* ── Tail Assembly ── */}
      {/* Swept Vertical Stabilizer */}
      <group position={[-1.35, 0.45, 0]} rotation={[0, 0, -0.35]}>
        <mesh>
          <boxGeometry args={[0.65, 0.85, 0.04]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        {/* Tail Flashing White Beacon Light */}
        <mesh position={[-0.1, 0.45, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial ref={beaconRef} color="#ffffff" transparent />
        </mesh>
      </group>

      {/* Horizontal Stabilizers */}
      <mesh position={[-1.4, 0.08, 0]}>
        <boxGeometry args={[0.45, 0.03, 1.6]} />
        <meshStandardMaterial color="#0369a1" metalness={0.8} />
      </mesh>
    </group>
  );
}
