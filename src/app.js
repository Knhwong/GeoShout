const express = require('express')
const cors = require('cors');
const pool = require('./db/db');
require('dotenv').config();

const app = express()
app.use(express.json());
app.use(cors());


app.post('/shout', async (req, res) => {
    try {
        const { user_id, message, lat, lon } = req.body;
        if (!user_id || !message || typeof lat !== 'number' || typeof lon !== 'number') {
            return res.status(400).json({ error: 'Missing or invalid fields. Ensure user_id, message, lat, lon are provided.' });
        }
        const query = `
        INSERT INTO shouts (user_id, message, location)
        VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))
        RETURNING id, message, created_at`;

        const { rows } = await pool.query(query, [user_id, message, lon, lat]);
        const newShout = rows[0];
        res.status(201).json({ success: true, shout: newShout });
    } catch (e) {
        console.error('Error posting shout:', e);
        res.status(500).json({ e: 'Internal server error.' });
    }

})
app.get('/feed', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        const radius = parseFloat(req.query.radius) || 1000;
        if (typeof lat !== 'number' || typeof lon !== 'number') {
            return res.status(400).json({ error: 'Missing or invalid lat/lon' });
        }

    const query = `
      SELECT id, user_id, message,
             ST_Y(location::geometry) AS lat,
             ST_X(location::geometry) AS lon,
             created_at,
             ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance_m
      FROM shouts
      WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
        AND created_at > NOW() - INTERVAL '24 hours'
      ORDER BY created_at DESC
      LIMIT 50
    `;

        const { rows } = await pool.query(query, [lon, lat, radius]);
        res.json({ success: true, shouts: rows });
    } catch (e) {
        console.error('Error fetching feed:', e);
        res.status(500).json({ e: 'Internal server error.' });
    }

})

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