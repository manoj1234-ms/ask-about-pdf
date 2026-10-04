const pdfService = require("../services/pdfService");

exports.uploadPdf = async (req, res) => {
    console.log("Upload endpoint hit! File:", req.file ? req.file.originalname : "None");
    try {
        if (!req.file) {
            console.error("No file uploaded!");
            return res.status(400).json({ error: "No file uploaded" });
        }
        await pdfService(req.file);
        res.json({ success: true });
    } catch (e) {
        console.error("Upload error:", e);
        res.status(500).json({ error: e.message, stack: e.stack });
    }
};