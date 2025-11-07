import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Heart } from 'lucide-react';
import { blogAPI } from '../utils/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getBlogs({ isPublished: true });
      setBlogs(response.data.data);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 py-24">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
              📝 Latest Articles
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
            Our <span className="text-yellow-300">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Insights, tutorials, and updates from our team of experts
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">📝</div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No blog posts yet
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  We're working on exciting content. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
                >
                  {/* Featured Image */}
                  <div className="relative h-56 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    {blog.featuredImage ? (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-7xl font-bold">
                        {blog.title.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {blog.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                      <Link to={`/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 leading-relaxed text-base">
                      {blog.summary 
                        ? blog.summary
                            .replace(/#{1,6}\s+/g, '') // Remove markdown headings
                            .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
                            .replace(/\*(.+?)\*/g, '$1') // Remove italic
                            .replace(/`(.+?)`/g, '$1') // Remove inline code
                            .replace(/\.{3,}/g, '.') // Remove ellipsis
                            .trim()
                        : (blog.content
                            .replace(/#{1,6}\s+/g, '')
                            .replace(/\*\*(.+?)\*\*/g, '$1')
                            .replace(/\*(.+?)\*/g, '$1')
                            .substring(0, 150) + '...')
                      }
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1 font-medium">
                          <Calendar className="w-4 h-4 text-primary-600" />
                          <span>{format(new Date(blog.publishedAt || blog.createdAt), 'MMM dd, yyyy')}</span>
                        </span>
                        <span className="flex items-center space-x-1 font-medium">
                          <Clock className="w-4 h-4 text-primary-600" />
                          <span>{blog.readTime} min</span>
                        </span>
                      </div>
                      <span className="flex items-center space-x-1 text-red-500 font-semibold">
                        <Heart className="w-4 h-4" />
                        <span>{blog.likes}</span>
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-bold text-base group-hover:translate-x-2 transition-transform"
                    >
                      <span>Read Full Article</span>
                      <span className="text-xl">→</span>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
