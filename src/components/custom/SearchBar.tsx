import { Popover, Transition } from '@headlessui/react';
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useState } from 'react';

import { useYolesStore } from '@/components/yoles-context';

interface Props {
  className?: string;
  closeModal: () => void;
}

const initialPriceRange = {
  min: 0,
  max: 100,
};

export default function SearchBar({ className, closeModal }: Props) {
  const [searchInput, setSearchInput] = useState('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(
    initialPriceRange
  );

  const router = useRouter();
  const { searchHistory, setSearchHistory } = useYolesStore();

  const addSearchHistory = useCallback(() => {
    const timer = setTimeout(() => {
      if (searchHistory.includes(searchInput)) {
        const dedupedSearchHistory = searchHistory.filter(
          (value) => value !== searchInput
        );
        setSearchHistory([searchInput, ...dedupedSearchHistory]);
        return;
      }
      if (searchHistory.length >= 3) {
        searchHistory.pop();
        const subtractedSearchHistory = searchHistory;
        setSearchHistory([searchInput, ...subtractedSearchHistory]);
        return;
      }
      setSearchHistory([searchInput, ...searchHistory]);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchHistory, setSearchHistory]);

  const initializePriceRange = useCallback(() => {
    const timer = setTimeout(() => {
      setPriceRange(initialPriceRange);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={clsx('relative w-full', className)}>
      <form
        action='submit'
        onSubmit={(e) => {
          e.preventDefault();
          if (searchInput === '') {
            return;
          } else {
            addSearchHistory();
            closeModal();
            setSearchInput('');
            initializePriceRange();
            router.push(
              priceRange === initialPriceRange
                ? `/search/${searchInput}`
                : `/search/${searchInput}?minPrice=${priceRange.min}&maxPrice=${priceRange.max}`
            );
          }
        }}
        className='w-full'
      >
        <input
          type='text'
          className='w-full rounded-full border border-gray-400 bg-gray-100 px-6 py-2 placeholder:text-sm placeholder:text-gray-700 focus:bg-white focus:outline-blue-500'
          placeholder='Search products'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className='absolute right-2 top-1/2 flex -translate-y-1/2 items-center space-x-1'>
          <div className='relative'>
            <Popover className='relative'>
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className={clsx(
                      'rounded-full border border-transparent p-0.5 hover:border-gray-600',
                      {
                        'border-gray-600': open,
                      }
                    )}
                  >
                    <AdjustmentsHorizontalIcon className='h-5 w-5 stroke-2' />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-200'
                    enterFrom='opacity-0 translate-y-1'
                    enterTo='opacity-100 translate-y-0'
                    leave='transition ease-in duration-150'
                    leaveFrom='opacity-100 translate-y-0'
                    leaveTo='opacity-0 translate-y-1'
                  >
                    {/* TODO: Create dual range input component */}
                    <Popover.Panel className='absolute -right-14 z-10 mt-3 w-screen max-w-xs transform px-4 sm:px-0 md:max-w-sm md:-translate-x-10'>
                      <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                        <div className='relative flex flex-col space-y-4 bg-white p-4'>
                          <p className='font-medium'>Price Range</p>
                          <div className='flex items-center space-x-2'>
                            {/* Min */}
                            <div className='flex flex-col'>
                              <label
                                htmlFor='min'
                                className='text-sm font-medium'
                              >
                                Min:
                              </label>
                              <input
                                type='number'
                                className='w-max rounded-md bg-gray-100 py-1 px-2 font-medium'
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  if (e.target.valueAsNumber > 0) {
                                    setPriceRange((prev) => ({
                                      ...prev,
                                      min: e.target.valueAsNumber,
                                    }));
                                  }
                                  if (e.target.valueAsNumber > priceRange.max) {
                                    setPriceRange((prev) => ({
                                      ...prev,
                                      min: prev.max,
                                    }));
                                  }
                                  if (
                                    e.target.value === '' ||
                                    e.target.valueAsNumber === 0
                                  ) {
                                    setPriceRange((prev) => ({
                                      ...prev,
                                      min: 0,
                                    }));
                                  }
                                }}
                                value={Number(priceRange.min).toString()}
                                max={priceRange.max}
                                min={0}
                                id='min'
                                name='min'
                              />
                            </div>

                            <span>~</span>

                            {/* Max */}
                            <div className='flex flex-col'>
                              <label
                                htmlFor='max'
                                className='text-sm font-medium'
                              >
                                Max:
                              </label>
                              <input
                                type='number'
                                className='w-max rounded-md bg-gray-100 py-1 px-2 font-medium'
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  if (e.target.valueAsNumber > 0) {
                                    setPriceRange((prev) => ({
                                      ...prev,
                                      max: e.target.valueAsNumber,
                                    }));
                                  }
                                  if (e.target.valueAsNumber < priceRange.min) {
                                    setPriceRange((prev) => ({
                                      ...prev,
                                      max: prev.min,
                                    }));
                                  }
                                  if (
                                    e.target.value === '' ||
                                    e.target.valueAsNumber === 0
                                  ) {
                                    setPriceRange((prev) => ({
                                      ...prev,
                                      max: 0,
                                    }));
                                  }
                                  if (e.target.valueAsNumber > 100) {
                                    setPriceRange((prev) => ({
                                      ...prev,
                                      max: 100,
                                    }));
                                  }
                                }}
                                value={Number(priceRange.max).toString()}
                                max={100}
                                min={priceRange.min}
                                id='max'
                                name='max'
                              />
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (searchInput === '') return;
                              addSearchHistory();
                              closeModal();
                              setSearchInput('');
                              initializePriceRange();
                              close();
                              router.push(
                                priceRange === initialPriceRange
                                  ? `/search/${searchInput}`
                                  : `/search/${searchInput}?minPrice=${priceRange.min}&maxPrice=${priceRange.max}`
                              );
                            }}
                            className='mt-2 w-max self-center rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600'
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
          <button
            type='submit'
            className='rounded-full border border-transparent p-1 hover:border-gray-600'
          >
            <MagnifyingGlassIcon className='h-5 w-5 stroke-2' />
          </button>
        </div>
      </form>
    </div>
  );
}
