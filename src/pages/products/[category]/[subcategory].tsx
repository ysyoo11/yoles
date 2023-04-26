import { GetStaticPaths, GetStaticPropsContext } from 'next';

import ProductsDisplay from '@/components/custom/ProductsDisplay';
import ShoppingLayout from '@/components/layout/Shopping';
import useProducts from '@/hooks/use-products';
import menu from 'public/menu.json';

interface Props {
  category: {
    main: string;
    sub: string;
  };
}

export default function SubCategorizedProductPage({ category }: Props) {
  const { products } = useProducts();

  return (
    <ShoppingLayout pageType='sub' category={category}>
      <section className='w-full p-4 lg:ml-80'>
        <ProductsDisplay products={products} showResultNumber />
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

  return {
    props: {
      category,
    },
  };
}
