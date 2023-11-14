import { MongoClient } from "mongodb";

declare global {
  type _mongoClientPromise = Promise<typeof MongoClient>;
}
