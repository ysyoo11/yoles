import { PostOrder } from '@/backend/order/model';

import displayPrice from './display-price';

interface Props {
  order: PostOrder;
  id: OurId;
  createdAt: Date;
}

export default function makeEmailTemplate({ order, id, createdAt }: Props) {
  const { userInfo, items } = order;

  return `
  <section style={${main}}>
    <div style={${container}}>
      <h3>Hi ${userInfo.firstName}!</h3>
      <p>Thank you for shopping at Yoles.</p>
      <p>Here's your order detail.</p>

      <strong><p>Order No. ${id}</p></strong>
      <p>${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}</p>
      <strong><h3>Delivery Address</h3></strong>
      <p>
        ${userInfo.address}<br />
        ${userInfo.suburb}, ${userInfo.state}<br />
        ${userInfo.postcode}<br />
        ${userInfo.firstName} ${userInfo.lastName}<br />
        ${userInfo.phone}
      </p>
      <strong><h3>Order Details</h3></strong>
      <table>
        <thead>
          <tr>
            <th scope='col' />
            <th scope='col'>Item</th>
            <th scope='col'>Quantity</th>
            <th scope='col'>Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(
            (item, idx) =>
              `<tr key='ordered-item-${idx}'>
              <td>
                <img
                  src='${item.image}'
                  width='40'
                  height='40'
                  alt='${item.name}'
                />
              </td>
              <td>
                <p>${item.name}</p>
                <p>${displayPrice(item.price)}</p>
              </td>
              <td>
                ${item.quantity}
              </td>
              <td>
                ${displayPrice(item.price * item.quantity)}
              </td>
            </tr>`
          )}
        </tbody>
      </table>
      <strong>
        <h4>Total: ${displayPrice(
          items
            .map((item) => item.price * item.quantity)
            .reduce((partialSum, a) => partialSum + a, 0)
        )}</h4>
      </strong>
    </div>
  </section>
  `;
}

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};
