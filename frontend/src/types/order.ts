export type OrderItem = {
  menuId: number;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  orderId: number;
  createdAt: string;
  totalPrice: number;
  orderItems: OrderItem[];
};
