export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  
    const token = localStorage.getItem("accessToken");
  
    const res = await fetch(`${baseUrl}${path}`, {
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
  