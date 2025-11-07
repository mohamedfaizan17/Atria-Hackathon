import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Lazy load templates with error handling
let ModernTemplate, ExecutiveTemplate, CreativeTemplate, MinimalistTemplate, TechnicalTemplate, AcademicTemplate;

try {
  ModernTemplate = require('../components/templates/ModernTemplate').default;
  ExecutiveTemplate = require('../components/templates/ExecutiveTemplate').default;
  CreativeTemplate = require('../components/templates/CreativeTemplate').default;
  MinimalistTemplate = require('../components/templates/MinimalistTemplate').default;
  TechnicalTemplate = require('../components/templates/TechnicalTemplate').default;
  AcademicTemplate = require('../components/templates/AcademicTemplate').default;
  console.log('✅ All templates loaded successfully');
} catch (error) {
  console.error('❌ Error loading templates:', error);
}

const ResumeTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [templateError, setTemplateError] = useState(null);

  // Sample resume data for previews
  const sampleData = {
    personalInfo: {
      name: 'John Doe',
      title: 'Senior Software Engineer',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      portfolio: 'johndoe.dev',
      github: 'github.com/johndoe'
    },
    summary: 'Experienced software engineer with 8+ years of expertise in full-stack development. Proven track record of building scalable applications and leading cross-functional teams. Passionate about clean code and innovative solutions.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        period: '2020 - Present',
        achievements: [
          'Led development of microservices architecture serving 1M+ users',
          'Improved application performance by 60% through optimization',
          'Mentored team of 5 junior developers',
          'Implemented CI/CD pipeline reducing deployment time by 75%'
        ]
      },
      {
        title: 'Software Engineer',
        company: 'Startup Inc',
        period: '2017 - 2020',
        achievements: [
          'Built RESTful APIs handling 500K+ requests daily',
          'Developed real-time features using WebSockets',
          'Reduced bug count by 40% through automated testing'
        ]
      }
    ],
    education: [
      {
        degree: 'BS, Computer Science',
        school: 'University of California',
        period: '2013 - 2017',
        gpa: '3.8/4.0'
      }
    ],
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
      'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Git'
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional'
    ]
  };

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and modern design perfect for tech and creative industries',
      color: 'from-blue-500 to-purple-500',
      component: ModernTemplate,
      features: ['ATS Friendly', 'Two-Column Layout', 'Modern Typography', 'Color Accents'],
      bestFor: 'Tech, Design, Marketing'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated design for senior-level positions and C-suite roles',
      color: 'from-gray-700 to-gray-900',
      component: ExecutiveTemplate,
      features: ['Professional Look', 'Highlights Leadership', 'Traditional Format', 'Impact-Focused'],
      bestFor: 'Leadership, Management, Executive'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Stand out with this creative and colorful design',
      color: 'from-pink-500 to-orange-500',
      component: CreativeTemplate,
      features: ['Eye-Catching', 'Portfolio Integration', 'Visual Elements', 'Unique Design'],
      bestFor: 'Design, Creative, Arts'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple and elegant design that highlights your experience',
      color: 'from-teal-500 to-green-500',
      component: MinimalistTemplate,
      features: ['Clean Design', 'Easy to Read', 'Timeless Style', 'Focus on Content'],
      bestFor: 'Any Industry, All Levels'
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Perfect for developers and technical professionals',
      color: 'from-indigo-500 to-blue-500',
      component: TechnicalTemplate,
      features: ['Skills Focused', 'Project Highlights', 'GitHub Integration', 'Code Theme'],
      bestFor: 'Software Engineering, IT'
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Ideal for researchers and academic positions',
      color: 'from-blue-600 to-cyan-500',
      component: AcademicTemplate,
      features: ['Publications Section', 'Research Focus', 'Conference Listings', 'Grant Details'],
      bestFor: 'Academia, Research, Education'
    }
  ];

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleDownload = (template) => {
    // In a real implementation, this would generate and download a PDF
    alert(`Downloading ${template.name} template... (Feature coming soon!)`);
  };

  const handleUseTemplate = (templateId) => {
    // Navigate to resume builder with selected template
    window.location.href = `/resume-builder?template=${templateId}`;
  };

  if (showPreview && selectedTemplate) {
    const TemplateComponent = selectedTemplate.component;
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container-custom max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => setShowPreview(false)}
            className="btn-outline mb-6 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Templates</span>
          </button>

          {/* Template Info */}
          <div className="card mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedTemplate.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedTemplate.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTemplate.features.map((feature, idx) => (
                    <span key={idx} className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                      <CheckCircle className="w-3 h-3" />
                      <span>{feature}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDownload(selectedTemplate)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => handleUseTemplate(selectedTemplate.id)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Use This Template</span>
                </button>
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
              Live Preview
            </h3>
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden mx-auto" style={{ maxWidth: '800px' }}>
              {TemplateComponent ? (
                <div className="transform scale-75 origin-top">
                  <TemplateComponent data={sampleData} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Template preview not available</p>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="mt-4 btn-primary"
                    >
                      Back to Templates
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                Professional Resume Templates
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Perfect
              <span className="gradient-text"> Template</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Select from our collection of professionally designed, ATS-friendly resume templates.
              Each template is carefully crafted to help you stand out.
            </p>

            <Link to="/resume" className="btn-outline inline-flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Resume Hub</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group hover:shadow-2xl transition-all duration-300"
              >
                {/* Template Preview Thumbnail */}
                <div className={`h-64 rounded-xl mb-4 relative overflow-hidden bg-gradient-to-br ${template.color} border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-400 transition-all`}>
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 right-4 h-3 bg-white rounded"></div>
                    <div className="absolute top-10 left-4 right-4 h-2 bg-white rounded"></div>
                    <div className="absolute top-16 left-4 w-1/2 h-2 bg-white rounded"></div>
                    <div className="absolute top-24 left-4 right-4 space-y-2">
                      <div className="h-2 bg-white rounded w-full"></div>
                      <div className="h-2 bg-white rounded w-5/6"></div>
                      <div className="h-2 bg-white rounded w-4/6"></div>
                    </div>
                    <div className="absolute top-40 left-4 right-4 space-y-2">
                      <div className="h-2 bg-white rounded w-full"></div>
                      <div className="h-2 bg-white rounded w-3/4"></div>
                    </div>
                  </div>
                  
                  {/* Template Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
                    <FileText className="w-24 h-24 text-white" />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-90 transition-all duration-300`} />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handlePreview(template)}
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <div className="mb-4 space-y-2">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Best For Badge */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">BEST FOR:</span>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                    {template.bestFor}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePreview(template)}
                    className="btn-outline flex-1 text-center"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="btn-primary flex-1 text-center"
                  >
                    Use Template
                  </button>
                </div>
              </motion.div>
            ))}
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
              Not Sure Which Template to Choose?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Try our AI Resume Score tool to get personalized recommendations
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/resume-score" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Get AI Recommendations
              </Link>
              <Link to="/resume-builder" className="btn-outline border-white text-white hover:bg-white/10">
                Start Building
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResumeTemplates;
