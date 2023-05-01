import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import { Product } from '@/backend/product/model';
import { SWR_KEY } from '@/defines/swr-keys';
import { getProducts } from '@/lib/get-products';

import type { ApiError } from '@/utils/api-error';

export default function useInfiniteProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const router = useRouter();
  const mainCategory = router.query.category as string;
  const subCategory = router.query.subcategory as string;

  const { data, size, setSize, error, mutate } = useSWRInfinite(
    (index) => `${SWR_KEY.PRODUCTS}-${mainCategory}-${subCategory}-${index}`,
    async () => {
      setLoading(true);
      const data = await getProducts({
        main: mainCategory,
        sub: subCategory,
        page,
      });
      setLoading(false);
      return data;
    },
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data) {
      setProducts(data.flat());
    }
  }, [data]);

  useEffect(() => {
    setPage(size);
  }, [size]);

  return {
    data,
    isLoading: loading,
    products: !error ? products : undefined,
    error: error as ApiError | undefined,
    mutate,
    setSize,
    size,
  };
}
