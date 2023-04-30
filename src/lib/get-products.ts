import { Product } from '@/backend/product/model';

import { fetcher } from './fetcher';

interface Props {
  main?: string;
  sub?: string;
}

export async function getProducts({ main, sub }: Props) {
  return await fetcher
    .get('/api/products', {
      searchParams: {
        main: main ? main : '',
        sub: sub ? sub : '',
      },
    })
    .json<Product[]>();
}
