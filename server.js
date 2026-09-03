require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/orders";

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));   // serve index.html + assets

// ── MongoDB Connection ──────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected →", MONGO_URI))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ── Nodemailer Transporter (Gmail App Password from .env) ───
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CLIENT_EMAIL,
    pass: process.env.CLIENT_PASSWORD
  }
});

transporter.verify((err) => {
  if (err) console.error("❌ Mail transporter error:", err.message);
  else console.log("✅ Mail transporter ready →", process.env.CLIENT_EMAIL);
});

// ── Schemas & Models ───────────────────────────────────────

// Cart item
const cartSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  name: String,
  color: String,
  price: Number,
  image: String,
  cartQty: { type: Number, default: 1 }
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

// Order (entire checkout event)
const orderSchema = new mongoose.Schema({
  customerName: String,
  orderId: String,
  contact: String,
  message: String,
  orderDate: String,
  products: [
    {
      productId: Number,
      name: String,
      color: String,
      price: Number,
      image: String,
      cartQty: Number
    }
  ],
  grandTotal: Number
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

// ═══════════════════════════════════════════════════════════
//  CART  ROUTES
// ═══════════════════════════════════════════════════════════

// GET  /api/cart  → all cart items
app.get("/api/cart", async (req, res) => {
  try {
    const items = await Cart.find().sort({ createdAt: 1 });
    res.json({ success: true, cart: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cart  → add product or increment qty
app.post("/api/cart", async (req, res) => {
  try {
    const { id, name, color, price, image } = req.body;

    if (!id) return res.status(400).json({ success: false, error: "Product id required." });

    let item = await Cart.findOne({ productId: id });
    if (item) {
      item.cartQty += 1;
      await item.save();
      return res.json({ success: true, message: "Quantity updated", cart: item });
    }

    item = await Cart.create({ productId: id, name, color, price, image, cartQty: 1 });
    res.status(201).json({ success: true, message: "Added to cart", cart: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT  /api/cart/:productId  → set exact qty
app.put("/api/cart/:productId", async (req, res) => {
  try {
    const { qty } = req.body;
    if (!qty || qty < 1) return res.status(400).json({ success: false, error: "qty must be >= 1" });

    const item = await Cart.findOneAndUpdate(
      { productId: req.params.productId },
      { cartQty: qty },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, error: "Cart item not found." });
    res.json({ success: true, cart: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/cart/:productId  → remove one item
app.delete("/api/cart/:productId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ productId: req.params.productId });
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/cart  → clear entire cart
app.delete("/api/cart", async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
//  ORDERS  ROUTES
// ═══════════════════════════════════════════════════════════

// GET  /api/orders  → all past orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders  → place order + send email + clear cart
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, orderId, contact, message, products, orderDate } = req.body;

    if (!customerName || !orderId || !contact || !products || !products.length) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    let grandTotal = 0;
    products.forEach(p => { grandTotal += p.cartQty * p.price; });

    // Save order to MongoDB
    const order = await Order.create({
      customerName, orderId, contact,
      message: message || "",
      orderDate,
      products,
      grandTotal
    });

    // Clear the cart collection
    await Cart.deleteMany({});

    // ── Build email body ──
    const lines = products.map(p => {
      const sub = p.cartQty * p.price;
      return `- ${p.name} | Color: ${p.color} | Price: Rs.${p.price} | Qty: ${p.cartQty} | Subtotal: Rs.${sub}`;
    });
    lines.push(`\nGRAND TOTAL: Rs.${grandTotal}`);

    const emailBody =
      "ORDER DETAILS\n====================\n" +
      `Customer Name : ${customerName}\n` +
      `Order ID      : ${orderId}\n` +
      `Contact No    : ${contact}\n` +
      `Order Date    : ${orderDate}\n` +
      `Message       : ${message || "None"}\n\n` +
      "PRODUCTS ORDERED\n====================\n" +
      lines.join("\n");

    // ── Send email via Nodemailer (fire-and-forget) ──
    transporter.sendMail({
      from: `"Drago Cart" <${process.env.CLIENT_EMAIL}>`,
      to: process.env.CLIENT_EMAIL,
      subject: `New Order [${orderId}] from ${customerName} - Drago Cart`,
      text: emailBody
    })
      .then(info => console.log("✅ Order email sent:", info.response))
      .catch(e => console.error("❌ Order email error:", e.message));

    res.status(201).json({ success: true, message: "Order placed!", order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/contact  → Send contact form message via email
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    await transporter.sendMail({
      from: `"Drago Cart" <${process.env.CLIENT_EMAIL}>`,
      to: process.env.CLIENT_EMAIL,
      subject: `New Contact Inquiry from ${name}`,
      text: `You have received a new contact message:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\nMessage:\n${message}`,
      replyTo: email
    });

    res.status(200).json({ success: true, message: "Message sent!" });
  } catch (err) {
    console.error("Contact route error:", err.message);
    res.status(500).json({ success: false, error: "Failed to send email: " + err.message });
  }
});

// ── SPA Fallback (Clean URLs) ─────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Drago Cart server running at http://localhost:${PORT}`);
  console.log(`   Open: http://localhost:${PORT}/register`);
});
