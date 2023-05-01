import { Product } from '@/backend/product/model';
import { PRODUCTS_FETCH_LENGTH } from '@/defines/policy';

import { fetcher } from './fetcher';

interface Props {
  q: string;
  priceRange?: {
    min: string | undefined;
    max: string | undefined;
  };
  page: number;
}

export async function searchProducts({
  q,
  priceRange = { min: '0', max: '100' },
  page,
}: Props) {
  return await fetcher
    .get('/api/search', {
      searchParams: {
        q,
        minPrice: priceRange.min ?? '0',
        maxPrice: priceRange.max ?? '100',
        limit: PRODUCTS_FETCH_LENGTH,
        skip: page * PRODUCTS_FETCH_LENGTH,
      },
    })
    .json<Product[]>();
}
