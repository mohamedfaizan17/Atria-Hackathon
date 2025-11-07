import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, X, Upload, FileText, Target, Sparkles, CheckCircle } from 'lucide-react';
import { jobsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { useAnalytics } from '../hooks/useAnalytics';

const Careers = () => {
  const { trackConversion } = useAnalytics();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
    yearsOfExperience: '',
    currentLocation: '',
    expectedSalary: '',
    noticePeriod: '',
    whyJoin: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [fromResumeBuilder, setFromResumeBuilder] = useState(false);

  useEffect(() => {
    const loadJobsAndResume = async () => {
      await fetchJobs();
      
      // Check if coming from resume builder
      const applyJobId = searchParams.get('apply');
      const savedResumeData = localStorage.getItem('applyResumeData');
      
      if (applyJobId && savedResumeData) {
        try {
          const resumeData = JSON.parse(savedResumeData);
          
          // Pre-fill application data from resume
          setApplicationData(prev => ({
            ...prev,
            name: resumeData.personalInfo?.name || '',
            email: resumeData.personalInfo?.email || '',
            phone: resumeData.personalInfo?.phone || '',
            linkedin: resumeData.personalInfo?.linkedin || '',
            portfolio: resumeData.personalInfo?.portfolio || '',
            currentLocation: resumeData.personalInfo?.location || '',
            coverLetter: resumeData.summary || ''
          }));
          
          setFromResumeBuilder(true);
          
          // Find and open the job application modal
          const response = await jobsAPI.getJobs();
          const job = response.data.find(j => j._id === applyJobId);
          if (job) {
            setSelectedJob(job);
            setShowApplicationModal(true);
            toast.success('Resume data loaded! Please review and submit.');
          }
          
          // Clear the saved data
          localStorage.removeItem('applyResumeData');
        } catch (error) {
          console.error('Error loading resume data:', error);
        }
      }
    };
    
    loadJobsAndResume();
  }, [searchParams]);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedJobs = async () => {
    setSeeding(true);
    try {
      await jobsAPI.seedJobs();
      toast.success('Dummy jobs created successfully!');
      // Refresh jobs list
      await fetchJobs();
    } catch (error) {
      console.error('Error seeding jobs:', error);
      toast.error('Failed to seed jobs. Make sure backend is running.');
    } finally {
      setSeeding(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationChange = (e) => {
    setApplicationData({ ...applicationData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!applicationData.name || !applicationData.email || !applicationData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!resumeFile && !applicationData.linkedin && !applicationData.portfolio) {
      toast.error('Please upload a resume or provide a LinkedIn/Portfolio link');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare comprehensive cover letter with all details
      const detailedCoverLetter = `
=== APPLICATION DETAILS ===

COVER LETTER:
${applicationData.coverLetter}

WHY JOIN MASTERSOLIS:
${applicationData.whyJoin}

PROFESSIONAL DETAILS:
- Years of Experience: ${applicationData.yearsOfExperience}
- Current Location: ${applicationData.currentLocation}
- Expected Salary: ${applicationData.expectedSalary || 'Not specified'}
- Notice Period: ${applicationData.noticePeriod}

LINKS:
- LinkedIn: ${applicationData.linkedin || 'Not provided'}
- Portfolio: ${applicationData.portfolio || 'Not provided'}
- Resume: ${resumeFile ? resumeFile.name : 'Provided via link'}
      `.trim();

      const payload = {
        name: applicationData.name,
        email: applicationData.email,
        phone: applicationData.phone,
        coverLetter: detailedCoverLetter,
        resumeUrl: applicationData.linkedin || applicationData.portfolio || (resumeFile ? resumeFile.name : '')
      };

      console.log('Submitting application:', payload);
      const response = await jobsAPI.applyJob(selectedJob._id, payload);
      console.log('Application response:', response);

      toast.success('🎉 Application submitted successfully! Check your email for confirmation.', {
        duration: 5000
      });
      
      if (trackConversion) {
        trackConversion('jobApplications');
      }
      
      setShowApplicationModal(false);
      setApplicationData({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        coverLetter: '',
        yearsOfExperience: '',
        currentLocation: '',
        expectedSalary: '',
        noticePeriod: '',
        whyJoin: ''
      });
      setResumeFile(null);
    } catch (error) {
      console.error('Application error:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit application. Please try again.';
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg py-24">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold">
              <Briefcase className="w-4 h-4 mr-2" />
              We're Hiring!
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold mb-6"
          >
            Join Our <span className="gradient-text">Innovative Team</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Be part of an innovative team building the future of technology with AI. 
            We're looking for talented individuals who are passionate about making a difference.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12"
          >
            {[
              { label: 'Open Positions', value: jobs.length || '5+' },
              { label: 'Team Members', value: '50+' },
              { label: 'Countries', value: '10+' },
              { label: 'Growth Rate', value: '200%' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              >
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Join Mastersolis
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover exciting opportunities and become part of our innovative team
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Briefcase className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  No open positions at the moment.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Click the button below to load sample job openings
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSeedJobs}
                  disabled={seeding}
                  className="btn-primary inline-flex items-center space-x-2 px-8 py-3"
                >
                  {seeding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading Jobs...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Load Sample Jobs (6 positions)</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:border-primary-200 dark:hover:border-primary-800 flex flex-col h-full"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                        Open
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {job.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Briefcase className="w-4 h-4 mr-2 text-primary-500" />
                        {job.department}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 text-secondary-500" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2 text-green-500" />
                        {job.type}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                          <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                          {job.salary}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApply(job)}
                    className="btn-primary w-full mt-4"
                  >
                    Apply Now
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Career Tools */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Career Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              AI-powered tools to help you land your dream job
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Resume Builder */}
            <Link to="/resume-builder">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="card group bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 cursor-pointer h-full"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                      AI Resume Builder
                      <Sparkles className="w-5 h-5 ml-2 text-yellow-500" />
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Create a professional resume with AI-powered content enhancement and live preview
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                      <span>Start Building</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Resume Score */}
            <Link to="/resume-score">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="card group bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-700 cursor-pointer h-full"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                      AI Resume Scorer
                      <Sparkles className="w-5 h-5 ml-2 text-yellow-500" />
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Get instant AI analysis and score your resume against job descriptions
                    </p>
                    <div className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                      <span>Analyze Now</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-20">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Briefcase className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  No open positions at the moment.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Click the button below to load sample job openings
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSeedJobs}
                  disabled={seeding}
                  className="btn-primary inline-flex items-center space-x-2 px-8 py-3"
                >
                  {seeding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading Jobs...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Load Sample Jobs (6 positions)</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Open Positions
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Find your perfect role and join our growing team
                </p>
              </div>

              <div className="space-y-6">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card group hover:border-primary-200 dark:hover:border-primary-800 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                              </div>
                              <span className="font-medium">{job.department}</span>
                            </span>
                            <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <div className="w-9 h-9 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                              </div>
                              <span className="font-medium">{job.location}</span>
                            </span>
                            <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium">{job.type}</span>
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 6).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 text-primary-700 dark:text-primary-300 text-sm font-semibold rounded-lg border border-primary-200 dark:border-primary-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 6 && (
                            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold rounded-lg">
                              +{job.skills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApply(job)}
                          className="btn-primary whitespace-nowrap px-8 text-lg"
                        >
                          Apply Now
                        </motion.button>
                        {job.salary && (
                          <div className="text-center md:text-right">
                            <div className="flex items-center justify-center md:justify-end space-x-2 text-gray-600 dark:text-gray-400">
                              <DollarSign className="w-5 h-5 text-green-600" />
                              <span className="font-bold text-gray-900 dark:text-white">{job.salary}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Apply for {selectedJob?.title}
                </h2>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {fromResumeBuilder && (
                <div className="mx-6 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">Resume Data Loaded</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your information from Resume Builder has been pre-filled. Please review and complete any remaining fields.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitApplication} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={applicationData.name}
                      onChange={handleApplicationChange}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={applicationData.email}
                      onChange={handleApplicationChange}
                      required
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={applicationData.phone}
                      onChange={handleApplicationChange}
                      required
                      className="input-field"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={applicationData.linkedin}
                      onChange={handleApplicationChange}
                      className="input-field"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={applicationData.portfolio}
                    onChange={handleApplicationChange}
                    className="input-field"
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Resume * (PDF, DOC, DOCX)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span>{resumeFile ? resumeFile.name : 'Click to upload resume'}</span>
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Years of Experience *
                    </label>
                    <select
                      name="yearsOfExperience"
                      value={applicationData.yearsOfExperience}
                      onChange={handleApplicationChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-8">5-8 years</option>
                      <option value="8+">8+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Current Location *
                    </label>
                    <input
                      type="text"
                      name="currentLocation"
                      value={applicationData.currentLocation}
                      onChange={handleApplicationChange}
                      required
                      className="input-field"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Expected Salary (Annual)
                    </label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={applicationData.expectedSalary}
                      onChange={handleApplicationChange}
                      className="input-field"
                      placeholder="e.g., $100,000 - $120,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Notice Period *
                    </label>
                    <select
                      name="noticePeriod"
                      value={applicationData.noticePeriod}
                      onChange={handleApplicationChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select notice period</option>
                      <option value="Immediate">Immediate</option>
                      <option value="2 weeks">2 weeks</option>
                      <option value="1 month">1 month</option>
                      <option value="2 months">2 months</option>
                      <option value="3+ months">3+ months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Why do you want to join Mastersolis? *
                  </label>
                  <textarea
                    name="whyJoin"
                    value={applicationData.whyJoin}
                    onChange={handleApplicationChange}
                    required
                    rows="4"
                    className="textarea-field"
                    placeholder="Tell us what excites you about this opportunity..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Cover Letter *
                  </label>
                  <textarea
                    name="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={handleApplicationChange}
                    required
                    rows="5"
                    className="textarea-field"
                    placeholder="Tell us why you're a great fit for this role..."
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;
