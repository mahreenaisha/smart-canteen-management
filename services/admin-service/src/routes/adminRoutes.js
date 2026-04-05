// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

router.post("/menu", auth, adminController.createMenu);
router.put("/menu/:id", auth, adminController.updateMenu);
router.delete("/menu/:id", auth, adminController.deleteMenu);
router.patch("/orders/:id", auth, adminController.updateOrderStatus);

module.exports = router;