import { Product } from '@/backend/product/model';

import { fetcher } from './fetcher';

interface Props {
  main?: string;
  sub?: string;
  q?: string;
  priceRange?: {
    min: string;
    max: string;
  };
}

export async function getProducts({
  main,
  sub,
  q,
  priceRange = { min: '0', max: '100' },
}: Props) {
  return await fetcher
    .get(
      q
        ? `/api/search?q=${q}&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`
        : main === undefined && sub === undefined
        ? `/api/products`
        : main !== undefined && sub === undefined
        ? `/api/products?main=${main}`
        : `/api/products?main=${main}&sub=${sub}`
    )
    .json<Product[]>();
}
