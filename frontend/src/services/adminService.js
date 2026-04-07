import axios from "axios";
import { API } from "../config";

function withAdmin(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function adminLogin(payload) {
  const response = await axios.post(`${API.GATEWAY}/api/admin/auth/login`, payload);
  return response.data;
}

export async function getAdminMenu() {
  const response = await axios.get(`${API.GATEWAY}/api/menu`);
  return response.data;
}

export async function createMenuItem(payload, token) {
  const response = await axios.post(`${API.GATEWAY}/api/admin/menu`, payload, withAdmin(token));
  return response.data;
}

export async function updateMenuItem(id, payload, token) {
  const response = await axios.put(`${API.GATEWAY}/api/admin/menu/${id}`, payload, withAdmin(token));
  return response.data;
}

export async function deleteMenuItem(id, token) {
  const response = await axios.delete(`${API.GATEWAY}/api/admin/menu/${id}`, withAdmin(token));
  return response.data;
}

export async function getAdminOrders(token) {
  const response = await axios.get(`${API.GATEWAY}/api/orders`, withAdmin(token));
  return response.data;
}

export async function updateAdminOrderStatus(orderId, status, token) {
  const response = await axios.patch(
    `${API.GATEWAY}/api/admin/orders/${orderId}`,
    { status },
    withAdmin(token),
  );

  return response.data;
}
