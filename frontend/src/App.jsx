import { useEffect, useState } from "react";
import MapView from "@/components/MapView";
import ShoutBox from "@/components/ShoutBox";
import socket from "@/socket";

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [shouts, setShouts] = useState([]);

  // Track user geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const loc = { lat: coords.latitude, lon: coords.longitude };
        setUserLocation(loc);

        // Notify backend of location for zone assignment
        socket.emit("updateLocation", loc);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // Listen for live shouts in current zone
  useEffect(() => {
    socket.on("shoutUpdate", (shout) => {
      setShouts((prev) => [shout, ...prev]);
    });

    return () => socket.off("shoutUpdate");
  }, []);

  // Optional: fetch initial shouts from /feed
  useEffect(() => {
    if (!userLocation) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/feed?lat=${userLocation.lat}&lon=${userLocation.lon}`)
      .then((res) => res.json())
      .then((data) => setShouts(data.shouts || []))
      .catch(console.error);
  }, [userLocation]);

  return (
    <div className="flex h-screen w-screen">
      <MapView userLocation={userLocation} shouts={shouts} />
      <ShoutBox shouts={shouts} setShouts={setShouts} userLocation={userLocation} />
    </div>
  );
}
