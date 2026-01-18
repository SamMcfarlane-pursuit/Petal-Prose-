
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { FLOWER_CATALOG } from "../constants";

// Catalog context for the model
const catalogKnowledge = FLOWER_CATALOG.map(f => `${f.name} (ID: ${f.id}, Style: ${f.subCategory})`).join("; ");

const SYSTEM_INSTRUCTION = `
You are Iris, the Premier Concierge & Floral Architect for "Petal & Prose". You are an elite mentor for high-end floral design.

CORE PHILOSOPHY:
1. Proportion: Thrillers (focal), Fillers (volume), Spillers (movement).
2. Balance: Asymmetrical balance is often more elegant than perfect symmetry.
3. Palette: Guide users toward harmonious color stories (Monochromatic, Analogous, Complementary).

YOUR SPECIAL CAPABILITIES:
- If an image is provided, perform a Visual Audit: critique specific positioning, scale, and color clusters.
- Use technical terminology (Ikebana principles, Negative space, Focal points).
- Recommend exactly 2-4 items from our catalog for current needs: ${catalogKnowledge}.

RESPONSE FORMAT:
You MUST return a JSON object with:
- suggestion (string): High-level artisan vision.
- deepAnalysis (string): Technical breakdown of the composition.
- recommendedFlowerIds (string[]): Array of flower IDs from the catalog.
- designScore (number): 0-100 rating of current composition.
- nextStep (string): The single most important next action.
- toolTip (string): UI guidance.
`;

// Helper to get Iris's architectural response
export const getIrisResponse = async (userPrompt: string, studioState?: string, base64Image?: string) => {
  try {
    // Guidelines: Always create a new GoogleGenAI instance before calling an API.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [{ text: `User: ${userPrompt}\nStudio Configuration: ${studioState}` }];
    
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: base64Image.split(',')[1]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING },
            deepAnalysis: { type: Type.STRING },
            recommendedFlowerIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            designScore: { type: Type.NUMBER },
            nextStep: { type: Type.STRING },
            toolTip: { type: Type.STRING }
          },
          required: ["suggestion", "deepAnalysis", "recommendedFlowerIds", "designScore", "nextStep", "toolTip"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Iris Studio Error:", error);
    return null;
  }
};

// Helper to generate Iris's voice output
export const getIrisVoice = async (text: string) => {
  try {
    // Guidelines: Always create a new GoogleGenAI instance before calling an API.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak in a warm, sophisticated, encouraging professional tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Voice Generation Error:", error);
    return null;
  }
};

// Helper to get sophisticated color palette suggestions
export const getPaletteSuggestions = async (currentFlowerNames: string[]) => {
  try {
    // Guidelines: Always create a new GoogleGenAI instance before calling an API.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a color theory analysis for this bouquet: ${currentFlowerNames.join(", ")}. Suggest a harmonious palette, a ribbon hex, a wrap type, and a recommended studio background ambiance hex color.`,
      config: {
        systemInstruction: "You are Iris, the elite color theorist for Petal & Prose. Provide sophisticated, high-end color advice.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            palette: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 hex colors representing the palette." },
            ribbonColor: { type: Type.STRING, description: "Single hex color for the ribbon." },
            wrapType: { type: Type.STRING, enum: ["paper", "burlap", "silk", "jute", "organza", "none"] },
            backgroundHex: { type: Type.STRING, description: "A hex color for the studio background." },
            reasoning: { type: Type.STRING, description: "Artisan explanation of the palette." }
          },
          required: ["palette", "ribbonColor", "wrapType", "backgroundHex", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Palette Suggestion Error:", error);
    return null;
  }
};
