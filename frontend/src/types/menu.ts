export type Menu = {
  id: number;
  name: string;
  description: string;
  price: number;
  stockCount?: number; // stockCount는 관리자 메뉴에서만 사용, 일반 메뉴에는 없어도 됨
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
};

export type CartItem = {
  menu: MenuItem;
  quantity: number;
};
