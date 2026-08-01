import { BASE_URL, handleResponse, authHeaders } from "../apiClient";
import { unpackCompanyMetadata } from "../utils/companyUtils";

export async function createRecruiterProfile(data) {
    const response = await fetch(`${BASE_URL}/api/recruiter/profile`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function getRecruiterProfile() {
    const response = await fetch(`${BASE_URL}/api/recruiter/profile`, {
        headers: authHeaders(),
    });
    const profile = await handleResponse(response);
    if (profile && profile.company) {
        profile.company = unpackCompanyMetadata(profile.company);
    }
    return profile;
}

export async function updateRecruiterProfile(data) {
    const response = await fetch(`${BASE_URL}/api/recruiter/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}
