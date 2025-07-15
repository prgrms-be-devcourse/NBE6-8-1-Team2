import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-60 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">관리자 메뉴</h2>
        <nav className="flex flex-col gap-2">
          <a href="/admin/orders" className="hover:underline">주문 관리</a>
          <a href="/admin/menus" className="hover:underline">메뉴 관리</a>
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}