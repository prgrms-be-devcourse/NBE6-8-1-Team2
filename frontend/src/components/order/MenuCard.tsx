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
    <div className="border p-4 rounded shadow-sm flex justify-between items-center">
      <div>
        <p className="font-semibold">{menu.name}</p>
        <p className="text-sm text-gray-500">{menu.description}</p>
        <p className="text-sm">₩{menu.price.toLocaleString()}</p>
      </div>
      <button
        onClick={onAdd}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        담기
      </button>
    </div>
  );
}
