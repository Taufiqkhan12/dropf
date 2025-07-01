import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Increase the payload size limits for both Express and Socket.IO
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes

// Increase HTTP payload size limit for Express
app.use(express.json({ limit: MAX_FILE_SIZE })); // Allow larger JSON payloads

// Socket.IO settings to handle larger payloads
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL },
  maxHttpBufferSize: MAX_FILE_SIZE, // Max buffer size for Socket.IO messages
});

let rooms = {}; // Store rooms and their timeout state

// Serve static files (for frontend)
app.use(express.static("public"));

// Socket events
io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  // Handle sender joining a room (creating a room)
  socket.on("sender-join", (data) => {
    const { uid } = data;

    // If the room doesn't exist, create a new one
    if (!rooms[uid]) {
      rooms[uid] = { users: [socket.id], timeout: null, fileSize: 0 }; // Add fileSize to track total file size
      // Set a timeout to close the room after 10 minutes
      rooms[uid].timeout = setTimeout(() => {
        io.to(uid).emit("room-closed");
        delete rooms[uid]; // Cleanup room data after timeout
        console.log("Room", uid, "has been closed due to inactivity.");
      }, 10 * 60 * 1000); // 10 minutes
    } else {
      rooms[uid].users.push(socket.id); // Add user to existing room
    }

    socket.join(uid); // Join the room
    console.log(`User joined room: ${uid}`);
  });

  // Handle joining an existing room (receiver joining)
  socket.on("join-room", (data) => {
    const { uid } = data;
    socket.join(uid); // Join the room

    // If room doesn't exist, emit a room-not-found message
    if (!rooms[uid]) {
      socket.emit("room-not-found", "Room does not exist or has expired.");
      console.log("Room not found:", uid);
      return;
    }

    console.log("User joined room:", uid);
  });

  // Handle file metadata (file name, mime type, total size)
  socket.on("file-meta", (data) => {
    const { uid, metadata } = data;
    socket.to(uid).emit("fs-meta", metadata); // Send metadata to receiver
  });

  // Handle file chunks (sending raw file data)
  socket.on("file-raw", (data) => {
    const { uid, buffer } = data;
    const room = rooms[uid];

    if (!room) {
      // If room does not exist, reject the chunk
      socket.emit("room-not-found", "Room does not exist.");
      return;
    }

    // Check the total file size being uploaded
    room.fileSize += buffer.byteLength;

    if (room.fileSize > MAX_FILE_SIZE) {
      // If the file exceeds the maximum size, reject the upload
      socket.emit(
        "file-too-large",
        `The file exceeds the maximum allowed size of 500MB.`
      );
      // Optionally, disconnect the sender or take other actions
      socket.disconnect();
      return;
    }

    // If the file size is within limit, continue sending chunks
    socket.to(uid).emit("fs-share", buffer); // Send file chunk to receiver
  });

  // Handle user disconnection (optional cleanup)
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Clean up user from rooms
    for (let roomId in rooms) {
      const room = rooms[roomId];
      room.users = room.users.filter((user) => user !== socket.id);
      if (room.users.length === 0) {
        clearTimeout(room.timeout); // Clear timeout if room becomes empty
        delete rooms[roomId]; // Remove room data if no users are left
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
