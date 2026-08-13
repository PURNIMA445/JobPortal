import { BASE_URL, handleResponse, authHeaders } from "../apiClient";
import { packCompanyMetadata, unpackCompanyMetadata } from "../utils/companyUtils";

export async function createCompany(data) {
    const payload = packCompanyMetadata(data);
    const response = await fetch(`${BASE_URL}/api/companies`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    const result = await handleResponse(response);
    return unpackCompanyMetadata(result);
}

export async function searchCompanies(name) {
    const response = await fetch(
        `${BASE_URL}/api/companies/search?name=${name}`
    );
    const results = await handleResponse(response);
    if (Array.isArray(results)) {
        return results.map(unpackCompanyMetadata);
    }
    return unpackCompanyMetadata(results);
}

// ═══ INVITES & TEAM MEMBERS ════════════════════════════════════════════

export async function sendInvite(companyId, email) {
    const response = await fetch(`${BASE_URL}/api/companies/${companyId}/invite`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
}

export async function validateInvite(token) {
    const response = await fetch(`${BASE_URL}/api/companies/invite/validate/${token}`);
    return handleResponse(response);
}

export async function acceptInvite(token) {
    const response = await fetch(`${BASE_URL}/api/companies/invite/accept?token=${token}`, {
        method: "POST",
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function getCompanyMembers(companyId) {
    const response = await fetch(`${BASE_URL}/api/companies/${companyId}/members`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function removeCompanyMember(companyId, memberId) {
    const response = await fetch(`${BASE_URL}/api/companies/${companyId}/members/${memberId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function getPendingMembers(companyId) {
    const response = await fetch(`${BASE_URL}/api/companies/${companyId}/members/pending`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function verifyMember(companyId, memberId, isApproved) {
    const response = await fetch(`${BASE_URL}/api/companies/${companyId}/members/${memberId}/verify`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ isApproved }),
    });
    return handleResponse(response);
}
