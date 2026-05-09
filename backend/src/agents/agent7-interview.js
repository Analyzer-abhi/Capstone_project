//import { getModel } from './geminiClient.js';
import { generateContent } from './geminiClient.js';
/**
 * Agent 7: AI Interview Conductor
 */

export async function startInterviewAgent({ skills, experience, jobRole, userName }) {
  //const model = getModel();
  const prompt = `You are John, an experienced technical interviewer conducting an interview for the role of ${jobRole}.

Candidate Profile:
- Name: ${userName}
- Skills: ${skills.join(', ')}
- Experience: ${experience}

Your task is to start the interview with a warm greeting using the candidate's name and ask the first question. The interview should include:
1. A brief introduction addressing ${userName} by name
2. Questions should be based on their resume skills and the job role
3. Start with easier questions and gradually increase difficulty

Generate the opening message and first question. Be professional, friendly, and encouraging. Address the candidate as ${userName}.

Return ONLY the opening message and first question as plain text (no JSON).`;

  // const result = await model.generateContent(prompt);
  // const firstQuestion = result.response.text();
  const firstQuestion = await generateContent(prompt);
  return {
    firstQuestion,
    context: {
      skills,
      experience,
      jobRole,
      userName,
      questionCount: 1,
    },
  };
}

export async function continueInterviewAgent({ context, messages, jobRole }) {
  // const model = getModel();

  const conversationHistory = messages
    .map(m => `${m.role === 'user' ? context.userName : 'John'}: ${m.content}`)
    .join('\n\n');

  const questionCount = context.questionCount + 1;

  const prompt = `You are John conducting an interview for ${jobRole} with ${context.userName}.

Candidate Profile:
- Name: ${context.userName}
- Skills: ${context.skills.join(', ')}
- Experience: ${context.experience}

Conversation so far:
${conversationHistory}

Based on ${context.userName}'s previous answer, ask the next relevant question or provide feedback. Mix technical and behavioral questions. Be encouraging and professional. Address the candidate as ${context.userName}.

Return ONLY your response as plain text (no JSON).`;

  // const result = await model.generateContent(prompt);
  // const response = result.response.text();

  const response = await generateContent(prompt);

  return {
    response,
    shouldEnd: false, // Timer will handle ending
  };
}

export async function generateInterviewReport({ messages, jobRole, skills }) {
  // const model = getModel();

  const conversationHistory = messages
    .map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`)
    .join('\n\n');

  const prompt = `You are an expert interview evaluator. Analyze this interview for the ${jobRole} position.

Candidate Skills: ${skills.join(', ')}

Interview Transcript:
${conversationHistory}

Generate a comprehensive interview report with:
1. Overall Score (0-100)
2. Performance Level (e.g., "Excellent", "Good", "Needs Improvement")
3. Top 3-5 Strengths
4. Top 3-5 Areas for Improvement
5. Detailed Feedback (2-3 paragraphs)
6. 3-5 Specific Recommendations

Return ONLY valid JSON in this exact format:
{
  "overallScore": 85,
  "performanceLevel": "Good",
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "detailedFeedback": "detailed paragraph...",
  "recommendations": ["rec1", "rec2", ...]
}`;

  // const result = await model.generateContent(prompt);
  // const text = result.response.text();
  const text = await generateContent(prompt);

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Failed to parse report JSON:', err.message);
    // Return fallback report
    return {
      overallScore: 70,
      performanceLevel: 'Good',
      strengths: ['Demonstrated technical knowledge', 'Clear communication'],
      improvements: ['Provide more specific examples', 'Elaborate on technical details'],
      detailedFeedback: 'The candidate showed good understanding of the role requirements and communicated their experience effectively. There is room for improvement in providing more detailed technical explanations.',
      recommendations: ['Practice explaining technical concepts in detail', 'Prepare specific examples from past projects', 'Research common interview questions for this role'],
    };
  }
}
