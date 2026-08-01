import { BASE_URL, handleResponse, authHeaders, getToken } from "../apiClient";

export async function applyToJob(jobId, coverLetter) {
    const url = coverLetter
        ? `${BASE_URL}/api/applications/apply/${jobId}?coverLetter=${encodeURIComponent(
              coverLetter
          )}`
        : `${BASE_URL}/api/applications/apply/${jobId}`;

    const response = await fetch(url, {
        method: "POST",
        headers: authHeaders(),
    });

    return handleResponse(response);
}

export async function getMyApplications() {
    const response = await fetch(
        `${BASE_URL}/api/applications/my-applications`,
        {
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function getJobApplications(jobId) {
    const response = await fetch(
        `${BASE_URL}/api/applications/job/${jobId}`,
        {
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function updateApplicationStatus(applicationId, status) {
    const response = await fetch(
        `${BASE_URL}/api/applications/${applicationId}/status?status=${status}`,
        {
            method: "PATCH",
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function checkMyScore(applicationId) {
    const token = getToken();

    const response = await fetch(
        `${BASE_URL}/api/applications/${applicationId}/check-score`,
        {
            method: "POST",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        }
    );

    return handleResponse(response);
}

export async function getApplicationCv(applicationId) {
    const token = getToken();

    const response = await fetch(
        `${BASE_URL}/api/applications/${applicationId}/cv`,
        {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        }
    );

    if (!response.ok) {
        let message = `Error ${response.status}`;
        try {
            const text = await response.text();
            message = text || message;
        } catch {
            // ignore parse errors, fall back to default message
        }
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    return response.blob();
}
