import { Product } from '@/backend/product/model';

import { fetcher } from './fetcher';

export async function getProduct({ id }: { id: string }) {
  return await fetcher.get(`/api/product?id=${id}`).json<Product>();
}
