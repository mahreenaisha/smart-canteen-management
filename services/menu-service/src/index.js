require("dotenv").config();


require("./cache/redis");

const app = require("./app");

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Menu Service running on port ${PORT}`);
});
