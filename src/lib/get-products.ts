import { Product } from '@/backend/product/model';

import { fetcher } from './fetcher';

interface Props {
  main?: string;
  sub?: string;
  q?: string;
}

export async function getProducts({ main, sub, q }: Props) {
  return await fetcher
    .get(
      q
        ? `/api/search?q=${q}`
        : main === undefined && sub === undefined
        ? `/api/products`
        : main !== undefined && sub === undefined
        ? `/api/products?main=${main}`
        : `/api/products?main=${main}&sub=${sub}`
    )
    .json<Product[]>();
}
