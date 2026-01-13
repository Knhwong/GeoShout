const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL
});

async function insertMessage(user_id, message, lat, lon) {
  const query = `
            INSERT INTO messages (user_id, message, lat, lon, location)
            VALUES ($1, $2, $3, $4,
                ST_SetSRID(ST_MakePoint($4, $3), 4326)::geography
            )
            RETURNING *;
        `;
  const values = [user_id, message, lat, lon];
  const { rows } = await pool.query(query, values);
  console.log("Inserted message in db:" + rows[0]);
}

async function registerUser(user_id, zone, lat, lon, location) {
  const query = `
            INSERT INTO messages (user_id, zone, lat, lon, location)
            VALUES ($1, $2, $3, $4,
                ST_SetSRID(ST_MakePoint($4, $3), 4326)::geography
            )
            RETURNING *;
        `;
  const values = [user_id, message, lat, lon];
  const { rows } = await pool.query(query, values);
  console.log("Registered user in db:" + rows[0]);
}

async function checkConnection() {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Database connected! Current time:', res.rows[0].now);
    }
  });
}

module.exports = { pool, insertMessage, checkConnection };  