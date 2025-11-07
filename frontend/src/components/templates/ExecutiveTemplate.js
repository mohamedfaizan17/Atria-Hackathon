import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const ExecutiveTemplate = ({ data = {} }) => {
  const {
    personalInfo = {
      name: 'Sarah Johnson',
      title: 'Chief Technology Officer',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/sarahjohnson'
    },
    summary = 'Strategic technology executive with 15+ years of experience leading digital transformation initiatives. Proven track record of scaling organizations, driving innovation, and building high-performing teams. Expert in enterprise architecture, cloud migration, and strategic planning.',
    experience = [
      {
        title: 'Chief Technology Officer',
        company: 'Fortune 500 Enterprise',
        location: 'New York, NY',
        period: '2020 - Present',
        achievements: [
          'Led digital transformation initiative resulting in $50M annual cost savings',
          'Built and managed technology team of 200+ engineers across 5 countries',
          'Architected cloud migration strategy moving 85% of infrastructure to AWS',
          'Established DevOps culture reducing deployment time by 70%'
        ]
      },
      {
        title: 'VP of Engineering',
        company: 'Tech Unicorn Startup',
        location: 'San Francisco, CA',
        period: '2016 - 2020',
        achievements: [
          'Scaled engineering organization from 15 to 150 people',
          'Led product development for platform serving 10M+ users',
          'Implemented agile methodologies across all engineering teams',
          'Reduced technical debt by 60% through strategic refactoring'
        ]
      },
      {
        title: 'Director of Engineering',
        company: 'Global Software Company',
        location: 'Seattle, WA',
        period: '2012 - 2016',
        achievements: [
          'Managed 5 cross-functional engineering teams',
          'Delivered 3 major product launches on time and under budget',
          'Improved team productivity by 40% through process optimization'
        ]
      }
    ],
    education = [
      {
        degree: 'Master of Business Administration (MBA)',
        school: 'Stanford Graduate School of Business',
        location: 'Stanford, CA',
        period: '2010 - 2012'
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'MIT',
        location: 'Cambridge, MA',
        period: '2004 - 2008'
      }
    ],
    expertise = [
      'Strategic Planning & Execution',
      'Digital Transformation',
      'Cloud Architecture (AWS, Azure)',
      'Team Building & Leadership',
      'Agile & DevOps',
      'Enterprise Architecture',
      'Budget Management ($50M+)',
      'Stakeholder Management'
    ],
    achievements = [
      'Led company to achieve SOC 2 Type II certification',
      'Reduced infrastructure costs by $10M annually',
      'Named "Top 50 Tech Leaders" by TechCrunch (2022)',
      'Speaker at AWS re:Invent and Google Cloud Next'
    ]
  } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
      {/* Header Section - Traditional & Professional */}
      <div className="border-b-4 border-gray-800 p-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-1">{personalInfo.name}</h1>
        <h2 className="text-2xl text-gray-700 mb-4">{personalInfo.title}</h2>
        
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>{personalInfo.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{personalInfo.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Linkedin className="w-4 h-4" />
            <span>{personalInfo.linkedin}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Executive Summary */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Executive Summary
          </h3>
          <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
        </section>

        {/* Core Competencies */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Core Competencies
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {expertise.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <span className="w-2 h-2 bg-gray-800 mr-2"></span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Professional Experience
          </h3>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{exp.title}</h4>
                    <p className="text-gray-700 font-semibold">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{exp.period}</p>
                    <p className="text-gray-600 text-sm">{exp.location}</p>
                  </div>
                </div>
                <ul className="space-y-1 ml-4">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-gray-700 text-sm flex">
                      <span className="mr-2">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Key Achievements */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Key Achievements
          </h3>
          <ul className="space-y-1 ml-4">
            {achievements.map((achievement, idx) => (
              <li key={idx} className="text-gray-700 flex">
                <span className="mr-2">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Education
          </h3>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-baseline">
                <div>
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-700">{edu.school}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">{edu.period}</p>
                  <p className="text-gray-600 text-sm">{edu.location}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
