"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch"; // apiFetch 임포트

type Props = {
  params: { id: string };
};

export default function EditMenu({ params }: Props) {
  const menuId = params.id;
  const router = useRouter();

  // 기존 메뉴 정보를 상태로 관리
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stockCount, setStockCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // 메뉴 상세 조회 → 기존 데이터 불러오기
  const fetchMenu = async () => {
    try {
      const res = await apiFetch(`/admin/menus/${menuId}`);
      // 응답에서 data 필드를 통해 메뉴 정보 가져오기
      const menuData = res.data;

      setName(menuData.name);
      setDescription(menuData.description);
      setPrice(menuData.price);
      setStockCount(menuData.stock_count); // snake_case → camelCase로 처리
    } catch (error) {
      console.error(error);
      alert("메뉴 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [menuId]);

  // 수정 버튼 클릭 → PUT API 호출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedMenu = {
      name,
      description,
      price,
      stock_count: stockCount,
    };

    try {
      const res = await apiFetch(`/admin/menus/${menuId}`, {
        method: "PUT",
        body: JSON.stringify(updatedMenu),
        headers: { "Content-Type": "application/json" },
      });

      alert(
        `메뉴가 수정되었습니다!\n\n 수정 결과:\n- 이름: ${res.data.name}\n- 설명: ${res.data.description}\n- 가격: ${res.data.price}원\n- 재고: ${res.data.stock_count}개`
      );

      router.push("/admin/menus"); // 수정 후 목록으로 이동
    } catch (error) {
      console.error(error);
      alert("메뉴를 수정하는 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p className="text-center mt-10">로딩 중입니다...</p>;

  return (
    <div className="px-4 w-full flex justify-center">
      <div className="w-full max-w-full md:max-w-lg">
        <h1 className="text-2xl font-bold mb-4">메뉴 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-semibold">메뉴 이름</label>
            <input
              type="text"
              className="w-full border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="메뉴 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">설명</label>
            <textarea
              className="w-full border p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="메뉴 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">가격</label>
            <input
              type="number"
              className="w-full border p-2"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="가격을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">재고</label>
            <input
              type="number"
              className="w-full border p-2"
              value={stockCount}
              onChange={(e) => setStockCount(Number(e.target.value))}
              placeholder="재고 수량을 입력하세요"
            />
          </div>

          {/* 버튼 그룹: 오른쪽 정렬 */}
          <div className="flex justify-end gap-2 pt-4">
            {/* 취소 버튼 */}
            <button
              type="button"
              onClick={() => router.push("/admin/menus")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-200"
            >
              취소
            </button>

            {/* 수정 버튼 */}
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white hover:bg-neutral-800"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
