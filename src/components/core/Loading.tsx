import clsx from 'clsx';

interface Props {
  className?: string;
  absolute?: boolean;
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='12'
        cy='12'
        r='10'
        stroke='white'
        strokeOpacity='0.25'
        strokeWidth='4'
      />
      <path
        d='M12 2C6.47715 2 2 6.47715 2 12C2 14.5361 2.94409 16.8517 4.5 18.6146'
        stroke='currentColor'
        strokeOpacity='0.75'
        strokeWidth='4'
      />
    </svg>
  );
}

export default function Loading({ className, absolute }: Props) {
  return (
    <div
      className={clsx('flex justify-center py-40', className, {
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2': absolute,
      })}
    >
      <div className='h-8 w-8 animate-spin'>
        <Spinner />
      </div>
    </div>
  );
}
