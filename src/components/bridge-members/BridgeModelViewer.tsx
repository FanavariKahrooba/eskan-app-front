"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Html, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type {
  BridgeElementRecord,
  BridgeModelPart,
} from "@/types/bridge-model";

type Props = {
  modelUrl: string;
  selectedPart: string | null;
  isolatedPart: string | null;
  hiddenParts: string[];
  records: Record<string, BridgeElementRecord>;
  resetSignal: number;
  onSelectPart: (name: string) => void;
  onPartsDetected: (parts: BridgeModelPart[]) => void;
};

function getMeshName(mesh: THREE.Object3D, fallbackIndex = 0) {
  return (
    mesh.name ||
    mesh.parent?.name ||
    mesh.userData?.name ||
    `segment-${fallbackIndex + 1}`
  );
}

function getStatusColor(status?: BridgeElementRecord["status"]) {
  if (status === "healthy") return "#10b981";
  if (status === "warning") return "#f59e0b";
  if (status === "critical") return "#ef4444";
  return "#cbd5e1";
}

function CameraController({ resetSignal }: { resetSignal: number }) {
  const controlsRef = React.useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 7, 16);
    camera.lookAt(0, 0, 0);
    controlsRef.current?.target.set(0, 0, 0);
    controlsRef.current?.update();
  }, [camera, resetSignal]);

  return <OrbitControls ref={controlsRef} enableDamping makeDefault />;
}

function ObjModel({
  modelUrl,
  selectedPart,
  isolatedPart,
  hiddenParts,
  records,
  onSelectPart,
  onPartsDetected,
}: Omit<Props, "resetSignal">) {
  const [object, setObject] = React.useState<THREE.Group | null>(null);
  const [hoveredPart, setHoveredPart] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const meshesRef = React.useRef<THREE.Mesh[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrorMessage(null);
    setObject(null);
    meshesRef.current = [];

    const loader = new OBJLoader();

    loader.load(
      modelUrl,
      (loaded) => {
        if (cancelled) return;

        console.log("OBJ loaded:", loaded);

        const meshes: THREE.Mesh[] = [];

        loaded.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            meshes.push(mesh);

            if (!mesh.name) {
              mesh.name = mesh.parent?.name || `segment-${meshes.length}`;
            }

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            mesh.material = new THREE.MeshStandardMaterial({
              color: "#cbd5e1",
              metalness: 0.15,
              roughness: 0.72,
              side: THREE.DoubleSide,
            });
          }
        });

        if (meshes.length === 0) {
          setErrorMessage(
            "مدل OBJ لود شد، اما هیچ Mesh قابل نمایش یا کلیک در آن پیدا نشد.",
          );
          setLoading(false);
          return;
        }

        meshesRef.current = meshes;

        const box = new THREE.Box3().setFromObject(loaded);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();

        box.getCenter(center);
        box.getSize(size);

        loaded.position.sub(center);

        const maxAxis = Math.max(size.x, size.y, size.z);

        if (maxAxis > 0) {
          loaded.scale.setScalar(10 / maxAxis);
        }

        const parts: BridgeModelPart[] = meshes.map((mesh, index) => {
          const name = getMeshName(mesh, index);

          return {
            id: name,
            name,
            visible: true,
          };
        });

        onPartsDetected(parts);
        setObject(loaded);
        setLoading(false);
      },
      (event) => {
        if (!event.total) return;

        const progress = Math.round((event.loaded / event.total) * 100);
        console.log(`OBJ loading: ${progress}%`);
      },
      (error) => {
        console.error("OBJ load error:", error);

        if (!cancelled) {
          setErrorMessage(
            "مدل سه‌بعدی لود نشد. مسیر /models/3dModel.obj یا محتوای فایل را بررسی کن.",
          );
          setLoading(false);
        }
      },
    );

    return () => {
      cancelled = true;
      document.body.style.cursor = "default";
    };
  }, [modelUrl, onPartsDetected]);

  React.useEffect(() => {
    const meshes = meshesRef.current;

    meshes.forEach((mesh, index) => {
      const name = getMeshName(mesh, index);
      const record = records[name];

      const isSelected = selectedPart === name;
      const isHovered = hoveredPart === name;
      const isHidden = hiddenParts.includes(name);
      const shouldHideByIsolation = Boolean(
        isolatedPart && isolatedPart !== name,
      );

      mesh.visible = !isHidden && !shouldHideByIsolation;

      const color = isSelected
        ? "#2563eb"
        : isHovered
          ? "#f97316"
          : getStatusColor(record?.status);

      mesh.material = new THREE.MeshStandardMaterial({
        color,
        emissive: isSelected ? "#1d4ed8" : isHovered ? "#f97316" : "#000000",
        emissiveIntensity: isSelected ? 0.25 : isHovered ? 0.12 : 0,
        metalness: 0.15,
        roughness: 0.72,
        side: THREE.DoubleSide,
      });
    });
  }, [selectedPart, hoveredPart, hiddenParts, isolatedPart, records]);

  if (loading) {
    return (
      <Html center>
        <div className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xl">
          در حال بارگذاری مدل سه‌بعدی...
        </div>
      </Html>
    );
  }

  if (errorMessage) {
    return (
      <Html center>
        <div className="max-w-md rounded-2xl border border-rose-100 bg-white px-5 py-4 text-center shadow-xl">
          <div className="text-sm font-bold text-rose-600">
            خطا در نمایش مدل
          </div>
          <div className="mt-2 text-xs leading-6 text-slate-600">
            {errorMessage}
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
            مسیر مورد انتظار: <b>/models/3dModel.obj</b>
          </div>
        </div>
      </Html>
    );
  }

  if (!object) return null;

  return (
    <>
      <primitive
        object={object}
        onPointerMove={(e: any) => {
          e.stopPropagation();

          const mesh = e.object as THREE.Mesh;
          const name = getMeshName(mesh);

          setHoveredPart(name);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();

          setHoveredPart(null);
          document.body.style.cursor = "default";
        }}
        onClick={(e: any) => {
          e.stopPropagation();

          const mesh = e.object as THREE.Mesh;
          const name = getMeshName(mesh);

          onSelectPart(name);
        }}
      />

      {hoveredPart ? (
        <Html center>
          <div className="pointer-events-none rounded-xl bg-slate-950/95 px-3 py-2 text-xs font-semibold text-white shadow-xl">
            {records[hoveredPart]?.title || hoveredPart}
          </div>
        </Html>
      ) : null}
    </>
  );
}

export default function BridgeModelViewer(props: Props) {
  return (
    <div className="relative h-[680px] min-h-[680px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <Canvas
        camera={{ position: [0, 7, 16], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#f8fafc"]} />

        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 12, 10]} intensity={1.4} castShadow />
        <directionalLight position={[-8, 6, -8]} intensity={0.65} />

        <gridHelper args={[40, 40, "#cbd5e1", "#e2e8f0"]} />
        <axesHelper args={[4]} />

        <ObjModel
          modelUrl={props.modelUrl}
          selectedPart={props.selectedPart}
          isolatedPart={props.isolatedPart}
          hiddenParts={props.hiddenParts}
          records={props.records}
          onSelectPart={props.onSelectPart}
          onPartsDetected={props.onPartsDetected}
        />

        <Environment preset="city" />
        <CameraController resetSignal={props.resetSignal} />
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 right-4 rounded-2xl bg-white/90 px-4 py-3 text-xs text-slate-600 shadow-lg backdrop-blur">
        چرخش: Drag — زوم: Scroll — انتخاب جزء: Click
      </div>
    </div>
  );
}
