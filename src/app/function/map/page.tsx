"use client";

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef } from 'react';

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: '/osm_liberty.json',
      center: [135.6283103, 34.8481918],
      zoom: 18.95,
    });

    // クリーンアップ
    return () => map.remove();
  }, []);

  return (
    <div>
      <div
        ref={mapContainer}
        id="map"
        style={{ width: "100%", height: "100vh" }}
      />
    </div>
  );
}