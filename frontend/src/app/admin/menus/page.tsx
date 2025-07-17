"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@/types";  // 공용 타입 사용

export default function Menus() {
  const router = useRouter();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);

  // 등록 폼 상태
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stockCount, setStockCount] = useState<number>(0);

  // ✅ 더미 데이터 (백엔드 API 안될 때 테스트용)
  const dummyMenus: Menu[] = [
    {
      id: 1,
      name: "아메리카노",
      description: "진한 에스프레소와 물의 조화",
      price: 4500,
      stockCount: 20,
    },
    {
      id: 2,
      name: "카페라떼",
      description: "부드러운 우유와 에스프레소",
      price: 5000,
      stockCount: 15,
    },
    {
      id: 3,
      name: "카푸치노",
      description: "풍부한 거품과 진한 커피",
      price: 5500,
      stockCount: 10,
    },
  ];

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
      console.error("API 호출 실패 → 더미 데이터 사용", error);
      setMenus(dummyMenus); // ✅ API 실패 시 fallback
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

  // 메뉴 등록 API 호출
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
      fetchMenus(); // 등록 후 목록 새로고침
    } catch (error) {
      console.error(error);
      alert("메뉴를 등록하는 중 오류가 발생했습니다.");
    }
  };

  // 수정 버튼 → 수정 페이지 이동
  const handleEditMenu = (id: number) => {
    router.push(`/admin/menus/${id}`); 
  };

  // 삭제 버튼 → 확인하고 API 호출 후 응답 메시지 출력
  const handleDeleteMenu = async (id: number) => {
    const confirmed = confirm("정말 이 메뉴를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/menus/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");

      // 백엔드 응답 메시지를 alert로 그대로 보여주기
      const result = await res.json();
      alert(result.message);
      
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
        className="mb-4 px-4 py-2 bg-black text-white hover:bg-neutral-800"
      >
        메뉴 등록
      </button>

      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full table-auto text-sm text-left text-black bg-white">
          <thead className="bg-black text-white text-[13px] font-bold tracking-wide uppercase h-12 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">이름</th>
              <th className="px-4 py-2 text-left">설명</th>
              <th className="px-4 py-2 text-left">가격</th>
              <th className="px-4 py-2 text-left">재고</th>
              <th className="px-4 py-2 text-left">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {menus.map((menu) => (
              <tr key={menu.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-left font-medium">{menu.id}</td>
                <td className="px-4 py-3 text-left">{menu.name}</td>
                <td className="px-4 py-3 text-left">{menu.description}</td>
                <td className="px-4 py-3 text-right">
                  {menu.price.toLocaleString()}원
                </td>
                <td className="px-4 py-3 text-left">{menu.stockCount}</td>
                <td className="px-4 py-3 text-left space-x-2">
                  {/* 수정 버튼 */}
                  <button
                    className="px-2 py-1 bg-black text-white hover:bg-neutral-800"
                    onClick={() => handleEditMenu(menu.id)}
                  >
                    수정
                  </button>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleDeleteMenu(menu.id)}
                    className="px-2 py-1 bg-gray-500 text-white hover:bg-gray-400"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 메뉴 등록 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">메뉴 등록</h2>

            <form onSubmit={handleCreateMenu} className="space-y-4">
              <div>
                <label className="block font-semibold">메뉴 이름</label>
                <input
                  type="text"
                  className="w-full border p-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="메뉴 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block font-semibold">설명</label>
                <textarea
                  className="w-full border p-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="메뉴 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block font-semibold">가격</label>
                <input
                  type="number"
                  className="w-full border p-2"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="가격을 입력하세요"
                />
              </div>

              <div>
                <label className="block font-semibold">재고</label>
                <input
                  type="number"
                  className="w-full border p-2"
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  placeholder="재고 수량을 입력하세요"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white hover:bg-neutral-800"
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
