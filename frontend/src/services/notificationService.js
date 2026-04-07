import axios from "axios";
import { API } from "../config";

function withAuth(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function normalizeNotification(item) {
  return {
    _id: item._id || item.orderId || `${item.status}-${item.createdAt || item.updatedAt}`,
    orderId: item.orderId,
    message: item.message,
    status: item.status,
    createdAt: item.createdAt || item.updatedAt,
  };
}

export async function getNotifications(studentId, token) {
  const requests = [
    () => axios.get(`${API.GATEWAY}/api/notifications/me`, withAuth(token)),
    () => axios.get(`${API.GATEWAY}/api/notifications/${studentId}`, withAuth(token)),
    () => axios.get(`${API.NOTIFICATION}/api/notifications/me`, withAuth(token)),
    () => axios.get(`${API.NOTIFICATION}/api/notifications/${studentId}`, withAuth(token)),
  ];

  let lastError;

  for (const request of requests) {
    try {
      const response = await request();
      return response.data.map(normalizeNotification);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to fetch notifications");
}
