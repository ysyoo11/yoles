import clsx from 'clsx';
import Link from 'next/link';

interface Props {
  className?: string;
}

export default function Logo({ className }: Props) {
  return (
    <Link href='/'>
      <span
        className={clsx(
          'text-3xl font-semibold text-yoles md:text-4xl',
          className
        )}
      >
        yoles
      </span>
    </Link>
  );
}
