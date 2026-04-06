const { getChannel } = require("../../../../shared/rabbitmq");
const { QUEUE_NAME } = require("../../../../shared/constants");
const { handleNotification } = require("../handlers/notificationService");

const startOrderConsumer = async () => {
  const channel = getChannel();

  console.log("Listening to queue...");

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    console.log("Event received:", data.event);

    await handleNotification(data);

    channel.ack(msg); 
  });
};

module.exports = { startOrderConsumer };