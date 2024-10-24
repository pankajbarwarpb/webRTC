const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const ioServer = createServer();
const io = new Server(ioServer, {
  cors: {
    origin: "*",
  },
});
app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("New Connection: ", socket.id);

  socket.on("join-room", (data) => {
    const { emailId, roomId } = data;
    console.log(data, { emailId, roomId });

    socket.join(roomId);
    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);

    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { emailId, roomId });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    console.log("call-user", data);

    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(emailId);

    socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
  });

  socket.on("call-accepted", (data) => {
    console.log("call-accepted", { data });
    const { emailId, ans } = data;

    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit("call-accepted", { ans });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected :", socket.id);
  });
});

app.listen(8000, () => console.log("Http server running at PORT 8000"));

ioServer.listen(8001);
console.log("Socket-io started listening at PORT 8001");
