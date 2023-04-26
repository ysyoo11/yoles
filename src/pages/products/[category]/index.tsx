import { GetStaticPropsContext } from 'next';

import 'keen-slider/keen-slider.min.css';

import ProductsDisplay from '@/components/custom/ProductsDisplay';
import ShoppingLayout from '@/components/layout/Shopping';
import useProducts from '@/hooks/use-products';
import menu from 'public/menu.json';

import type { ProductCategoryInfo } from '@/types';

interface Props {
  productInfo: ProductCategoryInfo;
}

export default function CategorizedProductPage({ productInfo }: Props) {
  const { products } = useProducts();

  return (
    <ShoppingLayout pageType='main' productInfo={productInfo}>
      <section className='w-full p-4 lg:ml-80'>
        <ProductsDisplay products={products} showResultNumber />
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

  return {
    props: {
      productInfo,
    },
  };
}
