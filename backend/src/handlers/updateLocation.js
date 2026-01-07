function updateLocation(socket, io) {

  return ({userId, lat, lon, zone }) => {
    
    for (const room of socket.rooms) {
      if (room.includes(":")) socket.leave(room);
    }
    socket.join(zone);
    console.log(`${userId} with socketId ${socket.id} moved to zone ${zone}`);
  };
}

module.exports = updateLocation;