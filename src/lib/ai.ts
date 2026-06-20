import { createServerFn } from '@tanstack/react-start';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const getAIPersonalizedTip = createServerFn({ method: 'POST' })
  .validator((data: { profile: any; logs: any[] }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
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

Here is a user's carbon footprint data for the current period:
- Total footprint: ${stats.totalKg || 0} kg CO2
- Travel: ${stats.travelKg || 0} kg CO2
- Home Energy: ${stats.energyKg || 0} kg CO2
- Food: ${stats.foodKg || 0} kg CO2
- Shopping: ${stats.shoppingKg || 0} kg CO2
- User context: lives in ${profile.location || 'Unknown'}, household size ${profile.household_size || '1'}, primary commute is ${profile.commute_mode || 'Unknown'}, diet is ${profile.diet_type || 'Unknown'}.
- Previous suggestions given (avoid repeating these): ${previousSuggestions}

Task: Identify the single category contributing most to this user's footprint. Generate ONE specific, low-effort, achievable suggestion to reduce emissions in that category this week. 

Rules:
- Keep it under 35 words.
- Be specific and actionable (not generic advice like "drive less" — instead say something like "Swap one car commute for the bus this week to cut ~2kg CO2").
- Use an encouraging, non-judgmental tone — never guilt-trip.
- Do not invent or estimate new CO2 numbers beyond what's given; only reference the data provided.
- Return ONLY the suggestion text, no preamble, no markdown, no quotes.`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Oops, we couldn't load your personalized tip right now. Try swapping two short car trips for a walk or bike ride!";
    }
  });
