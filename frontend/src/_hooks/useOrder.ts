import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { CartItem, OrderItem } from "@/types"; 
import { toast } from "react-toastify";

export function useOrder() {
  const router = useRouter();
  const [state, setState] = useState<UseApiState>({
    isLoading: false,
    errorMessage: "",
  });

  const order = async (cart: CartItem[]) => {
    if (cart.length === 0) {
      setState({ ...state, errorMessage: "*장바구니가 비어 있습니다."});
      return;
    }

    const items: OrderItem[] = cart.map((item) => ({
      menuId: item.menu.id,
      quantity: item.quantity,
      name: item.menu.name,
      price: item.menu.price,
    }));

    setState({ ...state, errorMessage: "", isLoading: true });

    try {
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({ orderItems: items }),
      });

      toast.success("주문이 완료되었습니다.");
      router.push("/mypage");
    } catch (err: any) {
      toast.error(err.message || "주문 중 오류가 발생했습니다.");
    }
  };

  return { order, isLoading: state.isLoading, errorMessage: state.errorMessage };
}