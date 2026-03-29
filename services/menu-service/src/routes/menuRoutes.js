const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");

/* =========================
   CREATE MENU ITEM
========================= */
router.post("/", menuController.createMenu);

/* =========================
   GET ALL MENU ITEMS
========================= */
router.get("/", menuController.getAllMenu);

/* =========================
   GET SINGLE MENU ITEM
========================= */
router.get("/:id", menuController.getMenuById);

/* =========================
   UPDATE MENU ITEM
========================= */
router.put("/:id", menuController.updateMenu);

/* =========================
   DELETE MENU ITEM
========================= */
router.delete("/:id", menuController.deleteMenu);

module.exports = router;