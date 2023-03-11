import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

import SearchBar from '@/components/custom/SearchBar';
import { useYolesStore } from '@/components/yoles-context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { searchHistory } = useYolesStore();

  return (
    <Dialog as='div' className='relative z-10' onClose={onClose} open={isOpen}>
      <div className='fixed inset-0 overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center'>
          <Dialog.Panel className='relative min-h-screen w-full transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all'>
            <div className='flex items-center justify-end'>
              <SearchBar className='mr-6' closeModal={onClose} />
              <button onClick={onClose} className='p-1'>
                <XMarkIcon className='h-4 w-4 stroke-2' />
              </button>
            </div>
            {searchHistory.length > 0 && (
              <div className='mt-6 space-y-4'>
                <p className='text-sm font-semibold'>Recent searches</p>
                <ul className='space-y-1'>
                  {searchHistory.map((item, idx) => (
                    <li key={`search-history-${idx}`}>
                      <button
                        className='flex h-full w-full items-center space-x-4 rounded border border-transparent px-4 py-2 hover:border-gray-800 hover:underline'
                        onClick={() => {
                          router.push(`/products?q=${item}`);
                          onClose();
                        }}
                      >
                        <MagnifyingGlassIcon className='h-4 w-4 stroke-[3px]' />
                        <span className='text-sm text-gray-700'>{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
