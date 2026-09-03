
const fs = require("fs");

let css = `
/* -- Global Reset & Premium Dark Theme -- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
    --bg-dark: #07030d;
    --bg-gradient: radial-gradient(circle at top left, #1c0836, #07030d);
    --primary: #9d4edd;
    --primary-glow: rgba(157, 78, 221, 0.6);
    --secondary: #e0aaff;
    --glass-bg: rgba(25, 10, 40, 0.45);
    --glass-border: rgba(255, 255, 255, 0.08);
    --text-main: #f8f9fa;
    --text-muted: #adb5bd;
}

body {
    font-family: "Inter", Arial, sans-serif;
    min-height: 100vh;
    background: var(--bg-dark);
    background-image: var(--bg-gradient);
    background-attachment: fixed;
    color: var(--text-main);
    overflow-x: hidden;
}

/* -- Page Transitions -- */
.page:not(.active) { display: none !important; }
.page.active {
    display: block;
    animation: luxuriousFade 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}
@keyframes luxuriousFade {
    0% { opacity: 0; transform: scale(0.98) translateY(20px); filter: blur(4px); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}

/* -- Generic Glass Containers (Forms) -- */
.glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.glass-panel:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
}

/* Typography Enhancements */
h1, h2, h3, h4, h5 { font-family: "Inter", sans-serif; font-weight: 800; color: var(--secondary); letter-spacing: -0.5px; }

/* -- Generic Inputs -- */
input, textarea {
    width: 100%;
    padding: 14px;
    margin-bottom: 20px;
    background: rgba(0,0,0,0.2) !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-radius: 12px !important;
    color: var(--text-main) !important;
    font-size: 1rem;
    transition: all 0.3s ease;
}
input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.4); }
input:focus, textarea:focus {
    outline: none;
    background: rgba(0,0,0,0.4) !important;
    border-color: var(--primary) !important;
    box-shadow: 0 0 15px var(--primary-glow) !important;
}

/* -- Generic Buttons -- */
button, .btn {
    background: linear-gradient(135deg, #7b2cbf, #9d4edd) !important;
    border: none !important;
    color: white !important;
    padding: 12px 28px;
    font-weight: 700;
    border-radius: 12px !important;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1) !important;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 8px 20px rgba(123, 44, 191, 0.3);
}
button:hover, .btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 25px rgba(123, 44, 191, 0.5), 0 0 15px var(--primary-glow);
}
button:active, .btn:active { transform: translateY(1px); }

/* -- Registers & Logins -- */
#page-register, #page-login {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
.register-box, .login-box {
    width: 400px;
    max-width: 90%;
    padding: 40px;
    text-align: center;
    animation: none; /* override float */
}
.register-box h1, .login-box h1 {
    font-size: 2rem; margin-bottom: 30px; text-shadow: 0 0 20px rgba(157,78,221,0.5);
}
.switch-link { margin-top: 25px; color: var(--text-muted); font-size: 0.95rem; }
.switch-link a { color: var(--secondary); text-decoration: none; font-weight: 600; transition: color 0.3s; }
.switch-link a:hover { color: #fff; text-shadow: 0 0 10px var(--primary-glow); }

/* -- Header -- */
.custom-header {
    background: rgba(10, 3, 20, 0.8) !important;
    backdrop-filter: blur(15px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 15px 0;
    box-shadow: 0 5px 30px rgba(0,0,0,0.5);
}
.navbar-brand { font-size: 1.8rem; font-weight: 900; background: -webkit-linear-gradient(45deg, #e0aaff, #9d4edd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-link { color: var(--text-muted) !important; font-weight: 600; letter-spacing: 0.5px; transition: all 0.3s; }
.nav-link:hover { color: #fff !important; text-shadow: 0 0 12px var(--primary-glow); transform: translateY(-2px); }

/* -- Carousel -- */
.carousel-item img { border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.6); }

/* -- Products Grid -- */
#prod-section { padding: 40px 0; }
.card {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border) !important;
    border-radius: 20px !important;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}
.card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(157,78,221,0.2) !important;
    border-color: rgba(157,78,221,0.4) !important;
}
.card-img-top { height: 260px; object-fit: cover; border-bottom: 1px solid rgba(255,255,255,0.05); }
.card-title { color: #fff; font-size: 1.25rem; }
.card-body p { color: var(--text-muted); margin-bottom: 10px; }

/* -- Cart & Orders shared UI -- */
#cart, #orders { display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; margin: 40px 0; }
.cart-card, .order-card {
    width: 280px;
    padding: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    text-align: center;
    transition: all 0.3s ease;
}
.cart-card:hover, .order-card:hover {
    transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 0 0 1px var(--primary-glow);
}
.cart-card img, .order-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 16px; margin-bottom: 15px; }
.cart-card h5, .order-card h5 { color: #fff; margin-bottom: 5px; }
.cart-card span { font-size: 1.4rem; font-weight: bold; margin: 0 15px; color: #fff; }
.cart-card button { padding: 8px 16px; font-size: 1.2rem; min-width: 45px; }
#cart h1, #orders h1 { text-align: center; margin-top: 30px; color: #e0aaff; text-shadow: 0 0 15px rgba(157,78,221,0.5); }
#total { text-align: center; font-size: 2rem; color: #fff; margin: 30px 0; }
.place-btn, .back-btn { display: block; margin: 20px auto; width: 250px; text-align: center; }

/* -- Order Form -- */
.form-section, .contact-wrapper {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 25px;
    padding: 40px;
    max-width: 600px;
    margin: 40px auto;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    position: relative;
    overflow: hidden;
}
.form-section::before, .contact-wrapper::before {
    content: ""; position: absolute; top:0; left:0; width:100%; height:4px;
    background: linear-gradient(90deg, #7b2cbf, #ff00ff, #7b2cbf);
    background-size: 200% 100%;
    animation: animateBorder 3s linear infinite;
}
@keyframes animateBorder { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
.form-section label, .contact-wrapper label { color: var(--secondary); margin-bottom: 8px; font-weight: 600; display: block; }
.form-section h2 { text-align: center; margin-bottom: 30px; }

/* -- Contact Section -- */
.contact-wrapper { max-width: 700px; padding: 50px; }

/* -- Footer -- */
.custom-footer {
    background: #05010a;
    border-top: 1px solid rgba(255,255,255,0.1);
    color: var(--text-muted);
    padding: 30px 0;
    margin-top: 60px;
}

/* -- Toast Notifications -- */
#toast {
    position: fixed; bottom: 40px; right: 40px; padding: 20px 30px; border-radius: 16px;
    font-weight: 600; font-size: 1.1rem; color: white; opacity: 0; transform: translateY(30px) scale(0.9);
    transition: all 0.5s cubic-bezier(0.2, 1.5, 0.3, 1);
    z-index: 9999; pointer-events: none; max-width: 450px;
    box-shadow: 0 15px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
}
#toast.show { opacity: 1; transform: translateY(0) scale(1); }
#toast.success { background: rgba(46, 204, 113, 0.85); box-shadow: 0 10px 30px rgba(46, 204, 113, 0.4); }
#toast.error { background: rgba(231, 76, 60, 0.85); box-shadow: 0 10px 30px rgba(231, 76, 60, 0.4); }
#toast.sending { background: rgba(157, 78, 221, 0.85); box-shadow: 0 10px 30px rgba(157, 78, 221, 0.4); }

.spinner {
    display: inline-block; width: 18px; height: 18px;
    border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.8s bezier infinite; vertical-align: middle; margin-right: 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Helpers */
.msg-success { color: #2ecc71; margin-top: 15px; }
.msg-error { color: #e74c3c; margin-top: 15px; }
`;

let html = fs.readFileSync("index.html", "utf-8");
html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${css}\n    </style>`);

// Fix box classes to include glass-panel
html = html.replace(/class="register-box"/g, `class="register-box glass-panel"`);
html = html.replace(/class="login-box"/g, `class="login-box glass-panel"`);
fs.writeFileSync("index.html", html);
console.log("CSS completely modernized and updated in index.html!");

