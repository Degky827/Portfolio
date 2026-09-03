const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.AI_MODEL || "gemini-2.5-flash";

let model = null;

function getModel() {
  if (!API_KEY) {
    const err = new Error(
      "AI service is not configured. Set GEMINI_API_KEY in the .env file."
    );
    err.status = 503;
    err.userMessage = "AI assistant is not configured. Please contact the site owner.";
    throw err;
  }

  if (!API_KEY.startsWith("AIza") && !API_KEY.startsWith("AQ.")) {
    const err = new Error(
      `Invalid Gemini API key format. Expected key starting with "AIza" or "AQ.". Update GEMINI_API_KEY in .env.`
    );
    err.status = 503;
    err.userMessage = "AI assistant is temporarily unavailable due to a configuration issue. Please contact the site owner.";
    throw err;
  }

  if (!model) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: MODEL_NAME });
  }
  return model;
}

const generateGeminiResponse = async (prompt) => {
  const m = getModel();

  try {
    const result = await m.generateContent(prompt);
    const text = result.response.text();

    if (!text) {
      const err = new Error("Gemini returned an empty response");
      err.status = 502;
      err.userMessage = "The AI assistant returned an empty response. Please try again.";
      throw err;
    }

    return text;
  } catch (error) {
    if (error.status) throw error;

    const errMsg = error?.message || "";
    const errCode = error?.code || error?.status;

    if (errMsg.includes("API key") || errMsg.includes("not configured") || errMsg.includes("INVALID_ARGUMENT")) {
      console.error("Gemini API Key Error:", errMsg);
      const err = new Error("AI service authentication failed. The API key may be invalid or expired.");
      err.status = 503;
      err.userMessage = "AI assistant authentication failed. Please contact the site owner.";
      throw err;
    }

    if (errMsg.includes("SAFETY") || errMsg.includes("blocked")) {
      console.error("Gemini Safety Error:", errMsg);
      const err = new Error("The AI response was blocked by safety filters.");
      err.status = 422;
      err.userMessage = "The AI response was blocked by safety filters. Try rephrasing your question.";
      throw err;
    }

    if (errCode === 429 || errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      console.error("Gemini Rate Limit Error:", errMsg);
      const err = new Error("AI service rate limit exceeded.");
      err.status = 429;
      err.userMessage = "AI service is currently overloaded. Please try again later.";
      throw err;
    }

    if (errCode === 503 || errMsg.includes("503") || errMsg.includes("UNAVAILABLE")) {
      console.error("Gemini Service Unavailable:", errMsg);
      const err = new Error("AI service is temporarily unavailable.");
      err.status = 503;
      err.userMessage = "AI service is temporarily unavailable. Please try again later.";
      throw err;
    }

    console.error("Gemini API Error:", error);
    const err = new Error(`Gemini API error: ${errMsg || "unknown"}`);
    err.status = 502;
    err.userMessage = "AI assistant encountered an error. Please try again.";
    throw err;
  }
};

module.exports = {
  generateGeminiResponse,
};