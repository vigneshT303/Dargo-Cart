const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

// Fix order route - replace old nodemailer call
const old = `    // ── Send email via Nodemailer (fire-and-forget) ──\r\n    transporter.sendMail({\r\n      from: \`"Drago Cart" <\${process.env.CLIENT_EMAIL}>\`,\r\n      to: process.env.CLIENT_EMAIL,\r\n      subject: \`New Order [\${orderId}] from \${customerName} - Drago Cart\`,\r\n      text: emailBody\r\n    })\r\n      .then(info => console.log("✅ Order email sent:", info.response))\r\n      .catch(e  => console.error("❌ Order email error:", e.message));`;

const neu = `    // ── Send order email via Web3Forms (fire-and-forget) ──\r\n    sendMail(\r\n      \`New Order [\${orderId}] from \${customerName} - Drago Cart\`,\r\n      emailBody\r\n    )\r\n      .then(r => console.log("✅ Order email:", r.success ? "sent" : "failed", r.message || ""))\r\n      .catch(e => console.error("❌ Order email error:", e.message));`;

if (s.includes('transporter.sendMail')) {
    s = s.replace(/\/\/ ── Send email via Nodemailer \(fire-and-forget\) ──[\s\S]*?\.catch\(e\s*=>\s*console\.error\("❌ Order email error:", e\.message\)\);/, neu);
    console.log('✅ Order route fixed');
} else {
    console.log('already fixed or not found');
}

fs.writeFileSync('server.js', s, 'utf8');
console.log('saved');
