import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const newsCache = new Map<string, { data: any; expiry: number }>();
const translationCache = new Map<string, { data: any; expiry: number }>();
let geminiCooldownUntil = 0;

export const translateForm = async (req: Request, res: Response) => {
  const { formData } = req.body;
  if (!formData) {
    return res.status(400).json({ error: "Missing formData in request body." });
  }

  const cacheKey = JSON.stringify(formData);
  const now = Date.now();
  const cached = translationCache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return res.json({ translated: cached.data });
  }

  if (now < geminiCooldownUntil) {
    return res.json({
      translated: formData,
      warning: "AI Translation is temporarily offline due to rate limits."
    });
  }

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.json({ translated: formData, warning: "GEMINI_API_KEY missing." });
    }

    const ai = new GoogleGenAI(geminiApiKey);
    const model = ai.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Translate all string values in this JSON to standard English. Keep keys unchanged. Return ONLY JSON.\n\nJSON:\n${JSON.stringify(formData)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translated = JSON.parse(response.text());

    translationCache.set(cacheKey, { data: translated, expiry: now + 600000 });
    res.json({ translated });
  } catch (error: any) {
    if (error.message?.includes('429')) geminiCooldownUntil = now + 300000;
    res.json({ translated: formData, warning: "Translation failed." });
  }
};

// ... Similar logic for sonarNews can be ported here
