import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Star, Edit, Download, Sparkles, Layout, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResumeHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const features = [
    {
      icon: Star,
      title: 'AI Resume Scoring',
      description: 'Get instant AI-powered analysis of your resume with detailed scoring across multiple criteria.',
      link: '/resume-score',
      color: 'from-yellow-500 to-orange-500',
      category: 'ai'
    },
    {
      icon: Edit,
      title: 'Resume Builder',
      description: 'Create professional resumes with our intuitive builder featuring multiple templates.',
      link: '/resume-builder',
      color: 'from-blue-500 to-purple-500',
      category: 'builder'
    },
    {
      icon: Layout,
      title: 'Professional Templates',
      description: 'Choose from a variety of professionally designed resume templates.',
      link: '/resume-templates',
      color: 'from-green-500 to-teal-500',
      category: 'templates'
    },
    {
      icon: Sparkles,
      title: 'Smart Suggestions',
      description: 'Get AI-powered suggestions for skills and achievements based on your job role.',
      link: '/smart-suggestions',
      color: 'from-purple-500 to-pink-500',
      category: 'ai'
    }
  ];

  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      image: '/templates/modern.png',
      description: 'Clean and modern design perfect for tech and creative industries',
      color: 'from-blue-500 to-purple-500',
      features: ['ATS Friendly', 'Two-Column Layout', 'Modern Typography']
    },
    {
      id: 2,
      name: 'Executive',
      image: '/templates/executive.png',
      description: 'Sophisticated design for senior-level positions',
      color: 'from-gray-700 to-gray-900',
      features: ['Professional Look', 'Highlights Leadership', 'Traditional Format']
    },
    {
      id: 3,
      name: 'Creative',
      image: '/templates/creative.png',
      description: 'Stand out with this creative and colorful design',
      color: 'from-pink-500 to-orange-500',
      features: ['Eye-Catching', 'Portfolio Integration', 'Visual Elements']
    },
    {
      id: 4,
      name: 'Minimalist',
      image: '/templates/minimalist.png',
      description: 'Simple and elegant design that highlights your experience',
      color: 'from-teal-500 to-green-500',
      features: ['Clean Design', 'Easy to Read', 'Timeless Style']
    },
    {
      id: 5,
      name: 'Technical',
      image: '/templates/technical.png',
      description: 'Perfect for developers and technical professionals',
      color: 'from-indigo-500 to-blue-500',
      features: ['Skills Focused', 'Project Highlights', 'GitHub Integration']
    },
    {
      id: 6,
      name: 'Academic',
      image: '/templates/academic.png',
      description: 'Ideal for researchers and academic positions',
      color: 'from-blue-600 to-cyan-500',
      features: ['Publications Section', 'Research Focus', 'Conference Listings']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'ai', label: 'AI-Powered' },
    { id: 'builder', label: 'Builder' },
    { id: 'templates', label: 'Templates' }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                AI-Powered Resume Tools
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Complete
              <span className="gradient-text"> Resume Solution</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Build, optimize, and score your resume with cutting-edge AI technology.
              Stand out from the competition with professional templates and intelligent insights.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/resume-builder" className="btn-primary">
                <Edit className="w-5 h-5 mr-2" />
                Start Building
              </Link>
              <Link to="/resume-score" className="btn-outline">
                <Star className="w-5 h-5 mr-2" />
                Score My Resume
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Resume Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create a winning resume
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.link} className="block group">
                  <div className="card h-full hover:scale-105 transition-transform duration-300">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Templates Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Templates
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group hover:shadow-xl transition-all duration-300"
              >
                {/* Template Preview */}
                <div className={`h-48 rounded-xl bg-gradient-to-br ${template.color} mb-4 flex items-center justify-center relative overflow-hidden`}>
                  <FileText className="w-20 h-20 text-white/30" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {template.features.map(feat => (
                    <div key={feat} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {feat}
                    </div>
                  ))}
                </div>

                <Link 
                  to={`/resume-builder?template=${template.id}`}
                  className="btn-primary w-full text-center"
                >
                  Use This Template
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Use Our Resume Tools?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Intelligence',
                description: 'Get instant feedback and recommendations powered by advanced AI algorithms'
              },
              {
                icon: Layout,
                title: 'Professional Templates',
                description: 'Choose from ATS-friendly, professionally designed templates that get results'
              },
              {
                icon: Download,
                title: 'Multiple Formats',
                description: 'Export your resume in PDF, DOCX, or other formats compatible with any system'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white mb-4">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of professionals who've landed their dream jobs with our tools
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/resume-builder" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                <Edit className="w-5 h-5 mr-2" />
                Start Building Now
              </Link>
              <Link to="/resume-score" className="btn-outline border-white text-white hover:bg-white/10">
                <Star className="w-5 h-5 mr-2" />
                Score Your Resume
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResumeHub;
