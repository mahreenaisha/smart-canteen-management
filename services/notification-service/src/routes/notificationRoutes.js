const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const NotificationController = require("../controllers/notificationController");

const router = express.Router();

router.get("/me", authMiddleware, NotificationController.getMyNotifications);
router.get("/:studentId", authMiddleware, NotificationController.getNotifications);

module.exports = router;
