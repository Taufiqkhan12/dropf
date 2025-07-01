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

  socket.on("sender-join", (data) => {
    const { uid } = data;

<<<<<<< HEAD
    if (!rooms[uid]) {
      rooms[uid] = { users: [socket.id], timeout: null, fileSize: 0 };

      rooms[uid].timeout = setTimeout(() => {
        io.to(uid).emit("room-closed");
        delete rooms[uid];
        console.log("Room", uid, "has been closed due to inactivity.");
      }, 10 * 60 * 1000);
    } else {
      rooms[uid].users.push(socket.id);
    }

    socket.join(uid);
    console.log(`User joined room: ${uid}`);
  });

  socket.on("join-room", (data) => {
    const { uid } = data;
    socket.join(uid);

    if (!rooms[uid]) {
      socket.emit("room-not-found", "Room does not exist or has expired.");
      console.log("Room not found:", uid);
      return;
    }

    console.log("User joined room:", uid);
  });

  socket.on("file-meta", (data) => {
    const { uid, metadata } = data;
    socket.to(uid).emit("fs-meta", metadata);
  });

  socket.on("file-raw", (data) => {
    const { uid, buffer } = data;
    const room = rooms[uid];

    if (!room) {
      socket.emit("room-not-found", "Room does not exist.");
      return;
    }

    room.fileSize += buffer.byteLength;

    if (room.fileSize > MAX_FILE_SIZE) {
      socket.emit(
        "file-too-large",
        `The file exceeds the maximum allowed size of 500MB.`
      );

      socket.disconnect();
      return;
    }

    socket.to(uid).emit("fs-share", buffer);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Clean up user from rooms
    for (let roomId in rooms) {
      const room = rooms[roomId];
      room.users = room.users.filter((user) => user !== socket.id);
      if (room.users.length === 0) {
        clearTimeout(room.timeout);
        delete rooms[roomId];
      }
=======
    await room.create({ roomId: uid });

    socket.join(uid.toString());
  });

  socket.on("send-files", async ({ roomId, file }) => {
    const data = {
      name: file.name,
      type: file.type,
      size: file.size,
      content: file.content,
    };

    const created = await room.findOneAndUpdate(
      { roomId },
      {
        fileName: data.name,
        fileType: data.type,
        fileSize: data.size,
        fileBuffer: data.content,
      }
    );
  });

  socket.on("join-room", async (roomId) => {
    try {
      socket.join(roomId);

      const data = await room.findOne({ roomId }); // assuming Mongoose schema

      // Send room data back only to others in the room
      socket.to(roomId).emit("room-joined", { data });
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("join-error", { message: "Failed to join room." });
>>>>>>> 692023198cf15814e6780b44b4e984ccad1b3646
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
