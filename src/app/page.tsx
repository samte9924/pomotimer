import { SessionsList } from "./components/SessionsList";
import { Timer } from "./components/Timer";

const fetchSessions = async () => {
  const response = await fetch("http://localhost:3000/api/pomo_sessions", {});
  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  return response.json();
};

export default async function Home() {
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
