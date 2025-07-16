"use client";

import { Order } from "@/types";

export function OrderCard({ order }: { order: Order }) {
  return (
    <li className="border p-4 rounded-xl shadow bg-white">
      <p className="text-sm text-gray-500 mb-2">
        주문 일시: {new Date(order.createdAt).toLocaleString()}
      </p>
      <ul className="divide-y">
        {order.orderItems.map((item, idx) => (
          <li key={idx} className="flex justify-between py-1">
            <span>{item.name} x {item.quantity}</span>
            <span>{item.price * item.quantity}원</span>
          </li>
        ))}
      </ul>
      <p className="text-right mt-2 font-semibold">
        총 결제 금액: {order.totalPrice.toLocaleString()}원
      </p>
    </li>
  );
}
