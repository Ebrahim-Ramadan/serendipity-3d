import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const LazyOrbitControls = React.lazy(() =>
  import('@react-three/drei').then((module) => ({ default: module.OrbitControls }))
);

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/**
 * A React component that renders a GLB model using react-three-fiber.
 *
 * @param {{ modelUrl: string }} props
 * @prop {string} modelUrl - The URL of the GLB model to render.
 *
 * @returns {React.ReactElement} A React component that renders a GLB model.
 */
export function GLBViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-600 to-blue-400 z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Model url={modelUrl} />
          <LazyOrbitControls />
      </Canvas>
    </div>
  );
}

export default GLBViewer;
