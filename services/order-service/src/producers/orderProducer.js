const { getChannel } = require("../../../../shared/rabbitmq");
const { QUEUE_NAME } = require("../../../../shared/constants");

const publishEvent = async (eventData) => {
  try {
    const channel = getChannel();

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(eventData))
    );

    console.log("Event published:", eventData.event);
  } catch (error) {
    console.error("Error publishing event:", error);
  }
};

module.exports = { publishEvent };