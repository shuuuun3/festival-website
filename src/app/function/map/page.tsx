// "use client";

// import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import React, { useEffect, useRef } from 'react';

// export default function Map() {
//   const mapContainer = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!mapContainer.current) return;
//     const map = new maplibregl.Map({
//       container: mapContainer.current,
//       style: '/osm_liberty.json',
//       center: [135.6283103, 34.8481918],
//       zoom: 18.95,
//     });

//     // クリーンアップ
//     return () => map.remove();
//   }, []);

//   return (
//     <div>
//       <div
//         ref={mapContainer}
//         id="map"
//         style={{ width: "100%", height: "100vh" }}
//       />
//     </div>
//   );
// }



// "use client";
// import dynamic from "next/dynamic";
// import { ModelView } from "@/src/components/map/MapScene";

// export default function Map() {
//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <ModelView />
//     </div>
//   );
// }


// pages/index.tsx
"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AnimatedModel } from "@/src/components/map/MapScene";

// ボタンに対応するアニメーション名を定義
const BUTTON_TARGETS: { [buttonLabel: string]: string } = {
  "1F": "transform_p_1",
  "2F": "transform_p_2",
  "3F": "transform_p_3",
  "4F": "transform_p_4",
};

export default function Map() {
  const [resetTrigger, setResetTrigger] = useState<{ name: string; timestamp: number } | null>(null);

  const handleResetButtonClick = (animationName: string) => {
    setResetTrigger({ name: animationName, timestamp: Date.now() });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{
          position: [-17.3065, 5.39917, -10.1376], // YをZに、Zを-Yに変換
          fov: 50,
        }}
      >
        <ambientLight />
        <directionalLight position={[5, 10, 5]} />

        {/* あなたのGLBモデル（アニメーション付き） */}
        <AnimatedModel resetAnimationTrigger={resetTrigger} />

        {/* 注視点をオブジェクト中心に合わせたいなら target を調整 */}
        <OrbitControls target={[1.3127, 0, -2.1926]} /> {/* モデルが原点近くならこれでOK */}
      </Canvas>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, display: "flex", flexDirection: "column-reverse", gap: "10px" }}>
        {Object.entries(BUTTON_TARGETS).map(([label, animName]) => (
          <button
            key={label}
            onClick={() => handleResetButtonClick(animName)}
            style={{ padding: "10px", cursor: "pointer" }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}