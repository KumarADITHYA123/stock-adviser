import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI directly in frontend
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const generateDebateResponse = async (question: string): Promise<string> => {
  try {
    // Check if API key is available
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
You are a stock AI coach. The user will argue with you about whether to buy/sell a stock.
Your style:
- Challenge them with 2-3 logical reasons.
- If their argument is strong, concede and say "You might be right, here's a safer approach."
- Keep responses concise (2-3 sentences max).
- Be conversational and slightly confrontational but helpful.
`;

    const result = await model.generateContent([prompt, question]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating debate response:', error);
    return "I'm having trouble processing your question right now. Please try again.";
  }
};
