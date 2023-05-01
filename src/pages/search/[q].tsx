import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { InView } from 'react-intersection-observer';
import useSWRInfinite from 'swr/infinite';

import { Product } from '@/backend/product/model';
import Loading from '@/components/core/Loading';
import ProductsDisplay from '@/components/custom/ProductsDisplay';
import ShoppingLayout from '@/components/layout/Shopping';
import { useAssertiveStore } from '@/context/assertives';
import { PRODUCTS_FETCH_LENGTH } from '@/defines/policy';
import { SWR_KEY } from '@/defines/swr-keys';
import { searchProducts } from '@/lib/search-products';

export default function SearchPage({ searchText }: { searchText: string }) {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAssertiveStore();

  const { data, size, setSize } = useSWRInfinite(
    (index) =>
      `${SWR_KEY.SEARCH}-${searchText}-${router.query.minPrice}-${router.query.maxPrice}-${index}`,
    async () => {
      setLoading(true);
      const data = await searchProducts({
        q: searchText,
        priceRange: {
          min: router.query.minPrice as string,
          max: router.query.maxPrice as string,
        },
        // FIXME: Make better solution
        page: router.query.minPrice || router.query.maxPrice ? page - 1 : page,
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

  return (
    <ShoppingLayout pageType='search' searchText={searchText}>
      <section className='w-full p-4 lg:ml-80'>
        <ProductsDisplay products={products} showResultNumber />

        {loading && <Loading className='w-full' />}

        {products && products.length >= size * PRODUCTS_FETCH_LENGTH && (
          <InView
            as='div'
            className='flex w-full items-center justify-center py-4'
            rootMargin='24px'
            onChange={(inView) => {
              if (inView) setSize((prev) => prev + 1);
            }}
          />
        )}
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
