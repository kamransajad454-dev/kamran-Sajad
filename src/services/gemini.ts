import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askGemini(prompt: string, isComplex: boolean = false) {
  const model = "gemini-3.1-pro-preview";
  
  const config: any = {
    systemInstruction: "You are Al-Qari AI, a knowledgeable and respectful assistant specialized in the Quran, Islamic history, and theology. Provide accurate information based on the Quran and authentic Hadith. Use a warm, scholarly, yet accessible tone. When users ask complex theological questions, provide nuanced answers. Always cite Surah and Ayah numbers when referencing the Quran.",
  };

  if (isComplex) {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "An error occurred while connecting to the AI. Please try again.";
  }
}
