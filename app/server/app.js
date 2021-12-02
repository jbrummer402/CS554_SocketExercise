const { kMaxLength } = require("buffer");
const app = require("express");
const http = require("http").createServer(app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const chat = io.of("/:chatName");

chat.on("connection", (socket) => {
  /* socket object may be used to send specific messages to the new connected client */
  console.log("new client connected");

  socket.emit("connection", null);
  socket.on("join-room", async (data, callback) => {
    try {
      socket.leave(data.previousRoom);
      socket.join(data.newRoom);
      socket.emit("joined room", data.newRoom);

      callback({
        status: "OK",
      });
    } catch (e) {
      callback({
        status: "error",
      });
    }
  });

  socket.on("message", ({ name, message }) => {
    console.log(name, message);
    io.emit("message", { name, message });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect Fired");
    socket.broadcast.emit("user_leave", `${this.username} has left`);
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
