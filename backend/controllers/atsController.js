const Application = require('../models/Application');
const Job = require('../models/Job');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (optional)
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ ATS AI features initialized');
  } catch (error) {
    console.warn('⚠️  ATS AI features unavailable');
  }
}

// Get all applications with advanced filtering
exports.getAllApplications = async (req, res) => {
  try {
    const {
      job,
      status,
      minScore,
      search,
      sort = '-submittedAt',
      page = 1,
      limit = 50,
      favorite,
      viewed,
      tags
    } = req.query;

    // Build query
    const query = {};
    if (job) query.job = job;
    if (status) query.status = status;
    if (minScore) query.atsScore = { $gte: parseInt(minScore) };
    if (favorite !== undefined) query.isFavorite = favorite === 'true';
    if (viewed !== undefined) query.isViewed = viewed === 'true';
    if (tags) query.tags = { $in: tags.split(',') };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate('job', 'title department location')
      .populate('reviewedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
};

// Get application by ID
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('reviewedBy', 'name email')
      .populate('internalNotes.addedBy', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Mark as viewed
    if (!application.isViewed) {
      application.isViewed = true;
      await application.save();
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application'
    });
  }
};

// Update application status
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    application.status = status;
    if (notes) {
      application.reviewNotes = notes;
    }
    application.reviewedBy = req.user.id;
    application.reviewedAt = Date.now();

    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status'
    });
  }
};

// Add internal note
exports.addNote = async (req, res) => {
  try {
    const { note } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    application.internalNotes.push({
      note,
      addedBy: req.user.id,
      addedAt: Date.now()
    });

    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add note'
    });
  }
};

// Schedule interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { round, type, scheduledAt, interviewer } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    application.interviews.push({
      round,
      type,
      scheduledAt,
      interviewer,
      status: 'scheduled'
    });

    application.status = 'interview_scheduled';
    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule interview'
    });
  }
};

// Update interview feedback
exports.updateInterview = async (req, res) => {
  try {
    const { interviewId, feedback, rating, status } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    const interview = application.interviews.id(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }

    if (feedback) interview.feedback = feedback;
    if (rating) interview.rating = rating;
    if (status) interview.status = status;

    // Update application status if interview completed
    if (status === 'completed') {
      application.status = 'interviewed';
    }

    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update interview'
    });
  }
};

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    application.isFavorite = !application.isFavorite;
    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle favorite'
    });
  }
};

// Add tags
exports.addTags = async (req, res) => {
  try {
    const { tags } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Add unique tags
    const newTags = tags.filter(tag => !application.tags.includes(tag));
    application.tags.push(...newTags);
    
    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Add tags error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add tags'
    });
  }
};

