const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.AI_MODEL || "gemini-2.5-flash";

let model = null;

function getModel() {
  if (!API_KEY) {
    throw new Error(
      "Gemini API key is not configured. Set GEMINI_API_KEY in the .env file."
    );
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
      throw new Error("Gemini returned an empty response");
    }

    return text;
  } catch (error) {
    const errMsg = error?.message || "";
    const errCode = error?.code || error?.status;

    if (errMsg.includes("API key") || errMsg.includes("not configured")) {
      console.error("Gemini API Key Error:", errMsg);
      throw new Error("AI service is not configured properly. Contact the site owner.");
    }

    if (errMsg.includes("SAFETY")) {
      console.error("Gemini Safety Error:", errMsg);
      throw new Error("The AI response was blocked by safety filters. Try rephrasing your question.");
    }

    if (errCode === 429 || errMsg.includes("429") || errMsg.includes("quota")) {
      console.error("Gemini Rate Limit Error:", errMsg);
      throw new Error("AI service is currently overloaded. Please try again later.");
    }

    if (errCode === 503 || errMsg.includes("503")) {
      console.error("Gemini Service Unavailable:", errMsg);
      throw new Error("AI service is temporarily unavailable. Please try again later.");
    }

    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI response");
  }
};

module.exports = {
  generateGeminiResponse,
};