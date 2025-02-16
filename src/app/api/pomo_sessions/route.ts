import { connectToDB } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await connectToDB();

  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);

  try {
    const [rows] = await connection.execute(
      `
      SELECT 
        session_id, 
        task_id, 
        session_start_time, 
        session_end_time, 
        session_duration, 
        SUM(session_duration) OVER(ORDER BY session_start_time) AS cumulative_duration 
      FROM Sessions 
      WHERE DATE(session_start_time) = ?
      ORDER BY session_start_time ASC
      `,
      [formattedDate]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Handle the case where error is not an instance of Error
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  } finally {
    await connection.end();
  }
}