// AI-powered candidate scoring with enhanced resume analysis
exports.scoreCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    let atsScore = 0;
    let skillsMatch = 0;
    let experienceMatch = 0;
    let aiAnalysis = '';

    if (genAI && application.job) {
      try {
        console.log('🤖 Starting AI-powered resume analysis...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Build comprehensive candidate profile
        const candidateProfile = `
=== CANDIDATE INFORMATION ===
Name: ${application.name}
Email: ${application.email}
Phone: ${application.phone}
Location: ${application.currentLocation || 'Not specified'}
Years of Experience: ${application.yearsOfExperience || 'Not specified'}
Expected Salary: ${application.expectedSalary || 'Not specified'}
Notice Period: ${application.noticePeriod || 'Not specified'}

=== PROFESSIONAL LINKS ===
LinkedIn: ${application.linkedin || 'Not provided'}
Portfolio: ${application.portfolio || 'Not provided'}

=== COVER LETTER ===
${application.coverLetter || 'Not provided'}

=== WHY JOIN ===
${application.whyJoin || 'Not provided'}

=== RESUME URL ===
${application.resumeUrl || 'Not provided'}
        `.trim();

        const jobRequirements = `
=== JOB POSITION ===
Title: ${application.job.title}
Department: ${application.job.department}
Location: ${application.job.location}
Type: ${application.job.type}
Experience Level: ${application.job.experienceLevel || 'Not specified'}

=== JOB DESCRIPTION ===
${application.job.description || 'Not provided'}

=== REQUIREMENTS ===
${application.job.requirements?.map((req, idx) => `${idx + 1}. ${req}`).join('\n') || 'Not specified'}

=== REQUIRED SKILLS ===
${application.job.skills?.join(', ') || 'Not specified'}

=== RESPONSIBILITIES ===
${application.job.responsibilities?.map((resp, idx) => `${idx + 1}. ${resp}`).join('\n') || 'Not specified'}
        `.trim();

        const prompt = `You are an expert ATS (Applicant Tracking System) and recruitment analyst. Analyze this job application thoroughly and provide accurate scoring.

${jobRequirements}

${candidateProfile}

ANALYSIS INSTRUCTIONS:
1. Carefully evaluate the candidate's qualifications against job requirements
2. Assess technical skills match (based on cover letter, LinkedIn, portfolio)
3. Evaluate experience level fit (years of experience vs required)
4. Consider cultural fit indicators (why join, motivation)
5. Analyze communication skills (quality of writing)
6. Check completeness of profile

SCORING CRITERIA:
- ATS Score (0-100): Overall candidate fit considering all factors
  * 90-100: Exceptional match, highly recommended
  * 80-89: Strong match, definitely interview
  * 70-79: Good match, consider for interview
  * 60-69: Moderate match, potential candidate
  * 50-59: Below average, needs careful review
  * 0-49: Poor match, likely reject

- Skills Match (0-100): Technical and soft skills alignment
  * Compare mentioned skills in cover letter/LinkedIn with required skills
  * Consider transferable skills
  * Evaluate depth of expertise indicators

- Experience Match (0-100): Experience level and relevance
  * Years of experience vs required
  * Relevance of past roles to job requirements
  * Career progression indicators

Provide your analysis in JSON format:
{
  "atsScore": <number 0-100>,
  "skillsMatch": <number 0-100>,
  "experienceMatch": <number 0-100>,
  "analysis": "<2-3 sentence summary of strengths and concerns>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "concerns": ["<concern 1>", "<concern 2>"],
  "recommendation": "<Recommend/Consider/Reject>"
}

Be thorough but fair in your assessment.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('📊 AI Analysis received, parsing results...');
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const scores = JSON.parse(jsonMatch[0]);
          atsScore = Math.round(scores.atsScore || 0);
          skillsMatch = Math.round(scores.skillsMatch || 0);
          experienceMatch = Math.round(scores.experienceMatch || 0);
          aiAnalysis = scores.analysis || '';
          
          console.log('✅ AI Scoring completed:', { atsScore, skillsMatch, experienceMatch });
          
          // Add AI analysis to internal notes
          if (aiAnalysis) {
            application.internalNotes.push({
              note: `AI Analysis: ${aiAnalysis}\n\nRecommendation: ${scores.recommendation || 'N/A'}\n\nStrengths: ${scores.strengths?.join(', ') || 'N/A'}\n\nConcerns: ${scores.concerns?.join(', ') || 'N/A'}`,
              addedBy: req.user?.id,
              addedAt: Date.now()
            });
          }
        } else {
          throw new Error('Could not parse AI response');
        }
      } catch (aiError) {
        console.error('❌ AI scoring error:', aiError.message);
        console.log('⚠️  Falling back to rule-based scoring...');
        // Fallback to enhanced basic scoring
        const basicScore = calculateEnhancedScore(application);
        atsScore = basicScore.atsScore;
        skillsMatch = basicScore.skillsMatch;
        experienceMatch = basicScore.experienceMatch;
      }
    } else {
      console.log('ℹ️  AI not configured, using rule-based scoring');
      // Enhanced basic scoring without AI
      const basicScore = calculateEnhancedScore(application);
      atsScore = basicScore.atsScore;
      skillsMatch = basicScore.skillsMatch;
      experienceMatch = basicScore.experienceMatch;
    }

    // Ensure scores are within bounds
    application.atsScore = Math.min(100, Math.max(0, atsScore));
    application.skillsMatch = Math.min(100, Math.max(0, skillsMatch));
    application.experienceMatch = Math.min(100, Math.max(0, experienceMatch));
    
    await application.save();
    
    console.log(`📈 Final ATS Score for ${application.name}: ${application.atsScore}/100`);

    res.json({
      success: true,
      data: {
        atsScore: application.atsScore,
        skillsMatch: application.skillsMatch,
        experienceMatch: application.experienceMatch,
        analysis: aiAnalysis
      }
    });
  } catch (error) {
    console.error('❌ Score candidate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to score candidate',
      message: error.message
    });
  }
};

// Bulk score applications
exports.bulkScore = async (req, res) => {
  try {
    const { jobId } = req.body;
    
    const applications = await Application.find({ 
      job: jobId, 
      atsScore: 0 
    }).populate('job').limit(50);

    let scored = 0;
    for (const application of applications) {
      const atsScore = calculateBasicScore(application);
      application.atsScore = atsScore;
      application.skillsMatch = 50;
      application.experienceMatch = 50;
      await application.save();
      scored++;
    }

    res.json({
      success: true,
      message: `Scored ${scored} applications`,
      scored
    });
  } catch (error) {
    console.error('Bulk score error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk score'
    });
  }
};

// Get ATS statistics
exports.getStatistics = async (req, res) => {
  try {
    const { jobId } = req.query;
    
    const query = jobId ? { job: jobId } : {};
    
    const totalApplications = await Application.countDocuments(query);
    
    const statusCounts = await Application.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const averageScore = await Application.aggregate([
      { $match: { ...query, atsScore: { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: '$atsScore' } } }
    ]);

    const topCandidates = await Application.find(query)
      .sort('-atsScore')
      .limit(10)
      .populate('job', 'title')
      .select('name email atsScore skillsMatch experienceMatch job submittedAt');

    const recentApplications = await Application.find(query)
      .sort('-submittedAt')
      .limit(5)
      .populate('job', 'title');

    res.json({
      success: true,
      data: {
        totalApplications,
        statusCounts,
        averageScore: averageScore[0]?.avgScore || 0,
        topCandidates,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
};

// Helper function for basic scoring (kept for compatibility)
function calculateBasicScore(application) {
  let score = 0;
  
  // Has resume
  if (application.resumeUrl) score += 20;
  
  // Has cover letter
  if (application.coverLetter && application.coverLetter.length > 50) score += 15;
  
  // Has LinkedIn
  if (application.linkedin) score += 10;
  
  // Has portfolio
  if (application.portfolio) score += 10;
  
  // Years of experience
  if (application.yearsOfExperience) {
    score += Math.min(25, application.yearsOfExperience * 5);
  }
  
  // Why join answer
  if (application.whyJoin && application.whyJoin.length > 30) score += 10;
  
  // Complete profile
  if (application.currentLocation && application.expectedSalary) score += 10;
  
  return Math.min(100, score);
}

// Enhanced scoring function with detailed breakdown
function calculateEnhancedScore(application) {
  let atsScore = 0;
  let skillsMatch = 0;
  let experienceMatch = 0;
  
  // === ATS SCORE CALCULATION ===
  
  // 1. Resume/Portfolio (25 points)
  if (application.resumeUrl) atsScore += 15;
  if (application.linkedin) atsScore += 5;
  if (application.portfolio) atsScore += 5;
  
  // 2. Cover Letter Quality (20 points)
  if (application.coverLetter) {
    const length = application.coverLetter.length;
    if (length > 500) atsScore += 20;
    else if (length > 200) atsScore += 15;
    else if (length > 50) atsScore += 10;
    else atsScore += 5;
  }
  
  // 3. Why Join/Motivation (15 points)
  if (application.whyJoin) {
    const length = application.whyJoin.length;
    if (length > 200) atsScore += 15;
    else if (length > 100) atsScore += 10;
    else if (length > 30) atsScore += 5;
  }
  
  // 4. Years of Experience (20 points)
  if (application.yearsOfExperience) {
    const years = parseInt(application.yearsOfExperience);
    if (years >= 8) atsScore += 20;
    else if (years >= 5) atsScore += 15;
    else if (years >= 3) atsScore += 10;
    else if (years >= 1) atsScore += 5;
  }
  
  // 5. Profile Completeness (10 points)
  let completeness = 0;
  if (application.currentLocation) completeness += 2.5;
  if (application.expectedSalary) completeness += 2.5;
  if (application.noticePeriod) completeness += 2.5;
  if (application.email) completeness += 2.5;
  atsScore += completeness;
  
  // 6. Communication Quality (10 points)
  const totalText = (application.coverLetter || '') + (application.whyJoin || '');
  if (totalText.length > 300) {
    // Basic quality check
    const hasGoodStructure = totalText.includes('.') && totalText.includes(',');
    const hasCapitalization = /[A-Z]/.test(totalText);
    const notAllCaps = totalText !== totalText.toUpperCase();
    
    if (hasGoodStructure && hasCapitalization && notAllCaps) atsScore += 10;
    else atsScore += 5;
  }
  
  // === SKILLS MATCH CALCULATION ===
  
  // LinkedIn profile present
  if (application.linkedin) skillsMatch += 30;
  
  // Portfolio present
  if (application.portfolio) skillsMatch += 25;
  
  // Resume provided
  if (application.resumeUrl) skillsMatch += 20;
  
  // Cover letter mentions skills/technologies (basic keyword check)
  if (application.coverLetter) {
    const coverLower = application.coverLetter.toLowerCase();
    const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 
                          'typescript', 'mongodb', 'sql', 'aws', 'docker', 'kubernetes', 'git',
                          'api', 'frontend', 'backend', 'fullstack', 'database', 'cloud'];
    
    const mentionedSkills = techKeywords.filter(keyword => coverLower.includes(keyword));
    skillsMatch += Math.min(25, mentionedSkills.length * 5);
  }
  
  // === EXPERIENCE MATCH CALCULATION ===
  
  if (application.yearsOfExperience) {
    const years = parseInt(application.yearsOfExperience);
    
    // Base score for having experience
    experienceMatch += 40;
    
    // Additional points based on years
    if (years >= 10) experienceMatch += 40; // Senior level
    else if (years >= 7) experienceMatch += 35; // Senior
    else if (years >= 5) experienceMatch += 30; // Mid-Senior
    else if (years >= 3) experienceMatch += 25; // Mid-level
    else if (years >= 1) experienceMatch += 20; // Junior-Mid
    else experienceMatch += 10; // Entry level
    
    // Quality indicators
    if (application.linkedin) experienceMatch += 10;
    if (application.coverLetter && application.coverLetter.length > 200) experienceMatch += 10;
  } else {
    // No experience specified - moderate score
    experienceMatch = 40;
  }
  
  return {
    atsScore: Math.min(100, Math.round(atsScore)),
    skillsMatch: Math.min(100, Math.round(skillsMatch)),
    experienceMatch: Math.min(100, Math.round(experienceMatch))
  };
}

module.exports = exports;
