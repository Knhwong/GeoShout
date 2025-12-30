const pool = require('../db/db');

const express = require('express');
const router = express.Router();

router.get('/feed', async (req, res) => {
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

module.exports = router;