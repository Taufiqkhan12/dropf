import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./db/db.connection.js";
import { room } from "./model/room.model.js";

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

app.use(express.static("public"));

await connectDB();

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("create-room", async (data) => {
    const { uid } = data;

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
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Connected to port ${process.env.PORT}`);
});
