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

    const createdRoom = await room.create({ roomId: uid });

    socket.join(uid.toString());
    socket.emit("room-created", { uid });
    console.log(createdRoom);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Connected to port ${process.env.PORT}`);
});
