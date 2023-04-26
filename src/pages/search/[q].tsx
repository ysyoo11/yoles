import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import { Product } from '@/backend/product/model';
import ProductsDisplay from '@/components/custom/ProductsDisplay';
import ShoppingLayout from '@/components/layout/Shopping';
import { useAssertiveStore } from '@/context/assertives';
import { SWR_KEY } from '@/defines/swr-keys';
import { getProducts } from '@/lib/get-products';

export default function SearchPage({ searchText }: { searchText: string }) {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const router = useRouter();

  const { showAlert } = useAssertiveStore();

  const priceRange = useMemo(() => {
    if (router.query.minPrice && router.query.maxPrice) {
      const min = router.query.minPrice as string;
      const max = router.query.maxPrice as string;
      return {
        min,
        max,
      };
    }
    return {
      min: '0',
      max: '100',
    };
  }, [router.query.minPrice, router.query.maxPrice]);

  const { data, error, isLoading } = useSWRImmutable(
    priceRange &&
      `${SWR_KEY.SEARCH}-${searchText}-${priceRange.min}-${priceRange.max}`,
    async () => {
      if (priceRange) {
        return await getProducts({
          q: searchText,
          priceRange,
        })
          .then((data) => setProducts(data))
          .catch(showAlert);
      }
    },
    {
      shouldRetryOnError: false,
    }
  );

  return (
    <ShoppingLayout pageType='search' searchText={searchText}>
      <section className='w-full p-4 lg:ml-80'>
        <ProductsDisplay products={products} showResultNumber />
      </section>
    </ShoppingLayout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  if (params) {
    const searchText = params.q;
    return { props: { searchText } };
  }
  return { notFound: true };
};
