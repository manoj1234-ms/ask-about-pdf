const express = require("express");
const multer = require("multer");
const { uploadPdf } = require("../controllers/uploadController");

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

router.post(
    "/",
    upload.single("file"),
    uploadPdf
);

module.exports = router;