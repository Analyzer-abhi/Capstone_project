import { generateContent } from './geminiClient.js';

/**
 * Agent 1: Extract skills and experience from resume text.
 * Returns structured JSON: { skills: string[], experience: string, education: string }.
 */
export async function extractResumeSkills(resumeText) {
  const prompt = `You are a resume analyst. Extract structured information from the following resume text.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "skills": ["skill1", "skill2", ...],
  "experience": "brief summary of work experience",
  "education": "brief summary of education"
}

Resume text:
---
${resumeText.slice(0, 30000)}
---

JSON:`;

  const text = await generateContent(prompt);
  const cleaned = text.replace(/```json?\s*|\s*```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Failed to parse resume skills from AI response. Try a clearer resume (PDF or TXT).');
  }
}
