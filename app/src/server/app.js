const app = require("express");
const http = require("http").createServer(app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send();
});

io.on("connection", (socket) => {
  /* socket object may be used to send specific messages to the new connected client */
  console.log("new client connected");
  socket.on("join-room", (data) => {
    socket.leave(data.previosRoom);
    socket.join(data.newRoom);

    socket.emit("joined room", data.newRoom);
  });

  socket.on("message", ({ name, message }) => {
    console.log(name, message);
    io.emit("message", { name, message });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect Fired");
    //socket.broadcast.emit('user_leave', `${this.username} has left`);
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
