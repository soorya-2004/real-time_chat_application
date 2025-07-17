const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Create an Express application
const app = express();

// Enable CORS for all origins (allow frontend to connect)
app.use(cors());

// Create an HTTP server using Express
const server = http.createServer(app);

// Attach a new Socket.IO server to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for development)
    methods: ["GET", "POST"],
  },
});

// Listen for new client connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for messages sent by a client
  socket.on("send_message", (data) => {
    // Broadcast received message to all connected clients
    io.emit("receive_message", data);
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
// This code sets up a simple Socket.IO server that allows real-time communication between clients.
// It listens for incoming connections, handles message broadcasting, and logs user connections and disconnections.