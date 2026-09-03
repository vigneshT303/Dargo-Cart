
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

// Adjust :root colors
html = html.replace(/--primary: #9d4edd;/, "--primary: #ff00ff; /* Vivid Magenta highlight */");
html = html.replace(/--primary-glow: rgba\(157, 78, 221, 0\.6\);/, "--primary-glow: rgba(255, 0, 255, 0.5); /* Magenta glow */");
html = html.replace(/--secondary: #e0aaff;/, "--secondary: #f4c2ff; /* Soft twilight pink */");

// Adjust Generic Buttons to sunset tones 
html = html.replace(/background: linear-gradient\(135deg, #7b2cbf, #9d4edd\) !important;/g, "background: linear-gradient(135deg, #700b97, #c100e6) !important;");
html = html.replace(/rgba\(123, 44, 191, 0\.3\)/g, "rgba(193, 0, 230, 0.4)");
html = html.replace(/rgba\(123, 44, 191, 0\.5\)/g, "rgba(193, 0, 230, 0.6)");

// Add position sticky to header
html = html.replace(/(\.custom-header\s*\{[\s\S]*?)(padding:\s*15px\s*0;)/, 
`$1position: sticky;
            top: 0;
            z-index: 1050;
            $2`);

fs.writeFileSync("index.html", html);
console.log("UI updated!");

