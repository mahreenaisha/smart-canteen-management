require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectRabbitMQ } = require("../../../shared/rabbitmq");
const { startOrderConsumer } = require("./consumers/orderConsumer");
const { connectDB } = require("./config/db");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/notifications", notificationRoutes);
app.get("/", (req, res) => {
  res.send("Notification Service running");
});

const start = async () => {
  try {
    console.log("Starting Notification Service...");

    await connectDB();
    await connectRabbitMQ(); 
    await startOrderConsumer(); 

    const port = process.env.PORT || 5006;
    app.listen(port, () => {
      console.log(`Notification HTTP API running on ${port}`);
    });

    console.log("Notification Service running");
  } catch (err) {
    console.error("Startup error:", err);
  }
};

start();
