require("dotenv").config();
const pdfService = require("./services/pdfService");

async function run() {
    try {
        console.log("Starting test...");
        await pdfService({ path: "dummy.pdf" });
        console.log("Success!");
    } catch (e) {
        console.error("Failed:", e);
    }
}
run();
