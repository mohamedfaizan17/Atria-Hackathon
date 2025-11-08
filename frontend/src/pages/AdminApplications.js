import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Mail, Phone, Calendar, Briefcase, MapPin, Clock, FileText, Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { jobsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, searchTerm, selectedJob, selectedStatus, dateFilter, experienceFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch jobs
      const jobsRes = await jobsAPI.getJobs();
      const jobsArr = Array.isArray(jobsRes.data)
        ? jobsRes.data
        : (jobsRes.data?.data || jobsRes.data?.jobs || []);
      setJobs(jobsArr);

      // Fetch applications for all jobs
      const allApplications = [];
      for (const job of jobsArr) {
        try {
          const appsRes = await jobsAPI.getApplications(job._id);
          const jobApplications = Array.isArray(appsRes.data) ? appsRes.data : (appsRes.data?.data || []);
          const applicationsWithJob = jobApplications.map(app => ({
            ...app,
            jobTitle: job.title,
            jobDepartment: job.department
          }));
          allApplications.push(...applicationsWithJob);
        } catch (error) {
          console.error(`Error fetching applications for ${job.title}:`, error);
        }
      }

      setApplications(allApplications);
      setFilteredApplications(allApplications);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Job filter
    if (selectedJob !== 'all') {
      filtered = filtered.filter(app => app.job === selectedJob);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(app => {
        const appDate = new Date(app.submittedAt);
        const diffDays = Math.floor((now - appDate) / (1000 * 60 * 60 * 24));
        
        switch(dateFilter) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          default: return true;
        }
      });
    }

    // Experience filter
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(app => {
        const coverLetter = app.coverLetter.toLowerCase();
        return coverLetter.includes(`years of experience: ${experienceFilter}`);
      });
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'reviewed': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'shortlisted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'submitted': return <AlertCircle className="w-4 h-4" />;
      case 'reviewed': return <Clock className="w-4 h-4" />;
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Department', 'Status', 'Submitted Date'];
    const rows = filteredApplications.map(app => [
      app.name,
      app.email,
      app.phone,
      app.jobTitle,
      app.jobDepartment,
      app.status,
      new Date(app.submittedAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Applications exported successfully!');
  };

  const viewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const parseApplicationDetails = (coverLetter) => {
    const details = {};
    const lines = coverLetter.split('\n');
    
    lines.forEach(line => {
      if (line.includes('Years of Experience:')) details.experience = line.split(':')[1].trim();
      if (line.includes('Current Location:')) details.location = line.split(':')[1].trim();
      if (line.includes('Expected Salary:')) details.salary = line.split(':')[1].trim();
      if (line.includes('Notice Period:')) details.noticePeriod = line.split(':')[1].trim();
      if (line.includes('LinkedIn:')) details.linkedin = line.split(':')[1].trim();
      if (line.includes('Portfolio:')) details.portfolio = line.split(':')[1].trim();
    });

    return details;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Application Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View, filter, and manage job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Applications', value: applications.length, icon: FileText, color: 'blue' },
            { label: 'New (Submitted)', value: applications.filter(a => a.status === 'submitted').length, icon: AlertCircle, color: 'yellow' },
            { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: CheckCircle, color: 'green' },
            { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'purple' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={exportToCSV}
              className="btn-outline flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Job Filter */}
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="input-field"
            >
              <option value="all">All Positions</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            {/* Experience Filter */}
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Experience</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-8">5-8 years</option>
              <option value="8+">8+ years</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="card">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Applications ({filteredApplications.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No applications found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Applicant</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Position</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Applied</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredApplications.map((app, idx) => (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{app.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{app.jobTitle}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.jobDepartment}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 mr-1" />
                            {app.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-1" />
                            {app.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => viewDetails(app)}
                          className="btn-outline text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Application Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Applicant Info */}
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Applicant Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Applied For</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedApplication.jobTitle}</p>
                    </div>
                    {(() => {
                      const details = parseApplicationDetails(selectedApplication.coverLetter);
                      return (
                        <>
                          {details.experience && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{details.experience}</p>
                            </div>
                          )}
                          {details.location && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Current Location</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{details.location}</p>
                            </div>
                          )}
                          {details.salary && details.salary !== 'Not specified' && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Expected Salary</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{details.salary}</p>
                            </div>
                          )}
                          {details.noticePeriod && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Notice Period</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{details.noticePeriod}</p>
                            </div>
                          )}
                          {details.linkedin && details.linkedin !== 'Not provided' && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">LinkedIn</p>
                              <a href={details.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:underline">
                                View Profile
                              </a>
                            </div>
                          )}
                          {details.portfolio && details.portfolio !== 'Not provided' && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio</p>
                              <a href={details.portfolio} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:underline">
                                View Portfolio
                              </a>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Application Details */}
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Cover Letter & Details
                  </h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm">
                      {selectedApplication.coverLetter}
                    </pre>
                  </div>
                </div>

                {/* Resume Link */}
                {selectedApplication.resumeUrl && (
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Resume
                    </h3>
                    <a
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Resume</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;
