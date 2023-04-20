import { ENV } from '@/utils/env';
import { connectMongo } from 'sdk/mongo';

import type { Product } from './product/model';

const dbOptions = {
  uri: ENV.MONGODB_URI,
  dbName: ENV.MONGODB_NAME,
};

export const collection = {
  products: async () =>
    (await connectMongo(dbOptions)).db.collection<Product[]>('products'),
};

export async function connectYolesMongo() {
  return await connectMongo(dbOptions);
}
