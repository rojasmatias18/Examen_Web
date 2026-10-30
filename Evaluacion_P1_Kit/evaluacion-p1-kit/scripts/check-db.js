require("dotenv").config();
const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL });
(async () => {
  try {
    await client.connect();
    const result = await client.query("SELECT current_user, current_database()");
    console.table(result.rows);
  } catch (error) {
    console.error("Error de conexión:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
