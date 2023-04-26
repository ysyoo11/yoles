import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useKeenSlider } from 'keen-slider/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { ProductCategoryInfo } from '@/types';

interface Props {
  children: ReactNode;
  pageType: 'main' | 'sub' | 'search';
  productInfo?: ProductCategoryInfo;
  category?: {
    main: string;
    sub: string;
  };
  searchText?: string;
}

export default function ShoppingLayout({
  children,
  pageType,
  productInfo,
  category,
  searchText,
}: Props) {
  const router = useRouter();

  const [sliderRef, instanceRef] = useKeenSlider<HTMLUListElement>({
    loop: false,
    mode: 'snap',
    rtl: false,
    slides: {
      perView: 'auto',
      spacing: 8,
    },
  });

  return (
    <section className='mx-auto w-full max-w-7xl pt-10 lg:flex lg:px-0 lg:pt-0'>
      <aside className='inset-y-0 overflow-y-auto border-b px-4 pb-4 lg:fixed lg:mt-20 lg:h-screen lg:w-80 lg:border-r lg:px-4 lg:pt-14'>
        <div className='flex flex-col lg:flex-col-reverse lg:px-4'>
          <button
            onClick={() => router.push('/products')}
            className='mb-6 flex items-center space-x-2 text-red-500 underline hover:no-underline lg:mt-10'
          >
            <ChevronLeftIcon className='h-4 w-4 stroke-[3px]' />
            <p>
              {pageType === 'main' && 'All categories'}
              {pageType === 'sub' && category && category.main}
              {pageType === 'search' && 'Shop all'}
            </p>
          </button>
          <h2 className='text-2xl font-semibold lg:text-4xl'>
            {pageType === 'main' && productInfo && productInfo.title}
            {pageType === 'sub' && category && category.sub}
            {pageType === 'search' && searchText && `'${searchText}'`}
          </h2>
        </div>
        {pageType === 'main' && productInfo && (
          <>
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
          </>
        )}
      </aside>
      {children}
    </section>
  );
}
