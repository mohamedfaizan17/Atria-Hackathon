import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Save, Send, Eye, Plus, Trash2, Sparkles, 
  User, Briefcase, GraduationCap, Award, FileText, X 
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import ResumeDownload from '../components/ResumeDownload';
import ModernTemplate from '../components/templates/ModernTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import MinimalistTemplate from '../components/templates/MinimalistTemplate';
import TechnicalTemplate from '../components/templates/TechnicalTemplate';

const EnhancedResumeBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeRef = useRef(null);

  const [selectedTemplate, setSelectedTemplate] = useState(searchParams.get('template') || 'modern');
  const [showPreview, setShowPreview] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });

  const templates = {
    modern: { name: 'Modern Professional', component: ModernTemplate },
    executive: { name: 'Executive', component: ExecutiveTemplate },
    creative: { name: 'Creative', component: CreativeTemplate },
    minimalist: { name: 'Minimalist', component: MinimalistTemplate },
    technical: { name: 'Technical', component: TechnicalTemplate }
  };

  useEffect(() => {
    // Load saved resume data from localStorage
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved resume:', error);
      }
    }

    // Fetch available jobs
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getJobs();
      setAvailableJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const addArrayItem = (section, template) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const saveResume = () => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };

  const handleApplyToJob = async (job) => {
    if (!resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      toast.error('Please fill in your name and email first');
      return;
    }

    setSelectedJob(job);
    
    // Navigate to careers page with resume data
    localStorage.setItem('applyResumeData', JSON.stringify(resumeData));
    navigate(`/careers?apply=${job._id}`);
    toast.success('Redirecting to application form...');
  };

  const TemplateComponent = templates[selectedTemplate]?.component || ModernTemplate;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Build your professional resume</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={saveResume}
                className="btn-outline text-sm flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-outline text-sm flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              
              <button
                onClick={() => setShowJobModal(true)}
                className="btn-secondary text-sm flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply to Jobs</span>
              </button>
              
              {showPreview && (
                <div className="border-l pl-2">
                  <ResumeDownload 
                    resumeRef={resumeRef}
                    fileName={`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume`}
                    showApplyButton={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Template Selector */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Template
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedTemplate === key
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={resumeData.personalInfo.name}
                    onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Job Title *"
                    value={resumeData.personalInfo.title}
                    onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email *"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    className="input-field"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                  className="input-field"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Portfolio URL"
                    value={resumeData.personalInfo.portfolio}
                    onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Professional Summary
              </h2>
              <textarea
                placeholder="Write a brief summary about yourself..."
                value={resumeData.summary}
                onChange={(e) => handleInputChange('summary', null, e.target.value)}
                rows="4"
                className="input-field"
              />
            </div>

            {/* Experience */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Experience
                </h2>
                <button
                  onClick={() => addArrayItem('experience', {
                    title: '',
                    company: '',
                    period: '',
                    achievements: ['']
                  })}
                  className="btn-outline text-sm py-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                    <button
                      onClick={() => removeArrayItem('experience', idx)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => updateArrayItem('experience', idx, 'title', e.target.value)}
                        className="input-field"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Period (e.g., 2020 - Present)"
                          value={exp.period}
                          onChange={(e) => updateArrayItem('experience', idx, 'period', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      {exp.achievements?.map((achievement, aIdx) => (
                        <div key={aIdx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Achievement/Responsibility"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...exp.achievements];
                              newAchievements[aIdx] = e.target.value;
                              updateArrayItem('experience', idx, 'achievements', newAchievements);
                            }}
                            className="input-field flex-1"
                          />
                          {exp.achievements.length > 1 && (
                            <button
                              onClick={() => {
                                const newAchievements = exp.achievements.filter((_, i) => i !== aIdx);
                                updateArrayItem('experience', idx, 'achievements', newAchievements);
                              }}
                              className="text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newAchievements = [...(exp.achievements || []), ''];
                          updateArrayItem('experience', idx, 'achievements', newAchievements);
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        + Add Achievement
                      </button>
                    </div>
                  </div>
                ))}
                {resumeData.experience.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No experience added yet</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </h2>
                <button
                  onClick={() => addArrayItem('education', {
                    degree: '',
                    school: '',
                    period: ''
                  })}
                  className="btn-outline text-sm py-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                    <button
                      onClick={() => removeArrayItem('education', idx)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)}
                        className="input-field"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="School/University"
                          value={edu.school}
                          onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Period"
                          value={edu.period}
                          onChange={(e) => updateArrayItem('education', idx, 'period', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {resumeData.education.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No education added yet</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Skills
              </h2>
              <textarea
                placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                value={resumeData.skills.join(', ')}
                onChange={(e) => handleInputChange('skills', null, e.target.value.split(',').map(s => s.trim()))}
                rows="3"
                className="input-field"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-32 h-fit">
            {showPreview ? (
              <div className="card bg-gray-100 dark:bg-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preview</h2>
                <div 
                  ref={resumeRef}
                  className="bg-white rounded-lg shadow-xl overflow-hidden transform scale-75 origin-top"
                >
                  <TemplateComponent data={resumeData} />
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <Eye className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  Click "Show Preview" to see your resume
                </p>
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn-primary"
                >
                  Show Preview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply to Jobs Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Apply to Job Openings
                </h2>
                <button onClick={() => setShowJobModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {availableJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No job openings available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableJobs.map((job) => (
                      <div
                        key={job._id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {job.department} • {job.location} • {job.type}
                            </p>
                          </div>
                          <button
                            onClick={() => handleApplyToJob(job)}
                            className="btn-primary text-sm py-2"
                          >
                            Apply Now
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {job.requirements?.slice(0, 3).map((req, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedResumeBuilder;
