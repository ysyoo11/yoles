export type ProductInfo = {
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
