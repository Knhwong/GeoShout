require('dotenv').config();
const express = require('express')
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const getZone = require('./misc/utils');
const shoutRoute = require('./routes/shout');
const feedRoute = require('./routes/feed')
const pool = require('./db/db');

const app = express()
app.use(express.json());
app.use(cors());



app.use('/', shoutRoute);
app.use('/', feedRoute);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // loosen for dev
    }
});

io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    socket.on('join-zone', ({ lat, lon }) => {
        const zone = getZone(lat, lon);
        socket.join(zone);
        console.log(`🗺️ ${socket.id} joined zone ${zone}`);
    });

    socket.on('disconnect', () => {
        console.log('🔴 Client disconnected:', socket.id);
    });

    socket.on('update-location', ({ lat, lon }) => {
        const newZone = getZone(lat, lon);

        // Leave old zone rooms
        for (const room of socket.rooms) {
            if (room.includes(':')) socket.leave(room);
        }

        socket.join(newZone);
        console.log(`🔄 ${socket.id} moved to zone ${newZone}`);
    });
});

app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
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
