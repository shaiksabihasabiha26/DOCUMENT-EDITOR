// Importing required modules
const express = require("express");   // Express framework for creating web server
const http = require("http");         // Node.js HTTP module (used to create server)
const { Server } = require("socket.io"); // Importing Socket.IO for real-time communication
const cors = require("cors");         // Middleware to allow cross-origin requests

// Creating an Express application
const app = express();
app.use(cors());                      // Enable CORS (so frontend from other ports can connect)
app.use(express.json());               // Parse incoming JSON requests

// Creating an HTTP server and attaching it to Express
const server = http.createServer(app);

// Creating a new instance of Socket.IO and attaching it to the HTTP server
const io = new Server(server, {
  cors: { origin: "*" }                // Allow all origins to connect (use specific domain in production)
});

// Event listener when a client connects to the server
io.on("connection", (socket) => {
  console.log("A user connected");     // Logs whenever a new client connects

  // Listen for 'doc-update' event from one client
  socket.on("doc-update", (data) => {
    // Broadcast the received data to all other connected clients
    socket.broadcast.emit("doc-update", data);
  });

  // Event listener when a client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");  // Logs whenever a client disconnects
  });
});

// A simple route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running...");    // Responds when someone visits the root URL
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log("Server running on port 5000"); // Confirmation message in console
});
