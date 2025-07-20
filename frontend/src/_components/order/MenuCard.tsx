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
    <div
      onClick={onAdd}
      role="button"
      aria-label={`${menu.name} 담기`}
      className="flex border border-gray-300 rounded-xl bg-white px-5 py-5 gap-5 items-start cursor-pointer transition hover:shadow-md hover:-translate-y-[2px] active:scale-[0.98]"
    >
      {/* 이미지 */}
      <div className="w-24 h-24 bg-gray-200 rounded" />

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
