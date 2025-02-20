import { connectToDB } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const connection = await connectToDB();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    console.log(formData);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const csvData = await file.text();
    const rows = csvData.split("\n").map((row) => row.split(";"));

    const sql = `
      INSERT INTO Sessions (session_start_time, session_end_time, session_duration)
      VALUES 
      ${rows.map(() => "\t(?, ?, ?)").join(",\n")};
    `;

    console.log(rows);

    const values = rows
      .flat()
      .map((value) =>
        isNaN(Number(value.trim())) ? value.trim() : Number(value.trim())
      );

    console.log(sql);
    console.log(values);

    await connection.query(sql, values);

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
  } finally {
    connection.end();
  }
}
