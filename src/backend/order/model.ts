import { Product } from '@/backend/product/model';

export const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS'] as const;

type State = (typeof states)[number];

export interface Order {
  _id: OurId;
  userInfo: {
    address: string;
    suburb: string;
    state: State;
    postcode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: Product[];
  createdAt: Date;
}

export type PostOrder = Omit<Order, '_id' | 'createdAt'>;

export type PostOrderResponse = Pick<Order, '_id'>;
