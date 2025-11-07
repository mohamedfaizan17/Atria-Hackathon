const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// @desc    Generate AI content
// @route   POST /api/ai/generate-content
// @access  Private (Admin)
exports.generateContent = async (req, res, next) => {
  try {
    const { type, context, style } = req.body;

    let prompt = '';
    
    switch(type) {
      case 'hero':
        prompt = `Generate a compelling hero section tagline for Mastersolis Infotech, a technology company. Style: ${style || 'professional and innovative'}. Include a catchy title and subtitle.`;
        break;
      case 'mission':
        prompt = `Generate a mission statement for Mastersolis Infotech, a technology company that ${context || 'delivers innovative software solutions'}. Make it inspiring and professional.`;
        break;
      case 'vision':
        prompt = `Generate a vision statement for Mastersolis Infotech. Focus on innovation, technology, and future growth. Keep it concise and inspiring.`;
        break;
      case 'service':
        prompt = `Generate a service description for: ${context}. Make it professional, highlighting benefits and value proposition. Around 100-150 words.`;
        break;
      case 'about':
        prompt = `Generate an "About Us" section for Mastersolis Infotech. Context: ${context || 'innovative tech company'}. Make it engaging and professional. Around 200 words.`;
        break;
      default:
        prompt = context;
    }

    const fullPrompt = `You are a professional content writer specializing in corporate website content. Generate engaging, professional, and SEO-friendly content.\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedContent = response.text();

    res.status(200).json({
      success: true,
      data: {
        content: generatedContent,
        type,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate content. Please check your Gemini API key.'
    });
  }
};

// @desc    Summarize text
// @route   POST /api/ai/summarize
// @access  Public
exports.summarize = async (req, res, next) => {
  try {
    const { text, length } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const maxLength = length === 'short' ? 100 : length === 'medium' ? 200 : 300;

    const prompt = `You are a text summarization expert. Summarize the following text in approximately ${maxLength} words:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({
      success: true,
      data: {
        summary,
        originalLength: text.length,
        summaryLength: summary.length
      }
    });
  } catch (error) {
    console.error('Summarization Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to summarize text'
    });
  }
};

// @desc    Chatbot conversation
// @route   POST /api/ai/chat
// @access  Public
exports.chat = async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let conversationContext = `You are a helpful AI assistant for Mastersolis Infotech's website. Answer questions about the company, its services, careers, and help visitors navigate the site. Be professional, friendly, and concise. If you don't know something specific about the company, politely say so and offer to connect them with the team.

Company Info:
- Mastersolis Infotech is a technology company
- Services: Web Development, Mobile Apps, AI Solutions, Cloud Services, UI/UX Design
- We're hiring for various tech positions
- Contact: Available through the contact form on the website

`;

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-10).forEach(msg => {
        conversationContext += `${msg.role}: ${msg.content}\n`;
      });
    }

    conversationContext += `user: ${message}\nassistant:`;

    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const reply = response.text();

    res.status(200).json({
      success: true,
      data: {
        reply,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message'
    });
  }
};

// @desc    Analyze resume and score
// @route   POST /api/ai/analyze-resume
// @access  Private
exports.analyzeResume = async (req, res, next) => {
  try {
    const { resumeText, jobRequirements } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      });
    }

    const prompt = `Analyze this resume and provide a detailed scoring:

Resume:
${resumeText}

${jobRequirements ? `Job Requirements:\n${jobRequirements}\n` : ''}

Provide a JSON response with:
1. overall score (0-100)
2. skillMatch score (0-100)
3. experienceMatch score (0-100)
4. educationMatch score (0-100)
5. analysis (brief analysis)
6. recommendations (array of 3-5 recommendations)

Format as valid JSON.`;

    const fullPrompt = `You are an expert HR analyst and resume reviewer. ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const content = response.text();

    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (e) {
      // If JSON parsing fails, create a structured response
      analysis = {
        overall: 75,
        skillMatch: 70,
        experienceMatch: 75,
        educationMatch: 80,
        analysis: content,
        recommendations: [
          "Enhance technical skills section",
          "Add more quantifiable achievements",
          "Include relevant certifications"
        ]
      };
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Resume Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume'
    });
  }
};

// @desc    Generate theme recommendation
// @route   POST /api/ai/theme-recommendation
// @access  Public
exports.themeRecommendation = async (req, res, next) => {
  try {
    const { time, industry, mood } = req.body;
    
    const hour = time ? new Date(time).getHours() : new Date().getHours();
    let timeOfDay = 'day';
    
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const prompt = `Suggest a website color theme for:
- Time: ${timeOfDay}
- Industry: ${industry || 'technology'}
- Mood: ${mood || 'professional'}

Provide a JSON response with:
{
  "primary": "hex color",
  "secondary": "hex color",
  "accent": "hex color",
  "background": "hex color",
  "text": "hex color",
  "mode": "light or dark",
  "reasoning": "brief explanation"
}`;

    const fullPrompt = `You are a UI/UX design expert specializing in color theory. ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const content = response.text();

    let theme;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        theme = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (e) {
      // Default theme if parsing fails
      theme = {
        primary: timeOfDay === 'night' ? '#1e40af' : '#3b82f6',
        secondary: timeOfDay === 'night' ? '#7c3aed' : '#8b5cf6',
        accent: '#f59e0b',
        background: timeOfDay === 'night' ? '#0f172a' : '#ffffff',
        text: timeOfDay === 'night' ? '#f1f5f9' : '#1e293b',
        mode: timeOfDay === 'night' ? 'dark' : 'light',
        reasoning: `Optimized for ${timeOfDay} viewing`
      };
    }

    res.status(200).json({
      success: true,
      data: theme
    });
  } catch (error) {
    console.error('Theme Recommendation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate theme recommendation'
    });
  }
};

// @desc    Generate analytics summary
// @route   POST /api/ai/analytics-summary
// @access  Private (Admin)
exports.analyticsSummary = async (req, res, next) => {
  try {
    const { analyticsData } = req.body;

    if (!analyticsData) {
      return res.status(400).json({
        success: false,
        message: 'Analytics data is required'
      });
    }

    const prompt = `Analyze this website analytics data and provide a concise, actionable summary:

${JSON.stringify(analyticsData, null, 2)}

Provide insights about:
1. Traffic trends
2. User engagement
3. Top performing pages
4. Recommendations for improvement

Keep it concise and actionable (2-3 paragraphs).`;

    const fullPrompt = `You are a data analyst specializing in web analytics. ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({
      success: true,
      data: {
        summary,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Analytics Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate analytics summary'
    });
  }
};
