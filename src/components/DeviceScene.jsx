import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Line, OrbitControls, RoundedBox } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function DemoDevice() {
  const device = useRef(null);

  const waveform = useMemo(
    () =>
      Array.from({ length: 32 }, (_, index) => {
        const progress = index / 31;
        const x = -0.95 + progress * 1.9;
        const envelope = Math.sin(progress * Math.PI * 3.5) * 0.18;
        const pulse = progress > 0.28 && progress < 0.34 ? Math.sin((progress - 0.28) * 55) * 0.28 : 0;
        const y = envelope + pulse;
        return new THREE.Vector3(x, y, 0);
      }),
    [],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (device.current) {
      device.current.rotation.y = Math.sin(elapsed * 0.35) * 0.28 + 0.35;
      device.current.rotation.x = -0.08 + Math.sin(elapsed * 0.25) * 0.03;
      device.current.position.y = Math.sin(elapsed * 1.25) * 0.05;
    }
  });

  return (
    <group ref={device} dispose={null}>
      <RoundedBox args={[1.7, 3.0, 0.44]} radius={0.11} smoothness={10} castShadow receiveShadow>
        <meshStandardMaterial color="#0a1321" metalness={0.42} roughness={0.24} />
      </RoundedBox>

      <mesh position={[0, 0.1, 0.24]} castShadow>
        <planeGeometry args={[1.12, 1.75]} />
        <meshStandardMaterial color="#06111d" emissive="#0a2340" emissiveIntensity={0.85} roughness={0.34} />
      </mesh>

      <group position={[0, 0.18, 0.26]}>
        <Line points={waveform} color="#63e6ff" lineWidth={2.2} />
      </group>

      <mesh position={[0.5, 0.95, 0.29]}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial color="#ff8d73" emissive="#ff8d73" emissiveIntensity={1.3} />
      </mesh>

      <mesh position={[0, -1.08, 0.27]}>
        <cylinderGeometry args={[0.22, 0.22, 0.09, 32]} />
        <meshStandardMaterial color="#1b2940" metalness={0.75} roughness={0.25} />
      </mesh>

      <mesh position={[0, -0.62, 0.27]}>
        <boxGeometry args={[0.56, 0.1, 0.1]} />
        <meshStandardMaterial color="#63e6ff" emissive="#63e6ff" emissiveIntensity={1.1} />
      </mesh>

      <mesh position={[0.58, -0.1, 0.29]}>
        <boxGeometry args={[0.18, 0.56, 0.07]} />
        <meshStandardMaterial color="#22c7b8" emissive="#22c7b8" emissiveIntensity={0.85} />
      </mesh>
    </group>
  );
}

export default function DeviceScene() {
  return (
    <div className="relative h-[380px] sm:h-[520px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-glow">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.75),_transparent_28%)]" />
      <Canvas camera={{ position: [0, 0, 5.25], fov: 34 }} shadows dpr={[1, 1.75]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 4]} intensity={2.1} color="#f8fafc" castShadow />
        <pointLight position={[-3, 2, 3]} intensity={1.3} color="#38bdf8" />
        <spotLight position={[0, 4, 2]} intensity={24} angle={0.4} penumbra={1} color="#fb7185" />
        <Environment preset="city" />
        <group position={[0, -0.22, 0]}>
          <DemoDevice />
        </group>
        <ContactShadows position={[0, -2.0, 0]} opacity={0.22} blur={2.6} scale={8.5} far={4.5} color="#cbd5e1" />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.8} minPolarAngle={Math.PI / 2.3} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-xs uppercase tracking-[0.28em] text-slate-600 backdrop-blur-xl">
        <span>Demo 3D device</span>
        <span>Swap in your GLB model later</span>
      </div>
    </div>
  );
}