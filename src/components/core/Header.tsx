import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import SearchBar from '@/components/custom/SearchBar';
import ShoppingCartButton from '@/components/custom/ShoppingCartButton';
import MenuModal from '@/components/modal/MenuModal';
import SearchModal from '@/components/modal/SearchModal';
import TrolleyModal from '@/components/modal/TrolleyModal';

import Logo from './Logo';

type ModalType = 'menu' | 'search' | 'trolley';

export default function Header() {
  const [showModal, setShowModal] = useState<ModalType | null>(null);

  const router = useRouter();

  const closeModal = useCallback(() => setShowModal(null), []);

  return (
    <>
      <header className='sticky top-0 z-[1] w-full bg-white shadow'>
        <div className='mx-auto flex max-w-xl items-center justify-between space-x-10 px-6 py-2 sm:max-w-7xl'>
          <div className='flex items-center space-x-4 md:space-x-0'>
            <button onClick={() => setShowModal('menu')} className='md:hidden'>
              <Bars3Icon className='h-6 w-6' />
            </button>
            <button onClick={() => router.push('/')}>
              <Logo />
            </button>
          </div>
          <SearchBar
            className='hidden md:flex md:max-w-xl'
            closeModal={closeModal}
          />
          <div className='flex space-x-6'>
            <button
              onClick={() => setShowModal('search')}
              className='group flex flex-col items-center rounded-sm p-2 text-gray-700 hover:bg-gray-100 md:hidden'
            >
              <MagnifyingGlassIcon className='h-6 w-6' />
              <span className='text-xs group-hover:underline'>Search</span>
            </button>
            <ShoppingCartButton onClick={() => setShowModal('trolley')} />
          </div>
        </div>
      </header>
      <MenuModal isOpen={showModal === 'menu'} onClose={closeModal} />
      <SearchModal isOpen={showModal === 'search'} onClose={closeModal} />
      <TrolleyModal isOpen={showModal === 'trolley'} onClose={closeModal} />
    </>
  );
}
