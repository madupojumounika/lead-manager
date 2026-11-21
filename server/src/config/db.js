import mongoose from 'mongoose';
import fs from 'fs';

let memoryServerInstance = null;

const localBinary = 'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe';
if (fs.existsSync(localBinary)) {
  process.env.MONGOMS_SYSTEM_BINARY = localBinary;
}

export const connectDB = async (uriOverride = null) => {
  const primaryUri = uriOverride || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead_manager';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB URI (${primaryUri}): ${err.message}`);

    // If in development mode and local connection fails, gracefully start in-memory MongoDB
    if (process.env.NODE_ENV !== 'production' && !uriOverride) {
      try {
        console.log('[Database] Starting local in-memory MongoDB server for development...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        const memUri = memoryServerInstance.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[Database] Connected to in-memory MongoDB instance: ${memUri}`);
        return conn;
      } catch (memErr) {
        console.error('[Database] Failed to start in-memory MongoDB fallback:', memErr.message);
      }
    }

    throw err;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
      memoryServerInstance = null;
    }
    console.log('[Database] Disconnected from MongoDB');
  } catch (err) {
    console.error('[Database] Error during disconnect:', err.message);
  }
};

