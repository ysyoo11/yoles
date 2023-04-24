import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { useYolesStore } from '@/components/yoles-context';

interface Props {
  className?: string;
  closeModal: () => void;
}

export default function SearchBar({ className, closeModal }: Props) {
  const [searchInput, setSearchInput] = useState('');

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
      if (searchHistory.length > 3) {
        const subtractedSearchHistory = searchHistory.splice(-1);
        setSearchHistory([searchInput, ...subtractedSearchHistory]);
        return;
      }
      setSearchHistory([searchInput, ...searchHistory]);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchHistory, setSearchHistory]);

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
            router.push(`/search/${searchInput}`);
          }
        }}
        className='w-full'
      >
        <input
          type='text'
          className='w-full rounded-full border border-gray-400 bg-gray-100 px-6 py-2 placeholder:text-sm placeholder:text-gray-700 focus:bg-white focus:outline-blue-500'
          placeholder='Search products'
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type='submit'
          className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-transparent p-1 hover:border-gray-600'
        >
          <MagnifyingGlassIcon className='h-5 w-5 stroke-2' />
        </button>
      </form>
    </div>
  );
}
