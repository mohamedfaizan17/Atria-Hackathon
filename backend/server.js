const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const prisma = require('./lib/prisma');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/career', require('./routes/career')); // ✅ Converted to Prisma + SQLite
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/suggestions', require('./routes/aiSuggestions'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/blog', require('./routes/blog')); // ✅ Converted to Prisma + AI Features
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ats', require('./routes/ats'));
app.use('/api/resume-score', require('./routes/resumeScore'));
app.use('/api/smart-analysis', require('./routes/smartAnalysis'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection
const PORT = process.env.PORT || 5000;

// Test Prisma/SQLite connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ SQLite database connected successfully');
    console.log('📊 Database: dev.db (No MongoDB needed!)');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Backend API: http://localhost:${PORT}`);
  
  // Test database connection
  await testDatabaseConnection();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
