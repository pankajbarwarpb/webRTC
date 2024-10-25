const express = require("express");
const https = require("https");
const { Server } = require("socket.io");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync("./key.pem"), // Adjust path as necessary
  cert: fs.readFileSync("./cert.pem"), // Adjust path as necessary
  requestCert: false, // Enable client certificate verification if needed
  rejectUnauthorized: false, // Reject unauthorized clients
};

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);
const io = new Server(httpsServer, {
  cors: {
    origin: "*", // Your client origin
  },
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("New Connection:", socket.id);

  socket.on("join-room", (data) => {
    const { emailId, roomId } = data;
    socket.join(roomId);
    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);

    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { emailId, roomId });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
  });

  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit("call-accepted", { ans });
  });

  socket.on("signaling-message", (data) => {
    const { message, emailId } = data;
    const socketId = emailToSocketMapping.get(emailId);
    if (socketId) {
      socket.to(socketId).emit("signaling-message", { message });
    } else {
      console.log("No socket ID found for email ID:", emailId);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

// Start the HTTPS server
httpsServer.listen(8001, "10.10.32.46", () => {
  console.log("HTTPS and WebSocket server running at https://10.10.32.46:8001");
});
