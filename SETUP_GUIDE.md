# 🚀 Setup Guide - Mastersolis Infotech AI-Powered Website

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Git** - [Download](https://git-scm.com/)
- **OpenAI API Key** - [Get it here](https://platform.openai.com/api-keys)

## 🛠️ Installation Steps

### 1. Clone or Navigate to the Project

```bash
cd c:\Users\shrey\OneDrive\Desktop\hackweb
```

### 2. Backend Setup

#### Install Backend Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
copy .env.example .env
```

Edit `.env` and fill in your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB (Choose one option)
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/mastersolis

# Option 2: MongoDB Atlas (Recommended)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mastersolis

# JWT Secret (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# OpenAI API (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@mastersolis.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

#### Install Frontend Dependencies

Open a new terminal and run:

```bash
cd frontend
npm install
```

#### Configure Frontend Environment (Optional)

Create `.env` in the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Paste it in your backend `.env` as `MONGODB_URI`

#### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### 5. Email Setup (Gmail)

To enable email features:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password
4. Use this password in your `.env` as `EMAIL_PASS`

### 6. OpenAI API Key

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Go to API Keys section
3. Create a new secret key
4. Copy and paste it in your `.env` as `OPENAI_API_KEY`

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend (New Terminal)

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 🎯 Default Admin Access

To access the admin dashboard, register a user or use these demo credentials:

```
Email: admin@mastersolis.com
Password: admin123
```

**Note:** You'll need to manually create this user in your database or through the registration form and update the `role` to `'admin'` in MongoDB.

## 🔧 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network access if using Atlas

### OpenAI API Errors

- Verify your API key is correct
- Ensure you have credits in your OpenAI account
- Check API usage limits

### Port Already in Use

```bash
# Change PORT in backend/.env
PORT=5001

# Or kill the process using the port (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### npm Install Errors

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 🎨 Features to Test

1. **Home Page** - Hero section with AI-generated content
2. **AI Chatbot** - Click the chat button (bottom right)
3. **AI Theme Toggle** - Click the sparkle icon in navbar
4. **Dark Mode** - Toggle theme with sun/moon icon
5. **Contact Form** - Submit and receive AI-generated email
6. **Career Page** - Apply for jobs with resume upload
7. **Blog with AI Summary** - View blog posts and generate AI summaries
8. **Admin Dashboard** - Login and access `/admin`

## 📦 Building for Production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The build folder will be ready for deployment.

## 🚀 Deployment Options

### Frontend Deployment

- **Vercel** - Best for React apps
- **Netlify** - Easy static site hosting
- **GitHub Pages** - Free hosting

### Backend Deployment

- **Render** - Free tier available
- **Heroku** - Easy deployment
- **Railway** - Modern platform
- **AWS/Azure/Google Cloud** - Scalable options

### Database

- **MongoDB Atlas** - Managed MongoDB (Recommended)

## 📝 Notes

- The CSS warnings about `@tailwind` and `@apply` are expected - they're Tailwind CSS directives
- First-time setup may take a few minutes to install dependencies
- OpenAI API calls may take 2-5 seconds to respond
- Email delivery may take up to 30 seconds

## 🆘 Need Help?

Check the following:

1. Ensure all environment variables are set correctly
2. Verify MongoDB is running and accessible
3. Check backend console for errors
4. Check browser console for frontend errors
5. Ensure all ports are available (3000, 5000)

## ✅ Quick Test Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] MongoDB connects successfully
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] AI Chatbot responds to messages
- [ ] Contact form sends emails
- [ ] Theme toggle works
- [ ] All pages load correctly

---

**Congratulations! Your AI-Powered Website is Ready! 🎉**
