"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@/types";  // 공용 타입 사용
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "react-toastify";  // toastify 임포트

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

  const fetchMenus = async () => {
    try {
      const res = await apiFetch("/admin/menus");
      const data = res.data || res;

      const formattedMenus: Menu[] = data.map((menu: any) => ({
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        stockCount: menu.stock_count, // snake_case → camelCase
      }));

      setMenus(formattedMenus);
    } catch (error) {
      console.error("메뉴 목록 불러오기 실패", error);
      toast.error("메뉴 데이터를 불러오는 데 실패했습니다.");  // toastify로 에러 표시
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

    try {
      await apiFetch("/admin/addmenu", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          price,
          stock_count: stockCount, // stockCount → stock_count로 수정
        }),
        headers: { "Content-Type": "application/json" },
      });

      toast.success("메뉴가 등록되었습니다.");  // 성공 메시지
      closeModal(); // 모달 닫기
      fetchMenus(); // 등록 후 목록 새로고침
    } catch (error) {
      console.error("메뉴 등록 실패", error);
      toast.error("메뉴를 등록하는 중 오류가 발생했습니다.");  // 실패 메시지
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
      const result = await apiFetch(`/admin/menus/${id}`, {
        method: "DELETE",
      });

      toast.success(result.message || "메뉴가 삭제되었습니다.");  // 성공 메시지
      fetchMenus(); // 삭제 후 목록 새로고침
    } catch (error) {
      console.error("메뉴 삭제 실패", error);
      toast.error("메뉴를 삭제하는 중 오류가 발생했습니다.");  // 실패 메시지
    }
  };

  if (loading) return <p className="text-center mt-10">로딩 중입니다...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">전체 메뉴 목록 조회</h1>

      {/* 메뉴 등록 버튼 → 모달 열기 */}
      <button
        onClick={openModal}
        className="mb-4 px-4 py-2 bg-black text-white hover:bg-neutral-800 rounded"
      >
        메뉴 등록
      </button>

      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="w-full table-auto text-sm text-left text-black bg-white rounded">
          <thead className="bg-black text-white text-[13px] font-bold tracking-wide uppercase h-12 border-b border-gray-300 rounded">
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
                    className="px-2 py-1 bg-black text-white hover:bg-neutral-800 rounded"
                    onClick={() => handleEditMenu(menu.id)}
                  >
                    수정
                  </button>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleDeleteMenu(menu.id)}
                    className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
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
          <div className="bg-white p-6 max-w-md w-full rounded">
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
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white hover:bg-neutral-800 rounded"
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
