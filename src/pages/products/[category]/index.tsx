import { GetStaticPropsContext } from 'next';
import { InView } from 'react-intersection-observer';

import 'keen-slider/keen-slider.min.css';

import { collection } from '@/backend/collection';
import Loading from '@/components/core/Loading';
import ProductsDisplay from '@/components/custom/ProductsDisplay';
import ShoppingLayout from '@/components/layout/Shopping';
import { PRODUCTS_FETCH_LENGTH } from '@/defines/policy';
import useInfiniteProducts from '@/hooks/use-infinite-products';
import menu from 'public/menu.json';

import type { ProductCategoryInfo } from '@/types';

interface Props {
  productInfo: ProductCategoryInfo;
  totalProducts: number;
}

export default function CategorizedProductPage({
  productInfo,
  totalProducts,
}: Props) {
  const { products, isLoading, setSize, size } = useInfiniteProducts();

  return (
    <ShoppingLayout pageType='main' productInfo={productInfo}>
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

export async function getStaticPaths() {
  return {
    paths: menu.map((item) => ({
      params: { category: item.image.alt },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  if (!context.params) return;

  const productCategory = context.params.category as string;
  const productInfo = menu.find((item) => item.image.alt === productCategory);

  try {
    const col = await collection.products();
    const totalProducts = (
      await col
        .find({ 'category.main': productInfo ? productInfo.image.alt : '' })
        .toArray()
    ).length;
    return {
      props: {
        productInfo,
        totalProducts,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        productInfo,
        totalProducts: 0,
      },
    };
  }
}
