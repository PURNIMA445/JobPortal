import { BASE_URL, handleResponse, authHeaders } from "../apiClient";

export async function getAllSkills() {
    const response = await fetch(`${BASE_URL}/api/skills`);
    return handleResponse(response);
}

export async function getDashboardStats() {
    const response = await fetch(`${BASE_URL}/api/dashboard`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    
    // We cannot use the standard authHeaders() directly for FormData because 
    // fetch will automatically set the correct multipart/form-data boundary 
    // if we omit the Content-Type header.
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
        
    const response = await fetch(`${BASE_URL}/api/upload/image`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData,
    });
    return handleResponse(response);
}
