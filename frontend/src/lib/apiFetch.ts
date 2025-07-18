export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const token = localStorage.getItem("accessToken");

  // 테스트용
  // memberId 안 붙는 API 목록
  const skipMemberIdPaths = ["/signup", "/login"];

  // 현재 요청이 memberId를 붙여야 하는 API인가?
  const needsMemberId = !skipMemberIdPaths.some((skip) => path.startsWith(skip));

  const url = needsMemberId
    ? path.includes("?")
      ? `${path}&memberId=1`
      : `${path}?memberId=1`
    : path;

  // 백엔드 토큰 작업 완료 -> const url = path; 로 수정.

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API 요청 실패");
  }

  return res.json();
}
