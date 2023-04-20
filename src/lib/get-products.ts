import { Product } from '@/backend/product/model';

import { fetcher } from './fetcher';

export async function getProducts({
  main,
  sub,
}: {
  main: string | undefined;
  sub: string | undefined;
}) {
  return await fetcher
    .get(
      main === undefined && sub === undefined
        ? `/api/products`
        : main !== undefined && sub === undefined
        ? `/api/products?main=${main}`
        : `/api/products?main=${main}&sub=${sub}`
    )
    .json<Product[]>();
}
