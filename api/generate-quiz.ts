// This is a Vercel Serverless Function
// It will live at your-site.com/api/generate-quiz

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Get the API key from *server-side* environment variables
  //    Note: It does NOT have VITE_ prefix.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured' });
  }

  try {
    // 3. Get the user's prompt from the request body
    const { userPrompt, systemPrompt } = req.body;

    if (!userPrompt || !systemPrompt) {
      return res.status(400).json({ error: 'Missing required prompts' });
    }

    // 4. Call the Gemini API securely from the server
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
    });

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const responseText = result.response.text();

    // 5. Send the AI's response back to the frontend
    res.status(200).json({ text: responseText });

  } catch (error: any) {
    console.error("Error in serverless function:", error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
}

