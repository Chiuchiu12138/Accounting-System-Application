import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db: any | null = null;

export async function GET(request: Request) {
  // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: "./collection.db", // Specify the database file path
      driver: sqlite3.Database,
    });
  }

  // Perform a database query to retrieve all items from the "configuration" table
  const items = await db.all("SELECT * FROM configuration");

  // Return the items as a JSON response with status 200
  return Response.json(items[0]);
}
