import clsx from 'clsx';

interface Props {
  className?: string;
}

export default function Logo({ className }: Props) {
  return (
    <span
      className={clsx(
        'text-3xl font-semibold text-yoles md:text-4xl',
        className
      )}
    >
      yoles
    </span>
  );
}
