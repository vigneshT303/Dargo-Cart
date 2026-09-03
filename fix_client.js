
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

html = html.replace(/const payload = \{[\s\S]*?body: JSON\.stringify\(payload\)\s*\}\);/, `const payload = {
                name: document.getElementById("contactName").value,
                email: document.getElementById("contactEmail").value,
                phone: document.getElementById("contactPhone").value,
                message: document.getElementById("contactMessage").value
            };

            try {
                const backendUrl = window.location.protocol === "file:"
                    ? "http://localhost:3000/api/contact"
                    : (window.location.port && window.location.port !== "3000" ? \`http://\${window.location.hostname}:3000/api/contact\` : "/api/contact");

                const res = await fetch(backendUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                });`);

fs.writeFileSync("index.html", html);
console.log("Client updated!");

