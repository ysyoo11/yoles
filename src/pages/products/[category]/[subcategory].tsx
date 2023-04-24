import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';

import ProductsDisplay from '@/components/custom/ProductsDisplay';
import useProducts from '@/hooks/use-products';
import menu from 'public/menu.json';

interface Props {
  category: {
    main: string;
    sub: string;
  };
}

export default function SubCategorizedProductPage({ category }: Props) {
  const router = useRouter();
  const { products } = useProducts();

  return (
    <section className='mx-auto w-full max-w-7xl py-10 lg:flex lg:px-0 lg:pt-0'>
      <div className='border-b px-4 pb-4 lg:min-h-screen lg:w-96 lg:border-r lg:px-4 lg:pt-14'>
        <div className='flex flex-col px-4 lg:flex-col-reverse'>
          <button
            onClick={() => router.push(`/products/${router.query.category}`)}
            className='mb-6 flex items-center space-x-2 text-red-500 underline hover:no-underline lg:mt-10'
          >
            <ChevronLeftIcon className='h-4 w-4 stroke-[3px]' />
            <p>{category.main}</p>
          </button>
          <h2 className='text-2xl font-semibold lg:text-4xl'>{category.sub}</h2>
        </div>
      </div>
      <section className='w-full p-4'>
        <ProductsDisplay products={products} showResultNumber />
      </section>
    </section>
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
