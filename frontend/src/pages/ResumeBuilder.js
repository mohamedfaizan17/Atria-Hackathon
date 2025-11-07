import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, User, Briefcase, GraduationCap, Award, Mail, Phone, MapPin } from 'lucide-react';
import { aiAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [{ company: '', position: '', duration: '', description: '' }],
    education: [{ institution: '', degree: '', year: '' }],
    skills: '',
  });
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', position: '', duration: '', description: '' }]
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', year: '' }]
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData({ ...formData, experience: newExperience });
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData({ ...formData, education: newEducation });
  };

  const enhanceWithAI = async () => {
    if (!formData.summary) {
      toast.error('Please add a summary first!');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.generateContent({
        type: 'resume',
        data: formData.summary
      });

      setFormData({
        ...formData,
        summary: response.data.content
      });
      setAiEnhanced(true);
      toast.success('✨ Resume enhanced with AI!');
    } catch (error) {
      toast.error('Failed to enhance resume');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = () => {
    toast.success('Resume download started!');
  };

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="gradient-bg py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              AI Resume Builder
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Create a professional resume enhanced by artificial intelligence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resume Form */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Personal Information */}
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-6 h-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Professional Summary */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Professional Summary</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={enhanceWithAI}
                    disabled={loading}
                    className="btn-secondary text-sm py-2 px-4 flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{loading ? 'Enhancing...' : 'AI Enhance'}</span>
                  </motion.button>
                </div>
                <textarea
                  name="summary"
                  placeholder="Write a brief summary of your professional background..."
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  className="textarea-field"
                />
                {aiEnhanced && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhanced by AI
                  </motion.p>
                )}
              </div>

              {/* Experience */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Experience</h3>
                  </div>
                  <button
                    onClick={addExperience}
                    className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                  >
                    + Add More
                  </button>
                </div>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      className="input-field"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={exp.duration}
                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      rows={2}
                      className="textarea-field"
                    />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Education</h3>
                  </div>
                  <button
                    onClick={addEducation}
                    className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                  >
                    + Add More
                  </button>
                </div>
                {formData.education.map((edu, index) => (
                  <div key={index} className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      className="input-field"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                <textarea
                  name="skills"
                  placeholder="Enter your skills separated by commas (e.g., React, Node.js, Python)"
                  value={formData.skills}
                  onChange={handleChange}
                  rows={3}
                  className="textarea-field"
                />
              </div>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resume Preview</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadResume}
                    className="btn-primary text-sm py-2 px-4 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>

                {/* Preview Content */}
                <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                  {formData.fullName && (
                    <div className="text-center border-b pb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.fullName}</h2>
                      <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {formData.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {formData.email}
                          </div>
                        )}
                        {formData.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {formData.phone}
                          </div>
                        )}
                        {formData.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {formData.location}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.summary && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Professional Summary</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{formData.summary}</p>
                    </div>
                  )}

                  {formData.experience[0].company && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Experience</h3>
                      {formData.experience.map((exp, index) => (
                        exp.company && (
                          <div key={index} className="mb-3">
                            <p className="font-semibold text-gray-900 dark:text-white">{exp.position}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company} • {exp.duration}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{exp.description}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {formData.education[0].institution && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Education</h3>
                      {formData.education.map((edu, index) => (
                        edu.institution && (
                          <div key={index} className="mb-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{edu.degree}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution} • {edu.year}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {formData.skills && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.split(',').map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeBuilder;
