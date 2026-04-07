const Notification = require("../models/Notification");

class NotificationController {
  static async getMyNotifications(req, res) {
    try {
      const studentId = req.user?.studentId;

      if (!studentId) {
        return res.status(400).json({
          message: "Student ID missing from token"
        });
      }

      const notifications = await Notification.find({
        studentId
      }).sort({ createdAt: -1 });

      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to fetch notifications"
      });
    }
  }

  static async getNotifications(req, res) {
    try {
      const requestedStudentId = req.params.studentId;
      const isAdmin = req.user?.role === "admin";

      if (!isAdmin && req.user?.studentId !== requestedStudentId) {
        return res.status(403).json({
          message: "You can only view your own notifications"
        });
      }

      const notifications = await Notification.find({
        studentId: requestedStudentId
      }).sort({ createdAt: -1 });

      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to fetch notifications"
      });
    }
  }
}

module.exports = NotificationController;
