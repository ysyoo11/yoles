import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Product } from '@/backend/product/model';
import { useYolesStore } from '@/components/yoles-context';
import { useAssertiveStore } from '@/context/assertives';
import { MAX_PURCHASE_QUANTITY } from '@/defines/policy';

interface Props {
  product: Product;
  isProductDetailPage?: boolean;
}

const DEFAULT_QUANTITY = 1;

export default function AddTrolleyButton({
  product,
  isProductDetailPage = false,
}: Props) {
  const [quantitySelectMode, setQuantitySelectMode] = useState(false);
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY);

  const { trolleyItems, setTrolleyItems } = useYolesStore();

  const { showNoti } = useAssertiveStore();

  const availableQty = useMemo(() => {
    if (product.quantity > MAX_PURCHASE_QUANTITY) {
      return MAX_PURCHASE_QUANTITY;
    }
    return product.quantity;
  }, [product.quantity]);

  const addToCart = useCallback(() => {
    if (trolleyItems.find((item) => item._id === product._id)) {
      const currentItemQty = trolleyItems.filter(
        (item) => item._id === product._id
      )[0].quantity;
      if (currentItemQty + quantity > availableQty) {
        showNoti({
          title: `You cannot purchase more than ${availableQty}.`,
          variant: 'alert',
        });
        setQuantity(DEFAULT_QUANTITY);
        return;
      }
      setTrolleyItems((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: +item.quantity + +quantity,
                inStock: availableQty,
              }
            : item
        )
      );
      setQuantity(DEFAULT_QUANTITY);
      return;
    }
    setTrolleyItems((prev) => [
      ...prev,
      { ...product, quantity, inStock: availableQty },
    ]);
    setQuantity(DEFAULT_QUANTITY);
  }, [
    trolleyItems,
    setTrolleyItems,
    product,
    quantity,
    availableQty,
    showNoti,
  ]);

  useEffect(() => {
    if (quantity === 0) {
      const quantitySelectModeTimeout = setTimeout(() => {
        setQuantitySelectMode(false);
        setQuantity(DEFAULT_QUANTITY);
      }, 2000);
      return () => clearTimeout(quantitySelectModeTimeout);
    }
  }, [quantity]);

  return (
    <div className='relative my-6 h-24 sm:h-[44px]'>
      {quantitySelectMode ? (
        <div className='relative flex flex-col items-center justify-between space-x-0 space-y-1 sm:flex-row sm:space-x-2 sm:space-y-0 md:max-w-xs'>
          <div
            onClick={(e) => e.stopPropagation()}
            className='flex w-full cursor-default items-center justify-between rounded-full border bg-white p-1.5 md:max-w-xs'
          >
            <button
              className='rounded-full bg-black p-1 disabled:cursor-not-allowed disabled:bg-gray-200'
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((prev) => prev - 1);
              }}
              disabled={quantity <= 0}
            >
              <MinusIcon className='h-4 w-4 stroke-white stroke-2' />
            </button>
            <input
              type='number'
              className='w-max rounded-md bg-gray-100 py-1 px-2 font-medium'
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.target.valueAsNumber > availableQty
                  ? setQuantity(availableQty)
                  : setQuantity(e.target.valueAsNumber);
                e.target.value === '' && setQuantity(0);
              }}
              value={Number(quantity).toString()}
              max={availableQty}
              min={0}
            />
            <button
              className='rounded-full bg-black p-1 disabled:cursor-not-allowed disabled:bg-gray-200'
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((prev) => prev + 1);
              }}
              disabled={quantity === availableQty}
            >
              <PlusIcon className='h-4 w-4 stroke-white stroke-2' />
            </button>
          </div>
          <button
            className='w-full rounded-lg bg-yoles py-2 px-4 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto'
            disabled={quantity < 1}
            onClick={(e) => {
              e.stopPropagation();
              addToCart();
              setQuantitySelectMode(false);
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuantitySelectMode(true);
          }}
          className='flex w-full items-center justify-center space-x-2 rounded-full bg-yoles py-3 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 md:max-w-xs'
          disabled={product.quantity === 0}
        >
          <ShoppingCartIcon className='h-5 w-5 stroke-2' />
          <span className='font-medium'>
            {isProductDetailPage ? 'Add to trolley' : 'Add'}
          </span>
        </button>
      )}
    </div>
  );
}
