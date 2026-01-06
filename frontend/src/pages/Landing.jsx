import { useState } from "react";

export default function Landing({ onReady }) {
  const [userId, setUserId] = useState(() => localStorage.getItem("geoshout_userId") ?? "");
  const [status, setStatus] = useState("idle"); // idle | requesting | error
  const [errorMsg, setErrorMsg] = useState("");

  const canContinue = userId.trim().length > 0;

  const requestLocation = () => {
    setStatus("requesting");
    setErrorMsg("");

    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMsg("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = { lat: coords.latitude, lon: coords.longitude };

        const cleanUserId = userId.trim();
        localStorage.setItem("geoshout_userId", cleanUserId);

        setStatus("idle");
        onReady({ userId: cleanUserId, location: loc });
      },
      (err) => {
        setStatus("error");
        setErrorMsg(`Failed to get location (${err.code}): ${err.message}`);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 border">
        <h1 className="text-2xl font-semibold">GeoShout</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter a user id and allow location to start.
        </p>

        <label className="block mt-5 text-sm font-medium text-gray-700">
          User ID
        </label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. John Doe"
          className="mt-2 w-full p-2 border rounded text-gray-500"
        />

        <button
          disabled={!canContinue || status === "requesting"}
          onClick={requestLocation}
          className="mt-4 w-full py-2 rounded bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-600"
        >
          {status === "requesting" ? "Requesting location..." : "Continue"}
        </button>

        {status === "error" && (
          <div className="mt-4 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Tip: If Chrome times out, try Edge or DevTools → Sensors to simulate location.
        </div>
      </div>
    </div>
  );
}
