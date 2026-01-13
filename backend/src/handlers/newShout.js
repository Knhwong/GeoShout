const {insertMessage} = require('../db/db');

function newShout(socket, io) {
    return async (payload) => {
        if (!payload.user_id ||
            !payload.message ||
            typeof payload.lat !== 'number' ||
            typeof payload.lon !== 'number' ||
            !payload.zone) {
            console.log("Error invalid payload!")
            return;
        }

        insertMessage(payload.user_id, payload.message, payload.lat, payload.lon);

        io.to(payload.zone).emit("shoutUpdate", payload);
    };
}

module.exports = newShout;