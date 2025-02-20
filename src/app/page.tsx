import { SessionsList } from "./components/SessionsList";
import { Timer } from "./components/Timer";

export const metadata = {
  title: "Pomotimer",
};

const fetchSessions = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const response = await fetch(`${BASE_URL}/api/pomo_sessions`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  return response.json();
};

export default async function HomePage() {
  const sessions = await fetchSessions();

  return (
    <div className="flex flex-col h-screen items-center gap-10">
      <div className="flex flex-col items-center w-full bg-gray-300 p-10">
        <Timer />
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl">Sessioni di oggi</h1>
        <SessionsList sessionsList={sessions} />
      </div>
    </div>
  );
}
