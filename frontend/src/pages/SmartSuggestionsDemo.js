import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, Award, ArrowRight, Download } from 'lucide-react';
import SmartSuggestions from '../components/SmartSuggestions';

const SmartSuggestionsDemo = () => {
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedAchievements, setSelectedAchievements] = useState([]);

  const popularRoles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'Designer',
    'Marketing Manager',
    'Sales Executive'
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior (5-8 years)' },
    { value: 'lead', label: 'Lead/Principal (8+ years)' }
  ];

  const handleExport = () => {
    const data = {
      jobRole,
      experienceLevel,
      industry,
      skills: selectedSkills,
      achievements: selectedAchievements
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suggestions-${jobRole.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
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
                AI-Powered Career Assistant
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Smart Suggestions for
              <span className="gradient-text"> Your Career</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Get AI-powered suggestions for skills and achievements tailored to your role.
              Build a compelling resume that stands out.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Input Form */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Information
                </h2>

                {/* Job Role */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="input-field"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {popularRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => setJobRole(role)}
                        className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 px-2 py-1 rounded transition-colors"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select level</option>
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Industry */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Industry (Optional)
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., FinTech, Healthcare"
                    className="input-field"
                  />
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Skills Selected</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {selectedSkills.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Achievements Selected</span>
                    <span className="font-bold text-secondary-600 dark:text-secondary-400">
                      {selectedAchievements.length}
                    </span>
                  </div>
                </div>

                {/* Export Button */}
                {(selectedSkills.length > 0 || selectedAchievements.length > 0) && (
                  <button
                    onClick={handleExport}
                    className="btn-primary w-full mt-4 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Selections</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Content - Suggestions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills Suggestions */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Skills Suggestions
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select relevant skills for your role
                    </p>
                  </div>
                </div>

                <SmartSuggestions
                  type="skills"
                  jobRole={jobRole}
                  experienceLevel={experienceLevel}
                  industry={industry}
                  selectedItems={selectedSkills}
                  onSelect={setSelectedSkills}
                  maxSelections={15}
                />
              </div>

              {/* Achievements Suggestions */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Achievement Suggestions
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Impactful statements to showcase your accomplishments
                    </p>
                  </div>
                </div>

                <SmartSuggestions
                  type="achievements"
                  jobRole={jobRole}
                  experienceLevel={experienceLevel}
                  industry={industry}
                  selectedItems={selectedAchievements}
                  onSelect={setSelectedAchievements}
                  maxSelections={10}
                />
              </div>

              {/* Selected Items Preview */}
              {(selectedSkills.length > 0 || selectedAchievements.length > 0) && (
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Your Selections
                  </h3>

                  {selectedSkills.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Skills ({selectedSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAchievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Achievements ({selectedAchievements.length})
                      </h4>
                      <ul className="space-y-2">
                        {selectedAchievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <ArrowRight className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {achievement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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
