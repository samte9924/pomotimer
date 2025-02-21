import { connectToDB } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await connectToDB();

  try {
    const [rows] = await connection.execute(
      `
      SELECT
        DATE(session_start_time) AS day,
        SUM(session_duration) AS total_duration,
        COUNT(session_id) AS total_sessions
      FROM 
        Sessions
      WHERE 
        YEARWEEK(session_start_time, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY 
        DATE(session_start_time)
      ORDER BY 
        day;
      `
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
  } finally {
    await connection.end();
  }
}
