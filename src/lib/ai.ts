import { createServerFn } from '@tanstack/react-start';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateTip(data: { profile: any; stats: any; previous_suggestions?: string }, apiKey: string | undefined) {
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return "Tip: Add your Gemini API key in the .env file to get personalized AI suggestions!";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const profile = data.profile || {};
    const stats = data.stats || {};
    const previousSuggestions = data.previous_suggestions || "None";

    const prompt = `You are a friendly, encouraging sustainability coach inside a carbon footprint app called CarbonLens. 

Address the user by their name: ${profile.full_name ? profile.full_name.split(' ')[0] : 'there'}!
Listen to their carbon leaves and give them a very specific tip based on their personal data.

Here is a user's carbon footprint data for the current period:
- Total footprint: ${stats.totalKg || 0} kg CO2
- Travel: ${stats.travelKg || 0} kg CO2
- Home Energy: ${stats.energyKg || 0} kg CO2
- Food: ${stats.foodKg || 0} kg CO2
- Shopping: ${stats.shoppingKg || 0} kg CO2
- User context: lives in ${profile.location || 'Unknown'}, household size ${profile.household_size || '1'}, primary commute is ${profile.commute_mode || 'Unknown'}, diet is ${profile.diet_type || 'Unknown'}.
- Previous suggestions given: ${previousSuggestions}

Task: Identify the single category contributing most to this user's footprint. Generate ONE specific, low-effort, achievable suggestion to reduce emissions in that category this week. Explicitly mention their commute mode or diet if relevant to prove you are analyzing their personal data.

Rules:
- Keep it under 35 words.
- Be specific and actionable (not generic advice like "drive less" — instead say something like "Since you commute by Car, swap one car commute for the bus this week to cut ~2kg CO2").
- Use an encouraging, non-judgmental tone — never guilt-trip.
- Do not invent or estimate new CO2 numbers beyond what's given.
- Return ONLY the suggestion text, no preamble, no markdown, no quotes.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429")) {
      return "You're taking so much action, we've hit our AI quota! 😅 Please wait a minute before tuning your next tip.";
    }
    console.error("Gemini API Error:", error);
    return "Oops, we couldn't load your personalized tip right now. Try swapping two short car trips for a walk or bike ride!";
  }
}

/**
 * Server function to generate a personalized AI tip based on the user's footprint data.
 * It uses the Google Gemini API to analyze the highest emission category and suggest an actionable tip.
 *
 * @param data - Object containing user profile context, aggregated stats, and previous suggestions.
 * @returns A personalized sustainability suggestion string.
 */
export const getAIPersonalizedTip = createServerFn({ method: 'POST' })
  .validator((data: { profile: any; stats: any; previous_suggestions?: string }) => data)
  .handler(async ({ data }) => {
    return generateTip(data, process.env.GEMINI_API_KEY);
  });

export async function generateNews(apiKey: string | undefined) {
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate 2 recent, short, positive environmental news snippets or awareness campaigns. Format exactly as a JSON array of objects with keys: "category" (e.g. "Global Trends"), "title" (short title), "description" (max 2 sentences). No markdown fences, just raw JSON.`;
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json/g, "").replace(/\`\`\`$/g, "").trim();
    return JSON.parse(text);
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429")) {
      console.warn("AI News 429 Error: Quota exceeded");
      return null;
    }
    console.error("Gemini News Error:", error);
    return null;
  }
}

export const getAIEnvironmentalNews = createServerFn({ method: 'POST' })
  .handler(async () => {
    return generateNews(process.env.GEMINI_API_KEY);
  });
