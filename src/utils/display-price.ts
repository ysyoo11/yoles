export default function displayPrice(price: number) {
  const formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });
  return formatter.format(price);
}
