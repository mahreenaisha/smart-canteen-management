// controllers/adminController.js
const menuService = require("../services/menuService");
const orderService = require("../services/orderService");


exports.createMenu = async (req, res) => {
  const response = await menuService.createMenu(
    req.body,
    req.headers.authorization
  );
  res.json(response.data);
};

exports.updateMenu = async (req, res) => {
  const response = await menuService.updateMenu(
    req.params.id,
    req.body,
    req.headers.authorization
  );
  res.json(response.data);
};

exports.deleteMenu = async (req, res) => {
  const response = await menuService.deleteMenu(
    req.params.id,
    req.headers.authorization
  );
  res.json(response.data);
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const response = await orderService.updateOrderStatus(
      req.params.id,
      req.body,
      req.headers.authorization
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      message: error.response?.data?.message || "Failed to update order"
    });
  }
};