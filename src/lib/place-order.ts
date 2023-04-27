import { validatePostOrder } from '@/backend/order/validation';

import { fetcher } from './fetcher';

import type { PostOrder, PostOrderResponse } from '@/backend/order/model';

export default async function placeOrder(body: PostOrder) {
  const json = await validatePostOrder(body);

  return await fetcher
    .post('/api/order', {
      json,
    })
    .json<PostOrderResponse>();
}
