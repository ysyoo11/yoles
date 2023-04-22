import { ChevronLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { Product } from '@/backend/product/model';
import { getProduct } from '@/lib/get-product';

export default function ProductDetailPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const router = useRouter();

  const getProductInfo = useCallback(async () => {
    setLoading(true);
    await getProduct({ id: router.query.id as string })
      .then((data) => setProduct(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router.query.id]);

  // TODO:
  const addToCard = useCallback(() => {}, []);

  useEffect(() => {
    getProductInfo();
  }, [getProductInfo]);

  return (
    <section className='relative mx-auto h-[2000px] w-full max-w-7xl px-4 py-6'>
      <button className='flex items-center space-x-2 text-yoles underline hover:no-underline'>
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
                priority
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
              ${product.price}
            </span>
            {product.quantity === 0 && (
              <p className='text-yoles'>Out of stock</p>
            )}
            <button
              onClick={addToCard}
              className='my-6 flex w-full cursor-not-allowed items-center justify-center space-x-2 rounded-full bg-yoles py-3 text-sm text-white hover:bg-red-700 disabled:bg-gray-300 md:max-w-xs'
              disabled={product.quantity === 0}
            >
              <ShoppingCartIcon className='h-5 w-5 stroke-2' />
              <span className='font-medium'>Add to trolley</span>
            </button>
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
