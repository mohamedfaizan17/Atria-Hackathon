const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Resume Scorer AI initialized');
  } catch (error) {
    console.warn('⚠️  Resume Scorer AI unavailable');
  }
}

// Score resume against job description
router.post('/score', async (req, res) => {
  try {
    const { 
      resumeText, 
      jobDescription, 
      candidateName,
      yearsOfExperience,
      skills 
    } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Resume text and job description are required'
      });
    }

    let atsScore = 0;
    let skillsMatch = 0;
    let experienceMatch = 0;
    let keywordsFound = [];
    let missingKeywords = [];
    let strengths = [];
    let improvements = [];
    let analysis = '';

    if (genAI) {
      try {
        console.log('🤖 Starting AI resume analysis...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume against the job description and provide detailed scoring.

JOB DESCRIPTION:
${jobDescription}

RESUME/CANDIDATE PROFILE:
${resumeText}
${candidateName ? `\nCandidate Name: ${candidateName}` : ''}
${yearsOfExperience ? `\nYears of Experience: ${yearsOfExperience}` : ''}
${skills ? `\nSkills Listed: ${skills}` : ''}

ANALYSIS REQUIREMENTS:
Evaluate the resume comprehensively and provide:

1. ATS Score (0-100): Overall resume quality and job match
   - Keyword optimization
   - Formatting and structure
   - Content relevance
   - Achievement quantification
   - Professional summary quality

2. Skills Match (0-100): Technical and soft skills alignment
   - Required skills present
   - Experience depth with each skill
   - Transferable skills
   - Technology stack match

3. Experience Match (0-100): Experience level and relevance
   - Years of experience alignment
   - Role similarity
   - Industry experience
   - Career progression
   - Project complexity

4. Keywords Found: List of important keywords from job description found in resume

5. Missing Keywords: List of important keywords from job description NOT found in resume

6. Strengths: Top 3-5 strong points of this resume

7. Improvements: Top 3-5 actionable suggestions to improve the resume

Provide your analysis in this exact JSON format:
{
  "atsScore": <number 0-100>,
  "skillsMatch": <number 0-100>,
  "experienceMatch": <number 0-100>,
  "keywordsFound": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "analysis": "<2-3 sentence overall summary>"
}

Be thorough, specific, and actionable in your feedback.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('📊 AI Analysis complete, parsing...');

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiResults = JSON.parse(jsonMatch[0]);
          
          atsScore = Math.round(aiResults.atsScore || 0);
          skillsMatch = Math.round(aiResults.skillsMatch || 0);
          experienceMatch = Math.round(aiResults.experienceMatch || 0);
          keywordsFound = aiResults.keywordsFound || [];
          missingKeywords = aiResults.missingKeywords || [];
          strengths = aiResults.strengths || [];
          improvements = aiResults.improvements || [];
          analysis = aiResults.analysis || '';

          console.log(`✅ AI Scoring: ATS ${atsScore}/100, Skills ${skillsMatch}/100, Experience ${experienceMatch}/100`);
        } else {
          throw new Error('Could not parse AI response');
        }
      } catch (aiError) {
        console.error('❌ AI analysis error:', aiError.message);
        console.log('⚠️  Falling back to rule-based scoring...');
        
        // Fallback to rule-based scoring
        const ruleBasedScore = calculateRuleBasedScore(resumeText, jobDescription, yearsOfExperience);
        atsScore = ruleBasedScore.atsScore;
        skillsMatch = ruleBasedScore.skillsMatch;
        experienceMatch = ruleBasedScore.experienceMatch;
        keywordsFound = ruleBasedScore.keywordsFound;
        missingKeywords = ruleBasedScore.missingKeywords;
        strengths = ruleBasedScore.strengths;
        improvements = ruleBasedScore.improvements;
      }
    } else {
      console.log('ℹ️  AI not configured, using rule-based scoring');
      
      // Rule-based scoring
      const ruleBasedScore = calculateRuleBasedScore(resumeText, jobDescription, yearsOfExperience);
      atsScore = ruleBasedScore.atsScore;
      skillsMatch = ruleBasedScore.skillsMatch;
      experienceMatch = ruleBasedScore.experienceMatch;
      keywordsFound = ruleBasedScore.keywordsFound;
      missingKeywords = ruleBasedScore.missingKeywords;
      strengths = ruleBasedScore.strengths;
      improvements = ruleBasedScore.improvements;
    }

    // Ensure scores are within bounds
    atsScore = Math.min(100, Math.max(0, atsScore));
    skillsMatch = Math.min(100, Math.max(0, skillsMatch));
    experienceMatch = Math.min(100, Math.max(0, experienceMatch));

    res.json({
      success: true,
      data: {
        atsScore,
        skillsMatch,
        experienceMatch,
        keywordsFound: keywordsFound.slice(0, 10), // Limit to top 10
        missingKeywords: missingKeywords.slice(0, 10),
        strengths: strengths.slice(0, 5),
        improvements: improvements.slice(0, 5),
        analysis
      }
    });
  } catch (error) {
    console.error('❌ Resume scoring error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze resume',
      message: error.message
    });
  }
});

