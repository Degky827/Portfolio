const { z } = require("zod");

const chatSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .min(1, "Message cannot be empty")
    .max(
      Number(process.env.CHAT_MAX_MESSAGE_LENGTH) || 1000,
      `Message cannot exceed ${Number(process.env.CHAT_MAX_MESSAGE_LENGTH) || 1000} characters`
    ),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'model']),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .optional(),
});

module.exports = {
  chatSchema,
};
