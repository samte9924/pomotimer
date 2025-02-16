import { PomodoroSessions } from "./components/PomodoroSessions";
import { Timer } from "./components/Timer";

export default function Home() {
  return (
    <div className="flex flex-col h-screen items-center gap-10">
      <div className="flex flex-col items-center w-full bg-gray-300 p-10">
        <Timer />
      </div>
      <PomodoroSessions />
    </div>
  );
}
