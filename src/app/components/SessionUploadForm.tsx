"use client";

import { useState } from "react";

export const SessionUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/pomo_sessions/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Dati caricati correttamente!");
    } else {
      alert("Errore durante il caricamento dei dati");
    }

    setFile(null);
  };

  return (
    <form>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!file}
        className="bg-blue-500 hover:not-disabled:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Carica
      </button>
    </form>
  );
};
