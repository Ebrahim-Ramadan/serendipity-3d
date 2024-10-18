import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const LazyOrbitControls = React.lazy(() =>
  import('@react-three/drei').then((module) => ({ default: module.OrbitControls }))
);

function Model({ url, untextured }: { url: string; untextured: boolean }) {
  const { scene, materials } = useGLTF(url);

  React.useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        if (untextured) {
          child.material = new THREE.MeshBasicMaterial({ color: 'white' });
        } else {
          child.material = materials[child.material.name] || child.material;
        }
      }
    });
  }, [untextured, scene, materials]);

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
  const [untextured, setUntextured] = useState(false);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-600 to-blue-400 z-10 relative">
      <button
        onClick={() => setUntextured(!untextured)}
        className="absolute bottom-36 md:bottom-24 left-4 z-50 rounded-full bg-neutral-200/20 hover:bg-neutral-200/30 w-6 md:w-8 h-6 md:h-8 flex items-center justify-center"
      >
        {untextured ? 
        <svg width="16" height="16" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM16.1961 8.51942C16.7377 8.62773 17.0889 9.15456 16.9806 9.69612L16 9.5C16.9806 9.69612 16.9807 9.69564 16.9806 9.69612L16.9802 9.69812L16.9797 9.70058L16.9784 9.7069L16.9746 9.72498C16.9714 9.73941 16.9672 9.75858 16.9617 9.7822C16.9508 9.82942 16.9349 9.89455 16.9133 9.97531C16.8701 10.1367 16.8038 10.3614 16.7081 10.6313C16.5172 11.1691 16.2055 11.8968 15.7187 12.6619C14.7403 14.1993 13.0329 15.9132 10.1961 16.4806C9.65456 16.5889 9.12773 16.2377 9.01942 15.6961C8.91111 15.1546 9.26232 14.6277 9.80388 14.5194C11.9671 14.0868 13.2597 12.8007 14.0313 11.5881C14.4195 10.9782 14.6703 10.3934 14.8232 9.96247C14.8993 9.74795 14.9502 9.57427 14.9813 9.45829C14.9968 9.40038 15.0072 9.3571 15.0134 9.3306L15.0194 9.30377L15.02 9.30124C15.1296 8.76141 15.6556 8.41131 16.1961 8.51942ZM6.12786 2.57182C6.12824 2.57167 6.12861 2.57152 6.5 3.5L6.12786 2.57182C6.64064 2.36671 7.22336 2.61583 7.42848 3.12861C7.63301 3.63993 7.38559 4.22005 6.87576 4.42672L6.86719 4.43036C6.85708 4.43471 6.8387 4.44278 6.81309 4.45469C6.76176 4.47854 6.68211 4.51744 6.5824 4.57212C6.38164 4.68221 6.10712 4.85214 5.82074 5.08646C5.24269 5.55941 4.67019 6.24806 4.48058 7.19612C4.37227 7.73768 3.84544 8.08889 3.30388 7.98058C2.76232 7.87227 2.41111 7.34544 2.51942 6.80388C2.82981 5.25194 3.75731 4.19059 4.55426 3.53854C4.95538 3.21036 5.33711 2.97404 5.62073 2.8185C5.7632 2.74037 5.88277 2.68161 5.97011 2.64102C6.01384 2.62069 6.04966 2.60484 6.07641 2.59333L6.10967 2.57925L6.12098 2.5746L6.12526 2.57287L6.12786 2.57182Z" fill=""></path>
        </svg>
        : 
        <svg width="16" height="16" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.12786 3.57182C7.12824 3.57167 7.12861 3.57152 7.5 4.5L7.12786 3.57182C7.64064 3.36671 8.22336 3.61583 8.42848 4.12861C8.63301 4.63993 8.38559 5.22005 7.87576 5.42672L7.86719 5.43036C7.85708 5.43471 7.8387 5.44278 7.81309 5.45469C7.76176 5.47854 7.68211 5.51744 7.5824 5.57212C7.38164 5.68221 7.10712 5.85214 6.82074 6.08646C6.24269 6.55941 5.67019 7.24806 5.48058 8.19612C5.37227 8.73768 4.84544 9.08889 4.30388 8.98058C3.76232 8.87227 3.41111 8.34544 3.51942 7.80388C3.82981 6.25194 4.75731 5.19059 5.55426 4.53854C5.95538 4.21036 6.33711 3.97404 6.62073 3.8185C6.7632 3.74037 6.88277 3.68161 6.97011 3.64102C7.01384 3.62069 7.04966 3.60484 7.07641 3.59333L7.10967 3.57925L7.12098 3.5746L7.12526 3.57287L7.12786 3.57182Z" fill="#"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM16 9C16 12.866 12.866 16 9 16C5.13401 16 2 12.866 2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9Z" fill=""></path>
        </svg>
        }
      </button>

      <Canvas camera={{ position: [0, 0, 5], fov: 20 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
          <Model url={modelUrl} untextured={untextured} />
          <LazyOrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default GLBViewer;
