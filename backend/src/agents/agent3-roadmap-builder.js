import { config } from '../config.js';
import { generateContent } from './geminiClient.js';
import { scrapeGoogleSearch } from '../utils/scrapeDoClient.js';

/**
 * Agent 3: Compute skill gap and build a learning roadmap with real course links.
 * Uses Scrape.do to fetch Google search for each skill and extract first result link.
 */
export async function buildRoadmap({
  resumeSkills,
  jobRequirements,
  targetJobTitle,
}) {
  const gap = computeSkillGap(
    resumeSkills.skills || [],
    jobRequirements.requiredSkills || []
  );
  const allToLearn = [
    ...new Set([...(jobRequirements.niceToHave || []), ...gap]),
  ].slice(0, 15);

  let linksMap = {};
  if (config.scrapeDoToken && allToLearn.length > 0) {
    linksMap = await fetchCourseLinks(allToLearn);
  }

  const prompt = `You are a learning path designer. Create a week-by-week learning roadmap.

Target job: ${targetJobTitle}
Skills the candidate already has (from resume): ${(resumeSkills.skills || []).join(', ') || 'None listed'}
Skills they need to learn (gap): ${gap.join(', ')}

For each skill to learn, suggest an order that makes sense (foundations first, then advanced). Split into phases of about 2-4 weeks each. Be realistic for a B.Tech student (a few hours per day).

Return ONLY valid JSON (no markdown) with this structure:
{
  "phases": [
    {
      "title": "Phase 1: Foundations",
      "weeks": "1-2",
      "goals": ["Goal 1", "Goal 2"],
      "skills": ["skill1", "skill2"],
      "tips": "Brief study tips"
    }
  ],
  "summary": "One paragraph overall roadmap summary",
  "estimatedDuration": "e.g. 12-16 weeks"
}

JSON:`;

  const text = await generateContent(prompt);
  const cleaned = text.replace(/```json?\s*|\s*```/g, '').trim();
  let roadmap;
  try {
    roadmap = JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Failed to build roadmap. Please try again.');
  }

  roadmap.phases = (roadmap.phases || []).map((phase) => ({
    ...phase,
    skills: (phase.skills || []).map((skill) => ({
      name: skill,
      link: linksMap[skill] || null,
    })),
  }));

  return {
    skillGap: gap,
    jobSummary: jobRequirements.summary,
    roadmap,
    resumeSummary: {
      skills: resumeSkills.skills,
      experience: resumeSkills.experience,
      education: resumeSkills.education,
    },
  };
}

function computeSkillGap(have, required) {
  const haveSet = new Set(have.map((s) => s.toLowerCase().trim()));
  return (required || [])
    .map((s) => s.trim())
    .filter((s) => s && !haveSet.has(s.toLowerCase()));
}

/**
 * Use Scrape.do to scrape Google search for each skill and extract first organic result URL.
 */
async function fetchCourseLinks(skills) {
  const linksMap = {};

  for (const skill of skills.slice(0, 10)) {
    try {
      const query = `${skill} course tutorial learn free documentation`;
      const html = await scrapeGoogleSearch(query, { output: 'raw' });
      const link = extractFirstSearchResultUrl(html);
      if (link) linksMap[skill] = link;
    } catch (_) {
      // skip
    }
  }
  return linksMap;
}

/**
 * Parse Google search result HTML for the first organic result link (/url?q=...).
 */
function extractFirstSearchResultUrl(html) {
  const matches = html.match(/\/url\?q=([^&"']+)/g);
  if (!matches) return null;
  for (const m of matches) {
    const url = decodeURIComponent(m.replace(/^\/url\?q=/, ''));
    if (url.startsWith('http') && !url.includes('google.com')) return url;
  }
  return null;
}
