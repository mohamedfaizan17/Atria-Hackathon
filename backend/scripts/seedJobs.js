const mongoose = require('mongoose');
const Job = require('../models/Job');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mastersolis', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

const dummyJobs = [
  {
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-Time',
    description: 'We are looking for an experienced Full Stack Developer to join our engineering team. You will work on cutting-edge AI-powered applications, building scalable web solutions that impact millions of users.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Strong proficiency in React, Node.js, and MongoDB',
      'Experience with cloud platforms (AWS, Azure, or GCP)',
      'Knowledge of RESTful APIs and microservices architecture',
      'Excellent problem-solving and communication skills'
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Mentor junior developers',
      'Participate in code reviews and technical discussions'
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
    salary: '$120,000 - $160,000',
    experienceLevel: 'Senior',
    posted: new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'AI/ML Engineer',
    department: 'Data Science',
    location: 'Hybrid - San Francisco',
    type: 'Full-Time',
    description: 'Join our AI team to build and deploy machine learning models that power our intelligent applications. Work with state-of-the-art technologies including GPT, BERT, and custom neural networks.',
    requirements: [
      'MS or PhD in Computer Science, AI, or related field',
      '3+ years of experience in machine learning',
      'Strong Python programming skills',
      'Experience with TensorFlow, PyTorch, or similar frameworks',
      'Understanding of NLP and computer vision'
    ],
    responsibilities: [
      'Develop and train machine learning models',
      'Optimize model performance and accuracy',
      'Deploy models to production environments',
      'Research new AI technologies and techniques',
      'Collaborate with product teams on AI features'
    ],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Deep Learning', 'Scikit-learn'],
    salary: '$140,000 - $180,000',
    experienceLevel: 'Mid to Senior',
    posted: new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Product Designer (UI/UX)',
    department: 'Design',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Create beautiful, intuitive user experiences for our AI-powered products. You will work closely with product managers and engineers to design interfaces that delight users.',
    requirements: [
      '4+ years of UI/UX design experience',
      'Strong portfolio demonstrating design skills',
      'Proficiency in Figma, Adobe XD, or Sketch',
      'Understanding of user research and testing methodologies',
      'Experience with design systems'
    ],
    responsibilities: [
      'Design user interfaces for web and mobile applications',
      'Conduct user research and usability testing',
      'Create wireframes, prototypes, and high-fidelity mockups',
      'Maintain and evolve design system',
      'Collaborate with developers on implementation'
    ],
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'User Testing'],
    salary: '$100,000 - $140,000',
    experienceLevel: 'Mid to Senior',
    posted: new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Build and maintain our cloud infrastructure, ensuring high availability, security, and performance. Work with modern DevOps tools and practices.',
    requirements: [
      '3+ years of DevOps experience',
      'Strong knowledge of AWS/Azure/GCP',
      'Experience with Kubernetes and Docker',
      'Proficiency in CI/CD pipelines',
      'Understanding of infrastructure as code (Terraform, CloudFormation)'
    ],
    responsibilities: [
      'Manage cloud infrastructure and deployments',
      'Implement and maintain CI/CD pipelines',
      'Monitor system performance and reliability',
      'Automate operational tasks',
      'Ensure security and compliance'
    ],
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'Python', 'Bash'],
    salary: '$110,000 - $150,000',
    experienceLevel: 'Mid-Level',
    posted: new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Build beautiful, responsive web applications using React and modern frontend technologies. Create seamless user experiences across all devices.',
    requirements: [
      '3+ years of frontend development experience',
      'Expert knowledge of React and JavaScript/TypeScript',
      'Strong CSS skills and responsive design',
      'Experience with state management (Redux, Context API)',
      'Understanding of web performance optimization'
    ],
    responsibilities: [
      'Develop responsive web applications',
      'Implement pixel-perfect designs',
      'Optimize application performance',
      'Write unit and integration tests',
      'Collaborate with designers and backend developers'
    ],
    skills: ['React', 'TypeScript', 'CSS', 'Redux', 'Next.js', 'Tailwind CSS'],
    salary: '$90,000 - $130,000',
    experienceLevel: 'Mid-Level',
    posted: new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Technical Content Writer',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Create engaging technical content including blog posts, tutorials, documentation, and case studies. Help developers understand and use our AI-powered tools.',
    requirements: [
      '2+ years of technical writing experience',
      'Strong understanding of software development',
      'Excellent writing and communication skills',
      'Experience with developer documentation',
      'Familiarity with AI/ML concepts'
    ],
    responsibilities: [
      'Write technical blog posts and tutorials',
      'Create and maintain product documentation',
      'Develop case studies and white papers',
      'Collaborate with engineering and product teams',
      'Optimize content for SEO'
    ],
    skills: ['Technical Writing', 'Documentation', 'SEO', 'Markdown', 'Git', 'APIs'],
    salary: '$70,000 - $95,000',
    experienceLevel: 'Mid-Level',
    posted: new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

async function seedJobs() {
  try {
    // Clear existing jobs
    console.log('🗑️  Clearing existing jobs...');
    await Job.deleteMany({});
    
    // Insert new jobs
    console.log('📝 Inserting dummy jobs...');
    const jobs = await Job.insertMany(dummyJobs);
    
    console.log(`✅ Successfully seeded ${jobs.length} jobs!`);
    console.log('\n📋 Jobs created:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - ${job.department} (${job.location})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();
