import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function TestCube() {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* Environment lighting */}
        <ambientLight intensity={1} />

        <directionalLight
          position={[3, 3, 3]}
          intensity={2}
        />

        {/* Test object */}
        <TestCube />

        {/* Mouse controls */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}