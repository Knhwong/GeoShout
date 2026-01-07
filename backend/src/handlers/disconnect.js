function disconnect(socket, io){
    return async (payload) => {
        console.log('Client disconnected:', socket.id);
    };
}

module.exports = disconnect;