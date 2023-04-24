import { GetStaticPaths, GetStaticProps } from 'next';
import useSWRImmutable from 'swr/immutable';

import ProductCard from '@/components/custom/ProductCard';
import { SWR_KEY } from '@/defines/swr-keys';
import { getProducts } from '@/lib/get-products';

export default function SearchPage({ searchText }: { searchText: string }) {
  const {
    data: products,
    error,
    isLoading,
  } = useSWRImmutable(
    `${SWR_KEY.SEARCH}-${searchText}`,
    async () => {
      return await getProducts({
        q: searchText,
      }).catch((e) => console.error(e));
    },
    {
      shouldRetryOnError: false,
    }
  );

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Something went wrong</p>}
      {products &&
        products.map((item, idx) => (
          <ProductCard key={`search-result-${idx}`} product={item} />
        ))}
      <div>Hello world!</div>
    </>
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
