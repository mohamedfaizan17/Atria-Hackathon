import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Target, CheckCircle, AlertCircle, TrendingUp, FileText, Sparkles } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ResumeScore = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.error('Please enter your resume text');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setAnalyzing(true);
    try {
      console.log('📊 Sending resume for AI analysis...');
      
      const response = await api.post('/resume-score/score', {
        resumeText,
        jobDescription,
        candidateName,
        yearsOfExperience,
        skills
      });

      console.log('✅ AI Analysis complete:', response.data);

      setResults({
        atsScore: response.data.data.atsScore,
        skillsMatch: response.data.data.skillsMatch,
        experienceMatch: response.data.data.experienceMatch,
        keywordsFound: response.data.data.keywordsFound,
        missingKeywords: response.data.data.missingKeywords,
        strengths: response.data.data.strengths,
        improvements: response.data.data.improvements,
        analysis: response.data.data.analysis
      });
      
      toast.success('✨ AI Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
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
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <Target className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ATS AI Resume Scorer
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get instant ATS-powered feedback on your resume. See how well it matches job requirements and optimize for Applicant Tracking Systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          {!results ? (
            <div className="space-y-6">
              {/* Optional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Optional Information (for better analysis)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Years of Experience"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Top Skills (comma-separated)"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="input-field"
                  />
                </div>
              </motion.div>

              {/* Resume Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-primary-600" />
                  Your Resume Text
                </h3>
                <textarea
                  placeholder="Paste your resume content here (or type it out)...&#10;&#10;Include:&#10;- Work Experience&#10;- Education&#10;- Skills&#10;- Projects&#10;- Certifications&#10;&#10;The more detailed, the better the analysis!"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={12}
                  className="textarea-field font-mono text-sm"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {resumeText.split(/\s+/).length} words
                </p>
              </motion.div>

              {/* Job Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-primary-600" />
                  Job Description
                </h3>
                <textarea
                  placeholder="Paste the job description here to get a targeted analysis...&#10;&#10;Include:&#10;- Required Skills&#10;- Experience Level&#10;- Responsibilities&#10;- Qualifications"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                  className="textarea-field"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {jobDescription.split(/\s+/).length} words
                </p>
              </motion.div>

              {/* Analyze Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
            /* Results Section */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Overall ATS Score */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="card text-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white dark:bg-gray-800 shadow-2xl mb-4"
                >
                  <div className="text-center">
                    <div className={`text-5xl font-black ${getScoreColor(results.atsScore)}`}>
                      {results.atsScore}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">out of 100</div>
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ATS Score
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Your resume is {results.atsScore >= 80 ? '🌟 excellent' : results.atsScore >= 60 ? '👍 good' : '⚠️ needs improvement'}
                </p>
                {results.analysis && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">
                    "{results.analysis}"
                  </p>
                )}
              </motion.div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Skills Match', score: results.skillsMatch, icon: Target, color: 'blue' },
                  { label: 'Experience Match', score: results.experienceMatch, icon: TrendingUp, color: 'purple' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`card ${getScoreBgColor(item.score)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className={`w-6 h-6 ${getScoreColor(item.score)}`} />
                      <span className={`text-3xl font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.label}</h4>
                  </motion.div>
                ))}
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="card"
                >
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Keywords Found</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.keywordsFound.map((keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="card"
                >
                  <div className="flex items-center mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Missing Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.missingKeywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-semibold"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="card bg-green-50 dark:bg-green-900/10"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                        <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="card bg-yellow-50 dark:bg-yellow-900/10"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {results.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                        <span className="text-yellow-600 dark:text-yellow-400 mr-2">!</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex justify-center gap-4"
              >
                <button
                  onClick={() => setResults(null)}
                  className="btn-outline"
                >
                  Analyze Another
                </button>
                <button className="btn-primary">
                  Download Report
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResumeScore;
