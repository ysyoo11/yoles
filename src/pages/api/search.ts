import { StatusCodes } from 'http-status-codes';

import { MyHandler, NextApiBuilder } from '@/backend/api-wrapper';
import { collection } from '@/backend/collection';

const handler: MyHandler = async (req, res) => {
  if (req.method === 'GET') {
    const col = await collection.products();
    const query = req.query.q as string;

    let products;
    if (query === '') {
      products = await col.find({}).toArray();
    } else {
      products = await col
        .find({ name: { $regex: query, $options: 'i' } })
        .toArray();
    }

    return res.status(StatusCodes.OK).json(products);
  }
};

export default new NextApiBuilder(handler).build();
