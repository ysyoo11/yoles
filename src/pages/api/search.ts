import { StatusCodes } from 'http-status-codes';

import { MyHandler, NextApiBuilder } from '@/backend/api-wrapper';
import { collection } from '@/backend/collection';

const handler: MyHandler = async (req, res) => {
  if (req.method === 'GET') {
    const {
      q: query,
      minPrice,
      maxPrice,
      skip,
      limit,
    } = req.query as {
      q: string;
      minPrice: string;
      maxPrice: string;
      skip: string;
      limit: string;
    };

    const col = await collection.products();

    let products;
    if (query === '') {
      products = await col.find({}).toArray();
    } else {
      products = await col
        .find({
          name: { $regex: query, $options: 'i' },
          price: { $gte: +minPrice, $lte: +maxPrice },
        })
        .skip(+skip)
        .limit(+limit)
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
