import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import LoadingDots from '../Loader';

// Lazy load OrbitControls
const LazyOrbitControls = React.lazy(() =>
  import('@react-three/drei').then((module) => ({ default: module.OrbitControls }))
);

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

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
