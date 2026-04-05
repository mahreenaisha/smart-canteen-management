const redis = require("redis");
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const client = redis.createClient({
  url: redisUrl
});

client.on("error", (err) => {
  console.log("Redis Error:", err);
});

client.connect()
  .then(() => console.log("Redis connected"))
  .catch(err => console.log(err));

module.exports = client;