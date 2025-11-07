import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [isAuthenticated, user]);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getSummary();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    toast.error('Admin access required');
    return <Navigate to="/login" />;
  }

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/admin' },
    { icon: <FileText className="w-5 h-5" />, label: 'Content', path: '/admin/content' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Jobs', path: '/admin/jobs' },
    { icon: <Users className="w-5 h-5" />, label: 'Applications', path: '/admin/applications' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', path: '/admin/messages' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen fixed left-0 top-16">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <span>Admin Panel</span>
            </h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<OverviewPage analytics={analytics} loading={loading} />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Overview Page Component
const OverviewPage = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Today\'s Views',
      value: analytics?.today?.pageViews || 0,
      change: analytics?.trends?.pageViewsChange || 0,
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      label: 'Unique Visitors',
      value: analytics?.today?.uniqueVisitors || 0,
      change: analytics?.trends?.visitorsChange || 0,
      icon: <Users className="w-8 h-8" />
    },
    {
      label: 'Contact Forms',
      value: analytics?.today?.conversions?.contactForms || 0,
      change: 0,
      icon: <MessageSquare className="w-8 h-8" />
    },
    {
      label: 'Job Applications',
      value: analytics?.today?.conversions?.jobApplications || 0,
      change: 0,
      icon: <Briefcase className="w-8 h-8" />
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-primary-600">{stat.icon}</div>
              {stat.change !== 0 && (
                <span className={`text-sm font-semibold ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                </span>
              )}
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
              {stat.label}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/content" className="btn-primary">
            Manage Content
          </Link>
          <Link to="/admin/jobs" className="btn-secondary">
            Post New Job
          </Link>
          <Link to="/admin/analytics" className="btn-outline">
            View Full Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other pages
const ContentPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Content Management</h1>
    <p className="text-gray-600 dark:text-gray-300">Manage site content, blogs, projects, and testimonials.</p>
  </div>
);

const JobsPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Jobs Management</h1>
    <p className="text-gray-600 dark:text-gray-300">Create and manage job postings.</p>
  </div>
);

const ApplicationsPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Applications</h1>
    <p className="text-gray-600 dark:text-gray-300">Review and manage job applications.</p>
  </div>
);

const MessagesPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Messages</h1>
    <p className="text-gray-600 dark:text-gray-300">View and respond to contact form submissions.</p>
  </div>
);

const AnalyticsPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h1>
    <p className="text-gray-600 dark:text-gray-300">Detailed analytics and insights.</p>
  </div>
);

const SettingsPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
    <p className="text-gray-600 dark:text-gray-300">Manage application settings and preferences.</p>
  </div>
);

export default Dashboard;
