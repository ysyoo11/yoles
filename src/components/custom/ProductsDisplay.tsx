import { useRouter } from 'next/router';

import ProductCardSkeleton from '@/components/skeleton/ProductCardSkeleton';

import ProductCard from './ProductCard';

import type { Product } from '@/backend/product/model';

interface Props {
  products: Product[] | undefined;
  showResultNumber?: boolean;
}

export default function ProductsDisplay({
  showResultNumber = false,
  products,
}: Props) {
  const router = useRouter();

  if (router.query.q && products && products.length === 0) {
    return (
      <p className='py-20 text-center text-lg md:text-2xl'>
        Could not find any results 😕
      </p>
    );
  }

  return (
    <>
      {/* TODO: Show total number by creating another API call */}
      {/* {showResultNumber && (
        <>
          {total ? (
            <p className='text-xs text-gray-400'>{total} results</p>
          ) : (
            <SkeletonBox height={16} width={64} />
          )}
        </>
      )} */}
      <div className='mt-10 grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
        {products && products.length > 0 ? (
          <>
            {products.map((item, idx) => (
              <ProductCard key={`product-${idx}`} product={item} />
            ))}
          </>
        ) : (
          <>
            {Array.from(Array(12).keys()).map((i) => (
              <ProductCardSkeleton key={`product-card-skeleton-${i}`} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
