import { z } from 'zod';

import { mainCategories, subCategories } from '@/backend/product/validation';
import { Params } from 'types';

import { states, type PostOrder } from './model';

export async function validatePostOrder(params: Params): Promise<PostOrder> {
  const schema = z.object({
    userInfo: z.object({
      address: z.string().min(1).max(50),
      suburb: z.string().min(1).max(20),
      state: z.enum(states),
      postcode: z.string().max(4),
      firstName: z.string().min(1).max(30),
      lastName: z.string().min(1).max(30),
      email: z
        .string()
        .min(1, { message: 'This field has to filled.' })
        .email('This is not a valid email.'),
      phone: z
        .string()
        .min(9, { message: 'Must be a valid phone number' })
        .max(14, { message: 'Must be a valid phone number' }),
    }),
    items: z
      .object({
        category: z.object({
          main: z.enum([mainCategories[0], ...mainCategories.slice(1)]),
          sub: z.enum([subCategories[0], ...subCategories.slice(1)]),
        }),
        price: z.number(),
        name: z.string().min(1).max(100),
        details: z.string().min(1).max(800),
        quantity: z.number().max(200),
        image: z.string().max(200),
      })
      .array(),
  });

  return (await schema.parseAsync(params)) as PostOrder;
}
