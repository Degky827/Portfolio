const { z } = require("zod");

const MAX_MESSAGE_LENGTH = Number(
  process.env.CHAT_MAX_MESSAGE_LENGTH || 500
);

const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(
      MAX_MESSAGE_LENGTH,
      `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`
    ),
});

module.exports = {
  chatSchema,
};