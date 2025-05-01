import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedConnection: Connection | null = null;

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }
  try {
    const opts = {
      bufferCommands: false,
    };

    const cnx = await mongoose.connect(MONGODB_URI!, opts);
    cachedConnection = cnx.connection;

    console.log("Database connection established");

    return cachedConnection;
  } catch (e) {
    console.error("Database connection error:", e);
    throw e;
  }
}

export default connectDB;