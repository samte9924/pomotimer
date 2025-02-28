import { supabase } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);
  console.log(formattedDate);

  const { data, error } = await supabase
    .from("sessions")
    .select(
      "session_id, session_start_time, session_end_time, session_duration"
    )
    .gte("session_start_time", `${formattedDate} 00:00:00`)
    .lte("session_start_time", `${formattedDate} 23:59:59`);

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (
    !body.session_start_time ||
    !body.session_end_time ||
    body.session_duration == null
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("sessions").insert([
    {
      session_start_time: body.session_start_time,
      session_end_time: body.session_end_time,
      session_duration: body.session_duration,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
