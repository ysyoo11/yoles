import NextImage from 'next/image';
import { useRouter } from 'next/router';

import { Product } from '@/backend/product/model';
import displayPrice from '@/utils/display-price';

import AddTrolleyButton from './AddTrolleyButton';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { _id, image, name, price } = product;
  const router = useRouter();

  return (
    <div
      className='flex h-full w-full cursor-pointer flex-col rounded-lg border border-transparent p-4 hover:border-gray-200 hover:shadow-lg'
      onClick={() => router.push(`/product/${_id}`)}
    >
      <div className='items-ceneter flex w-full justify-center px-6 py-10'>
        <NextImage
          src={image}
          height={200}
          width={200}
          alt='meat photo'
          className='overflow-hidden'
          placeholder='blur'
          blurDataURL={image}
        />
      </div>
      <p className='mb-4 h-full max-h-[60px] w-full font-medium line-clamp-2'>
        {name}
      </p>
      <span className='text-xl font-semibold'>{displayPrice(price)}</span>
      <AddTrolleyButton product={product} />
    </div>
  );
}
