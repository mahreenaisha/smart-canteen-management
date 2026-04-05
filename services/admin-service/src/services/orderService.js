// services/orderService.js
const axios = require("axios");

exports.updateOrderStatus = async (orderId, data, token) => {
  return axios.patch(
    `${process.env.ORDER_SERVICE}/orders/${orderId}`,
    data,
    {
      headers: { Authorization: token }
    }
  );
};