import SkeletonBox from './SkeletonBox';

export default function ProductCardSkeleton() {
  return (
    <div className='flex h-full w-full flex-col rounded-lg p-4'>
      <div className='items-ceneter flex w-full justify-center px-6 pt-10 pb-6'>
        <SkeletonBox width={150} height={150} />
      </div>
      <SkeletonBox full className='mb-2' />
      <SkeletonBox full className='mb-6' />
      <SkeletonBox height={48} full />
    </div>
  );
}
