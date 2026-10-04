const fs = require("fs");
const path = require("path");

async function run() {
    const filePath = path.join(__dirname, "dummy.pdf");
    if (!fs.existsSync(filePath)) {
        console.error("dummy.pdf not found");
        return;
    }
    const fileStream = fs.createReadStream(filePath);
    
    const FormData = require('form-data'); // Ensure we use form-data or standard fetch
    const form = new FormData();
    form.append('file', fileStream);
    
    try {
        const res = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            body: form
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch(e) {
        console.error("Error:", e);
    }
}
run();
