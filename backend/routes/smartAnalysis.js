const express = require('express');
const router = express.Router();
const multer = require('multer');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import pdf-parse (v1.1.1 exports as function directly)
const pdfParse = require('pdf-parse');
console.log('✅ pdf-parse v1.1.1 loaded, type:', typeof pdfParse);

console.log('📦 Smart Analysis routes loading...');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed.'));
    }
  }
});

// Initialize Gemini AI
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Smart Analysis AI initialized');
  } catch (error) {
    console.warn('⚠️  Smart Analysis AI unavailable');
  }
}

// Extract text from uploaded resume file
router.post('/extract-text', upload.single('resume'), async (req, res) => {
  try {
    console.log('🔍 File upload request received');
    
    if (!req.file) {
      console.error('❌ No file in request');
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log('📄 File received:', {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });

    let extractedText = '';

    // Handle different file types
    if (req.file.mimetype === 'text/plain') {
      // Plain text file
      console.log('📝 Processing TXT file...');
      extractedText = req.file.buffer.toString('utf-8');
      console.log('✅ TXT extraction complete');
      
    } else if (req.file.mimetype === 'application/pdf') {
      // PDF file - use pdf-parse v1.1.1
      console.log('📕 Processing PDF file...');
      console.log('📊 File size:', Math.round(req.file.buffer.length / 1024), 'KB');
      
      try {
        const data = await pdfParse(req.file.buffer);
        extractedText = data.text;
        console.log('✅ PDF extraction complete:', extractedText.length, 'characters');
        console.log('📄 PDF info - Pages:', data.numpages, '| Version:', data.info?.PDFFormatVersion);
      } catch (pdfError) {
        console.error('❌ PDF parsing error:', pdfError.message);
        return res.status(400).json({
          success: false,
          error: 'Could not parse PDF file. It may be corrupted, password-protected, or image-only.',
          details: pdfError.message
        });
      }
      
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // DOCX file - use mammoth
      console.log('📘 Processing DOCX file...');
      try {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = result.value;
        console.log('✅ DOCX extraction complete');
      } catch (docxError) {
        console.error('❌ DOCX parsing error:', docxError.message);
        return res.status(400).json({
          success: false,
          error: 'Could not parse DOCX file. It may be corrupted.',
          details: docxError.message
        });
      }
      
    } else {
      console.error('❌ Unsupported file type:', req.file.mimetype);
      return res.status(400).json({
        success: false,
        error: `Unsupported file type: ${req.file.mimetype}. Please upload PDF, DOCX, or TXT file.`
      });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      console.error('❌ No text extracted from file');
      return res.status(400).json({
        success: false,
        error: 'Could not extract text from file. The file may be empty or contain only images.'
      });
    }

    console.log(`✅ Text extracted successfully: ${extractedText.length} characters`);

    res.json({
      success: true,
      text: extractedText,
      filename: req.file.originalname,
      size: req.file.size,
      characterCount: extractedText.length
    });
  } catch (error) {
    console.error('❌ Text extraction error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to extract text from file',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Analyze resume and JD
router.post('/analyze', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Resume text and job description are required'
      });
    }

    console.log('🤖 Starting comprehensive resume analysis...');

    let analysis = {};

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are an expert HR professional and resume analyst. Analyze this resume against the job description and provide comprehensive feedback.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

ANALYSIS REQUIRED:

1. **Candidate Profile Extraction**:
   - Full Name
   - Current Title
   - Years of Experience
   - Education (degrees, institutions, years)
   - Key Skills (technical and soft)
   - Certifications
   - Contact Information

2. **Experience Analysis**:
   - List of companies and roles
   - Key responsibilities
   - Notable achievements
   - Duration at each role

3. **Skills Match Analysis**:
   - Matched Skills (skills in resume that match JD requirements): array of strings
   - Missing Critical Skills (required skills not in resume): array of strings
   - Skills Match Score: 0-100

4. **Job Fit Analysis**:
   - Overall Fit Score: 0-100
   - Fit Level: "Excellent", "Good", "Fair", or "Poor"
   - Key Strengths (for this role): array of 3-5 points
   - Areas of Concern: array of 2-4 points
   - Experience Level Match: "Overqualified", "Perfect Match", "Slightly Under", "Significantly Under"

5. **ATS Optimization Suggestions**:
   - ATS Friendliness Score: 0-100
   - Formatting Issues: array of issues
   - Keyword Optimization: array of keywords to add
   - Structure Improvements: array of suggestions
   - Content Improvements: array of suggestions

6. **Professional Template Recommendations**:
   - Recommended Template Style: "Modern", "Classic", "Minimal", "Creative"
   - Recommended Sections Order: array of section names
   - Suggested Length: "1 page", "2 pages", etc.

7. **Smart Resume Enhancements**:
   - Suggested Skills to Add: array of 5-10 skills
   - Achievement Suggestions: array of 5 bullet points formatted as achievements
   - Better Phrasing: array of 3 examples of improved phrases
   - Action Verbs to Use: array of 10 strong action verbs

8. **Overall Recommendations**:
   - Top 3 Priority Actions: array of 3 actionable items
   - Estimated Time to Improve: string (e.g., "2-3 hours")

Return your analysis in this exact JSON format:
{
  "candidateProfile": {
    "name": string,
    "currentTitle": string,
    "yearsOfExperience": number,
    "education": array,
    "keySkills": array,
    "certifications": array,
    "contactInfo": {}
  },
  "experience": array,
  "skillsMatch": {
    "matchedSkills": array,
    "missingSkills": array,
    "matchScore": number
  },
  "jobFit": {
    "overallFitScore": number,
    "fitLevel": string,
    "keyStrengths": array,
    "concerns": array,
    "experienceLevelMatch": string
  },
  "atsOptimization": {
    "atsScore": number,
    "formattingIssues": array,
    "keywordOptimization": array,
    "structureImprovements": array,
    "contentImprovements": array
  },
  "templateRecommendations": {
    "style": string,
    "sectionsOrder": array,
    "suggestedLength": string
  },
  "smartEnhancements": {
    "suggestedSkills": array,
    "achievementSuggestions": array,
    "betterPhrasing": array,
    "actionVerbs": array
  },
  "recommendations": {
    "topPriorities": array,
    "estimatedTime": string
  }
}

Be thorough, specific, and actionable in your analysis.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('📊 AI Analysis received, parsing...');

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
          console.log('✅ AI Analysis completed successfully');
        } else {
          throw new Error('Could not parse AI response');
        }
      } catch (aiError) {
        console.error('❌ AI analysis error:', aiError.message);
        console.log('⚠️  Falling back to rule-based analysis...');
        analysis = performRuleBasedAnalysis(resumeText, jobDescription);
      }
    } else {
      console.log('ℹ️  AI not configured, using rule-based analysis');
      analysis = performRuleBasedAnalysis(resumeText, jobDescription);
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('❌ Smart analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze resume',
      message: error.message
    });
  }
});

