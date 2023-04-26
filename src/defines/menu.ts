export const menu = [
  {
    title: 'Meat & Seafood',
    imageSrc: '/image/category/meat-seafood.png',
    category: 'meat-seafood',
    subCategory: [
      {
        title: 'Beef & Veal',
        name: 'beef-veal',
      },
      {
        title: 'Lamb',
        name: 'lamb',
      },
      {
        title: 'Pork',
        name: 'pork',
      },
      {
        title: 'Poultry',
        name: 'poultry',
      },
      {
        title: 'Seafood',
        name: 'seafood',
      },
    ],
  },
  {
    title: 'Fruit & Vegetables',
    image: '/image/category/fruit-vegetables.png',
    category: 'fruit-vegetables',
    subCategory: [
      {
        title: 'Fruit',
        name: 'fruit',
      },
      {
        title: 'Nuts & Dried Fruit',
        name: 'nuts-dried-fruit',
      },
      {
        title: 'Salad & Herbs',
        name: 'salad-herbs',
      },
      {
        title: 'Vegetables',
        name: 'vegetables',
      },
    ],
  },
  {
    title: 'Dairy, Eggs & Fridge',
    imageSrc: '/image/category/dairy-eggs-fridge.png',
    category: 'dairy-eggs-fridge',
    subCategory: [
      {
        title: 'Cheese',
        name: 'cheese',
      },
      {
        title: 'Dairy',
        name: 'dairy',
      },
      {
        title: 'Eggs',
        name: 'eggs',
      },
      {
        title: 'Milk',
        name: 'milk',
      },
      {
        title: 'Vegetarian & Vegan',
        name: 'vegetarian-vegan',
      },
    ],
  },
  {
    title: 'Bakery',
    imageSrc: '/image/category/bakery.png',
    category: 'bakery',
    subCategory: [
      {
        title: 'Cakes & Desserts',
        name: 'cakes-desserts',
      },
      {
        title: 'Hot Cross Buns',
        name: 'hot-cross-buns',
      },
      {
        title: 'Packaged Breads',
        name: 'packaged-breads',
      },
      {
        title: 'Gluten Free Range',
        name: 'gluten-free-range',
      },
      {
        title: 'Vegan Range',
        name: 'vegan-range',
      },
    ],
  },
  {
    title: 'Drinks',
    imageSrc: '/image/category/drinks.png',
    category: 'drinks',
    subCategory: [
      {
        title: 'Coffee Drinks',
        name: 'coffee-drinks',
      },
      {
        title: 'Cold Drinks',
        name: 'cold-drinks',
      },
      {
        title: 'Engergy Drinks',
        name: 'energy-drinks',
      },
      {
        title: 'Juice',
        name: 'juice',
      },
      {
        title: 'Water',
        name: 'water',
      },
    ],
  },
  {
    title: 'Frozen',
    imageSrc: '/image/category/frozen.png',
    category: 'frozen',
    subCategory: [
      {
        title: 'Frozen Fruit',
        name: 'frozen-fruit',
      },
      {
        title: 'Frozen Meals',
        name: 'frozen-meals',
      },
    ],
  },
] as const;
