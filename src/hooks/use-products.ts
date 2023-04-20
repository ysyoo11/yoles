import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';

import { SWR_KEY } from '@/defines/swr-keys';
import { getProducts } from '@/lib/get-products';

import type { ApiError } from '@/utils/api-error';

export default function useProducts() {
  const router = useRouter();
  const mainCategory = router.query.category;
  const subCategory = router.query.subcategory;

  const {
    data: products,
    mutate,
    error,
  } = useSWRImmutable(
    `${SWR_KEY.PRODUCTS}-${mainCategory}-${subCategory}`,
    async () =>
      await getProducts({
        main: mainCategory as string,
        sub: subCategory as string,
      }),
    {
      shouldRetryOnError: false,
    }
  );

  return {
    loading: !products && !error,
    products: !error ? products : [],
    error: error as ApiError | undefined,
    mutate,
  };
}
