import { SessionsList } from "./SessionsList";

export const PomodoroSessions = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl">Sessioni di oggi</h1>
      <SessionsList />
    </div>
  );
};
