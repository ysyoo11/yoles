import clsx from 'clsx';

export default function StockCount({
  quantity,
  className,
}: {
  quantity: number;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        'text-sm',
        {
          'text-red-500': quantity === 0,
          'text-gray-500': quantity !== 0,
        },
        className
      )}
    >
      {quantity === 0
        ? 'Out of stock'
        : `${quantity} item${quantity > 1 ? 's' : ''} in stock`}
    </p>
  );
}
