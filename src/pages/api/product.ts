import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

import { MyHandler, NextApiBuilder } from '@/backend/api-wrapper';
import { collection } from '@/backend/collection';

const handler: MyHandler = async (req, res) => {
  if (req.method === 'GET') {
    const col = await collection.products();

    const product = await col.findOne({
      _id: new ObjectId(req.query.id as string),
    });

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Could not find the product.' });
    }

    return res.status(StatusCodes.OK).json(product);
  }
};

export default new NextApiBuilder(handler).build();
