import { supabase } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the start and end of the current week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    // Query the sessions table
    const { data, error } = await supabase
      .from("sessions")
      .select("session_start_time, session_duration, session_id")
      .gte("session_start_time", startOfWeek.toISOString())
      .lte("session_start_time", endOfWeek.toISOString());

    if (error) {
      throw error;
    }

    // Process the data to get the required metrics
    const result = data.reduce((acc, session) => {
      const day = new Date(session.session_start_time)
        .toISOString()
        .split("T")[0];
      if (!acc[day]) {
        acc[day] = {
          day,
          total_duration: 0,
          total_sessions: 0,
        };
      }
      acc[day].total_duration += session.session_duration;
      acc[day].total_sessions += 1;
      return acc;
    }, {});

    // Convert the result object to an array
    const rows = Object.values(result).sort(
      (a, b) => new Date(a.day) - new Date(b.day)
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
