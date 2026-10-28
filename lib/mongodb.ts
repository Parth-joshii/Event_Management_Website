import mongoose from "mongoose";
import dns from "node:dns";

// Fix Node.js DNS SRV resolution issues on Windows & certain ISPs (querySrv ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in restricted environments
}

const PRIMARY_URI = process.env.MONGODB_URI || "";
const DIRECT_FALLBACK_URI =
  process.env.MONGODB_URI_DIRECT ||
  "mongodb://parthadmin:parthjoshi.com@ac-wxslp0l-shard-00-00.t06n2zp.mongodb.net:27017,ac-wxslp0l-shard-00-01.t06n2zp.mongodb.net:27017,ac-wxslp0l-shard-00-02.t06n2zp.mongodb.net:27017/Event_management?ssl=true&replicaSet=atlas-j1071n-shard-0&authSource=admin&retryWrites=true&w=majority";

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // Reuse the same connection in dev hot reloads and serverless invocations.
  var mongooseCache: CachedMongoose | undefined;
}

const cached: CachedMongoose = global.mongooseCache ?? {
  conn: null,
  promise: null
};

global.mongooseCache = cached;

async function attemptConnect(uri: string): Promise<typeof mongoose> {
  return mongoose.connect(uri, {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 6000
  });
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!PRIMARY_URI && !DIRECT_FALLBACK_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      // 1. Try primary URI (SRV)
      if (PRIMARY_URI) {
        try {
          const m = await attemptConnect(PRIMARY_URI);
          cached.conn = m;
          return m;
        } catch (srvErr) {
          console.warn(
            "Primary MongoDB SRV connection failed, attempting direct replica set fallback:",
            (srvErr as Error).message
          );
        }
      }

      // 2. Fall back to direct replica set hosts (bypasses ISP/Windows DNS SRV querySrv ECONNREFUSED)
      if (DIRECT_FALLBACK_URI && DIRECT_FALLBACK_URI !== PRIMARY_URI) {
        try {
          const m = await attemptConnect(DIRECT_FALLBACK_URI);
          cached.conn = m;
          return m;
        } catch (directErr) {
          console.error("Direct MongoDB fallback failed:", (directErr as Error).message);
          throw directErr;
        }
      }

      throw new Error("Failed to connect to MongoDB with both primary and fallback URIs");
    })().catch((err) => {
      cached.promise = null;
      cached.conn = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}

