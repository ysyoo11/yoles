import { StatusCodes } from 'http-status-codes';

import { MyHandler, NextApiBuilder } from '@/backend/api-wrapper';
import { collection } from '@/backend/collection';

const handler: MyHandler = async (req, res) => {
  if (req.method === 'GET') {
    const col = await collection.products();

    let products;
    if (req.query.main === undefined && req.query.sub === undefined) {
      products = await col.find({}).toArray();
    } else if (req.query.sub !== undefined) {
      products = await col
        .find({ category: { main: req.query.main, sub: req.query.sub } })
        .toArray();
    } else {
      products = await col.find({ 'category.main': req.query.main }).toArray();
    }
    return res.status(StatusCodes.OK).json(products);
  }
};

export default new NextApiBuilder(handler).build();
