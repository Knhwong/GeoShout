import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

//This sucks but it's much faster and mapbox tokens are public anyways
mapboxgl.accessToken = "pk.eyJ1Ijoia25od29uZyIsImEiOiJjbWg4Z20yZ2QwdWdpMmpwY3NpODZxYTN5In0.oGhpaXqBzaIk4ElLXLUr2A"

export default function MapView({ userLocation}) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!userLocation || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [userLocation.lon, userLocation.lat],
      zoom: 12,
    });



    const meEl = document.createElement("div");
    meEl.className = "gs-dot";
    meEl.style.background = "rgba(16, 185, 129, 0.95)";
    meEl.style.borderColor = "rgba(16, 185, 129, 0.95)" // green-ish for "me"
    new mapboxgl.Marker(meEl)
      .setLngLat([userLocation.lon, userLocation.lat])
      .addTo(map.current);

    // User marker
  }, [userLocation]);


  function spawnPing(map, lon, lat) {
    const el = document.createElement("div");
    el.className = "gs-ping";

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([lon, lat])
      .addTo(map);

    window.setTimeout(() => marker.remove(), 1000);
  }

  return <div ref={mapContainer} className="flex-1" />;
}


