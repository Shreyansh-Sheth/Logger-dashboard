/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "@/env.mjs";
import mongoose from "mongoose";
declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = env.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (cached.conn) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return cached.conn;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    cached.conn = await cached.promise;
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    cached.promise = null;
    throw e;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return cached.conn;
}

export default dbConnect;
