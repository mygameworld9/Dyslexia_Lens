import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ModelType } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeDocument = async (
  file: File, 
  model: ModelType
): Promise<string> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = await fileToGenerativePart(file);

  const prompt = `
    You are an expert assistive technology assistant for people with dyslexia. 
    Please analyze the image provided, which is a document.
    
    Perform the following tasks:
    1. Extract the text from the image accurately (OCR).
    2. Rewrite the text to be "Dyslexia Friendly". This means:
       - Use simple, direct language.
       - Break long sentences into shorter ones.
       - Use bullet points for lists or sequences.
       - Avoid passive voice.
       - Highlight the most important information.
    3. Return the result in Markdown format. Use headers, bold text, and bullet points to structure the content clearly.
    
    If the image does not appear to contain text, kindly inform the user.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        // We use a bit of thinking budget for Pro model to ensure high quality rewriting
        thinkingConfig: model === ModelType.PRO ? { thinkingBudget: 1024 } : undefined,
      }
    });

    return response.text || "Could not generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process the document. Please try again.");
  }
};
