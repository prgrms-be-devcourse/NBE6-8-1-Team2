import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { LoginForm } from "@/types";  
import { saveToken } from "@/lib/authService";

const validateLoginForm = (form: LoginForm): string | null => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email)) return "이메일 형식이 올바르지 않습니다.";
  if (form.password.length < 6) return "비밀번호는 최소 6자 이상이어야 합니다.";
  return null;
};

export function useLogin() {
  const router = useRouter();
  const [state, setState] = useState<UseApiState>({
    isLoading: false,
    errorMessage: "",
  });

  const login = async (form: LoginForm) => {
    setState({ ...state, errorMessage: "", isLoading: true });

    const error = validateLoginForm(form);
    if (error) {
      setState({ ...state, errorMessage: error, isLoading: false });
      return;
    }

    try {
      const res = await apiFetch<{ token: string }>("/api/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      saveToken(res.token);
      alert("로그인 성공");
      router.push("/order");
    } catch (err: any) {
      setState({ ...state, errorMessage: `로그인 실패: ${err.message}`, isLoading: false });
    }
  };

  return { login, isLoading: state.isLoading, errorMessage: state.errorMessage };
}