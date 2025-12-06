import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ModelType, SchemaResponse } from "../types";

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
): Promise<SchemaResponse> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = await fileToGenerativePart(file);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      metadata: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "The type of document, e.g., Invoice, Letter, Menu, Sign." },
          tone: { type: Type.STRING, enum: ["urgent", "informative", "calm", "positive"], description: "The overall feeling or urgency of the document." },
          summary: { type: Type.STRING, description: "A simple, one-sentence summary of what this document is about, written for a 5th grader." },
        },
        required: ["type", "tone", "summary"],
      },
      widgets: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "Unique ID for the widget." },
            type: { type: Type.STRING, enum: ["action", "info", "alert", "nav", "list"], description: "The category of information." },
            content: { type: Type.STRING, description: "The simplified content value. Remove jargon." },
            label: { type: Type.STRING, description: "A short label for the content, if applicable (e.g. 'Due Date')." },
            highlight: { type: Type.BOOLEAN, description: "True if this is very important information." },
          },
          required: ["id", "type", "content"],
        },
        description: "A list of extracted information chunks, prioritized by importance."
      },
    },
    required: ["metadata", "widgets"],
  };

  const prompt = `
    You are an expert accessibility assistant for people with dyslexia. 
    Analyze the image provided.
    
    Your goal is to "untangle" the document:
    1. Identify what it is (Metadata).
    2. Extract the critical information into "widgets".
    
    Widget Types:
    - 'alert': Deadlines, warnings, or penalties. High priority.
    - 'action': Things the user must DO (e.g., "Pay $50", "Call this number", "Sign here").
    - 'info': Key facts (Dates, Names, Amounts, Addresses).
    - 'list': List items or steps.
    - 'nav': Navigation elements if it's a sign or directory.

    Guidelines:
    - REWRITE text to be simple, direct, and active voice.
    - REMOVE decorative text, legal boilerplate, and corporate jargon.
    - FOCUS on what matters to the user.
    - If there is no text, return a 'calm' tone and explain in the summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        // We use a bit of thinking budget for Pro model to ensure high quality extraction
        thinkingConfig: model === ModelType.PRO ? { thinkingBudget: 1024 } : undefined,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");

    return JSON.parse(text) as SchemaResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process the document. Please try again.");
  }
};
