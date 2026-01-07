require('dotenv').config();
const path = require("path");
const express = require('express')
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const getZone = require('../../misc/utils');
const shoutRoute = require('./routes/shout');
const feedRoute = require('./routes/feed')
const updateLocation = require('./handlers/updateLocation')
const newShout = require('./handlers/newShout')
const disconnect = require('./handlers/disconnect')
const pool = require('./db/db');
const corsOrigin = process.env.CORS_ORIGIN;
const app = express()
app.use(express.json());
app.use(cors());


const distPath = path.resolve(__dirname, "../../frontend/dist");
console.log(distPath);
app.use(express.static(distPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use('/', shoutRoute);
app.use('/', feedRoute);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: corsOrigin, // loosen for dev
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', disconnect(socket,io));

    socket.on('updateLocation', updateLocation(socket, io));

    socket.on("newShout", newShout(socket, io));
});

app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Database connection error:', err);
        } else {
            console.log('Database connected! Current time:', res.rows[0].now);
        }
    });
});
