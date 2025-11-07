const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (optional)
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Blog AI features initialized');
  } catch (error) {
    console.warn('⚠️  Blog AI features unavailable');
  }
}

// Public routes
router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/:id/like', likeBlog);

// AI-powered summary generation (public for blog readers)
router.post('/generate-summary', async (req, res) => {
  try {
    const { content, title, length = 'medium' } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    let summary = '';

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const lengthMap = {
          short: '2-3 sentences',
          medium: '4-5 sentences',
          long: '6-8 sentences'
        };

        const prompt = `Summarize the following blog post in ${lengthMap[length] || '4-5 sentences'}. Make it engaging and capture the key points.

${title ? `Title: ${title}\n\n` : ''}Content: ${content}

Provide only the summary, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text().trim();
      } catch (aiError) {
        console.error('AI summary generation error:', aiError.message);
        // Fallback to simple truncation
        summary = content.substring(0, 300) + '...';
      }
    } else {
      // Fallback if AI unavailable
      summary = content.substring(0, 300) + '...';
    }

    res.json({ summary, source: genAI ? 'ai' : 'fallback' });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// AI-powered SEO description generation (admin only)
router.post('/generate-seo', async (req, res) => {
  try {
    const { title, content, summary } = req.body;

    if (!title && !content && !summary) {
      return res.status(400).json({ error: 'Title, content, or summary is required' });
    }

    let seoDescription = '';

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `Create an SEO-optimized meta description (max 155 characters) for this blog post. Make it compelling and include relevant keywords.

Title: ${title}
${summary ? `Summary: ${summary}` : `Content: ${content.substring(0, 500)}`}

Requirements:
- Maximum 155 characters
- Include main keywords
- Compelling and click-worthy
- Accurate representation of content

Provide only the SEO description, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        seoDescription = response.text().trim().substring(0, 160);
      } catch (aiError) {
        console.error('AI SEO generation error:', aiError.message);
        // Fallback
        seoDescription = (summary || content).substring(0, 155) + '...';
      }
    } else {
      // Fallback if AI unavailable
      seoDescription = (summary || content).substring(0, 155) + '...';
    }

    res.json({ seoDescription, source: genAI ? 'ai' : 'fallback' });
  } catch (error) {
    console.error('SEO generation error:', error);
    res.status(500).json({ error: 'Failed to generate SEO description' });
  }
});

// Protected routes (Admin)
router.post('/', protect, authorize('admin'), createBlog);
router.put('/:id', protect, authorize('admin'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

module.exports = router;
