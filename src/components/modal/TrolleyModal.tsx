import { Dialog, Transition } from '@headlessui/react';
import {
  ChevronLeftIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import NextImage from 'next/image';
import Link from 'next/link';
import { Fragment, useCallback, useState } from 'react';

import { validatePostOrder } from '@/backend/order/validation';
import Input from '@/components/ui/Input';
import { useYolesStore } from '@/components/yoles-context';
import { useAssertiveStore } from '@/context/assertives';
import { MAX_PURCHASE_QUANTITY } from '@/defines/policy';
import placeOrder from '@/lib/place-order';
import displayPrice from '@/utils/display-price';

import type { State } from '@/backend/order/model';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type UserInfo = {
  address: string;
  suburb: string;
  state: State;
  postcode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const initialUserInfo: UserInfo = {
  address: '',
  suburb: '',
  state: 'NSW',
  postcode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export default function TrolleyModal({ isOpen, onClose }: Props) {
  const [page, setPage] = useState<'trolley' | 'address' | 'confirm'>(
    'trolley'
  );
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [loading, setLoading] = useState(false);

  const { showNoti, showAlert } = useAssertiveStore();
  const { trolleyItems, setTrolleyItems, total } = useYolesStore();

  const { showModal } = useAssertiveStore();

  const close = () => {
    onClose();
    setPage('trolley');
  };

  const initializeTrolley = useCallback(() => {
    setPage('trolley');
    setUserInfo(initialUserInfo);
    setTrolleyItems([]);
  }, [setTrolleyItems]);

  const validateUserInfo = useCallback(async () => {
    setLoading(true);
    await validatePostOrder({
      userInfo,
      items: trolleyItems,
    })
      .then(() => setPage('confirm'))
      .catch((e) => {
        console.error(e);
        showAlert(e);
      })
      .finally(() => setLoading(false));
  }, [showAlert, trolleyItems, userInfo]);

  const orderItems = useCallback(async () => {
    setLoading(true);
    await placeOrder({ userInfo, items: trolleyItems })
      .then(() => {
        onClose();
        showNoti({
          title: 'Your order has been successfully proceeded!',
        });
        initializeTrolley();
      })
      .catch((e) => {
        console.error(e);
        showAlert(e);
      })
      .finally(() => setLoading(false));
  }, [onClose, showAlert, showNoti, trolleyItems, userInfo, initializeTrolley]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[2]' onClose={close}>
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
              <Dialog.Panel className='flex h-screen w-full transform flex-col bg-white text-left align-middle shadow-xl transition-all'>
                <div className='relative flex h-full flex-col overflow-y-auto'>
                  <div className='sticky top-0 z-[1] flex h-max items-center justify-between border-b bg-white p-6'>
                    <Dialog.Title as='div' className='text-2xl font-semibold'>
                      {page === 'trolley' && (
                        <h3>Trolley - {total.quantity} items</h3>
                      )}
                      {page === 'address' && (
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => setPage('trolley')}
                            className='rounded-full p-1.5 text-black hover:bg-gray-100'
                          >
                            <ChevronLeftIcon className='h-5 w-5' />
                          </button>
                          <h3>Delivery information</h3>
                        </div>
                      )}
                      {page === 'confirm' && (
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => setPage('address')}
                            className='rounded-full p-1.5 text-black hover:bg-gray-100'
                          >
                            <ChevronLeftIcon className='h-5 w-5' />
                          </button>
                          <h3>Order confirmation</h3>
                        </div>
                      )}
                    </Dialog.Title>
                    <button
                      onClick={close}
                      className='rounded-full border border-transparent p-1.5 text-black hover:border-gray-700 hover:bg-gray-100'
                    >
                      <XMarkIcon className='h-5 w-5' />
                    </button>
                  </div>

                  {page === 'trolley' && (
                    <>
                      {trolleyItems.length > 0 ? (
                        <>
                          <div className='h-full overflow-y-auto p-6'>
                            <ul className='divide-y'>
                              {trolleyItems.map((item) => (
                                <li
                                  key={`trolley-item-${item._id}`}
                                  className='flex justify-between space-x-4 py-4'
                                >
                                  <div className='flex w-full items-center justify-between space-x-6'>
                                    <Link
                                      href={`/product/${item._id}`}
                                      onClick={close}
                                      className='w-max'
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
                                    <div className='w-full space-y-2'>
                                      <Link
                                        href={`/product/${item._id}`}
                                        onClick={close}
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
                                    {displayPrice(item.price * item.quantity)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className='flex w-full justify-center py-6'>
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
                    </>
                  )}

                  {page === 'address' && (
                    <section className='h-full w-full overflow-y-auto px-6'>
                      <div className='space-y-4 py-6'>
                        <Input
                          label='Address'
                          placeholder='ex) 3xx/1 Some Place'
                          onChange={(e) => {
                            setUserInfo((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }));
                          }}
                          value={userInfo.address}
                        />
                        <div className='flex items-center justify-between space-x-4'>
                          <Input
                            label='Suburb'
                            className='w-full'
                            placeholder='ex) Chatswood'
                            onChange={(e) => {
                              setUserInfo((prev) => ({
                                ...prev,
                                suburb: e.target.value,
                              }));
                            }}
                            value={userInfo.suburb}
                          />
                          {/* TODO: Change it to dropdown component */}
                          <Input
                            label='State'
                            className='w-full'
                            placeholder='ex) NSW'
                            onChange={(e) => {
                              setUserInfo((prev) => ({
                                ...prev,
                                state: e.target.value as State,
                              }));
                            }}
                            value={userInfo.state}
                          />
                        </div>
                        <Input
                          label='Postcode'
                          className='w-full'
                          placeholder='ex) 2111'
                          onChange={(e) => {
                            setUserInfo((prev) => ({
                              ...prev,
                              postcode: e.target.value,
                            }));
                          }}
                          value={userInfo.postcode}
                        />
                        <div className='flex items-center justify-between space-x-4'>
                          <Input
                            label='First name'
                            className='w-full'
                            placeholder='John'
                            onChange={(e) => {
                              setUserInfo((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }));
                            }}
                            value={userInfo.firstName}
                          />
                          <Input
                            label='Last name'
                            className='w-full'
                            placeholder='Doe'
                            onChange={(e) => {
                              setUserInfo((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }));
                            }}
                            value={userInfo.lastName}
                          />
                        </div>
                        <Input
                          label='Email address'
                          className='w-full'
                          type='email'
                          placeholder='internet_programming@gmail.com'
                          onChange={(e) => {
                            setUserInfo((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                          }}
                          value={userInfo.email}
                        />
                        <Input
                          label='Phone number'
                          className='w-full'
                          type='tel'
                          placeholder='049x-123-456'
                          onChange={(e) => {
                            setUserInfo((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }));
                          }}
                          value={userInfo.phone}
                        />
                      </div>
                    </section>
                  )}

                  {page === 'confirm' && (
                    <section className='h-full w-full space-y-8 overflow-y-auto p-6'>
                      <div className='space-y-4'>
                        <h6 className='text-2xl font-semibold'>
                          Delivery Information
                        </h6>
                        <div className='space-y-2'>
                          <div>
                            <p className='text-lg font-medium'>Deliver to:</p>
                            <p>{userInfo.address}</p>
                            <p>
                              {userInfo.suburb}, {userInfo.state}
                            </p>
                            <p>{userInfo.postcode}</p>
                            <p>
                              {userInfo.firstName} {userInfo.lastName}
                            </p>
                          </div>
                          <div>
                            <p className='text-lg font-medium'>Contact info:</p>
                            <p>{userInfo.email}</p>
                            <p>{userInfo.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className='space-y-4'>
                        <h6 className='text-2xl font-semibold'>
                          Order Details
                        </h6>
                        <ul className='border-y'>
                          {trolleyItems.map((item, idx) => (
                            <li
                              key={`order-confirm-${idx}`}
                              className='flex items-center justify-between p-4'
                            >
                              <div className='flex items-center space-x-2'>
                                <NextImage
                                  src={item.image}
                                  alt={item.name}
                                  width={72}
                                  height={72}
                                  placeholder='blur'
                                  blurDataURL={item.image}
                                />
                                <div>
                                  <p className='font-medium line-clamp-2'>
                                    {item.name}
                                  </p>
                                  <span className='text-sm text-gray-600'>
                                    Quantity: {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className='w-max pl-4 text-xl font-medium'>
                                {displayPrice(item.price * item.quantity)}
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className='flex justify-between px-4 py-4'>
                          <div className='space-y-1'>
                            <span className='text-xl font-semibold'>Total</span>
                            <p className='text-xs text-gray-500'>
                              Excludes service and bagging fees
                            </p>
                          </div>
                          <span className='text-2xl font-bold'>
                            {displayPrice(total.price)}
                          </span>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
                <div>
                  {page === 'trolley' && (
                    <>
                      <div className='flex justify-between px-6 py-4'>
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
                          onClick={() => setPage('address')}
                        >
                          Checkout
                        </button>
                      </div>
                    </>
                  )}
                  {page === 'address' && (
                    <div className='px-6 py-4'>
                      <button
                        className='w-full rounded-full bg-yoles py-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300'
                        disabled={
                          Object.values(userInfo).includes('') || loading
                        }
                        onClick={validateUserInfo}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                  {page === 'confirm' && (
                    <div className='px-6 py-4'>
                      <button
                        className='w-full rounded-full bg-yoles py-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300'
                        onClick={orderItems}
                      >
                        Place order
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
