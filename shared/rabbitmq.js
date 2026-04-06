const amqp = require("amqplib");
const { QUEUE_NAME } = require("./constants");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true
    });

    console.log("RabbitMQ connected");
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ not initialized");
  }
  return channel;
};

module.exports = {
  connectRabbitMQ,
  getChannel
};