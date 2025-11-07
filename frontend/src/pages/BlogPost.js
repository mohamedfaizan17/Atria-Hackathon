import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { blogAPI, aiAPI } from '../utils/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await blogAPI.getBlog(slug);
      setBlog(response.data.data);
    } catch (error) {
      toast.error('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liked || !blog) return;
    
    try {
      await blogAPI.likeBlog(blog._id);
      setBlog({ ...blog, likes: blog.likes + 1 });
      setLiked(true);
      toast.success('Thanks for liking!');
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const generateAISummary = async () => {
    if (!blog || aiSummary) {
      setShowAISummary(!showAISummary);
      return;
    }

    setGeneratingSummary(true);
    try {
      const response = await blogAPI.generateSummary({
        content: blog.content,
        title: blog.title,
        length: 'medium'
      });
      setAiSummary(response.data.summary);
      setShowAISummary(true);
      toast.success('AI summary generated!');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="container-custom max-w-4xl">
          <Link to="/blog" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-semibold">
                {blog.category}
              </span>
            </div>

            <h1 className="section-title mb-6">{blog.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300">
              <span className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{blog.author?.name || 'Anonymous'}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{format(new Date(blog.publishedAt || blog.createdAt), 'MMMM dd, yyyy')}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{blog.readTime} min read</span>
              </span>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 ${liked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{blog.likes}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container-custom max-w-4xl">
          {/* AI Summary Button */}
          <div className="mb-8">
            <button
              onClick={generateAISummary}
              disabled={generatingSummary}
              className="btn-secondary flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{showAISummary ? 'Hide AI Summary' : 'Generate AI Summary'}</span>
            </button>
          </div>

          {/* AI Summary */}
          {showAISummary && aiSummary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 mb-8"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-primary-600" />
                <span>AI-Generated Summary</span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {aiSummary}
              </p>
            </motion.div>
          )}

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Blog Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </article>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
