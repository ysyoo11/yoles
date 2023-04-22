import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import ProductCard from '@/components/custom/ProductCard';
import useProducts from '@/hooks/use-products';
import menu from 'public/menu.json';

export default function SubCategorizedProductPage() {
  const router = useRouter();
  const { products } = useProducts();

  const category = useMemo(() => {
    const currentCategory = menu.find(
      (item) => item.image.alt === router.query.category
    );
    if (!currentCategory) return { main: 'All products', sub: '' };
    return {
      main: currentCategory.title,
      sub: currentCategory.list.find(
        (item) => item.href === `/${router.query.subcategory}`
      )!.title,
    };
  }, [router.query.category, router.query.subcategory]);

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
        {products && (
          <>
            <p className='text-xs text-gray-400'>{products.length} results</p>
            <div className='mt-10 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
              {products.map((item, idx) => (
                <ProductCard
                  key={`product-${idx}`}
                  name={item.name}
                  price={item.price}
                  imageUrl={item.image}
                  id={item.id}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </section>
  );
}
