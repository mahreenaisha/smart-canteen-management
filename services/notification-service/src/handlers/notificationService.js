const Notification = require("../models/Notification");

const handleNotification = async (data) => {
  const { event, orderId, email, studentId } = data;

  let message = "";
  let status = "";

  if (event === "ORDER_PLACED") {
    message = "Your order is confirmed";
    status = "PLACED";
  }

  if (event === "ORDER_READY") {
    message = "Your order is ready";
    status = "READY";
  }

  if (event === "ORDER_CANCELLED") {
    message = "Your order is cancelled";
    status = "CANCELLED";
  }

  try {
    console.log("About to save notification:", {
      orderId,
      studentId,
      email,
      message,
      status
    });

    const savedNotification = await Notification.create({
      orderId,
      studentId,
      email,
      message,
      status
    });

    console.log("Saved in DB:", savedNotification);
    console.log(`${message} (Order: ${orderId})`);
  } catch (error) {
    console.error("Failed to save notification:", error.message);
  }
};

module.exports = { handleNotification };
