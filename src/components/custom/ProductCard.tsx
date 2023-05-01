import NextImage from 'next/image';
import { useRouter } from 'next/router';

import { Product } from '@/backend/product/model';
import displayPrice from '@/utils/display-price';

import AddTrolleyButton from './AddTrolleyButton';
import StockCount from './StockCount';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { _id, image, name, price, quantity } = product;
  const router = useRouter();

  return (
    <div
      className='relative flex h-full w-full cursor-pointer flex-col rounded-lg border border-transparent p-4 hover:border-gray-200 hover:shadow-lg'
      onClick={() => router.push(`/product/${_id}`)}
    >
      <div className='items-ceneter flex w-full justify-center px-2 py-4 md:px-6 md:py-10'>
        <NextImage
          src={image}
          height={200}
          width={200}
          alt={name}
          placeholder='blur'
          blurDataURL={image}
        />
      </div>
      <p className='mb-4 max-h-[60px] w-full font-medium line-clamp-2 sm:h-full'>
        {name}
      </p>
      <span className='text-xl font-semibold'>{displayPrice(price)}</span>
      <StockCount quantity={quantity} />
      <AddTrolleyButton product={product} />
    </div>
  );
}
