const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");
const {
  authMiddleware,
  requireAdmin
} = require("../middleware/authMiddleware");

// CREATE MENU ITEM
router.post("/", authMiddleware, requireAdmin, menuController.createMenu);

// GET ALL MENU ITEMS
router.get("/", menuController.getAllMenu);

// GET SINGLE MENU ITEM
router.get("/:id", menuController.getMenuById);

// UPDATE MENU ITEM
router.put("/:id", authMiddleware, requireAdmin, menuController.updateMenu);

// DELETE MENU ITEM
router.delete("/:id", authMiddleware, requireAdmin, menuController.deleteMenu);

module.exports = router;
