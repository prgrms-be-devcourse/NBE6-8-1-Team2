import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { CartItem, OrderItem } from "@/types";
import { apiFetch } from "@/lib/apiFetch";
import { useCart } from "@/_contexts/CartContext";

interface ApiError extends Error {
  data?: any;
}

export function useOrder() {
  const router = useRouter();
  const { clearCart } = useCart(); 
  const [state, setState] = useState<UseApiState>({
    isLoading: false,
    errorMessage: "",
  });

  const order = async (cart: CartItem[]) => {
    if (cart.length === 0) {
      setState({ ...state, errorMessage: "*장바구니가 비어 있습니다." });
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderItems: items }),
      });

      toast.success("주문이 완료되었습니다.");
      await new Promise((res) => setTimeout(res, 700));
      clearCart(); // 장바구니 비우기 
      router.push("/mypage");
    } catch (err: unknown) {
      const error = err as ApiError;
    
      if (error?.data && Array.isArray(error.data)) {
        const shortages = error.data;
    
        toast.error("재고가 부족한 메뉴가 있습니다.");
    
        const messageList = shortages
          .map((item: any) => `${item.name} : ${item.remaining}개 남음`)
          .join("/ ");
    
          toast.error(messageList);
      } else {
        toast.error(error.message || "주문 중 오류가 발생했습니다.");
      }    
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return { order, isLoading: state.isLoading, errorMessage: state.errorMessage };
}
