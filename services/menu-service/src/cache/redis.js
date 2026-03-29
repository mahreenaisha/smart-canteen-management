const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379"
});

client.on("error", (err) => {
  console.log("Redis Error:", err);
});

client.connect()
  .then(() => console.log("Redis connected"))
  .catch(err => console.log(err));

module.exports = client;