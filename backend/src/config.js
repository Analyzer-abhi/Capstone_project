import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Always load .env from the backend folder (so it works from any cwd)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 4000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  scrapeDoToken: process.env.SCRAPE_DO_TOKEN,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // Firebase: path to service account JSON file, or leave empty to use FIREBASE_SERVICE_ACCOUNT_JSON
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || null,
  // Firebase: raw JSON string of service account (alternative to path)
  firebaseServiceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || null,
};
