import { LineChart } from "../components/LineChart";

const fetchSessions = async () => {
  const response = await fetch("http://localhost:3000/api/pomo_sessions", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  return response.json();
};

export default async function Report() {
  const initialData = await fetchSessions();

  return (
    <div>
      <LineChart data={initialData} />
    </div>
  );
}
