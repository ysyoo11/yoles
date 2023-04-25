import { Dialog, Transition } from '@headlessui/react';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import NextImage from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { useYolesStore } from '@/components/yoles-context';
import { useAssertiveStore } from '@/context/assertives';
import { MAX_PURCHASE_QUANTITY } from '@/defines/policy';
import displayPrice from '@/utils/display-price';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrolleyModal({ isOpen, onClose }: Props) {
  const { trolleyItems, setTrolleyItems, total } = useYolesStore();

  const { showModal } = useAssertiveStore();

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
          <div className='flex min-h-full w-full items-center justify-center md:max-w-md'>
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
                      Trolley - {total.quantity} items
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className='rounded-full border border-transparent p-1.5 text-black hover:border-gray-700 hover:bg-gray-100'
                    >
                      <XMarkIcon className='h-5 w-5' />
                    </button>
                  </div>

                  {trolleyItems.length > 0 ? (
                    <>
                      <div className='border-b p-6'>
                        <ul>
                          {trolleyItems.map((item) => (
                            <li
                              key={`trolley-item-${item._id}`}
                              className='flex justify-between space-x-4 py-4'
                            >
                              <div className='flex space-x-6'>
                                <Link
                                  href={`/product/${item._id}`}
                                  onClick={onClose}
                                >
                                  <NextImage
                                    src={item.image}
                                    alt={item.name}
                                    width={72}
                                    height={72}
                                    placeholder='blur'
                                    blurDataURL={item.image}
                                  />
                                </Link>
                                <div className='max-w-xs space-y-2'>
                                  <Link
                                    href={`/product/${item._id}`}
                                    onClick={onClose}
                                  >
                                    <p className='text-sm font-medium hover:underline'>
                                      {item.name}
                                    </p>
                                  </Link>
                                  <div className='flex space-x-4'>
                                    <select
                                      name='quantity'
                                      id='quantity'
                                      value={item.quantity}
                                      onChange={(e) => {
                                        const newTrolleyItems =
                                          trolleyItems.map((elem) => {
                                            if (elem._id === item._id) {
                                              return {
                                                ...elem,
                                                quantity: +e.target.value,
                                              };
                                            }
                                            return elem;
                                          });
                                        setTrolleyItems(newTrolleyItems);
                                      }}
                                      className='rounded-md border border-gray-400 bg-gray-100 px-2 py-1 text-sm'
                                    >
                                      {Array.from(
                                        Array(MAX_PURCHASE_QUANTITY).keys()
                                      ).map((i) => (
                                        <option
                                          key={`quantity-option-${i + 1}`}
                                        >
                                          {i + 1}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() =>
                                        showModal({
                                          title:
                                            'Would you like to remove the item?',
                                          content: '',
                                          variant: 'alert',
                                          actionButton: {
                                            label: 'Yes',
                                            onClick: () =>
                                              setTrolleyItems((prev) =>
                                                prev.filter(
                                                  (elem) =>
                                                    elem._id !== item._id
                                                )
                                              ),
                                          },
                                          cancelButton: {
                                            label: 'No',
                                          },
                                        })
                                      }
                                      className='text-sm text-gray-500 underline hover:no-underline'
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <span className='text-xl font-medium'>
                                {displayPrice(item.price)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className='flex w-full justify-center pt-6'>
                        <button
                          className='flex items-center space-x-1.5 text-red-500 hover:underline'
                          onClick={() =>
                            showModal({
                              title:
                                'Would you like to remove every item from the trolley?',
                              content: '',
                              variant: 'alert',
                              actionButton: {
                                label: 'Yes',
                                onClick: () => setTrolleyItems([]),
                              },
                              cancelButton: {
                                label: 'No',
                              },
                            })
                          }
                        >
                          <TrashIcon className='h-6 w-6 stroke-2' />
                          <span className='text-sm font-medium'>
                            Remove all items
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className='flex h-96 w-full items-center justify-center'>
                      <p className='md:text-lg'>Your trolley is empty 🥲</p>
                    </div>
                  )}
                </div>
                <div>
                  <div className='flex justify-between px-6 pb-4'>
                    <div className='space-y-1'>
                      <span className='text-xl font-semibold'>Total</span>
                      <p className='text-xs text-gray-500'>
                        Excludes service and bagging fees
                      </p>
                    </div>
                    <span className='text-xl font-semibold'>
                      {displayPrice(total.price)}
                    </span>
                  </div>
                  <div className='px-6 pb-4'>
                    <button
                      className='w-full rounded-full bg-yoles py-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300'
                      disabled={trolleyItems.length === 0}
                    >
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