// Rule-based scoring function
function calculateRuleBasedScore(resumeText, jobDescription, yearsOfExperience) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  let atsScore = 0;
  let skillsMatch = 0;
  let experienceMatch = 0;
  
  // Extract keywords from job description
  const commonTechKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
    'typescript', 'mongodb', 'sql', 'postgresql', 'mysql', 'aws', 'azure',
    'docker', 'kubernetes', 'git', 'api', 'rest', 'graphql', 'html', 'css',
    'frontend', 'backend', 'fullstack', 'devops', 'agile', 'scrum',
    'testing', 'ci/cd', 'microservices', 'cloud', 'linux', 'redis'
  ];
  
  const keywordsFound = [];
  const missingKeywords = [];
  
  // Check which keywords are in both job and resume
  commonTechKeywords.forEach(keyword => {
    if (jobLower.includes(keyword)) {
      if (resumeLower.includes(keyword)) {
        keywordsFound.push(keyword);
        skillsMatch += 3; // 3 points per matched keyword
      } else {
        missingKeywords.push(keyword);
      }
    }
  });
  
  // ATS Score calculation
  // Resume length (optimal 400-1000 words)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount >= 400 && wordCount <= 1000) atsScore += 20;
  else if (wordCount >= 200) atsScore += 10;
  
  // Keyword density
  atsScore += Math.min(30, keywordsFound.length * 3);
  
  // Structure indicators
  if (resumeLower.includes('experience') || resumeLower.includes('work history')) atsScore += 10;
  if (resumeLower.includes('education')) atsScore += 10;
  if (resumeLower.includes('skills')) atsScore += 10;
  if (resumeLower.includes('project') || resumeLower.includes('achievement')) atsScore += 10;
  
  // Professional formatting indicators
  if (resumeText.includes('@')) atsScore += 5; // Email present
  if (resumeText.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) atsScore += 5; // Phone number
  
  // Skills Match calculation
  skillsMatch = Math.min(100, skillsMatch);
  if (skillsMatch < 30 && keywordsFound.length > 0) skillsMatch = 30; // Minimum base
  if (resumeLower.includes('github') || resumeLower.includes('portfolio')) skillsMatch += 10;
  if (resumeLower.includes('certification') || resumeLower.includes('certified')) skillsMatch += 10;
  
  // Experience Match calculation
  if (yearsOfExperience) {
    const years = parseInt(yearsOfExperience);
    experienceMatch = 40;
    if (years >= 10) experienceMatch += 40;
    else if (years >= 7) experienceMatch += 35;
    else if (years >= 5) experienceMatch += 30;
    else if (years >= 3) experienceMatch += 25;
    else if (years >= 1) experienceMatch += 20;
    else experienceMatch += 10;
    
    if (resumeLower.includes('senior') || resumeLower.includes('lead')) experienceMatch += 10;
    if (resumeLower.includes('manager') || resumeLower.includes('director')) experienceMatch += 10;
  } else {
    experienceMatch = 50; // Neutral score if experience not specified
  }
  
  // Generate strengths and improvements
  const strengths = [];
  const improvements = [];
  
  if (keywordsFound.length > 5) strengths.push('Strong keyword optimization with relevant technical skills');
  if (wordCount >= 400) strengths.push('Well-detailed resume with comprehensive information');
  if (resumeLower.includes('achievement') || resumeLower.includes('accomplished')) {
    strengths.push('Includes achievements and accomplishments');
  }
  
  if (missingKeywords.length > 3) {
    improvements.push(`Add missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  if (wordCount < 300) improvements.push('Expand resume with more detailed experience and achievements');
  if (!resumeLower.includes('quantif') && !resumeText.match(/\d+%/)) {
    improvements.push('Include quantifiable achievements with numbers and percentages');
  }
  if (!resumeLower.includes('project')) {
    improvements.push('Add relevant projects to showcase practical experience');
  }
  
  // Default messages if arrays are empty
  if (strengths.length === 0) {
    strengths.push('Resume contains relevant professional information');
  }
  if (improvements.length === 0) {
    improvements.push('Consider adding more specific technical keywords from the job description');
  }
  
  return {
    atsScore: Math.min(100, Math.round(atsScore)),
    skillsMatch: Math.min(100, Math.round(skillsMatch)),
    experienceMatch: Math.min(100, Math.round(experienceMatch)),
    keywordsFound,
    missingKeywords,
    strengths,
    improvements
  };
}

module.exports = router;
