import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SignupForm } from "@/types";
import { toast } from "react-toastify";

const validateSignupForm = (form: SignupForm): string | null => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(form.email)) return "이메일 형식이 올바르지 않습니다.";
  if (form.password.length < 6) return "비밀번호는 최소 6자 이상이어야 합니다.";
  if (!form.nickname || form.nickname.trim().length < 2) return "닉네임은 2자 이상이어야 합니다.";
  // 주소 유효성 검사 : if (!form.address || form.address.trim().length) return "";

  return null;
};

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (form: SignupForm): Promise<boolean> => {
    setIsLoading(true); // 로딩 시작

    const validationError = validateSignupForm(form);
    if (validationError) {
      toast.error(validationError);
      setIsLoading(false);
      return false;
    }

    try {
      await apiFetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      toast.success("회원가입이 완료되었습니다.");
      return true;
    } catch (err: any) {
      const msg = err.message || "회원가입에 실패했습니다.";
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  return { signup, isLoading };
}
