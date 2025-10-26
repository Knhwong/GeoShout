const pool = require('../db/db');
const getZone = require('../misc/utils')

const express = require('express');
const router = express.Router();

router.post('/shout', async (req, res) => {
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

        const io = req.app.get('io');
        const zone = getZone(lat, lon);
        io.to(zone).emit('shout', { ...newShout, lat, lon });


        res.status(201).json({ success: true, shout: newShout });
    } catch (e) {
        console.error('Error posting shout:', e);
        res.status(500).json({ e: 'Internal server error.' });
    }

})

module.exports = router;