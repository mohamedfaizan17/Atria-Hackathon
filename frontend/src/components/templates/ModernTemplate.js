import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, Code } from 'lucide-react';

const ModernTemplate = ({ data = {} }) => {
  const {
    personalInfo = {
      name: 'John Doe',
      title: 'Full Stack Developer',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.dev'
    },
    summary = 'Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about creating efficient, user-friendly solutions.',
    experience = [
      {
        title: 'Senior Full Stack Developer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        period: 'Jan 2021 - Present',
        achievements: [
          'Led development of microservices architecture serving 1M+ users',
          'Reduced API response time by 40% through optimization',
          'Mentored team of 5 junior developers'
        ]
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        period: 'Jun 2019 - Dec 2020',
        achievements: [
          'Built RESTful APIs using Node.js and Express',
          'Developed responsive web applications with React',
          'Implemented CI/CD pipelines with Jenkins'
        ]
      }
    ],
    education = [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California',
        location: 'Berkeley, CA',
        period: '2015 - 2019',
        gpa: '3.8/4.0'
      }
    ],
    skills = [
      { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
      { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'Django'] },
      { category: 'Database', items: ['MongoDB', 'PostgreSQL', 'Redis'] },
      { category: 'DevOps', items: ['Docker', 'AWS', 'CI/CD', 'Kubernetes'] }
    ],
    certifications = [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2022' },
      { name: 'MongoDB Certified Developer', issuer: 'MongoDB University', year: '2021' }
    ]
  } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.name}</h1>
        <h2 className="text-xl font-light mb-4 opacity-90">{personalInfo.title}</h2>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
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
          {personalInfo.website && (
            <div className="flex items-center space-x-2 col-span-2">
              <Globe className="w-4 h-4" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-8">
        {/* Main Column */}
        <div className="col-span-2 space-y-6">
          {/* Professional Summary */}
          <section>
            <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-3">
              Professional Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-3 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-gray-800">{exp.title}</h4>
                      <p className="text-gray-600">{exp.company} • {exp.location}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-3 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h3>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.school} • {edu.location}</p>
                  </div>
                  <span className="text-sm text-gray-500">{edu.period}</span>
                </div>
                {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2 mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Skills
            </h3>
            <div className="space-y-3">
              {skills.map((skillGroup, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{skillGroup.category}</h4>
                  <div className="flex flex-wrap gap-1">
                    {skillGroup.items.map((skill, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Certifications
              </h3>
              <div className="space-y-2">
                {certifications.map((cert, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-gray-800 text-sm">{cert.name}</h4>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
