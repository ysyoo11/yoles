import { Product } from '@/backend/product/model';
import { PRODUCTS_FETCH_LENGTH } from '@/defines/policy';

import { fetcher } from './fetcher';

interface Props {
  main?: string;
  sub?: string;
  page: number;
}

export async function getProducts({ main, sub, page }: Props) {
  return await fetcher
    .get('/api/products', {
      searchParams: {
        main: main ? main : '',
        sub: sub ? sub : '',
        limit: PRODUCTS_FETCH_LENGTH,
        skip: page * PRODUCTS_FETCH_LENGTH,
      },
    })
    .json<Product[]>();
}
