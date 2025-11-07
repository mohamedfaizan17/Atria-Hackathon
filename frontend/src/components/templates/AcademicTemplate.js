import React from 'react';
import { Mail, Phone, MapPin, GraduationCap, BookOpen, Award, Users, FileText } from 'lucide-react';

const AcademicTemplate = ({ data = {} }) => {
  const {
    personalInfo = {
      name: 'Dr. Rebecca Smith',
      title: 'Assistant Professor of Computer Science',
      email: 'rebecca.smith@university.edu',
      phone: '+1 (555) 567-8901',
      location: 'Cambridge, MA',
      orcid: '0000-0001-2345-6789'
    },
    researchInterests = [
      'Artificial Intelligence',
      'Machine Learning',
      'Natural Language Processing',
      'Deep Learning',
      'Computer Vision'
    ],
    education = [
      {
        degree: 'Ph.D. in Computer Science',
        school: 'Stanford University',
        location: 'Stanford, CA',
        period: '2015 - 2020',
        thesis: 'Advanced Neural Networks for Natural Language Understanding',
        advisor: 'Prof. John Anderson'
      },
      {
        degree: 'M.S. in Computer Science',
        school: 'MIT',
        location: 'Cambridge, MA',
        period: '2013 - 2015'
      },
      {
        degree: 'B.S. in Computer Science',
        school: 'UC Berkeley',
        location: 'Berkeley, CA',
        period: '2009 - 2013',
        honors: 'Summa Cum Laude'
      }
    ],
    academicPositions = [
      {
        title: 'Assistant Professor',
        department: 'Department of Computer Science',
        institution: 'Harvard University',
        period: '2020 - Present',
        responsibilities: [
          'Teaching graduate and undergraduate courses in AI and Machine Learning',
          'Leading research lab with 8 Ph.D. students and 4 postdocs',
          'Secured $2M in research funding from NSF and industry partners',
          'Published 15 peer-reviewed papers in top-tier conferences'
        ]
      },
      {
        title: 'Postdoctoral Researcher',
        department: 'AI Research Lab',
        institution: 'Stanford University',
        period: '2020 - 2021',
        responsibilities: [
          'Conducted research on transformer architectures',
          'Collaborated with industry partners on applied AI projects',
          'Mentored graduate students'
        ]
      }
    ],
    publications = [
      {
        title: 'Attention Mechanisms in Neural Machine Translation',
        authors: 'Smith, R., Johnson, A., Williams, B.',
        venue: 'Neural Information Processing Systems (NeurIPS)',
        year: '2023',
        citations: 156
      },
      {
        title: 'Transfer Learning for Low-Resource Languages',
        authors: 'Smith, R., Chen, L.',
        venue: 'Association for Computational Linguistics (ACL)',
        year: '2022',
        citations: 203
      },
      {
        title: 'Efficient Training of Large Language Models',
        authors: 'Smith, R., et al.',
        venue: 'International Conference on Machine Learning (ICML)',
        year: '2021',
        citations: 421
      }
    ],
    teaching = [
      { course: 'CS 229: Machine Learning', level: 'Graduate', terms: '2021-Present' },
      { course: 'CS 188: Artificial Intelligence', level: 'Undergraduate', terms: '2020-Present' },
      { course: 'CS 224N: Natural Language Processing', level: 'Graduate', terms: '2022-Present' }
    ],
    grants = [
      {
        title: 'Neural Architectures for Multilingual Understanding',
        agency: 'National Science Foundation',
        amount: '$800,000',
        period: '2022-2025',
        role: 'Principal Investigator'
      },
      {
        title: 'AI for Healthcare Applications',
        agency: 'NIH',
        amount: '$500,000',
        period: '2021-2024',
        role: 'Co-Principal Investigator'
      }
    ],
    service = [
      'Program Committee Member: NeurIPS 2023, ICML 2023, ACL 2023',
      'Area Chair: EMNLP 2023',
      'Reviewer: Nature Machine Intelligence, JMLR, TACL',
      'Faculty Advisor: Women in Computer Science Chapter'
    ],
    awards = [
      'NSF CAREER Award (2023)',
      'Best Paper Award - ACL (2022)',
      'Outstanding Dissertation Award - Stanford (2020)',
      'Google PhD Fellowship (2018-2020)'
    ]
  } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
      {/* Header - Academic Style */}
      <div className="border-b-2 border-gray-800 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">{personalInfo.name}</h1>
        <h2 className="text-xl text-gray-700 mb-4">{personalInfo.title}</h2>
        
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
            <span className="font-semibold">ORCID:</span>
            <span>{personalInfo.orcid}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Research Interests */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Research Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {researchInterests.map((interest, idx) => (
              <span key={idx} className="text-sm text-gray-700">
                {interest}{idx < researchInterests.length - 1 ? ' •' : ''}
              </span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Education
          </h3>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <span className="text-sm text-gray-600">{edu.period}</span>
                </div>
                <p className="text-gray-700">{edu.school}, {edu.location}</p>
                {edu.thesis && <p className="text-sm text-gray-600 italic">Thesis: {edu.thesis}</p>}
                {edu.advisor && <p className="text-sm text-gray-600">Advisor: {edu.advisor}</p>}
                {edu.honors && <p className="text-sm text-gray-600 font-semibold">{edu.honors}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Academic Positions */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3">
            Academic Positions
          </h3>
          <div className="space-y-4">
            {academicPositions.map((pos, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h4 className="font-bold text-gray-900">{pos.title}</h4>
                    <p className="text-gray-700">{pos.department}</p>
                    <p className="text-gray-600">{pos.institution}</p>
                  </div>
                  <span className="text-sm text-gray-600">{pos.period}</span>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                  {pos.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Publications */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Selected Publications
          </h3>
          <div className="space-y-3">
            {publications.map((pub, idx) => (
              <div key={idx} className="text-sm">
                <p className="text-gray-900">
                  {pub.authors} ({pub.year}). <span className="italic">{pub.title}</span>.
                </p>
                <p className="text-gray-700">
                  {pub.venue}. <span className="text-gray-600">Citations: {pub.citations}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Teaching Experience */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Teaching Experience
          </h3>
          <div className="space-y-2">
            {teaching.map((course, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>
                  <span className="font-semibold text-gray-900">{course.course}</span>
                  <span className="text-gray-600 ml-2">({course.level})</span>
                </div>
                <span className="text-gray-600">{course.terms}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Grants & Funding */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3">
            Grants & Funding
          </h3>
          <div className="space-y-3">
            {grants.map((grant, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-gray-900">{grant.title}</h4>
                  <span className="text-gray-600">{grant.period}</span>
                </div>
                <p className="text-gray-700">
                  {grant.agency} • {grant.amount} • {grant.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Awards & Honors */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Awards & Honors
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {awards.map((award, idx) => (
              <li key={idx}>{award}</li>
            ))}
          </ul>
        </section>

        {/* Professional Service */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3">
            Professional Service
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {service.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AcademicTemplate;
