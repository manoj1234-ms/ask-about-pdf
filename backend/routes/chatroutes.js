const express = require("express");

const { askQuestion } = require("../controllers/chatController");

const router = express.Router();

router.post("/", askQuestion);

module.exports = router;