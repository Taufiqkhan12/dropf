import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema({
  roomId: Number,
  fileName: String,
  fileSize: Number,
  fileType: String,
  fileBuffer: Buffer, // Optional: if stored directly in MongoDB
  uploadedBy: String, // Optional: socketId or username
  uploadedAt: {
    type: Date,
    default: Date.now,
    index: { expires: 600 }, // TTL index: 600 seconds = 10 minutes
  },
});

const room = mongoose.model("Room", roomSchema);

export { room };
