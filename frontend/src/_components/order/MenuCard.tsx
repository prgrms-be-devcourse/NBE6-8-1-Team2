"use client";

import { MenuItem } from "@/types";
import { API_BASE_URL } from "@/lib/apiFetch";

export function MenuCard({
  menu,
  onAdd,
}: {
  menu: MenuItem;
  onAdd: () => void;
}) {
  return (
    <div
      onClick={onAdd}
      role="button"
      aria-label={`${menu.name} 담기`}
      className="flex border border-gray-300 rounded-xl bg-white px-5 py-5 gap-5 items-start cursor-pointer transition hover:shadow-md hover:-translate-y-[2px] active:scale-[0.98]"
    >
      <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
        {menu.imageUrl ? (
          <img
            src={`${API_BASE_URL}${menu.imageUrl}`}
            alt={menu.imageName || menu.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.className = "w-24 h-24 bg-gray-200 rounded flex items-center justify-center";
                parent.innerHTML = '<span class="text-gray-400 text-xs">이미지 없음</span>';
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-xs">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-base mb-1 leading-5">
          {menu.name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          ₩{menu.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 line-clamp-2">{menu.description}</p>
      </div>
    </div>
  );
}
