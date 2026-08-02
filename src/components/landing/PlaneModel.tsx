import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

/**
 * Real 3D Airplane Model loaded from /airplane.glb via @react-three/drei's useGLTF.
 * Scaled and positioned so the full commercial jet fits gracefully in the landing scene.
 */

interface PlaneModelProps {
  scale?: number;
}

export function PlaneModel({ scale = 1 }: PlaneModelProps) {
  const { scene } = useGLTF("/airplane.glb");

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  // Scale down the large commercial airliner model to fit camera viewport
  const modelScale = scale * 0.08;

  return (
    <group scale={modelScale} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the GLTF asset for instant rendering
useGLTF.preload("/airplane.glb");
