import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Sparkles, FileText, Search, Filter, Calendar, Save, X } from 'lucide-react';
import { blogAPI } from '../utils/api';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [generatingAI, setGeneratingAI] = useState({ summary: false, seo: false });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    seoDescription: '',
    category: 'Technology',
    tags: [],
    featuredImage: '',
    isPublished: false
  });

  const [tagInput, setTagInput] = useState('');

  const categories = [
    'Technology', 'Business', 'Design', 'Development', 
    'Marketing', 'Tutorial', 'News', 'Company Update'
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getBlogs({});
      setBlogs(response.data.data);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateAISummary = async () => {
    if (!formData.content) {
      toast.error('Please write some content first');
      return;
    }

    setGeneratingAI(prev => ({ ...prev, summary: true }));
    try {
      const response = await api.post('/blog/generate-summary', {
        content: formData.content,
        title: formData.title
      });

      setFormData(prev => ({
        ...prev,
        summary: response.data.summary
      }));
      toast.success('AI summary generated!');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setGeneratingAI(prev => ({ ...prev, summary: false }));
    }
  };

  const generateSEODescription = async () => {
    if (!formData.content && !formData.summary) {
      toast.error('Please write content or summary first');
      return;
    }

    setGeneratingAI(prev => ({ ...prev, seo: true }));
    try {
      const response = await api.post('/blog/generate-seo', {
        title: formData.title,
        content: formData.content,
        summary: formData.summary
      });

      setFormData(prev => ({
        ...prev,
        seoDescription: response.data.seoDescription
      }));
      toast.success('SEO description generated!');
    } catch (error) {
      toast.error('Failed to generate SEO description');
    } finally {
      setGeneratingAI(prev => ({ ...prev, seo: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      if (editingBlog) {
        await blogAPI.updateBlog(editingBlog._id, formData);
        toast.success('Blog updated successfully!');
      } else {
        await blogAPI.createBlog(formData);
        toast.success('Blog created successfully!');
      }
      
      fetchBlogs();
      handleCloseModal();
    } catch (error) {
      toast.error(editingBlog ? 'Failed to update blog' : 'Failed to create blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      summary: blog.summary || '',
      seoDescription: blog.seoDescription || '',
      category: blog.category,
      tags: blog.tags || [],
      featuredImage: blog.featuredImage || '',
      isPublished: blog.isPublished
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await blogAPI.deleteBlog(id);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      content: '',
      summary: '',
      seoDescription: '',
      category: 'Technology',
      tags: [],
      featuredImage: '',
      isPublished: false
    });
    setTagInput('');
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && blog.isPublished) ||
                         (filterStatus === 'draft' && !blog.isPublished);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage blog posts and company updates
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>New Blog Post</span>
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
            <p className="text-4xl font-bold">{blogs.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-teal-500 text-white">
            <h3 className="text-lg font-semibold mb-2">Published</h3>
            <p className="text-4xl font-bold">{blogs.filter(b => b.isPublished).length}</p>
          </div>
          <div className="card bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <h3 className="text-lg font-semibold mb-2">Drafts</h3>
            <p className="text-4xl font-bold">{blogs.filter(b => !b.isPublished).length}</p>
          </div>
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loader"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No blogs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="w-full md:w-48 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {blog.featuredImage ? (
                      <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary-600">
                        {blog.title.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {blog.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            blog.isPublished 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs font-semibold">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {blog.summary || blog.content.substring(0, 150)}...
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                        className="btn-outline text-sm py-2 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="btn-outline text-sm py-2 flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="btn-outline text-sm py-2 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl my-8"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog title..."
                    className="input-field"
                    required
                  />
                </div>

                {/* Category and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Publish immediately
                      </span>
                    </label>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Content * (Supports Markdown)
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your blog content here... (Markdown supported)"
                    rows="12"
                    className="input-field font-mono text-sm"
                    required
                  />
                </div>

                {/* AI Summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Summary
                    </label>
                    <button
                      type="button"
                      onClick={generateAISummary}
                      disabled={generatingAI.summary}
                      className="btn-secondary text-sm py-1 px-3 flex items-center space-x-1"
                    >
                      <Sparkles className={`w-4 h-4 ${generatingAI.summary ? 'animate-spin' : ''}`} />
                      <span>Generate AI Summary</span>
                    </button>
                  </div>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the blog post..."
                    rows="3"
                    className="input-field"
                  />
                </div>

                {/* SEO Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      SEO Description
                    </label>
                    <button
                      type="button"
                      onClick={generateSEODescription}
                      disabled={generatingAI.seo}
                      className="btn-secondary text-sm py-1 px-3 flex items-center space-x-1"
                    >
                      <Sparkles className={`w-4 h-4 ${generatingAI.seo ? 'animate-spin' : ''}`} />
                      <span>Generate SEO Description</span>
                    </button>
                  </div>
                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    placeholder="SEO-optimized description for search engines..."
                    rows="2"
                    className="input-field"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoDescription.length}/160 characters
                  </p>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="input-field"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type a tag and press Enter..."
                    className="input-field"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center space-x-2">
                    <Save className="w-5 h-5" />
                    <span>{editingBlog ? 'Update Blog' : 'Create Blog'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlog;
