"use client";

import { Order } from "@/types";
import { format } from "date-fns";

export function OrderCard({ order }: { order: Order }) {
  const formattedDate = format(new Date(order.createdAt), "yyyy. M. d. a h:mm:ss");

  return (
    <div className="bg-gray-200 p-5 rounded-xl flex flex-col gap-3">
      {/* 주문 일시 */}
      <div className="font-semibold text-sm">
        주문 일시 : {formattedDate}
      </div>

      {/* 주문 항목 */}
      {order.orderItems.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center text-base font-semibold">
          <span>{item.name} X {item.quantity}</span>
          <div className="flex-1 border-t border-dashed mx-3 mt-2" />
          <span>₩{item.price.toLocaleString()}</span>
        </div>
      ))}

      {/* 총 결제 금액 */}
      <div className="text-right text-lg font-bold mt-2">
        총 결제 금액 : ₩{order.totalPrice.toLocaleString()}
      </div>
    </div>
  );
}
