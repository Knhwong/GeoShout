import { useEffect, useState } from "react";
import MapView from "@/components/MapView";
import ShoutBox from "@/components/ShoutBox";
import socket from "@/socket";

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [shouts, setShouts] = useState([]);


  useEffect(() => {
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const loc = { lat: coords.latitude, lon: coords.longitude };
        setUserLocation(loc);
        socket.emit("updateLocation", loc);
      },
      (err) => console.error("Geolocation error:", err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  useEffect(() => {
    socket.on("zoneJoined", (update) => {
      console.log("Joined Zone:", update.zone);
    });
    return () => socket.off("zoneJoined");
  }, []);


  useEffect(() => {
    const onShout = (shout) => {
    setShouts((prev) => [...prev, shout]);
    };
    socket.on("shoutUpdate", onShout);
    return () => socket.off("shoutUpdate");
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <MapView userLocation={userLocation} shouts={shouts} />
      <ShoutBox shouts={shouts} setShouts={setShouts} userLocation={userLocation} />
    </div>
  );
}
