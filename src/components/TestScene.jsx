import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const TestScene = () => {
  const cubeRef = useRef();

  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta;
      cubeRef.current.rotation.y += delta;
    }
  });

  return (
    <group>
      {/* Simple test objects */}
      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>

      <mesh position={[4, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00FF00" />
      </mesh>

      <mesh position={[-4, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#0000FF" />
      </mesh>

      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#FFFF00" />
      </mesh>
    </group>
  );
};

export default TestScene;
