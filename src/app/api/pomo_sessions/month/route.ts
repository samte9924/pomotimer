import { supabase } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the start and end of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Generate all weeks in the current month
    const weeksInMonth = [];
    const currentWeekStart = new Date(startOfMonth);

    while (currentWeekStart <= endOfMonth) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // End of week (6 days later)

      // If the weekEnd exceeds the end of the month, clamp it to the end of the month
      if (weekEnd > endOfMonth) {
        weekEnd.setDate(endOfMonth.getDate());
      }

      weeksInMonth.push({
        week_start: currentWeekStart.toISOString().split("T")[0],
        week_end: weekEnd.toISOString().split("T")[0],
        total_duration: 0,
        total_sessions: 0,
      });

      // Move to the next week
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    // Query the sessions table for the current month
    const { data, error } = await supabase
      .from("sessions")
      .select("session_id, session_start_time, session_duration")
      .gte("session_start_time", startOfMonth.toISOString())
      .lte("session_start_time", endOfMonth.toISOString());

    if (error) {
      throw error;
    }

    // Process the data to group by weeks
    data.forEach((session) => {
      const sessionDate = new Date(session.session_start_time);

      // Find the corresponding week in the weeksInMonth array
      const week = weeksInMonth.find((w) => {
        const weekStart = new Date(w.week_start);
        const weekEnd = new Date(w.week_end);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      if (week) {
        week.total_duration += session.session_duration;
        week.total_sessions += 1;
      }
    });

    return NextResponse.json(weeksInMonth, { status: 200 });
  } catch (error) {
    console.error(error);
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
