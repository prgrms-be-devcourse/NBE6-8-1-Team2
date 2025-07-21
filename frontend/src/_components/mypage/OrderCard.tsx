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
        <div key={idx} className="flex items-center text-base font-semibold">
          {/* 메뉴명 + 수량 */}
          <span className="whitespace-nowrap">{item.name} X {item.quantity}</span>

          {/* 가운데 점선 */}
          <div className="flex-1 border-t border-dotted border-gray-500 mx-3" />

          {/* 가격 */}
          <span className="whitespace-nowrap">₩{item.price.toLocaleString()}</span>
        </div>
      ))}

      {/* 총 결제 금액 */}
      <div className="text-right text-lg font-bold mt-2">
        총 결제 금액 : ₩{order.totalPrice.toLocaleString()}
      </div>
    </div>
  );
}
