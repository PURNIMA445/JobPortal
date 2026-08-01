import { BASE_URL, handleResponse, authHeaders } from "../apiClient";

export async function getNotifications() {
    const response = await fetch(`${BASE_URL}/api/notifications`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function getUnreadCount() {
    const response = await fetch(
        `${BASE_URL}/api/notifications/unread-count`,
        {
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function markAllRead() {
    const response = await fetch(
        `${BASE_URL}/api/notifications/mark-all-read`,
        {
            method: "PATCH",
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}
