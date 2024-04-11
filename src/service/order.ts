import { OrderItem } from '../types/OrderItems';

export function getMaxId(items: OrderItem[]) {
  return Math.max(0, ...items.map(item => item.id));
}
