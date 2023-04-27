import { ENV } from '@/utils/env';
import { connectMongo } from 'sdk/mongo';

import type { Order } from './order/model';
import type { Product } from './product/model';

const dbOptions = {
  uri: ENV.MONGODB_URI,
  dbName: ENV.MONGODB_NAME,
};

export const collection = {
  products: async () =>
    (await connectMongo(dbOptions)).db.collection<Product>('products'),
  orders: async () =>
    (await connectMongo(dbOptions)).db.collection<Order>('order'),
};

export async function connectYolesMongo() {
  return await connectMongo(dbOptions);
}
