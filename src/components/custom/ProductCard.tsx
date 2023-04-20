import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Props {
  name: string;
  price: number;
  imageUrl: string;
  id: string;
}

export default function ProductCard({ name, price, imageUrl, id }: Props) {
  const router = useRouter();

  return (
    <div
      className='flex h-full w-full cursor-pointer flex-col rounded-lg border border-transparent p-4 hover:border-gray-200 hover:shadow-lg'
      onClick={() => router.push(`/product/${id}`)}
    >
      <div className='items-ceneter flex w-full justify-center px-6 py-10'>
        <Image
          src={imageUrl}
          height={200}
          width={200}
          alt='meat photo'
          className='overflow-hidden'
          priority
        />
      </div>
      <p className='mb-4 h-full max-h-[60px] w-full font-medium line-clamp-2'>
        {name}
      </p>
      {/* TODO: make a util for displaying price */}
      <span className='text-xl font-semibold'>$ {price}</span>
      {/* TODO: Add to cart */}
      <button className='mt-6 flex items-center justify-center space-x-2 rounded-full border py-2 hover:bg-yoles hover:text-white'>
        <ShoppingCartIcon className='h-5 w-5 stroke-2' />
        <span className='font-semibold'>Add</span>
      </button>
    </div>
  );
}