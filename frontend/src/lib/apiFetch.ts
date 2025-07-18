export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const url = path; // 기본 경로 유지

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // 쿠키 인증
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const cleanedMsg = error.msg?.split(": ").slice(-1)[0];
    throw new Error(cleanedMsg || error.message || "API 요청 실패");
  }

  return res.json();
}
