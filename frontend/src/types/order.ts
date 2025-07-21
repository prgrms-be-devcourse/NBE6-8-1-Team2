export type OrderItem = {
  menuId: number;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  orderId: number;
  userId: number;
  email: string;
  createdAt: string;
  totalPrice: number;
  orderItems: OrderItem[];
};
