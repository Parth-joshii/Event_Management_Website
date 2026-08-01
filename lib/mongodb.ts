import mongoose from "mongoose";
import dns from "node:dns";

// Ensure DNS SRV resolution works across Windows & Cloud Serverless environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Fallback to system default DNS if setServers is restricted
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://parthadmin:parthjoshi.com@cluster0.t06n2zp.mongodb.net/codiotic-technology";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

/** Establishes a cached connection to MongoDB using Mongoose. */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not defined.");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB Connection Error:", e);
    return null;
  }

  return cached.conn;
}
