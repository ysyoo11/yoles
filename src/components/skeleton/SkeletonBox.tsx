import clsx from 'clsx';

interface Props {
  className?: string;
  width?: number;
  height?: number;
  full?: boolean;
}

export default function SkeletonBox({
  className,
  full,
  width = 120,
  height = 24,
}: Props) {
  return (
    <div
      className={clsx(
        'shrink-0 animate-pulse rounded-md bg-gray-200',
        {
          '!w-full': full,
        },
        className
      )}
      style={{ width, height }}
    />
  );
}
