import { LineChart } from "../components/LineChart";

const fetchSessions = async () => {
  const response = await fetch("http://localhost:3000/api/pomo_sessions");
  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  return response.json();
};

export default async function Report() {
  const initialData = await fetchSessions();

  return (
    <div className="flex flex-col items-center gap-10">
      <LineChart data={initialData} />
    </div>
  );
}
