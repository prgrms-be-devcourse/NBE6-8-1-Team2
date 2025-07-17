"use client";

import { CartItem } from "@/types";
import { memo } from "react";

type Props = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export const CartItemCard = memo(function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <div className="border border-gray-300 rounded-xl p-5 bg-white flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <span className="font-semibold text-base">{item.menu.name}</span>
        <button
          onClick={onRemove}
          className="text-xs px-1.5 py-0.5 mt-[-10px] mr-[-10px] rounded hover:text-red-400"
        >
          X
        </button>
      </div>

      <div className="flex justify-between items-center mt-[-6px]">
        <p className="text-sm text-gray-600">
          ₩{item.menu.price.toLocaleString()}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={onDecrease}
            className="w-6 h-6 text-xs bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="text-sm">{item.quantity}</span>
          <button
            onClick={onIncrease}
            className="w-6 h-6 text-xs bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
});
