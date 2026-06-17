const { z } = require("zod");

const chatSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .min(1, "Message cannot be empty")
    .max(
      Number(process.env.CHAT_MAX_MESSAGE_LENGTH) || 500,
      `Message cannot exceed ${Number(process.env.CHAT_MAX_MESSAGE_LENGTH) || 500} characters`
    ),
});

module.exports = {
  chatSchema,
};
