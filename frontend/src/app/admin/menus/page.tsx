"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@/types";
import { apiFetch, API_BASE_URL } from "@/lib/apiFetch";
import { toast } from "react-toastify";

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
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchMenus = async () => {
    try {
      const res: any = await apiFetch("/admin/menus");
      const data = res.data || res;

      const formattedMenus: Menu[] = data.map((menu: any) => ({
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        stockCount: menu.stock_count, // snake_case → camelCase
        imageUrl: menu.imageUrl,
        imageName: menu.imageName,
      }));

      setMenus(formattedMenus);
    } catch (error) {
      console.error("메뉴 목록 불러오기 실패", error);
      toast.error("메뉴 데이터를 불러오는 데 실패했습니다.");
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

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageName(file.name);
    }
  };

  // 메뉴 등록 API 호출
  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const menuData = {
        name,
        description,
        price,
        stock_count: stockCount,
      };

      // menu part를 JSON blob으로 추가
      formData.append("menu", new Blob([JSON.stringify(menuData)], {
        type: "application/json"
      }));

      // 파일이 선택된 경우 추가
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response: any = await apiFetch("/admin/addmenu", {
        method: "POST",
        body: formData,
      });

      if (response.resultCode === "200-OK") {
        toast.success(response.msg || "메뉴가 등록되었습니다.");
        
        // 폼 데이터 초기화
        setName("");
        setDescription("");
        setPrice(0);
        setStockCount(0);
        setImageName("");
        setSelectedFile(null);

        closeModal(); // 모달 닫기
        fetchMenus(); // 등록 후 목록 새로고침
      } else {
        toast.error(response.msg || "메뉴 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("메뉴 등록 실패", error);
      toast.error("메뉴를 등록하는 중 오류가 발생했습니다.");
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
      const result: any = await apiFetch(`/admin/menus/${id}`, {
        method: "DELETE",
      });

      toast.success(result.msg || "메뉴가 삭제되었습니다.");
      fetchMenus(); // 삭제 후 목록 새로고침
    } catch (error) {
      console.error("메뉴 삭제 실패", error);
      toast.error("메뉴를 삭제하는 중 오류가 발생했습니다.");
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
          <thead className="bg-black text-white font-bold tracking-wide uppercase h-12 border-b border-gray-300 rounded">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">이미지</th>
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
                <td className="px-4 py-3 text-left">
                  {menu.imageUrl ? (
                    <img
                      src={`${API_BASE_URL}${menu.imageUrl}`}
                      alt={menu.imageName || menu.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <span
                    className="text-gray-400 text-sm"
                    style={{ display: menu.imageUrl ? 'none' : 'block' }}
                  >
                    <img src={`${API_BASE_URL}${menu.imageUrl}`} width={100} height={100} />
                  </span>
                </td>
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
                />
              </div>

              <div>
                <label className="block font-semibold">재고</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block font-semibold">상품 이미지</label>
                <input
                  type="file"
                  name="productImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    선택된 파일: {selectedFile.name}
                  </p>
                )}
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
