"use client";

import { useEffect, useState } from "react";

type Menu = {
  id: number;
  name: string;
  description: string;
  price: number;
  stockCount: number;
};

export default function Menus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);

  // 등록 폼 상태
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stockCount, setStockCount] = useState<number>(0);

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

  // 모달 열기/닫기
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // 메뉴 등록 API
  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();

    const newMenu = { name, description, price, stockCount };

    try {
      const res = await fetch("http://localhost:8080/admin/addmenu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMenu),
      });

      if (!res.ok) throw new Error("메뉴 등록 실패");

      alert("메뉴가 등록되었습니다.");
      closeModal(); // 모달 닫기
      fetchMenus(); // 목록 갱신
    } catch (error) {
      console.error(error);
      alert("메뉴를 등록하는 중 오류가 발생했습니다.");
    }
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

      alert("메뉴가 삭제되었습니다.");
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

      {/* 메뉴 등록 버튼 → 모달 열기 */}
      <button
        onClick={openModal}
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
                <button
                  className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                  onClick={() => alert("수정 페이지는 별도 구현 필요")}
                >
                  수정
                </button>
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

      {/* 모달 UI */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">메뉴 등록</h2>

            <form onSubmit={handleCreateMenu} className="space-y-4">
              <div>
                <label className="block font-semibold">메뉴 이름</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="메뉴 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block font-semibold">설명</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="메뉴 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block font-semibold">가격</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="가격을 입력하세요"
                />
              </div>

              <div>
                <label className="block font-semibold">재고</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  placeholder="재고 수량을 입력하세요"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
