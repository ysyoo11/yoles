import { ObjectId } from 'mongodb';

declare global {
  type OurId = ObjectId | string;
}

export {};
