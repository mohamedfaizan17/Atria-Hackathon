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
  const [summarySource, setSummarySource] = useState('ai');
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
      await blogAPI.likeBlog(blog.id);
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
      const response = await blogAPI.generateSummary(blog.id, {
        length: 'medium'
      });
      
      // AGGRESSIVE CLIENT-SIDE CLEANUP - remove ALL markdown
      let cleanSummary = response.data.summary
        .replace(/```[\s\S]*?```/g, ' ')     // Remove code blocks
        .replace(/`{1,3}[^`\n]*`{1,3}/g, ' ') // Remove inline code
        .replace(/#{1,6}\s+/g, '')            // Remove # ## ### headings
        .replace(/\*\*\*(.+?)\*\*\*/g, '$1')  // Remove ***bold+italic***
        .replace(/\*\*(.+?)\*\*/g, '$1')      // Remove **bold**
        .replace(/\*(.+?)\*/g, '$1')          // Remove *italic*
        .replace(/__(.+?)__/g, '$1')          // Remove __bold__
        .replace(/_(.+?)_/g, '$1')            // Remove _italic_
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove [links](url)
        .replace(/^[-*+]\s+/gm, '')           // Remove list markers - * +
        .replace(/^\d+\.\s+/gm, '')           // Remove numbered lists 1. 2. 3.
        .replace(/\.{2,}/g, '.')              // Remove ellipsis .. ...
        .replace(/\s+/g, ' ')                 // Normalize spaces
        .trim();
      
      // Ensure proper ending
      if (cleanSummary && !cleanSummary.match(/[.!?]$/)) {
        // Find last complete sentence
        const lastPunctuation = Math.max(
          cleanSummary.lastIndexOf('.'),
          cleanSummary.lastIndexOf('!'),
          cleanSummary.lastIndexOf('?')
        );
        
        if (lastPunctuation > 50) {
          cleanSummary = cleanSummary.substring(0, lastPunctuation + 1);
        } else {
          cleanSummary += '.';
        }
      }
      
      setAiSummary(cleanSummary);
      setSummarySource(response.data.source || 'ai');
      setShowAISummary(true);
      
      // Show appropriate message based on source
      if (response.data.source === 'ai') {
        toast.success('✨ AI summary generated!');
      } else if (response.data.source === 'fallback') {
        toast.success('📝 Content preview created!');
      } else {
        toast.success('✅ Summary ready!');
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error('Failed to generate summary. Please try again.');
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
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container-custom max-w-5xl">
          <Link to="/blog" className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full text-sm font-semibold shadow-lg">
                {blog.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 text-sm">
              <span className="flex items-center space-x-2 font-medium">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>{blog.author?.name || 'Mastersolis Team'}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>{format(new Date(blog.publishedAt || blog.createdAt), 'MMMM dd, yyyy')}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>{blog.readTime} min read</span>
              </span>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors hover:scale-110 transform ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span className="font-semibold">{blog.likes}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom max-w-4xl">
          {/* AI Summary Button */}
          <div className="mb-10 flex justify-center">
            <button
              onClick={generateAISummary}
              disabled={generatingSummary}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-6 h-6 ${generatingSummary ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="text-lg">
                {generatingSummary ? 'Generating AI Summary...' : showAISummary ? 'Hide AI Summary' : '✨ Generate AI Summary'}
              </span>
            </button>
          </div>

          {/* AI Summary */}
          {showAISummary && aiSummary && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summarySource === 'ai' ? 'AI-Generated Summary' : 'Content Summary'}
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-900 dark:text-gray-100 leading-loose text-lg font-normal whitespace-pre-wrap">
                  {aiSummary}
                </p>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                {summarySource === 'ai' ? (
                  <span>🤖 Powered by Google Gemini AI</span>
                ) : (
                  <span>📝 Content preview (AI temporarily unavailable)</span>
                )}
              </div>
            </motion.div>
          )}

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Introduction */}
          {blog.summary && (
            <div className="mb-12 p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 rounded-2xl border-l-4 border-primary-600 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <span className="text-2xl">📖</span>
                <span>Article Overview</span>
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {blog.summary
                  .replace(/#{1,6}\s+/g, '') // Remove markdown headings
                  .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
                  .replace(/\*(.+?)\*/g, '$1') // Remove italic
                  .replace(/`(.+?)`/g, '$1') // Remove inline code
                  .replace(/\.{3,}/g, '.') // Remove ellipsis
                  .trim()
                }
              </p>
            </div>
          )}

          {/* Blog Content */}
          <article className="prose prose-xl dark:prose-invert max-w-none 
            prose-headings:font-extrabold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight
            prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
            prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-b-4 prose-h2:border-primary-200 dark:prose-h2:border-primary-800 prose-h2:pb-4
            prose-h3:text-3xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-primary-700 dark:prose-h3:text-primary-400
            prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-loose prose-p:text-lg prose-p:mb-6 prose-p:font-normal
            prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline prose-a:font-semibold hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
            prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-em:italic
            prose-code:text-primary-700 dark:prose-code:text-primary-300 prose-code:bg-primary-50 dark:prose-code:bg-primary-900/30 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-base
            prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:overflow-x-auto
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-3
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-3
            prose-li:text-gray-800 dark:prose-li:text-gray-200 prose-li:text-lg prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:bg-primary-50 dark:prose-blockquote:bg-primary-900/20 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
            prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-12
            prose-table:border-collapse prose-table:w-full prose-table:shadow-lg prose-table:rounded-lg
            prose-th:bg-primary-600 dark:prose-th:bg-primary-800 prose-th:text-white prose-th:font-bold prose-th:p-4
            prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-4 prose-td:text-gray-800 dark:prose-td:text-gray-200
            ">
            <ReactMarkdown
              components={{
                // Custom renderers for even better formatting
                h1: ({node, ...props}) => <h1 className="first:mt-0" {...props} />,
                h2: ({node, ...props}) => <h2 className="first:mt-0" {...props} />,
                h3: ({node, ...props}) => <h3 className="first:mt-0" {...props} />,
                p: ({node, children, ...props}) => {
                  // Add drop cap to first paragraph
                  const isFirstChild = node?.position?.start?.line === 1;
                  return <p className={isFirstChild ? "first-letter:text-7xl first-letter:font-bold first-letter:text-primary-600 dark:first-letter:text-primary-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1" : ""} {...props}>{children}</p>;
                },
                code: ({node, inline, children, ...props}) => {
                  if (inline) {
                    return <code {...props}>{children}</code>;
                  }
                  return (
                    <div className="relative group">
                      <pre {...props}>
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                }
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </article>

          {/* Tags */}
          <div className="mt-16 pt-10 border-t-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Related Tags</h3>
            <div className="flex flex-wrap gap-3">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-5 py-3 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 text-primary-700 dark:text-primary-300 rounded-full font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer"
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
