import ProductCardSkeleton from '@/components/skeleton/ProductCardSkeleton';
import SkeletonBox from '@/components/skeleton/SkeletonBox';

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
  return (
    <>
      {showResultNumber && (
        <>
          {products ? (
            <p className='text-xs text-gray-400'>{products.length} results</p>
          ) : (
            <SkeletonBox height={16} width={64} />
          )}
        </>
      )}
      <div className='mt-10 grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
        {products ? (
          <>
            {products.map((item, idx) => (
              <ProductCard key={`product-${idx}`} product={item} />
            ))}
          </>
        ) : (
          <>
            {Array.from(Array(10).keys()).map((i) => (
              <ProductCardSkeleton key={`product-card-skeleton-${i}`} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
