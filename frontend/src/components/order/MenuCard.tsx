"use client";

import { MenuItem } from "@/types";

export function MenuCard({
  menu,
  onAdd,
}: {
  menu: MenuItem;
  onAdd: () => void;
}) {
  return (
    <div className="flex border border-gray-300 rounded-xl bg-white px-5 py-5 gap-5 items-center">
      {/* 이미지 */}
      <div className="w-24 h-24 bg-gray-200 rounded" />

      {/* 텍스트 + 버튼 */}
      <div className="flex flex-col justify-center flex-1 h-full">
        <div className="mb-2">
          <h3 className="font-semibold text-base mt-2 leading-5">
            {menu.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            ₩{menu.price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{menu.description}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onAdd}
            className="mt-1 px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-900 transition"
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
