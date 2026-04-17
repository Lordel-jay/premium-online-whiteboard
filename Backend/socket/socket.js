module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🎯 Receive drawing data
    socket.on("draw", (data) => {
      // broadcast to all OTHER users
      socket.broadcast.emit("draw", data);
    });

    // clear canvas event
    socket.on("clear", () => {
      socket.broadcast.emit("clear");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};