export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const url = path;

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  // 상태코드가 204(No Content)면 json 파싱하지 말고 바로 반환
  if (res.status === 204) {
    return {} as T;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const cleanedMsg = error.msg?.split(": ").slice(-1)[0];
    throw new Error(cleanedMsg || error.message || "API 요청 실패");
  }

  return res.json();
}
