import { Dialog, Transition } from '@headlessui/react';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Fragment } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const dummyItemList = [
  {
    id: 1,
    name: 'Chicken breast with chilli sauce and mustard 200g',
    price: 6.5,
    details:
      'This is a chicken breast and it is really good for your health. It is a good source of protein.',
    quantity: 4,
    imageSrc: '/image/category/meat-seafood.png',
  },
  {
    id: 2,
    name: 'Pork belly 150g',
    price: 8.5,
    details:
      'This is a pork belly and it is really good for your health. It is a Korean soul food.',
    quantity: 2,
    imageSrc: '/image/category/meat-seafood.png',
  },
];

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
              <Dialog.Panel className='flex min-h-screen w-full transform flex-col justify-between overflow-hidden bg-white text-left align-middle shadow-xl transition-all'>
                <div>
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
                  <div className='border-b p-6'>
                    <ul>
                      {/* TODO: */}
                      {dummyItemList.map((item) => (
                        <li
                          key={`cart-item-${item.id}`}
                          className='flex justify-between py-4'
                        >
                          <div className='flex space-x-6'>
                            <Image
                              src={item.imageSrc}
                              alt={item.name}
                              width={72}
                              height={72}
                            />
                            <div className='max-w-xs space-y-2'>
                              <p className='font-medium'>{item.name}</p>
                              <div className='flex space-x-4'>
                                <select
                                  name='quantity'
                                  id='quantity'
                                  value={item.quantity}
                                  className='rounded-md border border-gray-400 bg-gray-100 px-2 py-1 text-sm'
                                >
                                  <option>1</option>
                                  <option>2</option>
                                  <option>3</option>
                                  <option>4</option>
                                  <option>5</option>
                                  <option>6</option>
                                </select>
                                <button className='text-sm text-gray-500 underline hover:no-underline'>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                          <span className='text-xl font-medium'>
                            ${item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className='flex w-full justify-center pt-6'>
                    {/* TODO: */}
                    <button className='flex items-center space-x-1.5 text-red-500 hover:underline'>
                      <TrashIcon className='h-6 w-6 stroke-2' />
                      <span className='text-sm font-medium'>
                        Remove all items
                      </span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className='flex justify-between px-6 pb-4'>
                    <div className='space-y-1'>
                      <span className='text-xl font-semibold'>Total</span>
                      <p className='text-xs text-gray-500'>
                        Excludes service and bagging fees
                      </p>
                    </div>
                    <span className='text-xl font-semibold'>$15.00</span>
                  </div>
                  <div className='px-6 pb-2'>
                    <button className='w-full rounded-full bg-yoles py-3 text-white hover:bg-red-700'>
                      Checkout
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
