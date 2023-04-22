import {
  bakerySubCategories,
  dairyEggsFridgeSubCategories,
  drinksSubCategories,
  frozenSubCategories,
  fruitVegetablesSubCategories,
  meatSeafoodSubCategories,
} from '@/defines/category';

export type ProductCategory =
  | {
      main: 'meat-seafood';
      sub: (typeof meatSeafoodSubCategories)[number];
    }
  | {
      main: 'fruit-vegetables';
      sub: (typeof fruitVegetablesSubCategories)[number];
    }
  | {
      main: 'dairy-eggs-fridge';
      sub: (typeof dairyEggsFridgeSubCategories)[number];
    }
  | {
      main: 'bakery';
      sub: (typeof bakerySubCategories)[number];
    }
  | {
      main: 'drinks';
      sub: (typeof drinksSubCategories)[number];
    }
  | {
      main: 'frozen';
      sub: (typeof frozenSubCategories)[number];
    };

export interface Product {
  _id: OurId;
  category: ProductCategory;
  name: string;
  price: number;
  details: string;
  quantity: number;
  image: string;
}
