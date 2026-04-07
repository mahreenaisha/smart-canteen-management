import axios from "axios";
import { API } from "../config";

function withAuth(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getNotifications(token) {
  const response = await axios.get(`${API.GATEWAY}/api/notifications/me`, withAuth(token));
  return response.data;
}
