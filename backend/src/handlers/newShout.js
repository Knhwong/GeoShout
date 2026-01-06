function newShout(socket, io){
    return async (payload) => {
        console.log(payload);
        if (!payload.user_id || 
            !payload.message || 
            typeof payload.lat !== 'number' || 
            typeof payload.lon !== 'number' || 
            !payload.zone) {
            console.log("Error invalid payload!")
            return;
        }

        console.log("Sending Payload", payload);
        io.to(payload.zone).emit("shoutUpdate", payload);
    };
}

module.exports = newShout;