# 🖥️ Frontend Setup Guide

## 📌 Overview
The frontend is a lightweight React (Vite) app that connects to all backend microservices.

---

## 📁 Where to Create the Frontend

Create the frontend folder inside the **main project root**:
```
smart-canteen-system/        ← you should be here
├── services/
├── shared/
├── docs/
├── frontend/                ← created here
└── README.md
```

---

## 🚀 Setup Commands

### Step 1: Navigate to project root
```bash
cd smart-canteen-system
```

### Step 2: Create the Vite React app
```bash
npm create vite@latest frontend -- --template react
```

### Step 3: Navigate into frontend folder
```bash
cd frontend
```

### Step 4: Install base dependencies
```bash
npm install
```

### Step 5: Install required packages
```bash
npm install axios react-router-dom
```

### Step 6: Run the app
```bash
npm run dev
```

App runs at: `http://localhost:5173`

---

## 🧹 Clean Up Vite Boilerplate

After creating the app, remove the default files you don't need:
```
delete  → src/assets/
delete  → src/App.css
clear   → src/App.jsx      (replace with our own)
keep    → src/index.css    (global styles)
keep    → src/main.jsx     (entry point)
```

---

## 📁 File Structure
```
smart-canteen-system/
│
├── services/
│   ├── admin-service/
│   ├── api-gateway/
│   ├── menu-service/
│   ├── notification-service/
│   ├── order-service/
│   ├── user-service/
│   └── wallet-service/
│
├── shared/
├── docs/
├── frontend/                         ← create here
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Wallet.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminMenu.jsx
│   │   │       └── AdminOrders.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MenuCard.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── menuService.js
│   │   │   ├── orderService.js
│   │   │   ├── walletService.js
│   │   │   └── adminService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── config.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `frontend/` folder:
(use port numbers used in your local machine)
```
VITE_USER_SERVICE=http://localhost:5001
VITE_MENU_SERVICE=http://localhost:5002
VITE_ORDER_SERVICE=http://localhost:5000
VITE_WALLET_SERVICE=http://localhost:5004
VITE_ADMIN_SERVICE=http://localhost:5006
```

---

## 🔗 config.js

Create `src/config.js` to centralise all API URLs:
```javascript
export const API = {
  USER:   import.meta.env.VITE_USER_SERVICE,
  MENU:   import.meta.env.VITE_MENU_SERVICE,
  ORDER:  import.meta.env.VITE_ORDER_SERVICE,
  WALLET: import.meta.env.VITE_WALLET_SERVICE,
  ADMIN:  import.meta.env.VITE_ADMIN_SERVICE
}
```

If any service port changes, only update the `.env` file.

---

## 🔌 main.jsx

Entry point — wraps the app with AuthContext:
```jsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
```

---

## 🗺️ App.jsx

Defines all routes:
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Menu from "./pages/Menu"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import Wallet from "./pages/Wallet"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminMenu from "./pages/admin/AdminMenu"
import AdminOrders from "./pages/admin/AdminOrders"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

## 📄 Pages Overview

| Page | Path | Role |
|---|---|---|
| Login | `/login` | Student login |
| Register | `/register` | Student register |
| Menu | `/menu` | View menu, add to cart |
| Cart | `/cart` | Review cart, place order |
| Orders | `/orders` | View order history and status |
| Wallet | `/wallet` | View balance, add money |
| AdminLogin | `/admin/login` | Admin login |
| AdminMenu | `/admin/menu` | Create, update, delete menu items |
| AdminOrders | `/admin/orders` | Update order status |

---

## 🔒 Auth Flow
```
Student:
Register → Login → token stored → redirect to /menu

Admin:
Login → token stored → redirect to /admin/orders

From /admin/orders:
  → view all orders
  → update order status (PREPARING, READY, CANCELLED)

From /admin/menu:
  → view all menu items
  → create new menu item
  → edit existing menu item (update price, availability)
  → delete menu item
```

Token is stored in `localStorage` and managed via `AuthContext`.

---

## ⚠️ Important Notes

- Do NOT put the frontend inside the `services/` folder
- Always run `npm install` after cloning the repo
- Keep each component under 100 lines for easier debugging
- All API URLs must go through `config.js` only
- Token must be passed in `Authorization: Bearer <token>` header for all protected requests