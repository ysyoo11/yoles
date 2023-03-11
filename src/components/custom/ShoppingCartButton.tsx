import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface Props {
  className?: string;
  onClick: () => void;
}

// TODO: Apply real data after connecting to server
export default function ShoppingCartButton({ className, onClick }: Props) {
  return (
    <button
      className={clsx(
        'relative flex flex-col items-center p-2 text-gray-700',
        className
      )}
      onClick={onClick}
    >
      <ShoppingCartIcon className='h-6 w-6' />
      <span className='text-xs'>$119.00</span>
      <div className='absolute right-2 top-0 h-5 w-5 rounded-full bg-yoles text-white'>
        <span className='absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 text-xs'>
          11
        </span>
      </div>
    </button>
  );
}
