export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function handleResponse(response) {
    const text = await response.text();
    let data;
  
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
  
    if (!response.ok) {
      const errorMsg = typeof data === "string" ? data : data?.message || data?.error;
      const error = new Error(
        errorMsg ? errorMsg : `Status: ${response.status}, Body: ${JSON.stringify(data)}`
      );
      error.status = response.status;
      error.email = data?.email || null; // preserve email from backend
      throw error;
    }
  
    return data;
  }

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

export function authHeaders(extra = {}) {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}
