"use client";

import { useRef } from "react";

export const SessionUploadForm = () => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!fileRef.current) return;

    const formData = new FormData();
    formData.append("file", fileRef.current.files![0]);

    const response = await fetch("/api/pomo_sessions/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Dati caricati correttamente!");
    } else {
      alert("Errore durante il caricamento dei dati");
    }
  };

  return (
    <form>
      <input type="file" accept=".csv" ref={fileRef} />
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Carica
      </button>
    </form>
  );
};
