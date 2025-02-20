import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = (props) => {
  const ref = useRef();
  
  const [sphere] = useState(() => {
    const positions = new Float32Array(3500); // Każdy punkt ma X, Y, Z
    for (let i = 0; i < positions.length; i += 3) {
      const r = 1.2 * Math.cbrt(Math.random()); // Losowy promień w zakresie [0, 1.2]
      const theta = Math.random() * Math.PI * 2; // Losowy kąt w XY
      const phi = Math.acos((Math.random() * 2) - 1); // Losowy kąt w Z
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    return positions;
  });
  

  useFrame((state, delta) => {
    ref.current.rotation.x += delta / 60;
    ref.current.rotation.y -= delta / 60;
    ref.current.rotation.z -= delta / 60;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#fff'
          size={0.001}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className='w-full h-auto absolute inset-0 z-[-1] '>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;