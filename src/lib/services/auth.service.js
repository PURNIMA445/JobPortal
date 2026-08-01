import { BASE_URL, handleResponse, authHeaders } from "../apiClient";


export async function signupUser({ email, password, role }) {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
    });

    return handleResponse(response);
}

export async function loginUser({ email, password }) {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
}

export async function changePassword({ currentPassword, newPassword }) {
    const response = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(response);
}

export async function deactivateAccount() {
    const response = await fetch(`${BASE_URL}/api/auth/deactivate`, {
        method: "POST",
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function sendVerificationOtp(email) {
    const response = await fetch(
        `${BASE_URL}/api/auth/send-verification-otp?email=${encodeURIComponent(email)}`,
        { method: "POST" }
    );
    return handleResponse(response);
}

export async function verifyEmail(email, otp) {
    const response = await fetch(
        `${BASE_URL}/api/auth/verify-email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
        { method: "POST" }
    );
    return handleResponse(response);
}
