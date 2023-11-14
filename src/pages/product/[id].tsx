import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { Product } from '@/backend/product/model';
import AddTrolleyButton from '@/components/custom/AddTrolleyButton';
import StockCount from '@/components/custom/StockCount';
import { useAssertiveStore } from '@/context/assertives';
import { getProduct } from '@/lib/get-product';
import displayPrice from '@/utils/display-price';

export default function ProductDetailPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const router = useRouter();

  const { showAlert } = useAssertiveStore();

  const getProductInfo = useCallback(async () => {
    setLoading(true);
    if (router.query.id) {
      await getProduct({ id: router.query.id as string })
        .then((data) => setProduct(data))
        .catch(showAlert)
        .finally(() => setLoading(false));
    }
  }, [router.query.id, showAlert]);

  useEffect(() => {
    if (product) return;
    getProductInfo();
  }, [getProductInfo, product]);

  return (
    <section className='relative mx-auto w-full max-w-7xl px-4 py-6'>
      <button
        className='flex items-center space-x-2 text-yoles underline hover:no-underline'
        onClick={() => router.back()}
      >
        <ChevronLeftIcon className='h-4 w-4 stroke-yoles stroke-2' />
        <span className='text-sm'>Back</span>
      </button>
      {loading && !product && <p>Loading...</p>}
      {product && (
        <div className='flex flex-col md:flex-row'>
          <div className='md:w-1/2'>
            <div className='flex items-center justify-center'>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
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
            <StockCount
              quantity={product.quantity}
              className='mt-2 md:mt-4 md:text-base'
            />
            <AddTrolleyButton product={product} isProductDetailPage />
            <div className='mt-6 md:hidden'>
              <h6 className='text-2xl font-medium'>Product details</h6>
              <p className='mt-4 text-gray-700'>{product.details}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
