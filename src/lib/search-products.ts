import { Product } from '@/backend/product/model';

import { fetcher } from './fetcher';

interface Props {
  q: string;
  priceRange?: {
    min: string;
    max: string;
  };
}

export async function searchProducts({
  q,
  priceRange = { min: '0', max: '100' },
}: Props) {
  return await fetcher
    .get('/api/search', {
      searchParams: {
        q,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      },
    })
    .json<Product[]>();
}
