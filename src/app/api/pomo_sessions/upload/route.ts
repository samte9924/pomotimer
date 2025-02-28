import { supabase } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const csvData = await file.text();
    const rows = csvData
      .split("\n")
      .map((row) => row.split(";").map((value) => value.trim()));

    // Creiamo un array di oggetti per l'inserimento in Supabase
    const sessions = rows.map(
      ([session_start_time, session_end_time, session_duration]) => ({
        session_start_time,
        session_end_time,
        session_duration: Number(session_duration),
      })
    );

    // Inserimento dei dati in Supabase
    const { error } = await supabase.from("sessions").insert(sessions);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Sessions uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
