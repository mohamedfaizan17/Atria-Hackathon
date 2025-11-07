const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (optional)
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ AI Suggestions service initialized');
  } catch (error) {
    console.warn('⚠️  AI Suggestions service unavailable');
  }
}

// Predefined suggestions database for fallback
const predefinedSuggestions = {
  'software engineer': {
    skills: [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Git',
      'RESTful APIs', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Agile',
      'Problem Solving', 'Data Structures', 'Algorithms', 'CI/CD'
    ],
    achievements: [
      'Developed and deployed scalable web applications serving X+ users',
      'Optimized application performance, reducing load time by X%',
      'Implemented automated testing, increasing code coverage to X%',
      'Collaborated with cross-functional teams to deliver features on time',
      'Reduced bug count by X% through code reviews and quality assurance',
      'Built RESTful APIs handling X+ requests per day',
      'Migrated legacy systems to modern architecture',
      'Mentored junior developers on best practices'
    ]
  },
  'product manager': {
    skills: [
      'Product Strategy', 'Roadmap Planning', 'User Research', 'Data Analysis',
      'Agile/Scrum', 'Stakeholder Management', 'A/B Testing', 'SQL',
      'JIRA', 'Figma', 'Market Research', 'User Stories', 'KPI Tracking',
      'Cross-functional Leadership', 'Product Analytics', 'Wireframing'
    ],
    achievements: [
      'Launched X products/features that increased user engagement by X%',
      'Led product roadmap resulting in X% revenue growth',
      'Conducted user research with X+ participants to inform product decisions',
      'Improved user retention by X% through data-driven improvements',
      'Managed product backlog and prioritized features for X engineering teams',
      'Increased conversion rates by X% through A/B testing',
      'Reduced churn by X% by identifying and addressing pain points',
      'Coordinated cross-functional teams of X+ members'
    ]
  },
  'data scientist': {
    skills: [
      'Python', 'R', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL',
      'Data Visualization', 'Statistics', 'Deep Learning', 'NLP',
      'Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'Power BI', 'Big Data'
    ],
    achievements: [
      'Built machine learning models with X% accuracy',
      'Developed predictive models that generated $X in revenue',
      'Analyzed datasets of X+ records to extract actionable insights',
      'Improved model performance by X% through feature engineering',
      'Created dashboards that reduced reporting time by X%',
      'Implemented NLP solutions processing X+ documents',
      'Deployed ML models in production serving X+ predictions daily',
      'Reduced processing time by X% through optimization'
    ]
  },
  'designer': {
    skills: [
      'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop',
      'Illustrator', 'Prototyping', 'User Research', 'Wireframing',
      'Design Systems', 'HTML/CSS', 'Responsive Design', 'Accessibility',
      'User Testing', 'Information Architecture', 'Visual Design'
    ],
    achievements: [
      'Designed user interfaces that increased engagement by X%',
      'Created design systems used across X+ products',
      'Conducted user testing with X+ participants',
      'Improved user satisfaction scores by X% through redesign',
      'Reduced user drop-off by X% through UX improvements',
      'Designed X+ high-fidelity mockups and prototypes',
      'Collaborated with developers to ensure pixel-perfect implementation',
      'Established design guidelines adopted by X teams'
    ]
  },
  'marketing manager': {
    skills: [
      'Digital Marketing', 'SEO', 'Content Strategy', 'Google Analytics',
      'Social Media Marketing', 'Email Marketing', 'Campaign Management',
      'Brand Management', 'Marketing Automation', 'CRM', 'A/B Testing',
      'Budget Management', 'Market Research', 'Lead Generation'
    ],
    achievements: [
      'Increased website traffic by X% through SEO optimization',
      'Generated X+ qualified leads through targeted campaigns',
      'Improved conversion rates by X% through marketing optimization',
      'Managed marketing budget of $X with X% ROI',
      'Grew social media following by X% in X months',
      'Launched X campaigns resulting in X% revenue increase',
      'Reduced customer acquisition cost by X%',
      'Increased email open rates by X% through segmentation'
    ]
  },
  'sales executive': {
    skills: [
      'Sales Strategy', 'Lead Generation', 'CRM (Salesforce)', 'Negotiation',
      'Client Relationships', 'Pipeline Management', 'Cold Calling',
      'Presentations', 'Contract Negotiation', 'Market Analysis',
      'Account Management', 'Forecasting', 'B2B Sales', 'Closing Deals'
    ],
    achievements: [
      'Exceeded sales quota by X% for X consecutive quarters',
      'Generated $X in new revenue through client acquisition',
      'Managed pipeline of X+ opportunities worth $X',
      'Closed X deals averaging $X each',
      'Increased territory revenue by X% year-over-year',
      'Built and maintained relationships with X+ key accounts',
      'Reduced sales cycle by X% through process optimization',
      'Achieved X% win rate on proposals'
    ]
  }
};

