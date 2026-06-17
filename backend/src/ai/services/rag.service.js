const { generateGeminiResponse } = require("./gemini.service");
const { SYSTEM_PROMPT } = require("../prompts/system.prompt");

/**
 * Process user question using RAG architecture
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
const processRAGQuery = async (userMessage) => {
  try {
    // Temporary context
    // Later this will come from MongoDB Vector Search
    const context = `
    Portfolio information will be retrieved here from the database.
    This is a temporary placeholder.
    `;

    // Build the final prompt sent to Gemini
    const finalPrompt = `
${SYSTEM_PROMPT}

==============================
PORTFOLIO CONTEXT:
==============================

${context}


==============================
VISITOR QUESTION:
==============================

${userMessage}


==============================
AI ANSWER:
==============================
`;

    // Send to Gemini
    const answer = await generateGeminiResponse(finalPrompt);

    return answer;
  } catch (error) {
    console.error("RAG Service Error:", error);

    // Preserve the original error message for better debugging
    throw error;
  }
};

module.exports = {
  processRAGQuery,
};