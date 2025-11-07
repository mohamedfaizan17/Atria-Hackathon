import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Code, Database, Server, Terminal, Briefcase, GraduationCap, Award } from 'lucide-react';

const TechnicalTemplate = ({ data = {} }) => {
  const {
    personalInfo = {
      name: 'Michael Chen',
      title: 'Senior Software Engineer',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      github: 'github.com/michaelchen',
      linkedin: 'linkedin.com/in/michaelchen',
      website: 'michaelchen.dev'
    },
    summary = 'Senior Software Engineer specializing in distributed systems and cloud architecture. 8+ years of experience building scalable applications with microservices. Open-source contributor with 500+ GitHub stars.',
    technicalSkills = {
      languages: ['JavaScript/TypeScript', 'Python', 'Go', 'Java', 'C++'],
      frontend: ['React', 'Next.js', 'Vue.js', 'Redux', 'Tailwind CSS'],
      backend: ['Node.js', 'Express', 'Django', 'FastAPI', 'GraphQL'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
      cloud: ['AWS (EC2, S3, Lambda)', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
      tools: ['Git', 'Jenkins', 'GitHub Actions', 'Terraform', 'Grafana']
    },
    experience = [
      {
        title: 'Senior Software Engineer',
        company: 'Cloud Tech Corp',
        period: '2020 - Present',
        technologies: ['Node.js', 'React', 'AWS', 'Kubernetes'],
        achievements: [
          'Architected microservices platform processing 1M+ requests/day',
          'Reduced API latency by 60% through optimization and caching strategies',
          'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
          'Mentored 5 junior engineers and conducted technical interviews'
        ]
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        period: '2017 - 2020',
        technologies: ['Python', 'Django', 'PostgreSQL', 'React'],
        achievements: [
          'Built RESTful APIs serving 500K+ active users',
          'Implemented real-time features using WebSockets',
          'Optimized database queries improving performance by 45%',
          'Led migration from monolith to microservices architecture'
        ]
      }
    ],
    projects = [
      {
        name: 'Open Source Task Scheduler',
        description: 'Distributed task queue with 2K+ GitHub stars',
        technologies: ['Go', 'Redis', 'Docker'],
        link: 'github.com/michaelchen/task-scheduler'
      },
      {
        name: 'E-Commerce Platform',
        description: 'Full-stack marketplace with payment integration',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        link: 'github.com/michaelchen/ecommerce'
      },
      {
        name: 'ML Model Deployment API',
        description: 'Scalable API for serving machine learning models',
        technologies: ['Python', 'FastAPI', 'TensorFlow', 'Docker'],
        link: 'github.com/michaelchen/ml-api'
      }
    ],
    education = [
      {
        degree: 'BS, Computer Science',
        school: 'University of Washington',
        period: '2013 - 2017',
        gpa: '3.9/4.0'
      }
    ],
    certifications = [
      'AWS Certified Solutions Architect - Professional',
      'Google Cloud Professional Cloud Architect',
      'Certified Kubernetes Administrator (CKA)'
    ]
  } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-gray-50 shadow-2xl" style={{ minHeight: '297mm' }}>
      {/* Header with Code Theme */}
      <div className="bg-gray-900 text-gray-100 p-8">
        <div className="flex items-center space-x-2 text-green-400 mb-2 font-mono text-sm">
          <Terminal className="w-4 h-4" />
          <span>$ whoami</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 font-mono">{personalInfo.name}</h1>
        <h2 className="text-xl text-gray-400 mb-4">{personalInfo.title}</h2>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>{personalInfo.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-400" />
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Github className="w-4 h-4 text-blue-400" />
            <span>{personalInfo.github}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>{personalInfo.website}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Summary */}
        <section className="bg-white p-5 rounded-lg border-l-4 border-indigo-600">
          <div className="flex items-center mb-2">
            <Code className="w-5 h-5 mr-2 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">$ cat summary.txt</h3>
          </div>
          <p className="text-gray-700 leading-relaxed font-mono text-sm">{summary}</p>
        </section>

        {/* Technical Skills */}
        <section className="bg-white p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <Server className="w-5 h-5 mr-2 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">$ ls skills/</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(technicalSkills).map(([category, skills], idx) => (
              <div key={idx}>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2 flex items-center">
                  <span className="text-green-600 mr-2">├──</span>
                  {category}/
                </h4>
                <div className="flex flex-wrap gap-2 ml-6">
                  {skills.map((skill, i) => (
                    <span key={i} className="bg-gray-800 text-gray-100 px-2 py-1 rounded text-xs font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">$ cat experience.log</h3>
          </div>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="border-l-2 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{exp.title}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 font-mono">{exp.period}</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex">
                      <span className="text-green-600 mr-2">▸</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="bg-white p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <Github className="w-5 h-5 mr-2 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">$ ls projects/</h3>
          </div>
          <div className="space-y-3">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 font-mono">{project.name}</h4>
                  <a href={`https://${project.link}`} className="text-xs text-indigo-600 hover:underline font-mono">
                    {project.link}
                  </a>
                </div>
                <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="text-xs bg-gray-800 text-gray-100 px-2 py-0.5 rounded font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <div className="grid grid-cols-2 gap-4">
          <section className="bg-white p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Education</h3>
            </div>
            {education.map((edu, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">{edu.period}</p>
                {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>

          <section className="bg-white p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <Award className="w-5 h-5 mr-2 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate;
