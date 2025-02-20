import { LineChart } from "../components/LineChart";

export const metadata = {
  title: "Pomotimer | Report",
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

export default async function ReportPage() {
  const initialData = await fetchSessions();

  return (
    <div className="flex h-full justify-center pt-20">
      {initialData.length > 0 ? (
        <LineChart data={initialData} />
      ) : (
        <h1>Nessun dato disponibile</h1>
      )}
    </div>
  );
}
