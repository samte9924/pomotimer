"use client";

export const ExportCSVButton = () => {
  const handleDownload = () => {
    window.open("/api/pomo_sessions/export", "_download");
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Scarica CSV
    </button>
  );
};
