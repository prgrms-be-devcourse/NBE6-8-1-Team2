import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { LoginForm } from "@/types";
import { toast } from "react-toastify";
import { useAuth } from "@/_hooks/auth-context";

const validateLoginForm = (form: LoginForm): string | null => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email)) return "이메일 형식이 올바르지 않습니다.";
  if (form.password.length < 6) return "비밀번호는 최소 6자 이상이어야 합니다.";
  return null;
};

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth(); 

  const login = async (form: LoginForm) => {
    setIsLoading(true);

    const validationError = validateLoginForm(form);
    if (validationError) {
      toast.error(validationError);
      setIsLoading(false);
      return;
    }

    try {
      await apiFetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      authLogin(); // 전역 로그인 상태 true
      toast.success("로그인 성공");
      router.push("/order");
    } catch (err: any) {
      toast.error(err.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
}
