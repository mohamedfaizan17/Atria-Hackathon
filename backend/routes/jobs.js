const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (optional)
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized for personalized emails');
  } catch (error) {
    console.warn('⚠️  Gemini AI initialization failed - using fallback email templates');
  }
} else {
  console.warn('⚠️  Gemini API not configured - using standard email templates');
}

// Configure email transporter (optional - only if credentials provided)
let transporter = null;
let emailConfigured = false;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
    process.env.EMAIL_USER !== 'your-email@gmail.com' &&
    process.env.EMAIL_PASS !== 'your-app-specific-password') {
  
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify transporter configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.error('❌ Email transporter error:', error.message);
      console.warn('⚠️  Email notifications disabled - configure EMAIL_USER and EMAIL_PASS in .env to enable');
      emailConfigured = false;
      transporter = null;
    } else {
      console.log('✅ Email server is ready to send messages');
      emailConfigured = true;
    }
  });
} else {
  console.warn('⚠️  Email not configured - applications will be saved but no email notifications will be sent');
  console.log('💡 To enable emails: Add EMAIL_USER and EMAIL_PASS to backend/.env');
}

// Seed dummy jobs
router.post('/seed', async (req, res) => {
  try {
    // Clear existing jobs
    await Job.deleteMany({});

    const dummyJobs = [
      {
        title: 'Full Stack Engineer (Next.js + Node)',
        department: 'Engineering',
        location: 'Remote / Bengaluru',
        type: 'Full-Time',
        description: 'Own features end‑to‑end across a modern Next.js + Node stack. Ship fast, write clean code, and collaborate with design to deliver pixel‑perfect UX.',
        requirements: [
          '3+ years building production web apps',
          'Strong with React/Next.js, Node.js, and MongoDB',
          'Comfortable with REST/GraphQL and auth flows',
          'Good grasp of performance, a11y, and testing'
        ],
        responsibilities: [
          'Design, build, and maintain scalable services',
          'Collaborate closely with design and product',
          'Write maintainable, well‑tested code',
          'Review PRs and mentor junior engineers'
        ],
        skills: ['Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'REST', 'GraphQL'],
        salary: '₹18L – ₹28L / year',
        experienceLevel: 'Mid-Level',
        posted: new Date(),
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'AI Engineer (LLMs & RAG)',
        department: 'AI/ML',
        location: 'Hybrid – Bengaluru',
        type: 'Full-Time',
        description: 'Prototype and productionize LLM‑powered features. Build RAG pipelines, evaluate models, and optimize latency & cost for real‑world usage.',
        requirements: [
          '2+ years hands‑on with NLP/LLMs',
          'Python, vector databases, prompt engineering',
          'Familiar with OpenAI/Gemini or OSS models',
          'Experience with evaluation & guardrails is a plus'
        ],
        responsibilities: [
          'Build retrieval‑augmented generation pipelines',
          'Own evaluation and prompt iteration loops',
          'Ship inference services with monitoring',
          'Collaborate with product to ship AI features'
        ],
        skills: ['Python', 'LangChain', 'Vector DBs', 'Embeddings', 'OpenAI', 'Gemini', 'RAG'],
        salary: '₹20L – ₹35L / year',
        experienceLevel: 'Mid to Senior',
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Product Designer (UI/UX + Design Systems)',
        department: 'Design',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Design delightful product experiences. You’ll own flows, craft reusable components, and work closely with engineering to ensure high‑quality builds.',
        requirements: [
          '3+ years in product design',
          'Strong Figma skills and design systems experience',
          'Comfort with research, prototyping, and usability testing'
        ],
        responsibilities: [
          'Own end‑to‑end user flows and UI polish',
          'Build and maintain our design system',
          'Run lightweight research and usability tests'
        ],
        skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research', 'Accessibility'],
        salary: '₹12L – ₹22L / year',
        experienceLevel: 'Mid-Level',
        posted: new Date(),
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'DevOps Engineer (Kubernetes + CI/CD)',
        department: 'Platform',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Scale our infrastructure with reliability and speed. You’ll automate deployments, observability, and security best practices.',
        requirements: [
          '3+ years with cloud infra (AWS/GCP/Azure)',
          'Kubernetes, Docker, Terraform expertise',
          'Experience with CI/CD and monitoring'
        ],
        responsibilities: [
          'Own CI/CD pipelines and release hygiene',
          'Improve reliability, security, and cost',
          'Set up observability and incident response'
        ],
        skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'Github Actions', 'Prometheus', 'Grafana'],
        salary: '₹18L – ₹30L / year',
        experienceLevel: 'Mid-Level',
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Growth Marketer (B2B SaaS)',
        department: 'Marketing',
        location: 'Hybrid – Bengaluru',
        type: 'Full-Time',
        description: 'Own top‑of‑funnel growth. Run experiments across content, paid, and product‑led loops. Obsess over conversion and attribution.',
        requirements: [
          '2+ years in B2B SaaS growth/marketing',
          'Hands‑on with analytics and campaign tools',
          'Proven track record of running growth experiments'
        ],
        responsibilities: [
          'Run multi‑channel acquisition experiments',
          'Collaborate with product on PLG motions',
          'Build dashboards and report on ROI'
        ],
        skills: ['SEO', 'Content', 'Paid Ads', 'Email', 'GA4', 'HubSpot'],
        salary: '₹10L – ₹18L / year + incentives',
        experienceLevel: 'Mid-Level',
        posted: new Date(),
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'QA Automation Engineer',
        department: 'Quality',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Build robust automated test suites for web and API layers. Improve release confidence and developer velocity.',
        requirements: [
          '2+ years in test automation',
          'Experience with Playwright/Cypress and API testing',
          'Good understanding of CI pipelines'
        ],
        responsibilities: [
          'Design and maintain automated test suites',
          'Own regression and smoke testing coverage',
          'Work with engineers to prevent regressions'
        ],
        skills: ['Playwright', 'Cypress', 'Jest', 'Postman', 'REST'],
        salary: '₹9L – ₹16L / year',
        experienceLevel: 'Mid-Level',
        posted: new Date(),
        deadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000)
      }
    ];

    const jobs = await Job.insertMany(dummyJobs);
    res.json({ message: 'Dummy jobs seeded successfully', count: jobs.length, jobs });
  } catch (error) {
    console.error('Error seeding jobs:', error);
    res.status(500).json({ message: 'Error seeding jobs', error: error.message });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ posted: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
});

