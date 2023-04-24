import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import { Product } from '@/backend/product/model';
import ProductsDisplay from '@/components/custom/ProductsDisplay';
import { SWR_KEY } from '@/defines/swr-keys';
import { getProducts } from '@/lib/get-products';

export default function SearchPage({ searchText }: { searchText: string }) {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const router = useRouter();

  const { data, error, isLoading } = useSWRImmutable(
    `${SWR_KEY.SEARCH}-${searchText}`,
    async () => {
      return await getProducts({
        q: searchText,
      })
        .then((data) => setProducts(data))
        .catch((e) => console.error(e));
    },
    {
      shouldRetryOnError: false,
    }
  );

  return (
    <section className='mx-auto w-full max-w-7xl py-10 lg:flex lg:px-0 lg:pt-0'>
      <div className='border-b px-4 pb-4 lg:min-h-screen lg:w-96 lg:border-r lg:px-4 lg:pt-14'>
        <div className='flex flex-col px-4 lg:flex-col-reverse'>
          <button
            onClick={() => router.push('/products')}
            className='mb-6 flex items-center space-x-2 text-red-500 underline hover:no-underline lg:mt-10'
          >
            <ChevronLeftIcon className='h-4 w-4 stroke-[3px]' />
            <p>Shop All</p>
          </button>
          <h2 className='text-2xl font-semibold lg:text-4xl'>
            &apos;{searchText}&apos;
          </h2>
        </div>
      </div>
      <section className='w-full p-4'>
        <ProductsDisplay products={products} showResultNumber />
      </section>
    </section>
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
