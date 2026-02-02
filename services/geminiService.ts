
import { GoogleGenAI, Type } from "@google/genai";
import { CustomerHistory } from "../types";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRiskInsight = async (history: CustomerHistory) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following customer delivery history for a merchant:
      Phone: ${history.phone}
      Success Deliveries: ${history.successCount}
      Returns: ${history.returnCount}
      Success Rate: ${history.successRate}%

      Provide a 1-sentence professional summary advice for the merchant.`,
    });
    // Access the text property directly from the response
    return response.text;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Unable to generate smart insight at this moment.";
  }
};
