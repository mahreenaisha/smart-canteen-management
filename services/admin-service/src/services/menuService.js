// services/menuService.js
const axios = require("axios");

exports.createMenu = async (data, token) => {
  return axios.post(
    `${process.env.MENU_SERVICE}/api/menu`,
    data,
    {
      headers: { Authorization: token }
    }
  );
};

exports.updateMenu = async (id, data, token) => {
  return axios.put(
    `${process.env.MENU_SERVICE}/api/menu/${id}`,
    data,
    {
      headers: { Authorization: token }
    }
  );
};

exports.deleteMenu = async (id, token) => {
  return axios.delete(
    `${process.env.MENU_SERVICE}/api/menu/${id}`,
    {
      headers: { Authorization: token }
    }
  );
};