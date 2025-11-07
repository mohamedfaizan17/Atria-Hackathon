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
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-Time',
        description: 'We are looking for an experienced Full Stack Developer to join our engineering team. You will work on cutting-edge AI-powered applications, building scalable web solutions that impact millions of users.',
        requirements: [
          '5+ years of experience in full-stack development',
          'Strong proficiency in React, Node.js, and MongoDB',
          'Experience with cloud platforms (AWS, Azure, or GCP)',
          'Knowledge of RESTful APIs and microservices architecture',
          'Excellent problem-solving and communication skills'
        ],
        responsibilities: [
          'Design and develop scalable web applications',
          'Collaborate with cross-functional teams',
          'Write clean, maintainable code',
          'Mentor junior developers',
          'Participate in code reviews and technical discussions'
        ],
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
        salary: '$120,000 - $160,000',
        experienceLevel: 'Senior',
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        title: 'AI/ML Engineer',
        department: 'Data Science',
        location: 'Hybrid - San Francisco',
        type: 'Full-Time',
        description: 'Join our AI team to build and deploy machine learning models that power our intelligent applications. Work with state-of-the-art technologies including GPT, BERT, and custom neural networks.',
        requirements: [
          'MS or PhD in Computer Science, AI, or related field',
          '3+ years of experience in machine learning',
          'Strong Python programming skills',
          'Experience with TensorFlow, PyTorch, or similar frameworks',
          'Understanding of NLP and computer vision'
        ],
        responsibilities: [
          'Develop and train machine learning models',
          'Optimize model performance and accuracy',
          'Deploy models to production environments',
          'Research new AI technologies and techniques',
          'Collaborate with product teams on AI features'
        ],
        skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Deep Learning', 'Scikit-learn'],
        salary: '$140,000 - $180,000',
        experienceLevel: 'Mid to Senior',
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Product Designer (UI/UX)',
        department: 'Design',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Create beautiful, intuitive user experiences for our AI-powered products. You will work closely with product managers and engineers to design interfaces that delight users.',
        requirements: [
          '4+ years of UI/UX design experience',
          'Strong portfolio demonstrating design skills',
          'Proficiency in Figma, Adobe XD, or Sketch',
          'Understanding of user research and testing methodologies',
          'Experience with design systems'
        ],
        responsibilities: [
          'Design user interfaces for web and mobile applications',
          'Conduct user research and usability testing',
          'Create wireframes, prototypes, and high-fidelity mockups',
          'Maintain and evolve design system',
          'Collaborate with developers on implementation'
        ],
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'User Testing'],
        salary: '$100,000 - $140,000',
        experienceLevel: 'Mid to Senior',
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Build and maintain our cloud infrastructure, ensuring high availability, security, and performance. Work with modern DevOps tools and practices.',
        requirements: [
          '3+ years of DevOps experience',
          'Strong knowledge of AWS/Azure/GCP',
          'Experience with Kubernetes and Docker',
          'Proficiency in CI/CD pipelines',
          'Understanding of infrastructure as code (Terraform, CloudFormation)'
        ],
        responsibilities: [
          'Manage cloud infrastructure and deployments',
          'Implement and maintain CI/CD pipelines',
          'Monitor system performance and reliability',
          'Automate operational tasks',
          'Ensure security and compliance'
        ],
        skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'Python', 'Bash'],
        salary: '$110,000 - $150,000',
        experienceLevel: 'Mid-Level',
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Build beautiful, responsive web applications using React and modern frontend technologies. Create seamless user experiences across all devices.',
        requirements: [
          '3+ years of frontend development experience',
          'Expert knowledge of React and JavaScript/TypeScript',
          'Strong CSS skills and responsive design',
          'Experience with state management (Redux, Context API)',
          'Understanding of web performance optimization'
        ],
        responsibilities: [
          'Develop responsive web applications',
          'Implement pixel-perfect designs',
          'Optimize application performance',
          'Write unit and integration tests',
          'Collaborate with designers and backend developers'
        ],
        skills: ['React', 'TypeScript', 'CSS', 'Redux', 'Next.js', 'Tailwind CSS'],
        salary: '$90,000 - $130,000',
        experienceLevel: 'Mid-Level',
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Technical Content Writer',
        department: 'Marketing',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Create engaging technical content including blog posts, tutorials, documentation, and case studies. Help developers understand and use our AI-powered tools.',
        requirements: [
          '2+ years of technical writing experience',
          'Strong understanding of software development',
          'Excellent writing and communication skills',
          'Experience with developer documentation',
          'Familiarity with AI/ML concepts'
        ],
        responsibilities: [
          'Write technical blog posts and tutorials',
          'Create and maintain product documentation',
          'Develop case studies and white papers',
          'Collaborate with engineering and product teams',
          'Optimize content for SEO'
        ],
        skills: ['Technical Writing', 'Documentation', 'SEO', 'Markdown', 'Git', 'APIs'],
        salary: '$70,000 - $95,000',
        experienceLevel: 'Mid-Level',
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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
    const { name, email, phone, coverLetter, resumeUrl } = req.body;
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

    // Create application
    const application = new Application({
      job: jobId,
      name,
      email,
      phone,
      coverLetter,
      resumeUrl,
      status: 'submitted',
      submittedAt: new Date()
    });

    await application.save();

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

module.exports = router;
