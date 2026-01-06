import { useState } from "react";
import Landing from "@/pages/Landing";
import MainContent from "@/pages/MainContent";

export default function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <Landing onReady={setSession} />;
  }

  return <MainContent userId={session.userId} initialLocation={session.location} />;
}
