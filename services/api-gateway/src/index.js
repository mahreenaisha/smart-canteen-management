require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.json());

// MENU SERVICE
app.use(
  "/api/menu",
  createProxyMiddleware({
    target: process.env.MENU_SERVICE,
    changeOrigin: true
  })
);

// ORDER SERVICE
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE,
    changeOrigin: true
  })
);

// ADMIN SERVICE
app.use(
  "/api/admin",
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE,
    changeOrigin: true
  })
);

// AUTH (admin login)
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE,
    changeOrigin: true
  })
);

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});