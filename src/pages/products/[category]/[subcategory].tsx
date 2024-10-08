import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { InView } from 'react-intersection-observer';

import { collection } from '@/backend/collection';
import Loading from '@/components/core/Loading';
import ProductsDisplay from '@/components/custom/ProductsDisplay';
import ShoppingLayout from '@/components/layout/Shopping';
import { PRODUCTS_FETCH_LENGTH } from '@/defines/policy';
import useInfiniteProducts from '@/hooks/use-infinite-products';
import menu from 'public/menu.json';

interface Props {
  category: {
    main: string;
    sub: string;
  };
  totalProducts: number;
}

export default function SubCategorizedProductPage({
  category,
  totalProducts,
}: Props) {
  const { products, isLoading, setSize, size } = useInfiniteProducts();

  return (
    <ShoppingLayout pageType='sub' category={category}>
      <section className='w-full p-4 lg:ml-80'>
        <ProductsDisplay
          total={totalProducts}
          products={products}
          showResultNumber
        />

        {isLoading && <Loading className='w-full' />}

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
  return {
    paths: menu
      .map((item) =>
        item.list.map((list) => ({
          params: {
            category: item.image.alt,
            subcategory: list.href.replace('/', ''),
          },
        }))
      )
      .flat(),
    fallback: false,
  };
};

export async function getStaticProps(context: GetStaticPropsContext) {
  if (!context.params) return;

  const main = context.params.category as string;
  const sub = context.params.subcategory as string;
  const categoryData = menu.find((item) => item.image.alt === main);

  if (!categoryData) {
    return {
      notFound: true,
    };
  }

  const category = {
    main: categoryData.title,
    sub: categoryData['list'].filter((item) => item.href === `/${sub}`)[0]
      .title,
  };

  try {
    const col = await collection.products();
    const totalProducts = (
      await col.find({ category: { main, sub } }).toArray()
    ).length;
    return {
      props: {
        category,
        totalProducts,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        category,
        totalProducts: 0,
      },
    };
  }
}
