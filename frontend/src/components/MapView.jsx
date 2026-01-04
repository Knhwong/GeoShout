import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView({ userLocation, shouts }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!userLocation || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [userLocation.lon, userLocation.lat],
      zoom: 12,
    });

    // User marker
    new mapboxgl.Marker({ color: "blue" })
      .setLngLat([userLocation.lon, userLocation.lat])
      .addTo(map.current);
  }, [userLocation]);

  // Render markers for shouts
  useEffect(() => {
    if (!map.current) return;

    // Optional: clear previous shout markers here if needed
    shouts.forEach((s) => {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([s.lon, s.lat])
        .addTo(map.current);
      spawnPing(map.current, s.lon, s.lat);
    });
  }, [shouts]);

  function spawnPing(map, lon, lat) {
  const el = document.createElement("div");
  el.className = "geoshout-ping";

  const marker = new mapboxgl.Marker({ element: el })
    .setLngLat([lon, lat])
    .addTo(map);

  // Remove after animation completes
  window.setTimeout(() => marker.remove(), 1200);
}

  return <div ref={mapContainer} className="flex-1" />;
}


