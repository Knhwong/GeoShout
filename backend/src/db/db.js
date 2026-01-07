const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL
});
module.exports = pool;  