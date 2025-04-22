import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";

const Stars = (props) => {
  const ref = useRef();

  const [sphere] = useState(() => {
    const positions = new Float32Array(200); // Każdy punkt ma X, Y, Z
    for (let i = 0; i < positions.length; i += 3) {
      const r = 1.2 * Math.cbrt(Math.random()); // Losowy promień w zakresie [0, 1.2]
      const theta = Math.random() * Math.PI * 2; // Losowy kąt w XY
      const phi = Math.acos(2 * Math.random() - 1); // Ograniczenie wartości do [-1,1]

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      // Sprawdzenie NaN
      if (isNaN(positions[i]) || isNaN(positions[i + 1]) || isNaN(positions[i + 2])) {
        console.error("Błąd: Znaleziono NaN w pozycjach!", { i, positions });
      }
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta / 60;
      ref.current.rotation.y -= delta / 60;
      ref.current.rotation.z -= delta / 60;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="w-full h-auto absolute inset-0 z-[-1]">
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
