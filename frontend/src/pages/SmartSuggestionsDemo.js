import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Upload, FileText, Target, CheckCircle, AlertTriangle, TrendingUp, Award, Download, Zap } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SmartSuggestionsDemo = () => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [extracting, setExtracting] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, DOCX, or TXT file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setResumeFile(file);
    setExtracting(true);

    try {
      console.log('\n📤 === STARTING FILE UPLOAD ===');
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const formData = new FormData();
      formData.append('resume', file);
      console.log('✅ FormData created');

      console.log('📡 Sending POST request to /smart-analysis/extract-text...');
      const response = await api.post('/smart-analysis/extract-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000 // 30 second timeout
      });

      console.log('\n✅ === RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);

      // Validate response structure
      if (!response || !response.data) {
        console.error('❌ Invalid response structure!');
        console.error('Response:', response);
        throw new Error('Invalid server response - no data received');
      }

      // Check for explicit failure
      if (response.data.success === false) {
        console.error('❌ Server explicitly returned failure');
        console.error('Error from server:', response.data.error);
        throw new Error(response.data.error || response.data.message || 'Server failed to process file');
      }

      // Validate text field exists
      if (!response.data.text) {
        console.error('❌ Response missing text field!');
        console.error('Response data keys:', Object.keys(response.data));
        console.error('Full response data:', JSON.stringify(response.data));
        throw new Error('Server response missing extracted text');
      }

      // Success!
      const extractedText = response.data.text;
      const charCount = extractedText.length;
      
      console.log('✅ === EXTRACTION SUCCESSFUL ===');
      console.log('Characters extracted:', charCount);
      console.log('Method used:', response.data.method || 'unknown');
      console.log('Preview:', extractedText.substring(0, 100) + '...');
      console.log('=================================\n');

      setResumeText(extractedText);
      toast.success(`✅ Resume uploaded successfully! ${charCount} characters extracted.`, {
        duration: 4000
      });
      
    } catch (error) {
      console.error('\n❌ === UPLOAD FAILED ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      
      if (error.response) {
        // Server responded with error
        console.error('Server error response:');
        console.error('  Status:', error.response.status);
        console.error('  Data:', error.response.data);
        console.error('  Headers:', error.response.headers);
        
        const serverError = error.response.data?.error || error.response.data?.message || 'Server error';
        toast.error(`Upload failed: ${serverError}`, { duration: 5000 });
        
      } else if (error.request) {
        // Request made but no response
        console.error('No response from server');
        console.error('Request:', error.request);
        toast.error('Upload failed: No response from server. Is the backend running?', { duration: 5000 });
        
      } else {
        // Error in request setup
        console.error('Request setup error:', error.message);
        toast.error(`Upload failed: ${error.message}`, { duration: 5000 });
      }
      
      console.error('Full error object:', error);
      console.error('================================\n');
      
      setResumeFile(null);
    } finally {
      setExtracting(false);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.error('Please upload your resume or enter resume text');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter the job description');
      return;
    }

    setAnalyzing(true);
    try {
      console.log('🔍 Starting AI analysis...');
      
      const response = await api.post('/smart-analysis/analyze', {
        resumeText,
        jobDescription
      });

      console.log('✅ Analysis complete:', response.data);
      setAnalysis(response.data.data);
      toast.success('🎉 Analysis complete!');
      setActiveTab('overview');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!analysis) return;
    
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.json`;
    a.click();
    toast.success('Analysis exported!');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <section className="py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                AI-Powered Resume Analysis
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Smart Resume<span className="gradient-text"> Analysis & Optimization</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload your resume and job description for AI-powered analysis, ATS optimization, 
              and professional formatting suggestions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container-custom max-w-4xl">
          {!analysis ? (
            <div className="space-y-6">
              {/* Resume Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Upload Your Resume
                  </h3>
                </div>

                {/* File Upload Area */}
                <div className="mb-4">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                    disabled={extracting}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      extracting
                        ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed'
                        : 'border-primary-300 dark:border-primary-600 hover:border-primary-500 dark:hover:border-primary-400 bg-primary-50 dark:bg-primary-900/10'
                    }`}
                  >
                    <Upload className={`w-12 h-12 mb-3 ${extracting ? 'text-gray-400' : 'text-primary-600 dark:text-primary-400'}`} />
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {extracting ? 'Extracting text...' : resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      PDF, DOCX, or TXT (Max 5MB)
                    </p>
                    {resumeFile && !extracting && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        ✓ File uploaded successfully
                      </p>
                    )}
                  </label>
                </div>

                {/* Manual Text Input (Optional) */}
                {!resumeFile && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
                      Or paste your resume text below
                    </p>
                    <textarea
                      placeholder="Paste your resume content here...&#10;&#10;Include:&#10;- Contact Information&#10;- Work Experience&#10;- Education&#10;- Skills&#10;- Projects & Achievements"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      rows={8}
                      className="textarea-field font-mono text-sm"
                    />
                  </div>
                )}

                {/* Extracted Text Preview */}
                {resumeText && resumeFile && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Extracted Text Preview
                      </p>
                      <button
                        onClick={() => {
                          setResumeFile(null);
                          setResumeText('');
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg max-h-40 overflow-y-auto">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap">
                        {resumeText.substring(0, 500)}...
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {resumeText.split(/\s+/).filter(w => w).length} words
                </p>
              </motion.div>

              {/* Job Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-secondary-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Job Description
                  </h3>
                </div>
                <textarea
                  placeholder="Paste the job description here...&#10;&#10;Include:&#10;- Required Skills&#10;- Experience Level&#10;- Responsibilities&#10;- Qualifications"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                  className="textarea-field"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {jobDescription.split(/\s+/).filter(w => w).length} words
                </p>
              </motion.div>

              {/* Analyze Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={analyzeResume}
                  disabled={analyzing}
                  className="btn-primary text-lg py-4 px-12 flex items-center space-x-3 disabled:opacity-50"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>{analyzing ? 'Analyzing...' : 'Analyze with AI'}</span>
                </motion.button>
              </motion.div>
            </div>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              {/* Results Header */}
              <div className="card text-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Analysis Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your comprehensive resume analysis is ready
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setAnalysis(null)}
                    className="btn-outline"
                  >
                    Analyze Another
                  </button>
                  <button
                    onClick={handleExport}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Job Fit Score */}
                <div className={`card ${getScoreBgColor(analysis.jobFit?.overallFitScore || 0)}`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.jobFit?.overallFitScore || 0)} mb-2`}>
                      {analysis.jobFit?.overallFitScore || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Overall Job Fit
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {analysis.jobFit?.fitLevel || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Skills Match */}
                <div className={`card ${getScoreBgColor(analysis.skillsMatch?.matchScore || 0)}`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.skillsMatch?.matchScore || 0)} mb-2`}>
                      {analysis.skillsMatch?.matchScore || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Skills Match
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {analysis.skillsMatch?.matchedSkills?.length || 0} matched
                    </div>
                  </div>
                </div>

                {/* ATS Score */}
                <div className={`card ${getScoreBgColor(analysis.atsOptimization?.atsScore || 0)}`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.atsOptimization?.atsScore || 0)} mb-2`}>
                      {analysis.atsOptimization?.atsScore || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      ATS Score
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      System Compatibility
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Priorities */}
              {analysis.recommendations?.topPriorities && (
                <div className="card">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Top Priority Actions
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {analysis.recommendations.topPriorities.map((priority, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex items-center justify-center text-sm font-bold mr-3">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{priority}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                {analysis.skillsMatch?.matchedSkills?.length > 0 && (
                  <div className="card">
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Matched Skills
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skillsMatch.matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {analysis.skillsMatch?.missingSkills?.length > 0 && (
                  <div className="card">
                    <div className="flex items-center space-x-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Skills to Add
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skillsMatch.missingSkills.slice(0, 10).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Smart Enhancements */}
              {analysis.smartEnhancements && (
                <div className="card">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Smart Enhancements
                    </h3>
                  </div>
                  
                  {/* Achievement Suggestions */}
                  {analysis.smartEnhancements.achievementSuggestions?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Suggested Achievement Statements
                      </h4>
                      <ul className="space-y-2">
                        {analysis.smartEnhancements.achievementSuggestions.slice(0, 5).map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Verbs */}
                  {analysis.smartEnhancements.actionVerbs?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Powerful Action Verbs to Use
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.smartEnhancements.actionVerbs.map((verb, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded text-sm font-medium"
                          >
                            {verb}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your Resume?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Use these suggestions in our Resume Builder to create a professional resume
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/resume-builder" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Go to Resume Builder
              </a>
              <a href="/resume" className="btn-outline border-white text-white hover:bg-white/10">
                Explore All Tools
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SmartSuggestionsDemo;
