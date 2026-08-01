import { BASE_URL, handleResponse, authHeaders } from "../apiClient";

export async function adminGetStats() {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function adminGetSkills() {
    const res = await fetch(`${BASE_URL}/api/admin/skills`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function adminCreateSkill(name, category) {
    const res = await fetch(`${BASE_URL}/api/admin/skills`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name, category }),
    });
    return handleResponse(res);
}

export async function adminDeleteSkill(id) {
    const res = await fetch(`${BASE_URL}/api/admin/skills/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function adminGetUsers() {
    const res = await fetch(`${BASE_URL}/api/admin/users`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function adminDeleteUser(id) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function adminGetJobs() {
    const res = await fetch(`${BASE_URL}/api/admin/jobs`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function adminDeleteJob(id) {
    const res = await fetch(`${BASE_URL}/api/admin/jobs/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function adminUpdateUserRole(id, role) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}/role`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ role }),
    });
    return handleResponse(res);
}

export async function adminToggleUserVerification(id, isEmailVerified) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}/verify`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ isEmailVerified }),
    });
    return handleResponse(res);
}

export async function adminGetCompanies() {
    const res = await fetch(`${BASE_URL}/api/admin/companies`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function adminDeleteCompany(id) {
    const res = await fetch(`${BASE_URL}/api/admin/companies/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function adminGetApplications() {
    const res = await fetch(`${BASE_URL}/api/admin/applications`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function adminDeleteApplication(id) {
    const res = await fetch(`${BASE_URL}/api/admin/applications/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function adminGetPendingCompanies() {
    const res = await fetch(`${BASE_URL}/api/admin/companies/pending`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function adminVerifyCompany(id, approve, reason) {
    const res = await fetch(`${BASE_URL}/api/admin/companies/${id}/verify`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ approve, reason }),
    });
    return handleResponse(res);
}