// POST /api/suggestions/skills
router.post('/skills', async (req, res) => {
  try {
    const { jobRole, experienceLevel, industry } = req.body;

    if (!jobRole) {
      return res.status(400).json({ error: 'Job role is required' });
    }

    let skills = [];

    // Try AI generation first
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `As a career expert, suggest 15-20 relevant technical and soft skills for a ${experienceLevel || ''} ${jobRole} position ${industry ? `in the ${industry} industry` : ''}.

Requirements:
- Include both technical and soft skills
- Make skills specific and actionable
- Focus on in-demand, current skills
- Mix hard skills with soft skills
- Consider industry standards

Return ONLY a JSON array of skill strings, nothing else. Format: ["skill1", "skill2", ...]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse AI response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          skills = JSON.parse(jsonMatch[0]);
        }
      } catch (aiError) {
        console.error('AI skill generation error:', aiError.message);
      }
    }

    // Fallback to predefined suggestions
    if (skills.length === 0) {
      const roleKey = jobRole.toLowerCase();
      const matchedRole = Object.keys(predefinedSuggestions).find(key => 
        roleKey.includes(key) || key.includes(roleKey)
      );
      
      if (matchedRole) {
        skills = predefinedSuggestions[matchedRole].skills;
      } else {
        // Generic skills if no match found
        skills = [
          'Communication', 'Teamwork', 'Problem Solving', 'Time Management',
          'Leadership', 'Adaptability', 'Critical Thinking', 'Project Management',
          'Microsoft Office', 'Data Analysis', 'Customer Service', 'Attention to Detail'
        ];
      }
    }

    res.json({
      skills,
      source: genAI && skills.length > 0 ? 'ai' : 'predefined',
      jobRole,
      experienceLevel,
      industry
    });

  } catch (error) {
    console.error('Error generating skill suggestions:', error);
    res.status(500).json({ error: 'Failed to generate skill suggestions' });
  }
});

// POST /api/suggestions/achievements
router.post('/achievements', async (req, res) => {
  try {
    const { jobRole, experienceLevel, industry, context } = req.body;

    if (!jobRole) {
      return res.status(400).json({ error: 'Job role is required' });
    }

    let achievements = [];

    // Try AI generation first
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `As a career expert, suggest 8-10 impactful achievement statements for a ${experienceLevel || ''} ${jobRole} position ${industry ? `in the ${industry} industry` : ''}.

${context ? `Additional context: ${context}` : ''}

Requirements:
- Use action verbs (Led, Developed, Increased, Improved, etc.)
- Include quantifiable metrics (use X as placeholder for numbers)
- Focus on results and impact
- Make statements specific and powerful
- Follow the CAR method (Challenge, Action, Result)
- Keep each statement to 1-2 lines

Return ONLY a JSON array of achievement strings, nothing else. Format: ["achievement1", "achievement2", ...]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse AI response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          achievements = JSON.parse(jsonMatch[0]);
        }
      } catch (aiError) {
        console.error('AI achievement generation error:', aiError.message);
      }
    }

    // Fallback to predefined suggestions
    if (achievements.length === 0) {
      const roleKey = jobRole.toLowerCase();
      const matchedRole = Object.keys(predefinedSuggestions).find(key => 
        roleKey.includes(key) || key.includes(roleKey)
      );
      
      if (matchedRole) {
        achievements = predefinedSuggestions[matchedRole].achievements;
      } else {
        // Generic achievements if no match found
        achievements = [
          'Led team of X members to successfully complete projects on time',
          'Improved efficiency by X% through process optimization',
          'Managed budget of $X while maintaining quality standards',
          'Collaborated with X stakeholders to achieve organizational goals',
          'Increased productivity by X% through innovative solutions',
          'Reduced costs by X% through strategic initiatives',
          'Delivered X projects with X% success rate',
          'Trained and mentored X team members'
        ];
      }
    }

    res.json({
      achievements,
      source: genAI && achievements.length > 0 ? 'ai' : 'predefined',
      jobRole,
      experienceLevel,
      industry
    });

  } catch (error) {
    console.error('Error generating achievement suggestions:', error);
    res.status(500).json({ error: 'Failed to generate achievement suggestions' });
  }
});

// POST /api/suggestions/job-description
router.post('/job-description', async (req, res) => {
  try {
    const { jobTitle, company, responsibilities } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    let suggestions = {
      responsibilities: [],
      skills: [],
      improvements: []
    };

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `As a career expert, analyze this job position and provide suggestions:

Job Title: ${jobTitle}
Company: ${company || 'N/A'}
Current Responsibilities: ${responsibilities || 'None provided'}

Provide:
1. 5-7 common responsibilities for this role
2. 5-7 key skills typically required
3. 3-5 ways to improve the job description if responsibilities were provided

Return as JSON with keys: responsibilities (array), skills (array), improvements (array)`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse AI response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        }
      } catch (aiError) {
        console.error('AI job description error:', aiError.message);
      }
    }

    res.json({
      suggestions,
      source: genAI ? 'ai' : 'unavailable',
      jobTitle,
      company
    });

  } catch (error) {
    console.error('Error generating job description suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// GET /api/suggestions/roles
router.get('/roles', (req, res) => {
  const roles = Object.keys(predefinedSuggestions).map(role => ({
    id: role,
    name: role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    hasData: true
  }));

  res.json({ roles });
});

module.exports = router;
