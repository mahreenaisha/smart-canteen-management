import axios from "axios";
import { API } from "../config";

function withAuth(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getWallet(studentId, token) {
  const response = await axios.get(`${API.GATEWAY}/api/wallet/${studentId}`, withAuth(token));
  return response.data;
}

export async function createWallet(payload, token) {
  const response = await axios.post(`${API.GATEWAY}/api/wallet/create`, payload, withAuth(token));
  return response.data;
}
