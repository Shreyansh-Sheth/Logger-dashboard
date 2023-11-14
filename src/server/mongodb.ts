// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { env } from "@/env.mjs";
import { MongoClient } from "mongodb";

const uri = env.MONGO_URL;

let client;
let clientPromise: Promise<MongoClient>;

if (env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  //@ts-expect-error - global is not defined
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    //@ts-expect-error - global is not defined
    global._mongoClientPromise = client.connect();
  }
  //@ts-expect-error - global is not defined
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise as unknown as Promise<MongoClient>;
