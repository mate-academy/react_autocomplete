import React, { useState } from 'react';
import { OrderitemList } from './OrderItemList';
import { getMaxId } from '../service/order';
import { OrderItem } from '../types/OrderItems';

type Props = {
  name: string;
};

export const ShoppingCart: React.FC<Props> = ({ name }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(+event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (quantity <= 0 || !code) {
      return;
    }

    setOrderItems(currentItems => {
      const id = 1 + getMaxId(currentItems);
      const newItem = { id, code, quantity };

      return [...currentItems, newItem];
    });
    setCode('');
    setQuantity(0);
  };

  return (
    <div className="box mt-5">
      <h2 className="title is-5 mb-2">{name}</h2>
      <form className="mb-4" noValidate onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={handleCodeChange}
        />
        <input
          type="number"
          min="1"
          max="9"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <button type="submit">Add</button>
      </form>
      <OrderitemList items={orderItems} />
    </div>
  );
};
