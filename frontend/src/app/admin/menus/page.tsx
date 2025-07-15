"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Menu = {
  id: number;
  name: string;
  description: string;
  price: number;
  stockCount: number;
};

export default function Menus() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // 메뉴 목록 불러오기
  const fetchMenus = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/menus");
      if (!res.ok) throw new Error("메뉴 목록 불러오기 실패");

      const rawData = await res.json();

      const data: Menu[] = rawData.map((menu: any) => ({
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        stockCount: menu.stock_count,
      }));

      setMenus(data);
    } catch (error) {
      console.error(error);
      alert("메뉴 목록을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 등록 버튼 → 메뉴 등록 페이지로 이동
  const handleCreate = () => {
    router.push("/admin/menus/create");
  };

  // 수정 버튼 → 메뉴 수정 페이지로 이동
  const handleEdit = (id: number) => {
    router.push(`/admin/menus/${id}`);
  };

  // 삭제 버튼 → 확인 후 API 호출
  const handleDelete = async (id: number) => {
    const confirmed = confirm("정말 이 메뉴를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/menus/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");

      // 백엔드 응답 메시지를 읽고 alert로 표시
      const result = await res.json().catch(() => null);
      alert(result?.message ?? "메뉴가 삭제되었습니다.");

      fetchMenus(); // 삭제 후 목록 새로고침
    } catch (error) {
      console.error(error);
      alert("메뉴를 삭제하는 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>로딩 중입니다...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">전체 메뉴 목록 조회</h1>

      {/* 메뉴 등록 버튼 */}
      <button
        onClick={handleCreate}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + 메뉴 등록
      </button>

      <table className="w-full border-collapse bg-white shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">이름</th>
            <th className="border p-2">설명</th>
            <th className="border p-2">가격</th>
            <th className="border p-2">재고</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td className="border p-2 text-center">{menu.id}</td>
              <td className="border p-2">{menu.name}</td>
              <td className="border p-2">{menu.description}</td>
              <td className="border p-2 text-right">
                {menu.price.toLocaleString()}원
              </td>
              <td className="border p-2 text-center">{menu.stockCount}</td>
              <td className="border p-2 text-center space-x-2">
                {/* 수정 버튼 → 수정 페이지 이동 */}
                <button
                  onClick={() => handleEdit(menu.id)}
                  className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  수정
                </button>

                {/* 삭제 버튼 → confirm 후 삭제 API 호출 */}
                <button
                  onClick={() => handleDelete(menu.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
