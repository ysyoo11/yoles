import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useKeenSlider } from 'keen-slider/react';
import { GetStaticProps } from 'next';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useState } from 'react';

import { collection } from '@/backend/collection';
import { Product } from '@/backend/product/model';
import ProductsDisplay from '@/components/custom/ProductsDisplay';
import useWindowSize from '@/hooks/use-window-size';
import heroSlides from 'public/hero.json';
import menu from 'public/menu.json';

interface Props {
  products: Product[];
}

export default function HomePage({ products }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroCurrentSlide, setHeroCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [perView, setPerView] = useState(4);

  const router = useRouter();
  const { width } = useWindowSize();

  const [sliderRef, instanceRef] = useKeenSlider<HTMLUListElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    mode: 'snap',
    slides: {
      perView,
    },
  });
  const [heroSliderRef, heroInstanceRef] = useKeenSlider<HTMLUListElement>({
    initial: 0,
    slideChanged(slider) {
      setHeroCurrentSlide(slider.track.details.rel);
    },
    created() {
      setHeroLoaded(true);
    },
    loop: true,
    mode: 'snap',
  });

  useEffect(() => {
    const autoPlayHeroInterval = setInterval(() => {
      if (!heroInstanceRef.current) return;
      if (width && width > 768) {
        heroInstanceRef.current.next();
      }
    }, 4000);
    return () => {
      clearInterval(autoPlayHeroInterval);
    };
  }, [heroInstanceRef, width]);

  useEffect(() => {
    if (!width) return;
    if (width > 640) {
      setPerView(6);
    } else {
      setPerView(4);
    }
  }, [width]);

  return (
    <div className='min-h-[2000px]'>
      {/* Top Nav */}
      <div className='w-full bg-yellow-50'>
        <ul
          ref={sliderRef}
          className='keen-slider relative mx-auto flex max-w-7xl overflow-hidden py-6'
        >
          {menu.map((item, idx) => (
            <li key={`item-menu-${idx}`} className='keen-slider__slide'>
              <Link href={`/products/${item.image.alt}`}>
                <div className='group flex flex-col items-center justify-center space-y-2 text-center'>
                  <NextImage
                    src={item.image.src}
                    alt={item.image.alt}
                    width={64}
                    height={64}
                    placeholder='blur'
                    blurDataURL={item.image.src}
                  />
                  <span className='w-20 text-sm font-semibold group-hover:underline'>
                    {item.title}
                  </span>
                </div>
              </Link>
            </li>
          ))}
          {loaded && instanceRef.current && (
            <>
              <ArrowButton
                direction='left'
                onClick={(e) => {
                  if (!instanceRef.current) return;
                  e.stopPropagation();
                  instanceRef.current.prev();
                }}
                disabled={currentSlide === 0}
              />
              <ArrowButton
                direction='right'
                onClick={(e) => {
                  if (!instanceRef.current) return;
                  e.stopPropagation();
                  instanceRef.current.next();
                }}
                disabled={
                  currentSlide ===
                  instanceRef.current.track.details.slides.length - perView
                }
              />
            </>
          )}
        </ul>
      </div>

      {/* Hero section */}
      <div className='w-full'>
        <ul
          ref={heroSliderRef}
          className='keen-slider relative flex w-full overflow-hidden'
        >
          {heroSlides.map((item, idx) => (
            <li
              key={`hero-slide-${idx}`}
              className='keen-slider__slide bg-zinc-800'
            >
              <div className='md:mx-auto md:flex  md:max-w-7xl md:flex-row-reverse'>
                <div
                  className='h-[500px] w-full bg-cover bg-center bg-no-repeat md:h-[24rem] lg:h-[30rem]'
                  style={{
                    backgroundImage: `url("${item.imageSrc}")`,
                  }}
                />
                <div className='relative h-[300px] w-full space-y-6 px-6 pt-10 pb-8 text-white lg:space-y-8'>
                  <div className='space-y-4 lg:space-y-6'>
                    <h6 className='text-2xl font-semibold md:text-3xl lg:text-5xl'>
                      {item.title}
                    </h6>
                    <p className='text-sm font-light md:text-base lg:text-lg'>
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/products')}
                    className='flex w-full items-center justify-center rounded-full bg-yoles py-3 hover:bg-red-700 md:w-max md:px-6'
                  >
                    <span className='text-sm'>Shop now</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
          {heroLoaded && heroInstanceRef.current && (
            <>
              {/* Hero controller - Mobile view */}
              <div className='absolute bottom-4 flex w-full justify-between px-6 md:hidden'>
                <ArrowButton
                  direction='left'
                  disabled={heroCurrentSlide === 0}
                  onClick={(e) => {
                    if (!heroInstanceRef.current) return;
                    e.stopPropagation();
                    heroInstanceRef.current.prev();
                  }}
                  isHero
                />
                <div className='space-x-4'>
                  {Array.from(
                    Array(
                      heroInstanceRef.current.track.details.slides.length
                    ).keys()
                  ).map((idx) => (
                    <button
                      key={`dot-${idx}`}
                      className={clsx(
                        'h-2 w-2 rounded-full border border-white',
                        {
                          'bg-white': heroCurrentSlide === idx,
                        }
                      )}
                      onClick={() => {
                        if (!heroInstanceRef.current) return;
                        heroInstanceRef.current.moveToIdx(idx);
                      }}
                    />
                  ))}
                </div>
                <ArrowButton
                  direction='right'
                  disabled={
                    heroCurrentSlide ===
                    heroInstanceRef.current.track.details.slides.length - 1
                  }
                  onClick={(e) => {
                    if (!heroInstanceRef.current) return;
                    e.stopPropagation();
                    heroInstanceRef.current.next();
                  }}
                  isHero
                />
              </div>

              {/* Hero controller - PC view */}
              <div className='absolute bottom-4 right-4 hidden items-center justify-between space-x-8 rounded-full bg-white shadow-md md:flex'>
                <ArrowButton
                  direction='left'
                  disabled={heroCurrentSlide === 0}
                  onClick={(e) => {
                    if (!heroInstanceRef.current) return;
                    e.stopPropagation();
                    heroInstanceRef.current.prev();
                  }}
                  isHero
                />
                <div className='flex items-center space-x-4'>
                  {Array.from(
                    Array(
                      heroInstanceRef.current.track.details.slides.length
                    ).keys()
                  ).map((idx) => (
                    <button
                      key={`dot-${idx}`}
                      className={clsx(
                        'h-2 w-2 rounded-full border border-black',
                        {
                          'bg-gray-900': heroCurrentSlide === idx,
                        }
                      )}
                      onClick={() => {
                        if (!heroInstanceRef.current) return;
                        heroInstanceRef.current.moveToIdx(idx);
                      }}
                    />
                  ))}
                </div>
                <ArrowButton
                  direction='right'
                  disabled={
                    heroCurrentSlide ===
                    heroInstanceRef.current.track.details.slides.length - 1
                  }
                  onClick={(e) => {
                    if (!heroInstanceRef.current) return;
                    e.stopPropagation();
                    heroInstanceRef.current.next();
                  }}
                  isHero
                />
              </div>
            </>
          )}
        </ul>
      </div>
      <section className='mx-auto flex max-w-7xl flex-col px-4 py-4'>
        <h6 className='mt-6 text-3xl font-medium md:mt-10'>Shop Items</h6>
        <ProductsDisplay products={products} />
        <button
          onClick={() => router.push('/products')}
          className='group flex items-center space-x-2 self-center text-gray-700 hover:underline md:mt-10'
        >
          <span className='md:text-lg'>See more</span>
          <ArrowRightIcon className='h-5 w-5 stroke-2 transition-transform group-hover:translate-x-1' />
        </button>
      </section>
    </div>
  );
}

function ArrowButton({
  onClick,
  direction,
  disabled,
  isHero = false,
}: {
  onClick: (e: MouseEvent) => void;
  direction: 'right' | 'left';
  disabled: boolean;
  isHero?: boolean;
}) {
  return (
    <button
      className={clsx('group rounded-full border border-transparent p-2', {
        'absolute top-1/2 -translate-y-1/2 bg-white shadow-lg hover:border-black disabled:pointer-events-none disabled:opacity-0':
          !isHero,
        'right-2': direction === 'right' && !isHero,
        'left-2': direction === 'left' && !isHero,
        'hover:bg-white/10 md:hover:bg-gray-100': isHero,
      })}
      onClick={onClick}
      disabled={!isHero ? disabled : false}
    >
      {direction === 'right' && (
        <ChevronRightIcon
          className={clsx('h-4 w-4 stroke-2', {
            'group-hover:stroke-orange-500': !isHero,
            'stroke-white md:stroke-gray-900': isHero,
          })}
        />
      )}
      {direction === 'left' && (
        <ChevronLeftIcon
          className={clsx('h-4 w-4 stroke-2', {
            'group-hover:stroke-orange-500': !isHero,
            'stroke-white md:stroke-gray-900': isHero,
          })}
        />
      )}
    </button>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const col = await collection.products();
    const products = await col
      .find({ quantity: { $gt: 0 } })
      .limit(10)
      .toArray();

    return { props: { products: JSON.parse(JSON.stringify(products)) } };
  } catch (e) {
    console.error(e);
    return {
      props: { products: [] },
    };
  }
};
