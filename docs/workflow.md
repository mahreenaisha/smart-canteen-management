# 🔄 System Workflow

## Scenario

A student logs into the system and places a food order.

---

## Step 1: Login

- User sends login request
- User Service validates credentials
- JWT token is returned

---

## Step 2: View Menu

- Frontend calls Menu Service
- Menu Service checks Redis cache
- If not found → fetch from MongoDB
- Menu returned to frontend

---

## Step 3: Place Order

Frontend sends:

POST /orders

Order Service:
- validates menu items via Menu Service
- calculates total price

---

## Step 4: Payment Processing

Order Service calls Wallet Service:

POST /wallet/debit

Wallet Service:
- checks balance
- deducts amount using atomic operation

---

## Step 5: Order Creation

Order Service:
- saves order in database
- sets status = PLACED

---

## Step 6: Event Publishing

Order Service publishes:

ORDER_PLACED event via RabbitMQ

---

## Step 7: Notification

Notification Service:
- consumes event
- sends message to user

---

## Step 8: Order Status Update

Kitchen updates order:
- READY

Order Service publishes:

ORDER_READY event

---

## Step 9: Final Notification

User receives:
"Your order is ready for pickup"