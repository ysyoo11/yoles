import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent, useEffect, useState } from 'react';

import useWindowSize from '@/hooks/use-window-size';
import menu from 'public/menu.json';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [perView, setPerView] = useState(4);

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

  useEffect(() => {
    if (width === undefined) return;

    if (width > 640) {
      setPerView(6);
    } else {
      setPerView(4);
    }
  }, [width]);

  return (
    <div className='min-h-[2000px]'>
      <div className='w-full bg-yellow-50'>
        <ul
          ref={sliderRef}
          className='keen-slider relative mx-auto flex max-w-7xl overflow-hidden py-6'
        >
          {menu.map((item, idx) => (
            <li key={`item-menu-${idx}`} className='keen-slider__slide'>
              <Link href={`/products/${item.image.alt}`}>
                <div className='group flex flex-col items-center justify-center space-y-2 text-center'>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={64}
                    height={64}
                    priority
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
                onClick={(e: any) => {
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
    </div>
  );
}

function ArrowButton({
  onClick,
  direction,
  disabled,
}: {
  onClick: (e: MouseEvent) => void;
  direction: 'right' | 'left';
  disabled: boolean;
}) {
  return (
    <button
      className={clsx(
        'absolute top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg disabled:pointer-events-none disabled:opacity-0',
        {
          'right-2': direction === 'right',
          'left-2': direction === 'left',
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {direction === 'right' && (
        <ChevronRightIcon className='h-4 w-4 stroke-2' />
      )}
      {direction === 'left' && <ChevronLeftIcon className='h-4 w-4 stroke-2' />}
    </button>
  );
}
