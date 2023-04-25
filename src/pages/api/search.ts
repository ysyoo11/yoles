import { StatusCodes } from 'http-status-codes';

import { MyHandler, NextApiBuilder } from '@/backend/api-wrapper';
import { collection } from '@/backend/collection';

const handler: MyHandler = async (req, res) => {
  if (req.method === 'GET') {
    const col = await collection.products();
    const query = req.query.q as string;
    const minPrice = req.query.minPrice as string;
    const maxPrice = req.query.maxPrice as string;

    let products;
    if (query === '') {
      products = await col.find({}).toArray();
    } else {
      products = await col
        .find({
          name: { $regex: query, $options: 'i' },
          price: { $gte: +minPrice, $lte: +maxPrice },
        })
        .toArray();
    }

    if (!products) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Could not find any products.' });
    }

    return res.status(StatusCodes.OK).json(products);
  }
};

export default new NextApiBuilder(handler).build();
