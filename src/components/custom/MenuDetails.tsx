import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import NextImage from 'next/image';
import Link from 'next/link';

interface Props {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  list: {
    title: string;
    href: string;
  }[];
}

export default function MenuDetails({ title, image, list }: Props) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm font-medium hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'>
            <div className='flex items-center space-x-4'>
              <NextImage
                src={image.src}
                alt={image.alt}
                width={36}
                height={36}
              />
              <span>{title}</span>
            </div>
            <ChevronDownIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 duration-100`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className='py-2 text-sm text-gray-700'>
            <ul>
              {list.map((item, idx) => (
                <li key={`item-${idx}-${item.title}`}>
                  <Link href={`${item.href}`}>
                    <div className='h-full w-full rounded-lg py-4 pl-16 hover:bg-gray-100 hover:underline'>
                      {item.title}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
