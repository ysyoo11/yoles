import Image from 'next/image';
import Link from 'next/link';

import menu from 'public/menu.json';

export default function ProductsPage() {
  return (
    <section className='mx-auto w-full max-w-7xl px-4 py-10 lg:flex lg:px-0 lg:pt-0'>
      <div className='lg:min-h-screen lg:w-80 lg:border-r lg:px-6 lg:pt-14'>
        <h2 className='text-2xl font-semibold lg:text-4xl'>Shop all</h2>
      </div>
      <div className='grid h-max w-full grid-cols-2 gap-4 py-6 lg:py-10 lg:px-6 xl:grid-cols-3'>
        {menu.map((item, idx) => (
          <Link
            href={`/products/${item.image.alt}`}
            key={`item-${item.title}-${idx}`}
            className='flex transform items-center justify-between rounded-md border px-6 py-2 transition hover:-translate-y-1 hover:shadow-md'
          >
            <span className='text-sm font-semibold'>{item.title}</span>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              height={36}
              width={36}
              placeholder='blur'
              blurDataURL={item.image.src}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
