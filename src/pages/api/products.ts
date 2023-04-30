import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

import { type MyHandler, NextApiBuilder } from '@/backend/api-wrapper';
import { collection } from '@/backend/collection';
import { validatePostContact } from '@/backend/product/validation';
import { ApiError } from '@/utils/api-error';

import type { PostProductResponse } from '@/backend/product/model';

const handler: MyHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { main, sub } = req.query;
    const col = await collection.products();

    let products;
    if (main === '' && sub === '') {
      products = await col.find({}).toArray();
    } else if (sub !== '') {
      products = await col
        .find({ category: { main: main, sub: sub } })
        .toArray();
    } else {
      products = await col.find({ 'category.main': main }).toArray();
    }
    return res.status(StatusCodes.OK).json(products);
  }
  if (req.method === 'POST') {
    // Validation
    const postProduct = await validatePostContact(req.body);

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
