import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';

import { SWR_KEY } from '@/defines/swr-keys';
import { getProducts } from '@/lib/get-products';

import type { ApiError } from '@/utils/api-error';

export default function useProducts() {
  const router = useRouter();
  const mainCategory = router.query.category as string;
  const subCategory = router.query.subcategory as string;

  const {
    data: products,
    mutate,
    error,
  } = useSWRImmutable(
    `${SWR_KEY.PRODUCTS}-${mainCategory}-${subCategory}`,
    async () =>
      await getProducts({
        main: mainCategory,
        sub: subCategory,
      }),
    {
      shouldRetryOnError: false,
    }
  );

  return {
    loading: !products && !error,
    products: !error ? products : undefined,
    error: error as ApiError | undefined,
    mutate,
  };
}
