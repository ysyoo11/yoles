import {
  ChevronLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { Product } from '@/backend/product/model';
import { useYolesStore } from '@/components/yoles-context';
import { MAX_PURCHASE_QUANTITY } from '@/defines/policy';
import { getProduct } from '@/lib/get-product';
import displayPrice from '@/utils/display-price';

export default function ProductDetailPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantitySelectMode, setQuantitySelectMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();
  const { trolleyItems, setTrolleyItems } = useYolesStore();

  const getProductInfo = useCallback(async () => {
    setLoading(true);
    if (router.query.id) {
      await getProduct({ id: router.query.id as string })
        .then((data) => setProduct(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [router.query.id]);

  const addToCart = useCallback(() => {
    if (!product) return;
    if (trolleyItems.find((item) => item._id === product._id)) {
      const currentItemQty = trolleyItems.filter(
        (item) => item._id === product._id
      )[0].quantity;
      if (currentItemQty + quantity > MAX_PURCHASE_QUANTITY) {
        alert(`You cannot purchase more than ${MAX_PURCHASE_QUANTITY}.`);
        setQuantity(1);
        return;
      }
      const newTrolleyItems = trolleyItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setTrolleyItems(newTrolleyItems);
      setQuantity(1);
      return;
    }
    setQuantity(1);
    setTrolleyItems((prev) => [...prev, { ...product, quantity }]);
  }, [trolleyItems, setTrolleyItems, product, quantity]);

  useEffect(() => {
    getProductInfo();
  }, [getProductInfo]);

  useEffect(() => {
    if (quantity === 0) {
      const quantitySelectModeTimeout = setTimeout(() => {
        setQuantitySelectMode(false);
      }, 2000);
      return () => clearTimeout(quantitySelectModeTimeout);
    }
  }, [quantity]);

  return (
    <section className='relative mx-auto h-[2000px] w-full max-w-7xl px-4 py-6'>
      <button
        className='flex items-center space-x-2 text-yoles underline hover:no-underline'
        onClick={() => router.back()}
      >
        <ChevronLeftIcon className='h-4 w-4 stroke-yoles stroke-2' />
        <span className='text-sm'>Back</span>
      </button>
      {loading && <p>Loading...</p>}
      {product && (
        <div className='flex flex-col md:flex-row'>
          <div className='md:w-1/2'>
            <div className='flex items-center justify-center'>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                placeholder='blur'
                blurDataURL={product.image}
              />
            </div>
            <div className='hidden md:block'>
              <h6 className='text-2xl font-medium'>Product details</h6>
              <p className='mt-4 text-gray-700'>{product.details}</p>
            </div>
          </div>
          <div className='md:w-1/2'>
            <h5 className='text-2xl font-medium'>{product.name}</h5>
            <span className='mt-6 block text-3xl font-semibold'>
              {displayPrice(product.price)}
            </span>
            {product.quantity === 0 && (
              <p className='text-yoles'>Out of stock</p>
            )}
            {quantitySelectMode ? (
              <div className='flex items-center justify-between space-x-2 md:max-w-xs'>
                <div className='my-6 flex w-full items-center justify-between rounded-full border bg-white p-1.5 md:max-w-xs'>
                  <button
                    className='rounded-full bg-black p-1 disabled:cursor-not-allowed disabled:bg-gray-200'
                    onClick={() => setQuantity((prev) => prev - 1)}
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
                    onClick={() => setQuantity((prev) => prev + 1)}
                    disabled={quantity === MAX_PURCHASE_QUANTITY}
                  >
                    <PlusIcon className='h-4 w-4 stroke-white stroke-2' />
                  </button>
                </div>
                <button
                  className='h-full rounded-lg bg-yoles py-2 px-4 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300'
                  disabled={quantity < 1}
                  onClick={() => {
                    addToCart();
                    setQuantitySelectMode(false);
                  }}
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setQuantitySelectMode(true)}
                className='my-6 flex w-full items-center justify-center space-x-2 rounded-full bg-yoles py-3 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 md:max-w-xs'
                disabled={product.quantity === 0}
              >
                <ShoppingCartIcon className='h-5 w-5 stroke-2' />
                <span className='font-medium'>Add to trolley</span>
              </button>
            )}
            <div className='md:hidden'>
              <h6 className='text-2xl font-medium'>Product details</h6>
              <p className='mt-4 text-gray-700'>{product.details}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
