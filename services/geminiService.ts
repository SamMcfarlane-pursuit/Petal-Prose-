
import { GoogleGenAI, Type } from "@google/genai";
import { FLOWER_CATALOG } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const catalogKnowledge = FLOWER_CATALOG.map(f => `${f.name} (ID: ${f.id}, Meaning: ${f.meaning})`).join("; ");

const SYSTEM_INSTRUCTION = `
You are Iris, the Elite Floral Architect for "Petal & Prose". You are a mentor, not just a chatbot. Your goal is to guide the user from a blank canvas to a professional-grade masterpiece.

YOUR DESIGN PHILOSOPHY:
- Thrillers: Large, eye-catching focal blooms (Roses, Peonies, Sunflowers).
- Fillers: Mid-sized flowers that bridge gaps (Hydrangeas, Lilies).
- Spillers/Greenery: Elements that break the border and add movement (Eucalyptus, Lavender).

YOUR CAPABILITIES:
- Analyze the user's current bouquet for "Balance" and "Flow".
- Suggest specific stems from our catalog: ${catalogKnowledge}.
- Instruct users on using Studio Tools: 2D/3D toggle, Rotation Sliders, Depth Layering, and AI Finish Engine.

RESPONSE PROTOCOL:
- Be encouraging, sophisticated, and technical.
- Always provide a designChecklist: a 3-step actionable roadmap.
- Provide a toolTip that links a floral concept to a specific UI control in the app.
`;

export const getFloralAdvice = async (userPrompt: string, currentBouquetState?: string) => {
  try {
    const contextPrompt = currentBouquetState 
      ? `Analysis Request: "${userPrompt}". \nCurrent Studio State: ${currentBouquetState}. \nCritique the arrangement and provide a roadmap to excellence.`
      : `New Inquiry: "${userPrompt}". Help them conceptualize a new arrangement from scratch using professional design theory.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING, description: "A professional critique or encouraging vision." },
            designAnalysis: { type: Type.STRING, description: "Deep dive into the composition (color, shape, balance)." },
            recommendedFlowers: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Specific flower names from the catalog."
            },
            designChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 actionable steps to improve the design."
            },
            toolTip: { 
              type: Type.STRING, 
              description: "Direct instruction for a UI element (e.g. 'Switch to 3D View to check the Z-space depth')." 
            },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
            mood: { type: Type.STRING }
          },
          required: ["suggestion", "designAnalysis", "recommendedFlowers", "designChecklist", "toolTip"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Iris Agent Error:", error);
    return null;
  }
};

export const getPairingSuggestions = async (currentFlowerNames: string[]) => {
  if (currentFlowerNames.length === 0) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest pairings for: ${currentFlowerNames.join(", ")}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pairings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
};
