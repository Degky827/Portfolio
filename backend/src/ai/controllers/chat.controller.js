const { chatSchema } = require("../validations/chat.validation");
const { processRAGQuery } = require("../services/rag.service");

const chatController = async (req, res) => {
  try {
    // Validate request body
    const validation = chatSchema.safeParse(req.body);

    if (!validation.success) {
      const issues = validation.error.issues || validation.error.errors || [];
      return res.status(400).json({
        success: false,
        message: issues[0]?.message || "Invalid request",
      });
    }

    // Get validated user message
    const { message } = validation.data;

    // Send question to RAG system
    const answer = await processRAGQuery(message);

    // Send AI response
    return res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);

    const status = error.status || error.statusCode || 500;
    const message =
      error.userMessage ||
      error.message ||
      "Failed to process AI request";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

module.exports = {
  chatController,
};