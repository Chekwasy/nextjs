import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define MONGODB_URI in env");
}

let client;
let clientPromise;

// Reuse connection across hot reloads (important on Vercel)
if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

class DBClient {
  async isAlive() {
    try {
      const client = await clientPromise;
      return client.topology?.isConnected?.() ?? true;
    } catch {
      return false;
    }
  }

  async db() {
    const client = await clientPromise;
    return client.db();
  }

  async nbUsers() {
    const db = await this.db();
    return db.collection("users").estimatedDocumentCount();
  }

  async nbDates() {
    const db = await this.db();
    return db.collection("dates").estimatedDocumentCount();
  }
}

const dbClient = new DBClient();
export default dbClient;
