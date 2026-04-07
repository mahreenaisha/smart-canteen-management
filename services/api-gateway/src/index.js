require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  createProxyMiddleware,
  fixRequestBody
} = require("http-proxy-middleware");

const app = express();

app.use(cors());

// USER AUTH + PROFILE SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: `${process.env.USER_SERVICE}/api/auth`,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody
    }
  })
);

app.use(
  "/api/users",
  createProxyMiddleware({
    target: `${process.env.USER_SERVICE}/api/users`,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody
    }
  })
);

// MENU SERVICE
app.use(
  "/api/menu",
  createProxyMiddleware({
    target: `${process.env.MENU_SERVICE}/api/menu`,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody
    }
  })
);

// ORDER SERVICE
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: `${process.env.ORDER_SERVICE}/api/orders`,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody
    }
  })
);

// WALLET SERVICE
app.use(
  "/api/wallet",
  createProxyMiddleware({
    target: `${process.env.WALLET_SERVICE}/api/wallet`,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody
    }
  })
);

// NOTIFICATION SERVICE
app.use(
  "/api/notifications",
  createProxyMiddleware({
    target: `${process.env.NOTIFICATION_SERVICE}/api/notifications`,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody
    }
  })
);

// ADMIN SERVICE
app.use(
  "/api/admin",
  createProxyMiddleware({
    target: `${process.env.ADMIN_SERVICE}/api/admin`,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody
    }
  })
);

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});
