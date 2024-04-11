import React from 'react';
import { OrderItem } from '../types/OrderItems';

type Props = {
  items: OrderItem[];
};

export const OrderitemList: React.FC<Props> = ({ items }) => {
  if (items.length === 0) {
    return <p>No any items</p>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{`${item.code} - ${item.quantity}`}</li>
      ))}
    </ul>
  );
};
