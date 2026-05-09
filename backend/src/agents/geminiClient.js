import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';

/*
  Dynamically collect all Gemini API keys from env:
  GEMINI_API_KEY_1
  GEMINI_API_KEY_2
  GEMINI_API_KEY_3
  ...
*/

const API_KEYS = Object.keys(process.env)
  .filter((key) =>
    key === 'GEMINI_API_KEY' ||
    key.startsWith('GEMINI_API_KEY_'))
  .sort()
  .map((key) => process.env[key])
  .filter(Boolean);

if (API_KEYS.length === 0) {
  throw new Error('No Gemini API keys found');
}

const MODEL_NAME =
  config.geminiModel || 'gemini-2.5-flash';

/*
  Active key index persists in memory
*/
let activeKeyIndex = 0;

function getCurrentModel() {

  const apiKey = API_KEYS[activeKeyIndex];

  const genAI = new GoogleGenerativeAI(apiKey);

  console.log(
    `Using Gemini Key #${activeKeyIndex + 1}`
  );

  return genAI.getGenerativeModel({
    model: MODEL_NAME,
  });
}

function switchToNextKey() {

  activeKeyIndex =
    (activeKeyIndex + 1) % API_KEYS.length;

  console.log(
    `Switched to Gemini Key #${activeKeyIndex + 1}`
  );
}

export async function generateContent(
  prompt,
  options = {}
) {

  let attempts = 0;

  while (attempts < API_KEYS.length) {

    try {

      const model = getCurrentModel();

      const result =
        await model.generateContent(prompt);

      const response = result.response;

      return response.text();

    } catch (error) {

      console.error(
        'Gemini API Error:',
        error.message
      );

      /*
        Quota exhausted -> switch key
      */
      if (
        error.message?.includes('429') ||
        error.toString().includes('429')
      ) {

        attempts++;

        switchToNextKey();

        continue;
      }

      /*
        Non-quota error
      */
      return `
AI response generation failed.

Please try again later.
`;
    }
  }

  return `
All AI API keys are currently exhausted.

Please try again later.
`;
}