import sgMail from '@sendgrid/mail';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

import { type MyHandler, NextApiBuilder } from '@/backend/api-wrapper';
import { collection } from '@/backend/collection';
import { PostOrderResponse } from '@/backend/order/model';
import { validatePostOrder } from '@/backend/order/validation';
import { ApiError } from '@/utils/api-error';
import { ENV } from '@/utils/env';
import makeEmailTemplate from '@/utils/makeEmailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const handler: MyHandler = async (req, res) => {
  if (req.method === 'POST') {
    // Validation
    const postOrder = await validatePostOrder(req.body);

    // Logic
    const orderCol = await collection.orders();
    const productCol = await collection.products();

    const _id = new ObjectId();
    const createdAt = new Date();
    const result = await orderCol.insertOne({ _id, createdAt, ...postOrder });

    postOrder.items.forEach(async (item) => {
      await productCol
        .updateOne({ name: item.name }, { $inc: { quantity: -item.quantity } })
        .catch((e) => {
          console.error(e);
          throw new ApiError(
            'INTERNAL_SERVER_ERROR',
            'MongoDB service not available - could not update product quantity.'
          );
        });
    });

    if (!result.acknowledged) {
      throw new ApiError(
        'INTERNAL_SERVER_ERROR',
        'MongoDB service not available.'
      );
    }

    await sgMail
      .send({
        to: postOrder.userInfo.email,
        from: ENV.SENDGRID_SENDER,
        subject: 'Your order with Yoles',
        html: makeEmailTemplate({ order: postOrder, id: _id, createdAt }),
      })
      .catch((e) => {
        console.error(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Could not send the email due to internal server error',
        });
      });

    // Result
    const resBody = { _id } as PostOrderResponse;

    return res.status(StatusCodes.CREATED).json(resBody);
  }
};

export default new NextApiBuilder(handler).build();
