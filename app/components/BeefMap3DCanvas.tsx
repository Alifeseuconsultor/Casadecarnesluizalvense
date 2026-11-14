"use client";

import { Component, Suspense, useMemo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Group, Mesh, Vector3 } from "three";
import { beefRegions, type BeefRegion } from "./data";

const PRIMARY_BULL_URL = "https://grab3d.com/dl/bull/bull-light.glb";
const FALLBACK_BULL_URL = "https://cdn.3dassets.dev/assets/5010/v1/model.glb";

type BeefMap3DCanvasProps = {
  selectedId: string;
  showRegions: boolean;
  autoRotate: boolean;
  resetKey: number;
  onSelect: (region: BeefRegion) => void;
};

type BullAssetProps = {
  variant: "detailed" | "fallback";
  selectedId: string;
  showRegions: boolean;
  onSelect: (region: BeefRegion) => void;
};

function BullAsset({ variant, selectedId, showRegions, onSelect }: BullAssetProps) {
  const modelUrl = variant === "detailed" ? PRIMARY_BULL_URL : FALLBACK_BULL_URL;
  const { scene } = useGLTF(modelUrl);

  const preparedModel = useMemo(() => {
    const model = scene.clone(true) as Group;

    // The detailed bull is published in a Z-up export; the fallback uses glTF's Y-up axis.
    if (variant === "detailed") model.rotation.x = -Math.PI / 2;

    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const height = Math.max(size.y, 0.001);
    const scale = 2.05 / height;

    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);

    model.traverse((node) => {
      const mesh = node as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = true;
      }
    });

    return model;
  }, [scene, variant]);

  // These are orientation markers on the outer silhouette, not cut boundaries.
  // The source bull faces along +Z in the fallback asset. In the detailed export,
  // the length axis is rotated from local Y to world -Z.
  const frontSign = variant === "detailed" ? -1 : 1;
  const markerPositions: Record<string, [number, number, number]> = {
    shoulder: [0.66, 1.27, frontSign * 0.92],
    ribs: [0.69, 1.20, frontSign * 0.34],
    loin: [0.68, 1.18, frontSign * -0.37],
    rump: [0.62, 1.15, frontSign * -0.98],
  };

  return (
    <group>
      <primitive object={preparedModel} />
      {showRegions && beefRegions.map((region, index) => (
        <Html
          key={region.id}
          position={markerPositions[region.id] ?? [0.65, 1.1, 0]}
          center
          distanceFactor={6}
          zIndexRange={[30, 10]}
        >
          <button
            type="button"
            className={selectedId === region.id ? "beef3d-hotspot is-active" : "beef3d-hotspot"}
            aria-label={`Selecionar região: ${region.name}`}
            aria-pressed={selectedId === region.id}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(region);
            }}
          >
            <span className="beef3d-hotspot-index">0{index + 1}</span>
            <span className="beef3d-hotspot-name">{region.name}</span>
          </button>
        </Html>
      ))}
    </group>
  );
}

function LoadingModel() {
  return (
    <Html center>
      <div className="beef3d-loading">
        <span className="beef3d-spinner" />
        <strong>Preparando o modelo 3D</strong>
        <small>Carregando a representação bovina</small>
      </div>
    </Html>
  );
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Falha ao carregar o modelo bovino 3D:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default function BeefMap3DCanvas({
  selectedId,
  showRegions,
  autoRotate,
  resetKey,
  onSelect,
}: BeefMap3DCanvasProps) {
  const finalFallback = (
    <Html center>
      <div className="beef3d-loading beef3d-loading-error">
        <strong>Modelo 3D indisponível</strong>
        <small>Verifique sua conexão e tente atualizar a página.</small>
      </div>
    </Html>
  );

  const lightweightFallback = (
    <Suspense fallback={<LoadingModel />}>
      <BullAsset
        variant="fallback"
        selectedId={selectedId}
        showRegions={showRegions}
        onSelect={onSelect}
      />
    </Suspense>
  );

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [4.1, 2.05, 4.5], fov: 37, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#171614", 1)}
    >
      <ambientLight intensity={1.15} />
      <directionalLight
        castShadow
        position={[4.5, 7, 4]}
        intensity={2.4}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 3, -4]} intensity={0.85} color="#d9b88d" />
      <spotLight position={[0, 5, -3]} intensity={1.2} angle={0.55} penumbra={0.6} color="#fff0d8" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]} receiveShadow>
        <circleGeometry args={[2.7, 80]} />
        <meshStandardMaterial color="#28231d" roughness={0.94} metalness={0.02} />
      </mesh>

      <ModelErrorBoundary fallback={finalFallback}>
        <ModelErrorBoundary fallback={lightweightFallback}>
          <Suspense fallback={<LoadingModel />}>
            <BullAsset
              variant="detailed"
              selectedId={selectedId}
              showRegions={showRegions}
              onSelect={onSelect}
            />
          </Suspense>
        </ModelErrorBoundary>
      </ModelErrorBoundary>

      <ContactShadows position={[0, 0.008, 0]} scale={5.2} blur={2.6} opacity={0.38} far={3.2} />
      <OrbitControls
        key={resetKey}
        makeDefault
        target={[0, 1.02, 0]}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={2.4}
        maxDistance={7.8}
        minPolarAngle={0.18}
        maxPolarAngle={Math.PI / 2 + 0.12}
        autoRotate={autoRotate}
        autoRotateSpeed={0.7}
      />
    </Canvas>
  );
}
