import { GoogleGenAI } from "@google/genai";
import { TimeEntry, Project, Client } from "../types";

const getClient = () => {
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && process.env?.API_KEY);
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateInvoiceSummary = async (
  client: Client,
  project: Project,
  entries: TimeEntry[]
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable: Please check API Key.";

  const descriptions = entries
    .map((e) => `- ${e.description} (${new Date(e.startTime).toLocaleDateString()})`)
    .join("\n");

  const prompt = `
    You are a professional invoicing assistant. 
    I need a polite and professional invoice summary paragraph for my client "${client.name}" regarding the project "${project.name}".
    
    Here is the list of tasks completed:
    ${descriptions}
    
    Please write a cohesive summary paragraph (max 3 sentences) describing the work done to be included on the invoice. 
    Do not include markdown formatting. Keep it formal yet warm.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Summary generation failed.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Could not generate summary due to an error.";
  }
};

export const analyzeProductivity = async (entries: TimeEntry[]): Promise<string> => {
    const ai = getClient();
    if (!ai) return "AI Service Unavailable.";

    const dataPoints = entries.map(e => {
        const duration = e.endTime 
            ? (new Date(e.endTime).getTime() - new Date(e.startTime).getTime()) / (1000 * 60 * 60)
            : 0;
        return `Task: ${e.description}, Duration: ${duration.toFixed(2)} hours, Date: ${new Date(e.startTime).toLocaleDateString()}`;
    }).join('\n');

    const prompt = `
        Analyze the following freelance work logs:
        ${dataPoints}

        Provide a brief, encouraging insight about the user's productivity patterns or main focus areas. 
        Keep it under 50 words.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Analysis failed.";
    } catch (error) {
        return "Could not analyze data.";
    }
}
