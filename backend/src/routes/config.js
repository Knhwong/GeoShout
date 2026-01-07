const express = require('express');
const router = express.Router();

router.get('/api/mapboxConfig', async (req, res) => {
    console.log("config called")
    res.json({
        mapboxToken: process.env.MAPBOX_PUBLIC_TOKEN,
        mapboxStyle: process.env.MAPBOX_STYLE
    });
})

module.exports = router;