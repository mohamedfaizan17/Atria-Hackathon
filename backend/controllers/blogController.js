const prisma = require('../lib/prisma');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with timeout wrapper
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Blog AI features enabled (Gemini)');
  } catch (error) {
    console.warn('⚠️  Blog AI features unavailable');
  }
}

// Helper function to call Gemini with timeout
async function generateWithTimeout(model, prompt, timeoutMs = 15000) {
  return Promise.race([
    model.generateContent(prompt),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI generation timeout')), timeoutMs)
    )
  ]);
}

// Helper function to generate AI summary
async function generateAISummary(title, content) {
  if (!genAI) {
    console.log('ℹ️  AI not configured, using fallback summary');
    return null;
  }
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    
    // Clean and truncate content
    let cleanContent = content
      .replace(/#{1,6}\s+/g, '') // Remove markdown headings
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
      .replace(/\.{3,}/g, '.') // Remove ellipsis
      .trim();
    
    cleanContent = cleanContent.length > 2000 ? cleanContent.substring(0, 2000) : cleanContent;
    
    const prompt = `Create a concise summary of this blog in 3-4 complete sentences. End with a proper full stop.

Title: ${title}
Content: ${cleanContent}

Provide only the summary with NO ellipsis (...):`;

    console.log('🤖 Requesting AI summary from Gemini...');
    const result = await generateWithTimeout(model, prompt, 15000);
    const response = await result.response;
    let summary = response.text()
      .replace(/\.{3,}/g, '.') // Remove any ellipsis
      .trim();
    
    // Ensure proper ending punctuation
    if (summary && !summary.match(/[.!?]$/)) {
      summary += '.';
    }
    
    console.log('✅ AI summary generated successfully');
    return summary;
  } catch (error) {
    if (error.message.includes('timeout')) {
      console.warn('⏱️  AI generation timeout, using fallback');
    } else if (error.message.includes('unavailable')) {
      console.warn('🔌 AI service unavailable, using fallback');
    } else {
      console.error('❌ AI summary error:', error.message);
    }
    return null;
  }
}

