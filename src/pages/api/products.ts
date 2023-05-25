import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

import { type MyHandler, NextApiBuilder } from '@/backend/api-wrapper';
import { collection } from '@/backend/collection';
import { validatePostProduct } from '@/backend/product/validation';
import { ApiError } from '@/utils/api-error';

import type { PostProductResponse } from '@/backend/product/model';

const handler: MyHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { main, sub, skip, limit } = req.query;
    const col = await collection.products();

    let products;
    if (main === '' && sub === '') {
      products = await col.find({}).toArray();
    } else if (sub !== '') {
      products = await col
        .find({ category: { main: main, sub: sub } })
        .toArray();
    } else {
      products = await col
        .find({ 'category.main': main })
        .skip(+skip!)
        .limit(+limit!)
        .toArray();
    }

    return res.status(StatusCodes.OK).json(products);
  }
  if (req.method === 'POST') {
    // Validation
    const postProduct = await validatePostProduct(req.body);

    // Logic
    const col = await collection.products();

    const _id = new ObjectId();
    const result = await col.insertOne({ _id, ...postProduct });

    if (!result.acknowledged) {
      throw new ApiError(
        'INTERNAL_SERVER_ERROR',
        'MongoDB service not available.'
      );
    }

    // Result
    const resBody = { _id } as PostProductResponse;

    return res.status(StatusCodes.CREATED).json(resBody);
  }
};

export default new NextApiBuilder(handler).build();
