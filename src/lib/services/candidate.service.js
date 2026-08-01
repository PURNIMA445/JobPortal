import { BASE_URL, handleResponse, authHeaders, getToken } from "../apiClient";

export async function createCandidateProfile(data) {
    const response = await fetch(`${BASE_URL}/api/candidate/profile`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function getCandidateProfile() {
    const response = await fetch(`${BASE_URL}/api/candidate/profile`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function updateCandidateProfile(data) {
    const response = await fetch(`${BASE_URL}/api/candidate/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function uploadResume(resumeFile) {
    const token = getToken();
    const formData = new FormData();
    formData.append("resume", resumeFile);

    const response = await fetch(`${BASE_URL}/api/candidate/resume`, {
        method: "POST",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
    });

    return handleResponse(response);
}

export async function searchCandidates() {
    const response = await fetch(`${BASE_URL}/api/candidate/search`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}
