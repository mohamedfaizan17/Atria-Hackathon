import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { contentAPI } from '../utils/api';
import toast from 'react-hot-toast';

// Dummy projects for demo
const dummyProjects = [
  {
    _id: '1',
    title: 'AI-Powered Resume Builder',
    description: 'Intelligent resume creation tool with AI suggestions, multiple templates, and ATS optimization.',
    category: 'AI Tools',
    status: 'Completed',
    technologies: ['React', 'Node.js', 'Gemini AI', 'MongoDB', 'TailwindCSS'],
    thumbnailImage: '',
    demoUrl: '/resume-builder',
    githubUrl: '#',
    featured: true
  },
  {
    _id: '2',
    title: 'ATS Resume Scorer',
    description: 'Advanced ATS scoring system that analyzes resumes against job descriptions using AI.',
    category: 'AI Tools',
    status: 'Completed',
    technologies: ['React', 'Gemini Pro', 'NLP', 'TailwindCSS'],
    thumbnailImage: '',
    demoUrl: '/resume-score',
    githubUrl: '#',
    featured: true
  },
  {
    _id: '3',
    title: 'Applicant Tracking System',
    description: 'Full-featured ATS for recruiters with AI scoring, candidate management, and analytics.',
    category: 'Enterprise',
    status: 'Completed',
    technologies: ['React', 'Node.js', 'MongoDB', 'Gemini AI', 'Charts'],
    thumbnailImage: '',
    demoUrl: '/admin/ats',
    githubUrl: '#',
    featured: true
  },
  {
    _id: '4',
    title: 'Career Hub Platform',
    description: 'Comprehensive career platform with job listings, applications, and career resources.',
    category: 'Web App',
    status: 'Completed',
    technologies: ['React', 'Express', 'MongoDB', 'Nodemailer'],
    thumbnailImage: '',
    demoUrl: '/careers',
    githubUrl: '#',
    featured: false
  },
  {
    _id: '5',
    title: 'AI Blog Platform',
    description: 'Modern blog platform with AI-powered content summarization and SEO optimization.',
    category: 'Web App',
    status: 'Completed',
    technologies: ['React', 'Node.js', 'Gemini AI', 'Markdown'],
    thumbnailImage: '',
    demoUrl: '/blog',
    githubUrl: '#',
    featured: false
  },
  {
    _id: '6',
    title: 'Portfolio Showcase',
    description: 'Beautiful portfolio website with dark mode, animations, and responsive design.',
    category: 'Web Design',
    status: 'Completed',
    technologies: ['React', 'Framer Motion', 'TailwindCSS'],
    thumbnailImage: '',
    demoUrl: '/',
    githubUrl: '#',
    featured: false
  }
];

const Projects = () => {
  const [projects, setProjects] = useState(dummyProjects);
  const [filteredProjects, setFilteredProjects] = useState(dummyProjects);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all', 'AI Tools', 'Web App', 'Enterprise', 'Web Design']);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [selectedCategory, projects]);

  const fetchProjects = async () => {
    try {
      const response = await contentAPI.getProjects();
      if (response.data.data && response.data.data.length > 0) {
        setProjects(response.data.data);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(response.data.data.map(p => p.category))];
        setCategories(uniqueCategories);
      } else {
        // Use dummy data if no projects from API
        setProjects(dummyProjects);
        const uniqueCategories = ['all', ...new Set(dummyProjects.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.log('Using dummy projects data');
      // Use dummy data on error
      setProjects(dummyProjects);
      const uniqueCategories = ['all', ...new Set(dummyProjects.map(p => p.category))];
      setCategories(uniqueCategories);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === selectedCategory));
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title mb-6"
          >
            Interactive <span className="gradient-text">Demo Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-3xl mx-auto"
          >
            Explore our AI-powered tools and innovative solutions. Click on any project to try it live!
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-700 sticky top-16 bg-white dark:bg-gray-900 z-10">
        <div className="container-custom">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                No projects found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group overflow-hidden p-0"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    {project.thumbnailImage ? (
                      <img
                        src={project.thumbnailImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-600 text-6xl font-bold">
                        {project.title.charAt(0)}
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                        {project.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex space-x-3">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Demo</span>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 font-semibold"
                        >
                          <Github className="w-4 h-4" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
