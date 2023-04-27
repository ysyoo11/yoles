import { z } from 'zod';

import {
  bakerySubCategories,
  dairyEggsFridgeSubCategories,
  drinksSubCategories,
  frozenSubCategories,
  fruitVegetablesSubCategories,
  meatSeafoodSubCategories,
} from '@/defines/category';
import { menu } from '@/defines/menu';
import { Params } from 'types';

import type { PostProduct } from './model';

export const mainCategories = [...menu.map((item) => item.category)] as const;
export const subCategories = [
  ...menu.map((item) => item.subCategory.map((i) => i.name)).flat(),
] as const;

export const sortSubCategory = (main: (typeof mainCategories)[number]) => {
  switch (main) {
    case 'bakery':
      return bakerySubCategories;
    case 'dairy-eggs-fridge':
      return dairyEggsFridgeSubCategories;
    case 'drinks':
      return drinksSubCategories;
    case 'frozen':
      return frozenSubCategories;
    case 'fruit-vegetables':
      return fruitVegetablesSubCategories;
    case 'meat-seafood':
      return meatSeafoodSubCategories;
  }
};

export async function validatePostContact(
  params: Params
): Promise<PostProduct> {
  const schema = z.object({
    category: z.object({
      main: z.enum([mainCategories[0], ...mainCategories.slice(1)]),
      sub: z.enum(sortSubCategory(params.category['main'])),
    }),
    price: z.number().max(100),
    name: z.string().min(1).max(100),
    details: z.string().min(1).max(800),
    quantity: z.number().max(200),
    image: z.string().max(200),
  });
  return (await schema.parseAsync(params)) as PostProduct;
}
