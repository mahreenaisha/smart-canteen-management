import axios from "axios";
import { API } from "../config";

export function registerUser(payload) {
  return axios.post(`${API.GATEWAY}/api/auth/register`, payload);
}

export function loginUser(payload) {
  return axios.post(`${API.GATEWAY}/api/auth/login`, payload);
}
