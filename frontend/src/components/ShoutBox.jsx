import { useState } from "react";
import ShoutItem from "./ShoutItem";
import socket from "@/socket";

export default function ShoutBox({ shouts, setShouts, userLocation }) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim() || !userLocation) return;

    const newShout = {
      user_id: "You",
      message,
      lat: userLocation.lat,
      lon: userLocation.lon,
    };

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/shout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShout),
      });

      // Emit to backend Socket.IO for zone broadcast
      socket.emit("newShout", newShout);

      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-1/3 h-full border-l border-gray-300 p-4 overflow-y-auto bg-gray-50 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Nearby Shouts</h2>

      <div className="flex-1 overflow-y-auto">
        {shouts.length === 0 && <p className="text-gray-500">No shouts yet!</p>}
        {shouts.map((s, i) => (
          <ShoutItem key={i} shout={s} />
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a shout..."
          className="flex-1 p-2 border border-gray-300 rounded-l text-gray-900"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
