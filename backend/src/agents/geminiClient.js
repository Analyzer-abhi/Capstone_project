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
   console.log("NEW GEMINI CLIENT DEPLOYED");
  try {

    const model = getModel(options.model);

    const result = await model.generateContent(prompt);

    const response = result.response;

    return response.text();

  } catch (error) {

    console.error('Gemini API Error:', error);

    if (
      error.message?.includes('429') ||
      error.toString().includes('429')
    ) {

      return `
AI service is temporarily busy due to free-tier limits.

Please wait about 1 minute and try again.
`;
    }

    return `
Failed to generate AI response.
Please try again later.
`;
  }
}