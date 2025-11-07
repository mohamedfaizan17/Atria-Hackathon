import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Mastersolis Infotech</h3>
            <p className="text-gray-400 mb-4">
              Innovative technology solutions powered by artificial intelligence. Building the future, one line of code at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-primary-400 transition-colors">Projects</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary-400 transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-primary-400 transition-colors">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Web Development</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Mobile Apps</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">AI Solutions</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Cloud Services</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">UI/UX Design</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>123 Tech Street, Innovation City, TC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@mastersolis.com" className="hover:text-primary-400 transition-colors">
                  info@mastersolis.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-primary-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Mastersolis Infotech. All rights reserved. | Powered by AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
