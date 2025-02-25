import { connectToDB } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await connectToDB();

  try {
    const [rows] = await connection.execute(`
      SELECT 
        DATE_FORMAT(session_start_time, '%Y-%m-%d %H:%i:%s') AS session_start_time, 
        DATE_FORMAT(session_end_time, '%Y-%m-%d %H:%i:%s') AS session_end_time, 
        session_duration
      FROM Sessions 
      ORDER BY session_start_time ASC
    `);

    const headers = Object.keys(rows[0]).join(";") + "\n";

    const csvData =
      headers +
      rows
        .map((row) =>
          Object.values(row)
            .map((value) => `${String(value).replace(/"/g, '""')}`) // Escape delle virgolette
            .join(";")
        )
        .join("\n");

    return new Response(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=sessions_db_export.csv",
      },
    });
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
