export type ProductCategoryInfo = {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  list: {
    title: string;
    href: string;
  }[];
};
