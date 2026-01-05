import { useState } from "react";
import Landing from "@/Landing";
import MainContent from "@/MainContent";

export default function App() {
  const [session, setSession] = useState(null);
  // session = { userId, location }

  if (!session) {
    return <Landing onReady={setSession} />;
  }

  return <MainContent userId={session.userId} initialLocation={session.location} />;
}
