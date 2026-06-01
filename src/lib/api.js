// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// export async function apiFetch(endpoint: string, options?: RequestInit) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     headers: { "Content-Type": "application/json" },
//     ...options,
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }
export function getJobs() {
    return ["Developer", "Designer"];
  }