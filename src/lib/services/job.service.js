import { BASE_URL, handleResponse, authHeaders } from "../apiClient";

export async function getAllJobs() {
    const response = await fetch(`${BASE_URL}/api/jobs`);
    return handleResponse(response);
}

export async function getJob(id) {
    const response = await fetch(`${BASE_URL}/api/jobs/${id}`);
    return handleResponse(response);
}

export async function createJob(data) {
    const response = await fetch(`${BASE_URL}/api/jobs`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}
export async function updateJob(id, data) {
    const response = await fetch(`${BASE_URL}/api/jobs/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}
export async function searchJobs(keyword) {
    const response = await fetch(
        `${BASE_URL}/api/jobs/search?keyword=${keyword}`
    );
    return handleResponse(response);
}

export async function getMyJobs() {
    const response = await fetch(`${BASE_URL}/api/jobs/my-jobs`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function closeJob(id) {
    const response = await fetch(`${BASE_URL}/api/jobs/${id}/close`, {
        method: "PATCH",
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function saveJob(jobId) {
    const response = await fetch(
        `${BASE_URL}/api/saved-jobs/${jobId}`,
        {
            method: "POST",
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function unsaveJob(jobId) {
    const response = await fetch(
        `${BASE_URL}/api/saved-jobs/${jobId}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function getSavedJobs() {
    const response = await fetch(`${BASE_URL}/api/saved-jobs`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function getRecommendedJobs() {
    const response = await fetch(`${BASE_URL}/api/jobs/recommended`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}
