import { ShoppingCartIcon } from '@heroicons/react/24/outline';

import { useYolesStore } from '@/components/yoles-context';
import displayPrice from '@/utils/display-price';

interface Props {
  onClick: () => void;
}

export default function ShoppingCartButton({ onClick }: Props) {
  const { total } = useYolesStore();

  return (
    <button
      className='relative flex w-max flex-col items-center justify-center p-2 text-gray-700 hover:bg-gray-100'
      onClick={onClick}
    >
      <ShoppingCartIcon className='h-6 w-6' />
      <p className='w-full text-xs'>{displayPrice(total.price)}</p>
      <div className='absolute right-2 top-0 h-5 w-5 rounded-full bg-yoles text-white'>
        <span className='absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 text-xs'>
          {total.quantity}
        </span>
      </div>
    </button>
  );
}
