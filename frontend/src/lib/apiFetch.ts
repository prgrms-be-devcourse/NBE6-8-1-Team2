export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = API_BASE_URL;
  const url = path;

  // FormData인 경우 Content-Type 헤더를 설정하지 않음
  const headers = { ...(options.headers || {}) };
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  let res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && !url.includes("/login") && !url.includes("/signup") && !url.includes("/reissue")) {
    const reissueRes = await fetch(`${baseUrl}/reissue`, {
      method: "POST",
      credentials: "include",
    });

    if (reissueRes.ok) {
      // 쿠키 반영까지 아주 잠깐 delay → 브라우저에 반영될 시간 확보
      await new Promise((r) => setTimeout(r, 100)); // 100ms 딜레이

      // 원래 요청 재시도
      res = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  if (res.status === 204) {
    return {} as T;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const cleanedMsg = error.msg?.split(": ").slice(-1)[0];
    const err = new Error(cleanedMsg || error.message || "API 요청 실패");
    (err as any).data = error.data;
    throw err;
  }

  return res.json();
}
