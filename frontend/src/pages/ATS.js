import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, Filter, Search, Star, Eye, MessageSquare,
  Calendar, CheckCircle, XCircle, Clock, Award, TrendingUp,
  Download, Mail, Phone, MapPin, Linkedin, Globe, Plus,
  ChevronDown, BarChart3, Target, Sparkles
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ATS = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    job: '',
    status: '',
    minScore: '',
    search: '',
    favorite: null,
    viewed: null
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'blue' },
    { value: 'under_review', label: 'Under Review', color: 'yellow' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'green' },
    { value: 'interview_scheduled', label: 'Interview Scheduled', color: 'purple' },
    { value: 'interviewed', label: 'Interviewed', color: 'indigo' },
    { value: 'selected', label: 'Selected', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'offer_sent', label: 'Offer Sent', color: 'cyan' },
    { value: 'offer_accepted', label: 'Offer Accepted', color: 'emerald' },
    { value: 'offer_rejected', label: 'Offer Rejected', color: 'orange' }
  ];

  useEffect(() => {
    fetchApplications();
    fetchJobs();
    fetchStatistics();
  }, [filters, pagination.page]);

  const fetchApplications = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await api.get('/ats/applications', { params });
      setApplications(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total
      }));
    } catch (error) {
      console.error('Fetch applications error:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data.jobs || response.data || []);
    } catch (error) {
      console.error('Fetch jobs error:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/ats/statistics', {
        params: { jobId: filters.job }
      });
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Fetch statistics error:', error);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/ats/applications/${appId}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchApplications();
      if (selectedApp?._id === appId) {
        setSelectedApp(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleFavorite = async (appId) => {
    try {
      await api.put(`/ats/applications/${appId}/favorite`);
      fetchApplications();
      if (selectedApp?._id === appId) {
        setSelectedApp(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
      }
    } catch (error) {
      toast.error('Failed to toggle favorite');
    }
  };

  const handleScoreCandidate = async (appId) => {
    try {
      toast.loading('Calculating ATS score...');
      const response = await api.post(`/ats/applications/${appId}/score`);
      toast.dismiss();
      toast.success('Candidate scored successfully!');
      fetchApplications();
      if (selectedApp?._id === appId) {
        setSelectedApp(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to score candidate');
    }
  };

  const handleViewDetails = async (app) => {
    try {
      const response = await api.get(`/ats/applications/${app._id}`);
      setSelectedApp(response.data.data);
      setShowDetails(true);
    } catch (error) {
      toast.error('Failed to load application details');
    }
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj?.color || 'gray';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Users className="w-8 h-8 mr-3 text-primary-600" />
                Applicant Tracking System
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and track all job applications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="container-custom py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                  <h3 className="text-3xl font-bold mt-2">{statistics.totalApplications}</h3>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-green-100 text-sm font-medium">Shortlisted</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {statistics.statusCounts.find(s => s._id === 'shortlisted')?.count || 0}
                  </h3>
                </div>
                <Award className="w-8 h-8 text-green-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg ATS Score</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {Math.round(statistics.averageScore)}/100
                  </h3>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Under Review</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {statistics.statusCounts.find(s => s._id === 'under_review')?.count || 0}
                  </h3>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="container-custom pb-6">
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field pl-10"
              />
            </div>

            {/* Job Filter */}
            <select
              value={filters.job}
              onChange={(e) => setFilters({ ...filters, job: e.target.value })}
              className="input-field"
            >
              <option value="">All Jobs</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            {/* Score Filter */}
            <select
              value={filters.minScore}
              onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
              className="input-field"
            >
              <option value="">All Scores</option>
              <option value="80">80+ (Excellent)</option>
              <option value="60">60+ (Good)</option>
              <option value="40">40+ (Fair)</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setFilters({ ...filters, favorite: filters.favorite === 'true' ? null : 'true' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.favorite === 'true'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Star className="w-4 h-4 inline mr-1" />
              Favorites
            </button>
            
            <button
              onClick={() => setFilters({ ...filters, viewed: filters.viewed === 'false' ? null : 'false' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.viewed === 'false'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Unviewed
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="container-custom pb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loader"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(app)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Candidate Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                          {app.name}
                        </h3>
                        {app.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                        {!app.isViewed && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {app.job?.title || 'N/A'}
                        </span>
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {app.email}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(app.submittedAt), 'MMM dd, yyyy')}
                        </span>
                        {app.yearsOfExperience && (
                          <span className="flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            {app.yearsOfExperience}y exp
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scores & Status */}
                  <div className="flex items-center space-x-3">
                    {/* ATS Score */}
                    {app.atsScore > 0 ? (
                      <div className={`px-3 py-2 rounded-lg font-semibold ${getScoreColor(app.atsScore)}`}>
                        <div className="text-xs">ATS Score</div>
                        <div className="text-lg">{app.atsScore}</div>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScoreCandidate(app._id);
                        }}
                        className="btn-outline text-sm py-2"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Score
                      </button>
                    )}

                    {/* Status Dropdown */}
                    <select
                      value={app.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(app._id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 bg-${getStatusColor(app.status)}-100 text-${getStatusColor(app.status)}-700 border-${getStatusColor(app.status)}-200`}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    {/* Favorite Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(app._id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        app.isFavorite
                          ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${app.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="btn-outline"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      <AnimatePresence>
        {showDetails && selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl my-8"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Application Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Candidate Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                      {selectedApp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {selectedApp.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Applied for: {selectedApp.job?.title}
                      </p>
                    </div>
                  </div>
                  
                  {/* Scores */}
                  {selectedApp.atsScore > 0 && (
                    <div className="text-right">
                      <div className={`inline-block px-4 py-2 rounded-lg font-bold text-xl ${getScoreColor(selectedApp.atsScore)}`}>
                        {selectedApp.atsScore}/100
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ATS Score</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="card bg-gray-50 dark:bg-gray-900 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${selectedApp.email}`} className="text-primary-600 hover:underline">
                        {selectedApp.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedApp.phone}</span>
                    </div>
                    {selectedApp.currentLocation && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{selectedApp.currentLocation}</span>
                      </div>
                    )}
                    {selectedApp.linkedin && (
                      <div className="flex items-center space-x-2">
                        <Linkedin className="w-4 h-4 text-gray-500" />
                        <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {selectedApp.portfolio && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          Portfolio
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApp.coverLetter && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cover Letter</h4>
                    <div className="card bg-gray-50 dark:bg-gray-900">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedApp.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {selectedApp.yearsOfExperience && (
                    <div className="card bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedApp.yearsOfExperience} years
                      </p>
                    </div>
                  )}
                  {selectedApp.expectedSalary && (
                    <div className="card bg-green-50 dark:bg-green-900/20">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expected Salary</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedApp.expectedSalary}
                      </p>
                    </div>
                  )}
                  {selectedApp.noticePeriod && (
                    <div className="card bg-yellow-50 dark:bg-yellow-900/20">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notice Period</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedApp.noticePeriod}
                      </p>
                    </div>
                  )}
                  <div className="card bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Applied On</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {format(new Date(selectedApp.submittedAt), 'MMM dd')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedApp.resumeUrl && (
                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>View Resume</span>
                    </a>
                  )}
                  <button
                    onClick={() => handleScoreCandidate(selectedApp._id)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Re-Score</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ATS;
