import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useKeenSlider } from 'keen-slider/react';
import { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import 'keen-slider/keen-slider.min.css';

import ProductCard from '@/components/custom/ProductCard';
import useProducts from '@/hooks/use-products';
import menu from 'public/menu.json';

import type { ProductCategoryInfo } from '@/types';

interface Props {
  productInfo: ProductCategoryInfo;
}

export default function CategorizedProductPage({ productInfo }: Props) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLUListElement>({
    loop: false,
    mode: 'snap',
    rtl: false,
    slides: {
      perView: 'auto',
      spacing: 8,
    },
  });

  const router = useRouter();
  const { products } = useProducts();

  return (
    <section className='mx-auto w-full max-w-7xl py-10 lg:flex lg:px-0 lg:pt-0'>
      <div className='border-b px-4 pb-4 lg:min-h-screen lg:w-96 lg:border-r lg:px-4 lg:pt-14'>
        <div className='flex flex-col px-4 lg:flex-col-reverse'>
          <button
            onClick={() => router.push('/products')}
            className='mb-6 flex items-center space-x-2 text-red-500 underline hover:no-underline lg:mt-10'
          >
            <ChevronLeftIcon className='h-4 w-4 stroke-[3px]' />
            <p>All categories</p>
          </button>
          <h2 className='text-2xl font-semibold lg:text-4xl'>
            {productInfo.title}
          </h2>
        </div>
        <ul className='hidden py-4 lg:block'>
          {productInfo.list.map((item, idx) => (
            <li key={`subcategory-${item.title}-${idx}`}>
              <Link
                href={`/products/${productInfo.image.alt}${item.href}`}
                className='flex items-center justify-between rounded-md py-4 px-4 hover:bg-gray-100 hover:underline'
              >
                <span className='text-sm font-semibold'>{item.title}</span>
                <ChevronRightIcon className='h-5 w-5' />
              </Link>
            </li>
          ))}
        </ul>
        <div className='relative lg:hidden'>
          <ul ref={sliderRef} className='keen-slider mt-6'>
            {productInfo.list.map((item, idx) => (
              <li
                key={`item-${idx}`}
                className='keen-slider__slide !w-max !overflow-visible text-center'
              >
                <Link
                  href={`/products/${productInfo.image.alt}${item.href}`}
                  className='block w-max rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 hover:underline'
                >
                  <p>{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
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