// Rule-based analysis function
function performRuleBasedAnalysis(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Extract basic information
  const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = resumeText.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);

  // Common skills to check
  const techSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
    'typescript', 'mongodb', 'sql', 'aws', 'azure', 'docker', 'kubernetes',
    'git', 'api', 'rest', 'graphql', 'html', 'css', 'agile', 'scrum'
  ];

  const matchedSkills = [];
  const missingSkills = [];

  techSkills.forEach(skill => {
    if (jdLower.includes(skill)) {
      if (resumeLower.includes(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }
  });

  const skillsMatchScore = Math.min(100, Math.round((matchedSkills.length / Math.max(1, matchedSkills.length + missingSkills.length)) * 100));

  // Calculate ATS score
  let atsScore = 0;
  if (resumeText.split(/\s+/).length >= 300) atsScore += 20;
  if (emailMatch) atsScore += 10;
  if (phoneMatch) atsScore += 10;
  if (resumeLower.includes('experience')) atsScore += 15;
  if (resumeLower.includes('education')) atsScore += 15;
  if (resumeLower.includes('skills')) atsScore += 10;
  atsScore += Math.min(20, matchedSkills.length * 2);

  // Calculate job fit score
  const jobFitScore = Math.round((skillsMatchScore * 0.6) + (atsScore * 0.4));
  
  let fitLevel = 'Poor';
  if (jobFitScore >= 80) fitLevel = 'Excellent';
  else if (jobFitScore >= 65) fitLevel = 'Good';
  else if (jobFitScore >= 50) fitLevel = 'Fair';

  return {
    candidateProfile: {
      name: "Candidate Name",
      currentTitle: "Professional",
      yearsOfExperience: 0,
      education: ["See resume for details"],
      keySkills: matchedSkills.slice(0, 10),
      certifications: [],
      contactInfo: {
        email: emailMatch ? emailMatch[0] : "N/A",
        phone: phoneMatch ? phoneMatch[0] : "N/A"
      }
    },
    experience: [
      {
        company: "Previous Employers",
        role: "Various Roles",
        details: "See resume for complete work history"
      }
    ],
    skillsMatch: {
      matchedSkills: matchedSkills,
      missingSkills: missingSkills.slice(0, 10),
      matchScore: skillsMatchScore
    },
    jobFit: {
      overallFitScore: jobFitScore,
      fitLevel: fitLevel,
      keyStrengths: [
        `${matchedSkills.length} relevant skills found`,
        "Resume structure is professional",
        "Contact information provided"
      ],
      concerns: missingSkills.length > 0 ? [
        `Missing ${missingSkills.length} key skills from job description`,
        "Consider adding more quantifiable achievements"
      ] : ["Consider adding more quantifiable achievements"],
      experienceLevelMatch: "Review needed"
    },
    atsOptimization: {
      atsScore: atsScore,
      formattingIssues: [
        "Ensure consistent formatting throughout",
        "Use standard section headings"
      ],
      keywordOptimization: missingSkills.slice(0, 5),
      structureImprovements: [
        "Add a professional summary section",
        "Use bullet points for achievements",
        "Include quantifiable metrics"
      ],
      contentImprovements: [
        "Add measurable achievements (numbers, percentages)",
        "Use strong action verbs",
        "Tailor content to match job description"
      ]
    },
    templateRecommendations: {
      style: "Modern",
      sectionsOrder: [
        "Contact Information",
        "Professional Summary",
        "Work Experience",
        "Skills",
        "Education",
        "Certifications"
      ],
      suggestedLength: "1-2 pages"
    },
    smartEnhancements: {
      suggestedSkills: missingSkills.slice(0, 10),
      achievementSuggestions: [
        "Increased team productivity by X% through implementation of new processes",
        "Led cross-functional team of X members to deliver project ahead of schedule",
        "Reduced costs by X% by optimizing existing workflows",
        "Improved system performance by X% through code optimization",
        "Mentored X junior team members, resulting in faster onboarding"
      ],
      betterPhrasing: [
        {
          weak: "Responsible for managing team",
          strong: "Led cross-functional team of 5 engineers, delivering 3 major projects"
        },
        {
          weak: "Worked on various projects",
          strong: "Architected and deployed 10+ production features serving 100K+ users"
        },
        {
          weak: "Helped improve performance",
          strong: "Optimized application performance by 40% through code refactoring"
        }
      ],
      actionVerbs: [
        "Led", "Architected", "Implemented", "Optimized", "Delivered",
        "Spearheaded", "Orchestrated", "Streamlined", "Pioneered", "Transformed"
      ]
    },
    recommendations: {
      topPriorities: [
        `Add missing skills: ${missingSkills.slice(0, 3).join(', ')}`,
        "Include quantifiable achievements with metrics",
        "Optimize keyword density for ATS systems"
      ],
      estimatedTime: "2-3 hours"
    }
  };
}

// Test endpoint to verify routes are working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Analysis routes are working!',
    endpoints: [
      'POST /api/smart-analysis/extract-text',
      'POST /api/smart-analysis/analyze',
      'GET /api/smart-analysis/test'
    ]
  });
});

console.log('✅ Smart Analysis routes loaded successfully');

module.exports = router;
