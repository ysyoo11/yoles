import { Db, MongoClient, MongoClientOptions } from 'mongodb';

import { isDev } from '@/utils/env';

interface MongoOptions {
  uri?: string;
  dbName?: string;
  options?: MongoClientOptions;
}

type _mongoClientPromise = Promise<MongoClient> | undefined;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

async function getMongoClientPromise(
  uri = 'mongodb://localhost:27017',
  options: MongoClientOptions = {
    ignoreUndefined: true,
  }
) {
  if (clientPromise) {
    return clientPromise;
  }

  if (isDev) {
    if (!((global as any)._mongoClientPromise as _mongoClientPromise)) {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPromise = client.connect();
      console.info('Created a new connection');
    }
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function connectMongo({
  uri,
  dbName,
  options,
}: MongoOptions = {}): Promise<MongoDB> {
  const client = await getMongoClientPromise(uri, options);
  const db = client.db(dbName || 'test');

  return new MongoDB(client, db);
}

export class MongoDB {
  client: MongoClient;
  db: Db;

  constructor(client: MongoClient, db: Db) {
    this.client = client;
    this.db = db;
  }
}
