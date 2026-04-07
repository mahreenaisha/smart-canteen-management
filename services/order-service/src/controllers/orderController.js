const Order = require("../models/Order");
const { getMenuItemById } = require("../services/menuService");
const { debitWallet } = require("../services/walletService");
const { publishEvent } = require("../producers/orderProducer");

class OrderController {
  static async createOrder(req, res) {
    try {
      const { items } = req.body;

      const token = req.headers.authorization?.split(" ")[1];

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Items are required" });
      }

      const orderItems = [];

      for (const item of items) {
        if (!item.menuId || item.qty === undefined || item.qty <= 0) {
          return res.status(400).json({
            message: "Each item must contain menuId and qty",
          });
        }

        const menuItem = await getMenuItemById(item.menuId);

        if (!menuItem) {
          return res.status(404).json({
            message: `Menu item not found: ${item.menuId}`,
          });
        }

        orderItems.push({
          name: menuItem.name,
          price: menuItem.price,
          qty: item.qty,
        });
      }

      const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      );

      const { studentId, email, role } = req.user;

      if (role === "admin" || !studentId || !email) {
        return res.status(403).json({
          message: "Only students can place orders",
        });
      }
      
      let walletResponse;

      try {
        walletResponse = await debitWallet(studentId, total, token);
      } catch (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      const order = await Order.create({
        orderId: "ORD" + Date.now(),
        studentId,
        email,
        items: orderItems,
        total,
        status: "PLACED",
      });

      const eventData = {
        event: "ORDER_PLACED",
        orderId: order.orderId,
        studentId: order.studentId,
        email: order.email,
        items: order.items,
        total: order.total,
        status: order.status,
        timestamp: new Date(),
      };

      console.log("Order created successfully, publishing ORDER_PLACED", {
        orderId: order.orderId,
        studentId: order.studentId,
      });
      await publishEvent(eventData);

      return res.status(201).json({
        message: "Order placed successfully",
        wallet: walletResponse,
        order,
      });
    } catch (error) {
      console.error("Create Order Error:", error.message);

      return res.status(500).json({
        message: error.message || "Failed to create order",
      });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({
          message: "Admin access required",
        });
      }

      const { status } = req.body;
      const orderId = req.params.id;

      const allowedStatuses = ["PLACED", "READY", "CANCELLED"];

      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const order = await Order.findOne({ orderId });

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.status = status;
      await order.save();

      let eventName = null;

      if (status === "READY") {
        eventName = "ORDER_READY";
      } else if (status === "CANCELLED") {
        eventName = "ORDER_CANCELLED";
      }

      if (eventName) {
        const eventData = {
          event: eventName,
          orderId: order.orderId,
          studentId: order.studentId,
          email: order.email,
          items: order.items,
          total: order.total,
          status: order.status,
          timestamp: new Date(),
        };

        console.log("Publishing order status event", {
          event: eventName,
          orderId: order.orderId,
        });
        await publishEvent(eventData);
      }

      return res.status(200).json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Update Order Error:", error.message);

      return res.status(500).json({
        message: error.message || "Error updating order status",
      });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const query = req.user?.role === "admin"
        ? {}
        : { studentId: req.user.studentId };

      const orders = await Order.find(query);
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Get All Orders Error:", error.message);

      return res.status(500).json({
        message: "Error fetching orders",
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const orderId = req.params.id;

      const order = await Order.findOne({ orderId });

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      if (
        req.user?.role !== "admin" &&
        order.studentId !== req.user?.studentId
      ) {
        return res.status(403).json({
          message: "You can only view your own orders",
        });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Get Order By ID Error:", error.message);

      return res.status(500).json({
        message: "Error fetching order",
      });
    }
  }
}

module.exports = OrderController;
