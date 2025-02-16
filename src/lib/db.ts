import mysql from "mysql2/promise";

export async function connectToDB() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "pomotimer",
  });

  return connection;
}
