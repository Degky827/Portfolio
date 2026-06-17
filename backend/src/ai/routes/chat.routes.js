const express = require("express");
const rateLimit = require("express-rate-limit");

const { chatController } = require("../controllers/chat.controller");

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: Number(process.env.CHAT_REQUEST_LIMIT || 30),

  message: {
    success: false,
    message: "Too many AI requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/chat",
  chatLimiter,
  chatController
);

module.exports = router;