import { connectToDB } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {}
