import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAnalytics } from './hooks/useAnalytics';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/AdminApplications';
import AdminBlog from './pages/AdminBlog';
import ATS from './pages/ATS';
import ResumeBuilder from './pages/ResumeBuilder';
import EnhancedResumeBuilder from './pages/EnhancedResumeBuilder';
import ResumeScore from './pages/ResumeScore';
import ResumeHub from './pages/ResumeHub';
import ResumeTemplates from './pages/ResumeTemplates';
import SmartSuggestionsDemo from './pages/SmartSuggestionsDemo';

// Analytics Wrapper
const AnalyticsWrapper = ({ children }) => {
  useAnalytics();
  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <AnalyticsWrapper>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/resume" element={<ResumeHub />} />
                  <Route path="/resume-templates" element={<ResumeTemplates />} />
                  <Route path="/resume-builder" element={<EnhancedResumeBuilder />} />
                  <Route path="/resume-builder-simple" element={<ResumeBuilder />} />
                  <Route path="/resume-score" element={<ResumeScore />} />
                  <Route path="/smart-suggestions" element={<SmartSuggestionsDemo />} />
                  <Route path="/admin/applications" element={<AdminApplications />} />
                  <Route path="/admin/blog" element={<AdminBlog />} />
                  <Route path="/admin/ats" element={<ATS />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
              <Chatbot />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AnalyticsWrapper>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
