const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const app = express();
const io = new Server({ cors: true });

app.use(bodyParser.json());

const emailToSocketMapping = new Map();

io.on("connection", (socket) => {
  console.log("New user connected with id : ", socket.id);

  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log(
      "User ",
      emailId,
      " joined room ",
      roomId,
      " from : ",
      socket.id
    );
    emailToSocketMapping.set(emailId, socket.id);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected with id : ", socket.id);
    console.log("");
  });
});

app.listen(8000, () => {
  console.log("HTTP Server running at PORT 8000");
});

io.listen(8001, () => {
  console.log("Socket IO listening at PORT 8001");
});
