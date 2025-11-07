import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Camera, Palette, Star } from 'lucide-react';

const CreativeTemplate = ({ data = {} }) => {
  const {
    personalInfo = {
      name: 'Alex Rivera',
      title: 'Creative Designer & Brand Strategist',
      email: 'alex.rivera@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      linkedin: 'linkedin.com/in/alexrivera',
      portfolio: 'alexrivera.design'
    },
    summary = 'Award-winning creative designer with 7+ years of experience crafting compelling brand identities and user experiences. Passionate about merging aesthetics with functionality to create memorable digital experiences.',
    experience = [
      {
        title: 'Senior Creative Designer',
        company: 'Creative Agency Pro',
        period: '2021 - Present',
        achievements: [
          'Led rebranding projects for 15+ Fortune 500 clients',
          'Increased client engagement by 85% through innovative designs',
          'Managed creative team of 8 designers and illustrators',
          'Won 3 industry awards for outstanding creative work'
        ]
      },
      {
        title: 'Brand Designer',
        company: 'Design Studio XYZ',
        period: '2018 - 2021',
        achievements: [
          'Created brand identities for 50+ startups',
          'Designed UI/UX for mobile apps with 2M+ downloads',
          'Collaborated with marketing teams on 100+ campaigns'
        ]
      }
    ],
    skills = {
      design: ['Adobe Creative Suite', 'Figma', 'Sketch', 'InVision'],
      branding: ['Brand Strategy', 'Visual Identity', 'Typography', 'Color Theory'],
      digital: ['UI/UX Design', 'Web Design', 'Motion Graphics', 'Prototyping']
    },
    projects = [
      { name: 'TechCorp Rebrand', description: 'Complete brand overhaul for tech startup', year: '2023' },
      { name: 'EcoApp Mobile Design', description: 'Sustainable living app UI/UX', year: '2022' },
      { name: 'Fashion Week Campaign', description: 'Visual campaign for major fashion event', year: '2022' }
    ],
    awards = [
      'Best Brand Identity - Design Awards 2023',
      'Creative Excellence - Awwwards 2022',
      'Innovation in Design - AIGA 2021'
    ]
  } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl overflow-hidden" style={{ minHeight: '297mm' }}>
      {/* Creative Header with Gradient */}
      <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 p-10 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-2 tracking-tight">{personalInfo.name}</h1>
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6" />
            <h2 className="text-2xl font-light">{personalInfo.title}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
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
              <Globe className="w-4 h-4" />
              <span>{personalInfo.portfolio}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* About Me */}
        <section>
          <div className="flex items-center mb-3">
            <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mr-3"></div>
            <h3 className="text-2xl font-bold text-gray-900">About Me</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </section>

        {/* Experience */}
        <section>
          <div className="flex items-center mb-3">
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mr-3"></div>
            <h3 className="text-2xl font-bold text-gray-900">Experience</h3>
          </div>
          <div className="space-y-4">
            {(experience || []).map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-4 border-pink-300">
                <div className="absolute w-4 h-4 bg-pink-500 rounded-full -left-2 top-1"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{exp.title}</h4>
                    <p className="text-purple-600 font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-sm bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-1">
                  {(exp.achievements || []).map((achievement, i) => (
                    <li key={i} className="text-gray-700 text-sm flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="flex items-center mb-3">
            <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mr-3"></div>
            <h3 className="text-2xl font-bold text-gray-900">Skills & Expertise</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(skills || {}).map(([category, items], idx) => (
              <div key={idx}>
                <h4 className="font-bold text-gray-800 capitalize mb-2 flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2 ml-4">
                  {(Array.isArray(items) ? items : []).map((skill, i) => (
                    <span key={i} className="bg-gradient-to-r from-pink-100 to-orange-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section>
          <div className="flex items-center mb-3">
            <div className="w-12 h-1 bg-gradient-to-r from-yellow-500 to-pink-500 mr-3"></div>
            <h3 className="text-2xl font-bold text-gray-900">Featured Projects</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {(projects || []).map((project, idx) => (
              <div key={idx} className="bg-gradient-to-r from-pink-50 to-orange-50 p-4 rounded-lg border-l-4 border-pink-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{project.name}</h4>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">{project.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Awards & Recognition */}
        <section>
          <div className="flex items-center mb-3">
            <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mr-3"></div>
            <h3 className="text-2xl font-bold text-gray-900">Awards & Recognition</h3>
          </div>
          <div className="space-y-2">
            {(awards || []).map((award, idx) => (
              <div key={idx} className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-gray-700">{award}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreativeTemplate;
