import { config } from '../config.js';
import { generateContent } from './geminiClient.js';
import { scrapeGoogleSearch } from '../utils/scrapeDoClient.js';

/**
 * Agent 2: Search for current industry requirements for the target job
 * using Scrape.do to fetch Google search results, then Gemini to structure the requirements.
 */
export async function fetchJobRequirements(targetJobTitle) {
  const hasScrapeDo = !!config.scrapeDoToken;
  if (!hasScrapeDo) {
    return structureRequirementsWithGemini(targetJobTitle, '');
  }

  try {
    const query = `${targetJobTitle} job requirements skills 2024 2025`;
    const content = await scrapeGoogleSearch(query, { output: 'markdown' });
    return structureRequirementsWithGemini(targetJobTitle, content.slice(0, 15000));
  } catch (err) {
    return structureRequirementsWithGemini(targetJobTitle, '');
  }
}

async function structureRequirementsWithGemini(jobTitle, searchSnippets) {
  const prompt = `You are a career analyst. For the target job: "${jobTitle}".

${searchSnippets ? `Here is some current search data about this role:\n${searchSnippets}\n\n` : ''}
List the key skills and requirements typically needed for this role in 2024-2025. Be specific (technologies, frameworks, soft skills).

Return ONLY valid JSON (no markdown) with this structure:
{
  "requiredSkills": ["skill1", "skill2", ...],
  "niceToHave": ["skill1", "skill2", ...],
  "summary": "one paragraph summary of what the role demands"
}

JSON:`;

  const text = await generateContent(prompt);
  const cleaned = text.replace(/```json?\s*|\s*```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Failed to parse job requirements. Please try again.');
  }
}
