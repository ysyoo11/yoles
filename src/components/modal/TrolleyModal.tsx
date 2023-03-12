import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrolleyModal({ isOpen, onClose }: Props) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[2]' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30' />
        </Transition.Child>
        <div className='fixed inset-0 flex justify-end overflow-visible'>
          <div className='flex min-h-full w-full items-center justify-center md:max-w-sm'>
            <Transition.Child
              as={Fragment}
              enter='ease-in-out duration-300 transition transform'
              enterFrom='translate-x-full'
              enterTo='translate-x-0'
              leave='ease-in-out duration-200 transition transform'
              leaveFrom='translate-x-0'
              leaveTo='translate-x-full'
            >
              <Dialog.Panel className='min-h-screen w-full transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all'>
                <div className='flex items-center justify-between border-b p-6'>
                  <Dialog.Title as='h3' className='text-2xl font-semibold'>
                    Trolley - 11 items
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className='rounded-full border border-transparent p-1.5 text-black hover:border-gray-700 hover:bg-gray-100'
                  >
                    <XMarkIcon className='h-5 w-5' />
                  </button>
                </div>
                {/* TODO: Show items, quantity, price, total price, clear items, place order button */}
                <div>Cart</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
