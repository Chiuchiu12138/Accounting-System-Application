const sqlite3 = require("sqlite3").verbose();

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database("./collection.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Creating database, seeding data.");
});

// Serialize method ensures that database queries are executed sequentially
db.serialize(() => {
  // Create the items table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS configuration (
        id INTEGER PRIMARY KEY,
        siteName TEXT,
        gstRate INTEGER,
        qstRate INTEGER
      )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created configuration table.");

      // Clear the existing data in the products table
      db.run(`DELETE FROM configuration`, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Deleted all old data.");

        // Insert new data into the products table
        const value = ["BookBreeze", 500, 975];

        const insertSql = `INSERT INTO configuration(siteName, gstRate, qstRate) VALUES(?, ?, ?)`;

        db.run(insertSql, value, function (err) {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID; // get the id of the last inserted row
          console.log(`Rows inserted, ID ${id}`);
        });

        //   Close the database connection after all insertions are done
        db.close((err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log("Closed the database connection.");
        });
      });
    },
  );
});
