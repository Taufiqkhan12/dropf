import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstace = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `MongoDB Connected!! DB Host :${connectionInstace.connection.host}`
    );
  } catch (error) {
    console.log(`Error Connecting MongoDB :${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
