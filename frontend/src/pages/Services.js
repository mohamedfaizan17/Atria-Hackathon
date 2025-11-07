import React from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Brain, Cloud, Palette, Database, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: <Code className="w-12 h-12" />,
      title: 'Web Development',
      description: 'Custom web applications built with modern frameworks like React, Next.js, and Node.js. Responsive, scalable, and optimized for performance.',
      features: ['Custom Web Apps', 'E-commerce Solutions', 'CMS Development', 'API Integration']
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android. Beautiful interfaces with seamless user experiences.',
      features: ['iOS Development', 'Android Development', 'React Native', 'Flutter Apps']
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: 'AI & Machine Learning',
      description: 'Intelligent systems powered by artificial intelligence. From chatbots to predictive analytics, we make AI work for you.',
      features: ['AI Chatbots', 'Predictive Analytics', 'NLP Solutions', 'Computer Vision']
    },
    {
      icon: <Cloud className="w-12 h-12" />,
      title: 'Cloud Services',
      description: 'Scalable cloud infrastructure and deployment solutions. We help you migrate, deploy, and manage your applications in the cloud.',
      features: ['AWS Services', 'Azure Integration', 'Cloud Migration', 'DevOps Solutions']
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive designs that enhance user experience. We create interfaces that users love and that drive business results.',
      features: ['UI Design', 'UX Research', 'Prototyping', 'Design Systems']
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: 'Database Solutions',
      description: 'Robust database architecture and management. From SQL to NoSQL, we design and optimize databases for your needs.',
      features: ['Database Design', 'MongoDB', 'PostgreSQL', 'Data Migration']
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Cybersecurity',
      description: 'Protect your digital assets with our comprehensive security solutions. We ensure your applications and data stay safe.',
      features: ['Security Audits', 'Penetration Testing', 'Encryption', 'Compliance']
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Performance Optimization',
      description: 'Make your applications faster and more efficient. We optimize code, databases, and infrastructure for peak performance.',
      features: ['Code Optimization', 'Speed Enhancement', 'Load Testing', 'Monitoring']
    },
  ];

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
            Our <span className="gradient-text">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-3xl mx-auto"
          >
            Comprehensive technology solutions designed to transform your business
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group hover:scale-105 transition-transform"
              >
                <div className="text-primary-500 mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-primary-100">
              Let's discuss how we can help transform your business with our services
            </p>
            <Link to="/contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Contact Us Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
