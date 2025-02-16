import { connectToDB } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await connectToDB();

  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);

  try {
    const [rows] = await connection.execute(
      "SELECT * FROM Sessions " +
        "WHERE DATE(session_start_time) = ? " +
        "ORDER BY session_start_time ASC",
      [formattedDate]
    );

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { timeStart, timeEnd, duration } = req.body;

  return NextResponse.json({ data });
}
