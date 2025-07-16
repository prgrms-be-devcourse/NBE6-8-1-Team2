"use client";

import { CartItem } from "@/types";

export function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="border p-3 flex justify-between items-center rounded">
      <div>
        <p className="font-semibold">{item.menu.name}</p>
        <p className="text-sm text-gray-500">
          ₩{item.menu.price.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDecrease} className="px-2 py-1 bg-gray-300 rounded">-</button>
        <span>{item.quantity}</span>
        <button onClick={onIncrease} className="px-2 py-1 bg-gray-300 rounded">+</button>
        <button onClick={onRemove} className="px-2 py-1 bg-red-400 text-white rounded">삭제</button>
      </div>
    </div>
  );
}
