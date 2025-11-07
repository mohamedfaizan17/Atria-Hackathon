import React from 'react';

const MinimalistTemplate = ({ data = {} }) => {
  const {
    personalInfo = {
      name: 'Emma Thompson',
      title: 'Product Manager',
      email: 'emma.thompson@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      linkedin: 'linkedin.com/in/emmathompson'
    },
    summary = 'Results-driven Product Manager with 6+ years of experience launching successful digital products. Expertise in agile methodologies, user research, and cross-functional team leadership.',
    experience = [
      {
        title: 'Senior Product Manager',
        company: 'Tech Solutions Inc',
        period: '2021 - Present',
        achievements: [
          'Led product strategy for SaaS platform serving 500K+ users',
          'Increased user retention by 45% through data-driven improvements',
          'Managed product roadmap and coordinated with engineering, design, and marketing',
          'Successfully launched 4 major features on schedule'
        ]
      },
      {
        title: 'Product Manager',
        company: 'Digital Startup',
        period: '2018 - 2021',
        achievements: [
          'Defined product vision and strategy for mobile application',
          'Conducted user research and usability testing with 200+ participants',
          'Collaborated with engineering team to deliver quarterly releases'
        ]
      }
    ],
    education = [
      {
        degree: 'MBA, Product Management',
        school: 'University of Texas',
        period: '2016 - 2018'
      },
      {
        degree: 'BS, Computer Science',
        school: 'University of California',
        period: '2012 - 2016'
      }
    ],
    skills = [
      'Product Strategy',
      'Agile/Scrum',
      'User Research',
      'Data Analysis',
      'Roadmap Planning',
      'A/B Testing',
      'SQL',
      'Figma',
      'JIRA',
      'Stakeholder Management'
    ]
  } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
      <div className="p-12 space-y-8">
        {/* Header - Minimalist */}
        <header className="border-b border-gray-300 pb-6">
          <h1 className="text-5xl font-light text-gray-900 mb-2 tracking-tight">{personalInfo.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{personalInfo.title}</p>
          <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.location}</span>
            <span>•</span>
            <span>{personalInfo.linkedin}</span>
          </div>
        </header>

        {/* Summary */}
        <section>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">{exp.period}</span>
                </div>
                <ul className="space-y-1 text-gray-700">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm leading-relaxed">
                      — {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">Education</h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.period}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MinimalistTemplate;
