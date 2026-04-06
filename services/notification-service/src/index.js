require("dotenv").config();

const { connectRabbitMQ } = require("../../../shared/rabbitmq");
const { startOrderConsumer } = require("./consumers/orderConsumer");
const { connectDB } = require("./config/db");

const start = async () => {
  try {
    console.log("Starting Notification Service...");

    await connectDB();
    await connectRabbitMQ(); 
    await startOrderConsumer(); 

    console.log("Notification Service running");
  } catch (err) {
    console.error("Startup error:", err);
  }
};

start();