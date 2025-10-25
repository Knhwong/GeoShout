const express = require('express')
const pool = require('./db/db');
require('dotenv').config();

const app = express()
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(process.env.PGPASSWORD)
  pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected! Current time:', res.rows[0].now);
  }
});
});