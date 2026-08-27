const express    = require("express");
const nodemailer = require("nodemailer");
const cors       = require("cors");
const path       = require("path");

const app  = express();
const PORT = 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));   // serve HTML files

// ── Gmail SMTP Transporter ──────────────────────────────────
// Use a Gmail App Password (not your real password).
// Steps to create one:
//   1. Go to https://myaccount.google.com/security
//   2. Enable "2-Step Verification"
//   3. Search "App passwords" → create one for "Mail"
//   4. Paste the 16-character password below (no spaces)

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vigneshvicky182005@gmail.com",   // sender Gmail address
    pass: "YOUR_APP_PASSWORD_HERE",          // ← 16-char Gmail App Password
  },
});

// ── POST /api/send-order ────────────────────────────────────
app.post("/api/send-order", async (req, res) => {
  const { customerName, orderId, contact, message, products, orderDate } = req.body;

  // Validate required fields
  if (!customerName || !orderId || !contact || !products) {
    return res.status(400).json({ success: false, error: "Missing required fields." });
  }

  // Build product table rows
  let grandTotal = 0;
  const productRows = products.map((p) => {
    const subtotal = p.cartQty * p.price;
    grandTotal += subtotal;
    return `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">
          <img src="${p.image}" alt="${p.name}" width="60" style="border-radius:6px;">
        </td>
        <td style="padding:8px;border:1px solid #ddd;">${p.name}</td>
        <td style="padding:8px;border:1px solid #ddd;">${p.color}</td>
        <td style="padding:8px;border:1px solid #ddd;">₹${p.price}</td>
        <td style="padding:8px;border:1px solid #ddd;">${p.cartQty}</td>
        <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">₹${subtotal}</td>
      </tr>`;
  }).join("");

  const htmlBody = `
  <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;border:2px solid #800080;border-radius:12px;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4a0080,#9932cc);padding:24px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:24px;">🛒 New Order Received</h1>
      <p style="color:#e8c8ff;margin:6px 0 0;">Drago Cart</p>
    </div>

    <!-- Customer Info -->
    <div style="padding:20px;background:#fdf4ff;">
      <h2 style="color:#4a0080;border-bottom:2px solid #dda0dd;padding-bottom:8px;">Customer Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px;width:160px;color:#555;font-weight:bold;">👤 Name</td><td style="padding:6px;">${customerName}</td></tr>
        <tr style="background:#f5e6ff;"><td style="padding:6px;font-weight:bold;">🆔 Order ID</td><td style="padding:6px;">${orderId}</td></tr>
        <tr><td style="padding:6px;font-weight:bold;">📞 Contact</td><td style="padding:6px;">${contact}</td></tr>
        <tr style="background:#f5e6ff;"><td style="padding:6px;font-weight:bold;">📅 Date</td><td style="padding:6px;">${orderDate}</td></tr>
        <tr><td style="padding:6px;font-weight:bold;">💬 Message</td><td style="padding:6px;">${message || "—"}</td></tr>
      </table>
    </div>

    <!-- Products Table -->
    <div style="padding:20px;background:#fff;">
      <h2 style="color:#4a0080;border-bottom:2px solid #dda0dd;padding-bottom:8px;">🛍️ Ordered Products</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#800080;color:white;">
            <th style="padding:10px;border:1px solid #ddd;">Image</th>
            <th style="padding:10px;border:1px solid #ddd;">Product</th>
            <th style="padding:10px;border:1px solid #ddd;">Color</th>
            <th style="padding:10px;border:1px solid #ddd;">Price</th>
            <th style="padding:10px;border:1px solid #ddd;">Qty</th>
            <th style="padding:10px;border:1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${productRows}</tbody>
        <tfoot>
          <tr style="background:#f5e6ff;">
            <td colspan="5" style="padding:10px;text-align:right;font-weight:bold;border:1px solid #ddd;">GRAND TOTAL</td>
            <td style="padding:10px;font-weight:bold;font-size:16px;color:#4a0080;border:1px solid #ddd;">₹${grandTotal}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#4a0080;padding:14px;text-align:center;">
      <p style="color:#e8c8ff;margin:0;font-size:13px;">This is an automated email from Drago Cart 🛒</p>
    </div>
  </div>`;

  const mailOptions = {
    from    : `"Drago Cart" <vigneshvicky182005@gmail.com>`,
    to      : "vigneshvicky182005@gmail.com",
    subject : `🛒 New Order [${orderId}] from ${customerName}`,
    html    : htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Order email sent successfully!" });
  } catch (err) {
    console.error("Mail error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Drago Cart server running at http://localhost:${PORT}`);
  console.log(`   Open: http://localhost:${PORT}/product.html`);
});
