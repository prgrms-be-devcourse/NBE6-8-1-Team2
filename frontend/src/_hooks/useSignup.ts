import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SignupForm } from "@/types";
import { toast } from "react-toastify";

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signup = async (form: SignupForm) => {
    setErrorMessage(""); // 에러 메시지 초기화
    setIsLoading(true); // 로딩 시작

    try {
      await apiFetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast.success("회원가입이 완료되었습니다.");
    } catch (err: any) {
      toast.error(err.message || "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  return { signup, isLoading, errorMessage };
}
