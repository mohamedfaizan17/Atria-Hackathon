const Job = require('../models/Job');
const Application = require('../models/Application');
const { analyzeResume } = require('./aiController');

// @desc    Get all jobs
// @route   GET /api/career/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { department, type, location, isActive } = req.query;
    
    const filter = {};
    if (department) filter.department = department;
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, 'i');
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/career/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/career/jobs
// @access  Private (Admin)
exports.createJob = async (req, res, next) => {
  try {
    req.body.postedBy = req.user.id;
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/career/jobs/:id
// @access  Private (Admin)
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/career/jobs/:id
// @access  Private (Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit job application
// @route   POST /api/career/apply/:jobId
// @access  Public
exports.applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { applicant, coverLetter, resumeText } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      'applicant.email': applicant.email
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position'
      });
    }

    // Create application object
    const applicationData = {
      job: jobId,
      applicant,
      coverLetter
    };

    // Handle resume file if uploaded
    if (req.file) {
      applicationData.resume = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      };
    }

    // AI Resume Scoring (if resume text provided)
    if (resumeText) {
      try {
        const jobRequirements = `
Title: ${job.title}
Skills: ${job.skills.join(', ')}
Experience: ${job.experience}
Requirements: ${job.requirements.join(', ')}
        `;

        // Create a mock request object for AI analysis
        const mockReq = {
          body: {
            resumeText,
            jobRequirements
          }
        };

        const mockRes = {
          status: (code) => ({
            json: (data) => {
              if (data.success && data.data) {
                applicationData.aiScore = {
                  overall: data.data.overall || 75,
                  skillMatch: data.data.skillMatch || 70,
                  experienceMatch: data.data.experienceMatch || 75,
                  educationMatch: data.data.educationMatch || 80,
                  analysis: data.data.analysis || 'Resume analyzed successfully',
                  recommendations: data.data.recommendations || []
                };
              }
            }
          })
        };

        await analyzeResume(mockReq, mockRes, () => {});
      } catch (error) {
        console.error('Resume AI scoring error:', error);
        // Continue without AI score
      }
    }

    // Create application
    const application = await Application.create(applicationData);

    // Update job applications count
    job.applicationsCount += 1;
    await job.save();

    // Send email notification (implement email service)
    // await sendApplicationEmail(applicant.email, job);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: application._id,
        aiScore: application.aiScore
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/career/applications
// @access  Private (Admin)
exports.getApplications = async (req, res, next) => {
  try {
    const { job, status } = req.query;
    
    const filter = {};
    if (job) filter.job = job;
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate('job', 'title department location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/career/applications/:id
// @access  Private (Admin)
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/career/applications/:id/status
// @access  Private (Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    application.reviewNotes = reviewNotes;
    application.reviewedBy = req.user.id;

    await application.save();

    // Send status update email to applicant
    // await sendStatusUpdateEmail(application);

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};
