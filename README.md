# 🛒 Drago Cart — MERN E-Commerce App

A full-stack e-commerce single-page application built with **Node.js + Express + MongoDB + Vanilla HTML/CSS/JS**.

---

## ✨ Features

- 🔐 Register & Login (localStorage auth)
- 🛍️ Product listing loaded from `product.json`
- 🛒 Cart — Add, Remove, Increase/Decrease quantity (stored in **MongoDB**)
- 📦 Orders — Review cart, fill details, place order (saved to **MongoDB**)
- 📧 Email notification on every order via **Web3Forms API**
- 🎠 Image carousel & responsive Bootstrap layout

---

## 🗂️ Project Structure

```
project/
├── index.html        # Single-page app (all pages in one file)
├── server.js         # Express + Mongoose backend
├── product.json      # Product / carousel / header data
├── assets/           # Images
├── package.json
└── .gitignore
```

---

## 🚀 Getting Started (Local)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/vigneshT303/Ecommerce.git
cd Ecommerce

# 2. Install dependencies
npm install

# 3. Start MongoDB (if not already running)
mongod

# 4. Start the server
node server.js

# 5. Open in browser
# http://localhost:3000/index.html
```

---

## 🗄️ MongoDB Collections

| Collection | Purpose |
|---|---|
| `carts` | Stores active cart items (one doc per product) |
| `orders` | Stores placed orders with customer details & products |

---

## 🌐 API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/cart` | Get all cart items |
| `POST` | `/api/cart` | Add product / increment qty |
| `PUT` | `/api/cart/:productId` | Update item quantity |
| `DELETE` | `/api/cart/:productId` | Remove item from cart |
| `GET` | `/api/orders` | Get all placed orders |
| `POST` | `/api/orders` | Place order (saves to DB + email) |

---

## 📬 Email Notifications

Order confirmation emails are sent via [Web3Forms](https://web3forms.com/) — no SMTP setup required.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Email**: Web3Forms API

---

## 📄 License

MIT © [vigneshT303](https://github.com/vigneshT303)