// Submit application with AI-generated email
router.post('/:id/apply', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      coverLetter, 
      resumeUrl,
      linkedin,
      portfolio,
      currentLocation,
      yearsOfExperience,
      expectedSalary,
      noticePeriod,
      whyJoin
    } = req.body;
    const jobId = req.params.id;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Create application with all fields
    const application = new Application({
      job: jobId,
      name,
      email,
      phone,
      coverLetter,
      resumeUrl,
      linkedin,
      portfolio,
      currentLocation,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
      expectedSalary,
      noticePeriod,
      whyJoin,
      status: 'applied', // Updated to match new model
      submittedAt: new Date(),
      source: 'website'
    });

    try {
      await application.save();
      console.log('✅ Application saved successfully:', application._id);
    } catch (saveError) {
      console.error('❌ Error saving application:', saveError);
      return res.status(500).json({ 
        message: 'Failed to save application', 
        error: saveError.message,
        details: process.env.NODE_ENV === 'development' ? saveError : undefined
      });
    }

    // Automatically score the application using AI/rule-based system
    try {
      console.log('🔍 Auto-scoring application...');
      const scoredApp = await autoScoreApplication(application, job);
      if (scoredApp) {
        application.atsScore = scoredApp.atsScore;
        application.skillsMatch = scoredApp.skillsMatch;
        application.experienceMatch = scoredApp.experienceMatch;
        await application.save();
        console.log(`✅ Auto-scored: ATS ${application.atsScore}/100, Skills ${application.skillsMatch}/100, Experience ${application.experienceMatch}/100`);
      }
    } catch (scoringError) {
      console.warn('⚠️  Auto-scoring failed:', scoringError.message);
      // Continue anyway - scoring is not critical for submission
    }

    // Generate AI-powered acknowledgment email with application summary
    let emailContent;
    let applicationSummary = '';
    
    // Try AI generation if available
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Prepare application details for AI
        const applicationDetails = `
Applicant: ${name}
Email: ${email}
Phone: ${phone}
Position: ${job.title}
Department: ${job.department}
Location: ${job.location}
Application Details:
${coverLetter}
        `.trim();

        const prompt = `You are an HR representative at Mastersolis, a leading tech company. Generate a professional, warm, and personalized job application acknowledgment email for ${name} who just applied for the ${job.title} position.

APPLICATION CONTEXT:
${applicationDetails}

EMAIL REQUIREMENTS:
1. Start with a warm, personalized greeting
2. Thank them specifically for their interest in the ${job.title} role
3. Acknowledge 2-3 specific details from their application (experience, skills, or motivation) that stood out
4. Include a professional summary of what they submitted
5. Confirm receipt and next steps (review within 5-7 business days)
6. Express genuine enthusiasm about their application
7. Provide a contact point for questions
8. End with an encouraging, professional closing

TONE: Professional, warm, encouraging, and personalized
LENGTH: 4-5 well-structured paragraphs
AVOID: Generic templates, overly formal language, or robotic responses

Generate the email body only (no subject line):`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        emailContent = response.text();
        
        console.log('✅ AI-generated personalized email');
      } catch (aiError) {
        console.log('⚠️  AI generation failed, using standard template:', aiError.message);
        emailContent = null;
      }
    }
    
    // Use fallback template if AI didn't generate content
    if (!emailContent) {
      console.log('ℹ️  Using standard email template');
      
      // Enhanced fallback with application details
      emailContent = `Dear ${name},

Thank you for your application for the ${job.title} position at Mastersolis! We truly appreciate your interest in joining our team and the time you invested in preparing your application.

📋 APPLICATION SUMMARY:
We have successfully received your application with the following details:
• Position: ${job.title}
• Department: ${job.department}
• Location: ${job.location}
• Contact: ${email} | ${phone}

Your background and qualifications have been noted, and our hiring team will carefully review your application materials. We are particularly interested in learning more about your experience and how it aligns with this role.

🔍 NEXT STEPS:
Our recruitment team will thoroughly review your application within the next 5-7 business days. If your qualifications match our requirements, we will reach out to schedule an interview. Please keep an eye on your email (including spam folder) for any updates.

We know job searching can be an exciting yet challenging journey. Regardless of the outcome, we want you to know that we value your interest in Mastersolis and appreciate the effort you put into your application.

If you have any questions in the meantime, please don't hesitate to reach out to our HR team.

Thank you again for considering Mastersolis as your next career destination. We wish you all the best!

Warm regards,
The Mastersolis Hiring Team

---
This is an automated confirmation. Your application has been securely stored and will be reviewed by our team.`;
    }

    // Send email with enhanced professional template
    const mailOptions = {
      from: `${process.env.EMAIL_FROM || 'Mastersolis Careers'} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Application Received - ${job.title} at Mastersolis`,
      text: emailContent,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header with gradient -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                🎯 Mastersolis
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
                Innovation • Technology • Excellence
              </p>
            </div>
            
            <!-- Main content -->
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Success badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 10px 24px; border-radius: 25px; font-weight: 600; font-size: 14px;">
                  ✓ Application Successfully Received
                </div>
              </div>
              
              <!-- AI-generated content -->
              <div style="color: #1f2937; line-height: 1.8; font-size: 15px;">
                ${emailContent.split('\n\n').map(para => {
                  // Check if paragraph has emojis or special formatting
                  if (para.includes('📋') || para.includes('🔍') || para.includes('•')) {
                    return `<div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                      ${para.split('\n').map(line => `<p style="margin: 8px 0; color: #374151; font-size: 14px;">${line}</p>`).join('')}
                    </div>`;
                  }
                  return `<p style="margin: 16px 0; color: #374151;">${para}</p>`;
                }).join('')}
              </div>
              
              <!-- Job details card -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px solid #e0e7ff;">
                <h3 style="margin: 0 0 15px 0; color: #4f46e5; font-size: 16px; font-weight: 600;">
                  📌 Position Applied For:
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Position:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px;">${job.title}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Department:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px;">${job.department}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px;">${job.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Application ID:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px;">${application._id.toString().substring(0, 12)}...</td>
                  </tr>
                </table>
              </div>
              
              <!-- Contact section -->
              <div style="background-color: #fef3c7; padding: 16px 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Pro Tip:</strong> Keep an eye on your email (including spam folder) for updates. Add us to your contacts to ensure you don't miss any communication.
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                  Visit Our Website
                </a>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 30px 20px;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
                This is an automated confirmation email from Mastersolis.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Mastersolis. All rights reserved.
              </p>
              <div style="margin-top: 15px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Website</a>
                <span style="color: #d1d5db;">•</span>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/careers" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Careers</a>
                <span style="color: #d1d5db;">•</span>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Contact</a>
              </div>
            </div>
            
          </div>
        </body>
        </html>
      `
    };

    // Send email (only if email is configured)
    let emailSent = false;
    if (transporter) {
      try {
        console.log(`📧 Attempting to send email to ${email}...`);
        console.log(`Email from: ${process.env.EMAIL_USER}`);
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Confirmation email sent successfully to ${email}`);
        console.log(`Message ID: ${info.messageId}`);
        emailSent = true;
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError.message);
        console.error('⚠️ Note: Application was saved to database, but email failed to send');
        // Continue anyway - application is saved
      }
    } else {
      console.log('ℹ️  Email not configured - skipping email notification');
      console.log('💡 Application saved successfully. To enable emails, configure EMAIL_USER and EMAIL_PASS in .env');
    }

    res.json({
      message: emailSent 
        ? 'Application submitted successfully! Check your email for confirmation.' 
        : 'Application submitted successfully! (Email notification could not be sent)',
      emailSent: emailSent,
      application: {
        id: application._id,
        name: application.name,
        email: application.email,
        status: application.status
      }
    });
  } catch (error) {
    console.error('❌ Error submitting application:', error);
    res.status(500).json({ 
      message: 'Error submitting application', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get applications for a job (admin only)
router.get('/:id/applications', async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.id }).sort({ submittedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Auto-scoring function for new applications
async function autoScoreApplication(application, job) {
  try {
    let atsScore = 0;
    let skillsMatch = 0;
    let experienceMatch = 0;

    // Try AI scoring if available
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const candidateProfile = `
Name: ${application.name}
Location: ${application.currentLocation || 'Not specified'}
Years of Experience: ${application.yearsOfExperience || 'Not specified'}
LinkedIn: ${application.linkedin || 'Not provided'}
Portfolio: ${application.portfolio || 'Not provided'}
Cover Letter: ${application.coverLetter?.substring(0, 300) || 'Not provided'}
Why Join: ${application.whyJoin?.substring(0, 200) || 'Not provided'}
        `.trim();

        const jobInfo = `
Title: ${job.title}
Department: ${job.department}
Required Skills: ${job.skills?.join(', ') || 'Not specified'}
Experience Level: ${job.experienceLevel || 'Not specified'}
Requirements: ${job.requirements?.slice(0, 3).join('; ') || 'Not specified'}
        `.trim();

        const prompt = `You are an ATS system. Score this candidate (0-100 for each):

JOB:
${jobInfo}

CANDIDATE:
${candidateProfile}

Respond ONLY with JSON (no other text):
{"atsScore": X, "skillsMatch": Y, "experienceMatch": Z}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[^}]+\}/);
        if (jsonMatch) {
          const scores = JSON.parse(jsonMatch[0]);
          atsScore = Math.round(scores.atsScore || 0);
          skillsMatch = Math.round(scores.skillsMatch || 0);
          experienceMatch = Math.round(scores.experienceMatch || 0);
        } else {
          throw new Error('Invalid AI response format');
        }
      } catch (aiError) {
        console.log('⚠️  AI scoring failed, using rule-based:', aiError.message);
        // Fall back to rule-based
        const ruleScore = calculateRuleBasedScore(application);
        atsScore = ruleScore.atsScore;
        skillsMatch = ruleScore.skillsMatch;
        experienceMatch = ruleScore.experienceMatch;
      }
    } else {
      // Use rule-based scoring
      const ruleScore = calculateRuleBasedScore(application);
      atsScore = ruleScore.atsScore;
      skillsMatch = ruleScore.skillsMatch;
      experienceMatch = ruleScore.experienceMatch;
    }

    return {
      atsScore: Math.min(100, Math.max(0, atsScore)),
      skillsMatch: Math.min(100, Math.max(0, skillsMatch)),
      experienceMatch: Math.min(100, Math.max(0, experienceMatch))
    };
  } catch (error) {
    console.error('Auto-scoring error:', error);
    return null;
  }
}

// Rule-based scoring algorithm
function calculateRuleBasedScore(application) {
  let atsScore = 0;
  let skillsMatch = 0;
  let experienceMatch = 0;
  
  // ATS Score components
  if (application.resumeUrl) atsScore += 15;
  if (application.linkedin) atsScore += 10;
  if (application.portfolio) atsScore += 10;
  
  if (application.coverLetter) {
    const len = application.coverLetter.length;
    atsScore += len > 500 ? 20 : len > 200 ? 15 : len > 50 ? 10 : 5;
  }
  
  if (application.whyJoin) {
    const len = application.whyJoin.length;
    atsScore += len > 200 ? 15 : len > 100 ? 10 : len > 30 ? 5 : 0;
  }
  
  if (application.yearsOfExperience) {
    const years = parseInt(application.yearsOfExperience);
    atsScore += years >= 8 ? 20 : years >= 5 ? 15 : years >= 3 ? 10 : years >= 1 ? 5 : 0;
  }
  
  // Profile completeness
  if (application.currentLocation) atsScore += 2.5;
  if (application.expectedSalary) atsScore += 2.5;
  if (application.noticePeriod) atsScore += 2.5;
  if (application.email) atsScore += 2.5;
  
  // Skills Match
  if (application.linkedin) skillsMatch += 30;
  if (application.portfolio) skillsMatch += 25;
  if (application.resumeUrl) skillsMatch += 20;
  
  if (application.coverLetter) {
    const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'typescript', 
                          'mongodb', 'sql', 'aws', 'docker', 'api', 'git'];
    const found = techKeywords.filter(k => application.coverLetter.toLowerCase().includes(k));
    skillsMatch += Math.min(25, found.length * 5);
  }
  
  // Experience Match
  if (application.yearsOfExperience) {
    const years = parseInt(application.yearsOfExperience);
    experienceMatch += 40;
    experienceMatch += years >= 10 ? 40 : years >= 7 ? 35 : years >= 5 ? 30 : 
                       years >= 3 ? 25 : years >= 1 ? 20 : 10;
    if (application.linkedin) experienceMatch += 10;
    if (application.coverLetter?.length > 200) experienceMatch += 10;
  } else {
    experienceMatch = 40;
  }
  
  return {
    atsScore: Math.min(100, Math.round(atsScore)),
    skillsMatch: Math.min(100, Math.round(skillsMatch)),
    experienceMatch: Math.min(100, Math.round(experienceMatch))
  };
}

module.exports = router;
