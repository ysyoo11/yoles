import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';

import { Product } from '@/backend/product/model';
import { useYolesStore } from '@/components/yoles-context';
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

  const addToCart = useCallback(() => {
    if (trolleyItems.find((item) => item._id === product._id)) {
      const currentItemQty = trolleyItems.filter(
        (item) => item._id === product._id
      )[0].quantity;
      if (currentItemQty + quantity > MAX_PURCHASE_QUANTITY) {
        alert(`You cannot purchase more than ${MAX_PURCHASE_QUANTITY}.`);
        setQuantity(DEFAULT_QUANTITY);
        return;
      }
      setTrolleyItems((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      setQuantity(DEFAULT_QUANTITY);
      return;
    }
    setTrolleyItems((prev) => [...prev, { ...product, quantity }]);
    setQuantity(DEFAULT_QUANTITY);
  }, [trolleyItems, setTrolleyItems, product, quantity]);

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
    <>
      {quantitySelectMode ? (
        <div className='flex items-center justify-between space-x-2 md:max-w-xs'>
          <div className='my-6 flex w-full items-center justify-between rounded-full border bg-white p-1.5 md:max-w-xs'>
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
              onChange={(e) => {
                e.target.valueAsNumber > 20
                  ? setQuantity(20)
                  : setQuantity(e.target.valueAsNumber);
                e.target.value === '' && setQuantity(0);
              }}
              value={quantity}
              max={MAX_PURCHASE_QUANTITY}
              min={0}
            />
            <button
              className='rounded-full bg-black p-1 disabled:cursor-not-allowed disabled:bg-gray-200'
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((prev) => prev + 1);
              }}
              disabled={quantity === MAX_PURCHASE_QUANTITY}
            >
              <PlusIcon className='h-4 w-4 stroke-white stroke-2' />
            </button>
          </div>
          <button
            className='rounded-lg bg-yoles py-2 px-4 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300'
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
          className='my-6 flex w-full items-center justify-center space-x-2 rounded-full bg-yoles py-3 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 md:max-w-xs'
          disabled={product.quantity === 0}
        >
          <ShoppingCartIcon className='h-5 w-5 stroke-2' />
          <span className='font-medium'>
            {isProductDetailPage ? 'Add to trolley' : 'Add'}
          </span>
        </button>
      )}
    </>
  );
}
