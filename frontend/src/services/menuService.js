import axios from "axios";
import { API } from "../config";

export async function getMenu() {
  const response = await axios.get(`${API.GATEWAY}/api/menu`);
  return response.data;
}

export async function getMenuById(menuId) {
  const response = await axios.get(`${API.GATEWAY}/api/menu/${menuId}`);
  return response.data;
}
