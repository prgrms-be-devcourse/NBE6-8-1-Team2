"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, API_BASE_URL } from "@/lib/apiFetch";
import { toast } from "react-toastify"; // toastify 임포트

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditMenu({ params }: Props) {
  const { id } = use(params);
  const menuId = Number(id);
  const router = useRouter();

  // 기존 메뉴 정보를 상태로 관리
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stockCount, setStockCount] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageName(file.name);
    }
  };

  // 메뉴 상세 조회 → 기존 데이터 불러오기
  const fetchMenu = async () => {
    try {
      const res = await apiFetch(`/admin/menus/${menuId}`);
      const menuData = res.data || res;

      setName(menuData.name || "");
      setDescription(menuData.description || "");
      setPrice(menuData.price || 0);
      setStockCount(menuData.stock_count || 0);
      setImageUrl(menuData.imageUrl || "");
      setImageName(menuData.imageName || "");
    } catch (error) {
      console.error(error);
      toast.error("메뉴 정보를 불러오는 중 오류가 발생했습니다.");
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

    try {
      const menuData = {
        name,
        description,
        price,
        stock_count: stockCount,
        imageUrl: imageUrl,  // 기존 이미지 URL 포함
        imageName: imageName, // 기존 이미지 이름 포함
      };

      let response;
      
      if (selectedFile) {
        // 새 이미지가 선택된 경우: FormData 사용 (이미지 변경)
        const formData = new FormData();
        formData.append("menu", new Blob([JSON.stringify(menuData)], {
          type: "application/json"
        }));
        formData.append("image", selectedFile);
        
        response = await apiFetch(`/admin/menus/${menuId}`, {
          method: "PUT",
          body: formData,
        });
        
        toast.info("메뉴 정보와 이미지가 함께 수정됩니다.");
      } else {
        // 새 이미지가 선택되지 않은 경우: JSON 사용 (정보만 수정, 이미지 유지)
        response = await apiFetch(`/admin/menus/${menuId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menuData),
        });
      }

      if (response.resultCode === "200-OK") {
        toast.success(response.msg || "메뉴가 수정되었습니다.");
        router.push("/admin/menus");
      } else {
        toast.error(response.msg || "메뉴 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      toast.error("메뉴를 수정하는 중 오류가 발생했습니다.");
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
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="메뉴 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">설명</label>
            <textarea
              className="w-full border p-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="메뉴 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">가격</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="가격을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">재고</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={stockCount}
              onChange={(e) => setStockCount(Number(e.target.value))}
              placeholder="재고 수량을 입력하세요"
            />
          </div>

          {/* 기존 이미지 미리보기 */}
          {imageUrl && (
            <div>
              <label className="block text-lg font-semibold mb-2">현재 이미지</label>
              <img 
                src={`${API_BASE_URL}${imageUrl}`} 
                alt={imageName || name}
                className="w-32 h-32 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div>
            <label className="block text-lg font-semibold">
              상품 이미지 변경
              <span className="text-sm font-normal text-gray-500 ml-2">
                (선택하지 않으면 기존 이미지 유지)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                새로운 이미지로 변경됩니다: {selectedFile.name}
              </p>
            )}
          </div>

          {/* 버튼 그룹: 오른쪽 정렬 */}
          <div className="flex justify-end gap-2 pt-4">
            {/* 취소 버튼 */}
            <button
              type="button"
              onClick={() => router.push("/admin/menus")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded"
            >
              취소
            </button>

            {/* 수정 버튼 */}
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white hover:bg-neutral-800 rounded"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
