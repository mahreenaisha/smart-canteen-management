import axios from "axios";
import { API } from "../config";

function withAuth(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function placeOrder(items, token) {
  const response = await axios.post(`${API.GATEWAY}/api/orders`, { items }, withAuth(token));
  return response.data;
}

export async function getOrders(token) {
  const response = await axios.get(`${API.GATEWAY}/api/orders`, withAuth(token));
  return response.data;
}
