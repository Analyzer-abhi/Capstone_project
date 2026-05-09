import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';

const genAI = config.geminiApiKey
  ? new GoogleGenerativeAI(config.geminiApiKey)
  : null;

export function getModel(name) {
  if (!genAI) throw new Error('GEMINI_API_KEY is not set');
  const modelName = name || config.geminiModel;
  console.log('Using Gemini model:', modelName);
  return genAI.getGenerativeModel({ model: modelName });
}

export async function generateContent(prompt, options = {}) {
  try {
    const model = getModel(options.model);

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {
    console.error('Gemini API Error:', error);

    if (error.message?.includes('429')) {
      throw new Error(
        'AI usage limit reached. Please wait a minute and try again.'
      );
    }

    throw error;
  }
}