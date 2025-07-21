export type Menu = {
  id: number;
  name: string;
  description: string;
  price: number;
  stockCount?: number; // stockCount는 관리자 메뉴에서만 사용, 일반 메뉴에는 없어도 됨
  imageUrl?: string; // 이미지 URL
  imageName?: string; // 이미지 이름
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  imageName: string;
};

export type CartItem = {
  menu: MenuItem;
  quantity: number;
};
