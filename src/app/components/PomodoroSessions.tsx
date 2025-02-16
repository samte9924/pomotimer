import { SessionsList } from "./SessionsList";

export const PomodoroSessions = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl">Sessioni di oggi</h1>
      <SessionsList />
    </div>
  );
};