// Helper function to generate SEO description
async function generateSEODescription(title, content, summary) {
  if (!genAI) return null;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Create an SEO-optimized meta description (max 155 characters) for this blog post.

Title: ${title}
${summary ? `Summary: ${summary}` : `Content: ${content.substring(0, 500)}`}

Requirements:
- Maximum 155 characters
- Include main keywords
- Compelling and click-worthy
- Accurate representation

Provide only the SEO description, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().substring(0, 160);
  } catch (error) {
    console.error('AI SEO generation error:', error.message);
    return null;
  }
}

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// @desc    Get all blogs
// @route   GET /api/blog
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const { category, isPublished, search } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ];
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Parse JSON fields
    const blogsWithParsedData = blogs.map(blog => ({
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : []
    }));

    res.status(200).json({
      success: true,
      count: blogsWithParsedData.length,
      data: blogsWithParsedData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } }
    });

    // Parse JSON fields
    const blogWithParsedData = {
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : [],
      views: blog.views + 1 // Return incremented value
    };

    res.status(200).json({
      success: true,
      data: blogWithParsedData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog with AI-generated summary and SEO
// @route   POST /api/blog
// @access  Private (Admin)
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, category, tags, featuredImage, isPublished, generateAI } = req.body;

    // Generate slug
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({ where: { slug } });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'A blog with a similar title already exists'
      });
    }

    // Calculate read time
    const readTime = calculateReadTime(content);

    // Prepare blog data
    const blogData = {
      title,
      slug,
      content,
      category,
      tags: JSON.stringify(tags || []),
      featuredImage,
      readTime,
      authorId: req.user.id
    };

    // AI generation if requested
    if (generateAI) {
      console.log('🤖 Generating AI summary and SEO description...');
      
      // Generate AI summary
      const aiSummary = await generateAISummary(title, content);
      if (aiSummary) {
        blogData.aiGeneratedSummary = aiSummary;
        blogData.summary = aiSummary; // Use AI summary as default
      }

      // Generate SEO description
      const seoDesc = await generateSEODescription(title, content, aiSummary);
      if (seoDesc) {
        blogData.seoDescription = seoDesc;
      }
    } else if (req.body.summary) {
      blogData.summary = req.body.summary;
    }

    if (req.body.seoDescription) {
      blogData.seoDescription = req.body.seoDescription;
    }

    // Set publish status
    if (isPublished) {
      blogData.isPublished = true;
      blogData.publishedAt = new Date();
    } else {
      blogData.isPublished = false;
    }

    const blog = await prisma.blog.create({
      data: blogData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully' + (generateAI ? ' with AI-generated content' : ''),
      data: {
        ...blog,
        tags: JSON.parse(blog.tags)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blog/:id
// @access  Private (Admin)
exports.updateBlog = async (req, res, next) => {
  try {
    const blogId = parseInt(req.params.id);
    
    const existingBlog = await prisma.blog.findUnique({
      where: { id: blogId }
    });

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const updateData = {};

    // Update basic fields
    if (req.body.title) {
      updateData.title = req.body.title;
      updateData.slug = generateSlug(req.body.title);
    }
    if (req.body.content) {
      updateData.content = req.body.content;
      updateData.readTime = calculateReadTime(req.body.content);
    }
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.tags) updateData.tags = JSON.stringify(req.body.tags);
    if (req.body.featuredImage !== undefined) updateData.featuredImage = req.body.featuredImage;
    if (req.body.summary) updateData.summary = req.body.summary;
    if (req.body.seoDescription) updateData.seoDescription = req.body.seoDescription;

    // Handle publish status
    if (req.body.isPublished !== undefined) {
      updateData.isPublished = req.body.isPublished;
      // If publishing for the first time
      if (req.body.isPublished && !existingBlog.isPublished) {
        updateData.publishedAt = new Date();
      }
    }

    // AI regeneration if requested
    if (req.body.regenerateAI) {
      const title = req.body.title || existingBlog.title;
      const content = req.body.content || existingBlog.content;
      
      console.log('🤖 Regenerating AI content...');
      
      const aiSummary = await generateAISummary(title, content);
      if (aiSummary) {
        updateData.aiGeneratedSummary = aiSummary;
        if (!req.body.summary) {
          updateData.summary = aiSummary;
        }
      }

      const seoDesc = await generateSEODescription(title, content, aiSummary);
      if (seoDesc && !req.body.seoDescription) {
        updateData.seoDescription = seoDesc;
      }
    }

    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: {
        ...blog,
        tags: JSON.parse(blog.tags)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blog/:id
// @access  Private (Admin)
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await prisma.blog.delete({
      where: { id: parseInt(req.params.id) }
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like blog
// @route   POST /api/blog/:id/like
// @access  Public
exports.likeBlog = async (req, res, next) => {
  try {
    const blog = await prisma.blog.update({
      where: { id: parseInt(req.params.id) },
      data: {
        likes: { increment: 1 }
      },
      select: { likes: true }
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { likes: blog.likes }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI summary for existing blog
// @route   POST /api/blog/:id/generate-summary
// @access  Public (for visitors to summarize long posts)
exports.generateBlogSummary = async (req, res, next) => {
  try {
    const { length = 'medium' } = req.body;
    const blogId = parseInt(req.params.id);

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        title: true,
        content: true
      }
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    if (!genAI) {
      // Fallback to simple truncation
      const summary = blog.content.substring(0, 300) + '...';
      return res.json({
        success: true,
        summary,
        source: 'fallback'
      });
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      });
      
      const lengthMap = {
        short: '2-3 complete sentences (about 50-80 words)',
        medium: '4-5 complete sentences (about 100-130 words)',
        long: '6-7 complete sentences (about 150-180 words)'
      };

      const targetLength = lengthMap[length] || lengthMap.medium;
      
      // Clean content: remove markdown and truncate
      let cleanContent = blog.content
        .replace(/#{1,6}\s+/g, '') // Remove markdown headings
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.+?)\*/g, '$1') // Remove italic
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/\.{3,}/g, '.') // Remove ellipsis (...)
        .trim();
      
      cleanContent = cleanContent.length > 3000 
        ? cleanContent.substring(0, 3000) 
        : cleanContent;

      const prompt = `You are a professional content writer. Create a clear, engaging summary of this blog post.

Title: ${blog.title}

Content:
${cleanContent}

IMPORTANT INSTRUCTIONS:
- Write EXACTLY ${targetLength}
- Each sentence MUST be complete with proper ending punctuation (. ! ?)
- Use plain text only - NO markdown, NO hashtags, NO formatting symbols, NO ellipsis (...)
- Write in a professional, flowing narrative style
- Do NOT cut off sentences mid-way
- Ensure every sentence is grammatically complete
- End with a proper full stop (.)
- Make it engaging and easy to read

Provide ONLY the summary in plain text:`;

      console.log('🤖 Generating AI summary with Gemini (20s timeout)...');
      
      // Use timeout wrapper with longer timeout
      const result = await generateWithTimeout(model, prompt, 20000);
      const response = await result.response;
      let summary = response.text().trim();
      
      // AGGRESSIVE cleanup - remove ALL markdown
      summary = summary
        .replace(/^["']|["']$/g, '') // Remove quotes
        .replace(/#{1,6}\s+/g, '') // Remove markdown headings # ## ###
        .replace(/\*\*\*(.+?)\*\*\*/g, '$1') // Remove bold+italic ***
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold **
        .replace(/\*(.+?)\*/g, '$1') // Remove italic *
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks ```
        .replace(/`([^`]+)`/g, '$1') // Remove inline code `
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/^[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\d+\.\s+/gm, '') // Remove numbered lists
        .replace(/\.{3,}/g, '') // Remove ellipsis ...
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      // Extract only complete sentences if text is too long or has fragments
      if (summary.length > 500 || summary.includes('...')) {
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const sentences = summary.match(sentenceRegex) || [];
        const cleanSentences = sentences
          .map(s => s.trim())
          .filter(s => s.length > 30 && !s.includes('...')); // Filter good sentences
        
        summary = cleanSentences.slice(0, 4).join(' ').trim();
      }
      
      // Ensure it ends with proper punctuation
      if (summary && !summary.match(/[.!?]$/)) {
        summary += '.';
      }
      
      console.log('✅ AI summary generated successfully');

      res.json({
        success: true,
        summary,
        source: 'ai',
        length,
        model: 'gemini-pro'
      });
    } catch (aiError) {
      // Better error logging
      if (aiError.message.includes('timeout')) {
        console.warn('⏱️  AI generation timeout (>20s), using fallback');
      } else if (aiError.message.includes('unavailable')) {
        console.warn('🔌 Gemini API unavailable, using fallback');
      } else {
        console.error('❌ AI error:', aiError.message);
      }
      
      // ULTRA AGGRESSIVE FALLBACK - Clean and extract complete sentences
      let cleanContent = blog.content
        // Remove ALL markdown formatting in multiple passes
        .replace(/```[\s\S]*?```/g, ' ') // Remove code blocks first
        .replace(/`{1,3}[^`\n]*`{1,3}/g, ' ') // Remove inline code
        .replace(/#{1,6}\s+/g, ' ') // Remove # ## ### headings
        .replace(/\*\*\*(.+?)\*\*\*/g, '$1') // Remove ***bold italic***
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove **bold**
        .replace(/\*(.+?)\*/g, '$1') // Remove *italic*
        .replace(/__(.+?)__/g, '$1') // Remove __bold__
        .replace(/_(.+?)_/g, '$1') // Remove _italic_
        .replace(/~~(.+?)~~/g, '$1') // Remove ~~strikethrough~~
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove [links](url)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
        .replace(/^[>\s]+/gm, ' ') // Remove > blockquotes
        .replace(/^[-*+]\s+/gm, '') // Remove - * + list markers
        .replace(/^\d+\.\s+/gm, '') // Remove 1. 2. 3. numbered lists
        .replace(/\|/g, ' ') // Remove table pipes
        .replace(/[-]{3,}/g, ' ') // Remove horizontal rules
        .replace(/\n+/g, ' ') // Replace all newlines with spaces
        .replace(/\.{2,}/g, '.') // Replace .. ... with single .
        .replace(/\s+/g, ' ') // Normalize all spaces
        .trim();
      
      // BETTER APPROACH: Split by sentence-ending punctuation followed by space and capital letter
      // This ensures we only get COMPLETE sentences
      const sentences = [];
      
      // Method 1: Split on period/!/? followed by space and capital letter OR end of string
      let remaining = cleanContent;
      const sentencePattern = /^(.+?[.!?])(?:\s+(?=[A-Z])|$)/;
      
      while (remaining.length > 0) {
        const match = remaining.match(sentencePattern);
        if (match) {
          const sentence = match[1].trim();
          // Only add if it's substantial and complete
          if (sentence.length > 40 && sentence.match(/[.!?]$/)) {
            // Check it doesn't end with incomplete word
            const words = sentence.split(/\s+/);
            const lastWord = words[words.length - 1];
            // Last word should be at least 2 chars (excluding punctuation)
            if (lastWord.replace(/[.!?,;:]/, '').length >= 2) {
              sentences.push(sentence);
            }
          }
          remaining = remaining.substring(match[0].length).trim();
        } else {
          break;
        }
      }
      
      // If regex method didn't work, try simpler split
      if (sentences.length < 2) {
        sentences.length = 0;
        const simpleSplit = cleanContent.split(/\.\s+/);
        for (let part of simpleSplit) {
          part = part.trim();
          if (part.length > 40) {
            // Check last word is complete (at least 3 characters)
            const words = part.split(/\s+/);
            const lastWord = words[words.length - 1];
            if (lastWord.length >= 3) {
              sentences.push(part.endsWith('.') ? part : part + '.');
            }
          }
          if (sentences.length >= 3) break;
        }
      }
      
      const summaryLength = length === 'short' ? 2 : length === 'long' ? 4 : 3;
      let summary = sentences.slice(0, summaryLength).join(' ').trim();
      
      // If no good sentences found, try alternative extraction
      if (!summary || summary.length < 100) {
        console.log('⚠️  Sentence extraction failed, trying alternative...');
        
        // Method 2: Split by periods more carefully
        const parts = cleanContent
          .split(/\.(?=\s+[A-Z])/) // Split on period followed by space and capital
          .map(p => p.trim())
          .filter(p => p.length > 40 && !p.match(/[#*`]/)); // Good length, no markdown
        
        if (parts.length >= 3) {
          summary = parts.slice(0, 3).map(p => p + '.').join(' ');
        } else {
          // Method 3: Just take first N words that don't have markdown
          const words = cleanContent
            .replace(/[#*`\[\]_~|]/g, ' ') // Remove all markdown symbols
            .split(/\s+/)
            .filter(w => w.length > 0)
            .slice(0, 50); // Take 50 words
          
          summary = words.join(' ');
        }
      }
      
      // FINAL CLEANUP - remove any remaining markdown
      summary = summary
        .replace(/[#*`\[\]_~|]/g, '') // Remove any markdown symbols
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      // Ensure it ends with proper punctuation
      if (summary && !summary.match(/[.!?]$/)) {
        // Find the last complete sentence
        const lastPeriod = summary.lastIndexOf('.');
        const lastExclaim = summary.lastIndexOf('!');
        const lastQuestion = summary.lastIndexOf('?');
        const lastPunctuation = Math.max(lastPeriod, lastExclaim, lastQuestion);
        
        if (lastPunctuation > 50) {
          // Truncate to last complete sentence
          summary = summary.substring(0, lastPunctuation + 1);
        } else {
          // Just add a period
          summary += '.';
        }
      }
      
      res.json({
        success: true,
        summary: summary || 'This blog post discusses ' + blog.title.toLowerCase() + '.',
        source: 'fallback',
        message: 'AI temporarily unavailable, showing content preview'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Generate SEO description for blog
// @route   POST /api/blog/generate-seo
// @access  Private (Admin)
exports.generateSEO = async (req, res, next) => {
  try {
    const { title, content, summary } = req.body;

    if (!title && !content && !summary) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, or summary is required'
      });
    }

    if (!genAI) {
      // Fallback
      const seoDescription = (summary || content).substring(0, 155) + '...';
      return res.json({
        success: true,
        seoDescription,
        source: 'fallback'
      });
    }

    const seoDescription = await generateSEODescription(title, content, summary);

    res.json({
      success: true,
      seoDescription: seoDescription || (summary || content).substring(0, 155) + '...',
      source: seoDescription ? 'ai' : 'fallback'
    });
  } catch (error) {
    next(error);
  }
};
