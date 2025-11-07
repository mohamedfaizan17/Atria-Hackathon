# 🚀 Quick Start Guide - Easy Setup!

## ⚡ STEP 1: Get Your FREE Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

**✅ Gemini is FREE and easier to use than OpenAI!**

---

## 📝 STEP 2: Configure Backend

1. Go to `backend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

3. Open `.env` file and **paste your Gemini API key**:

```env
# 🔑 PASTE YOUR GEMINI API KEY HERE (Required)
GEMINI_API_KEY=AIza...your-key-here

# Database (Local - No setup needed)
MONGODB_URI=mongodb://localhost:27017/mastersolis

# JWT Secret (Any random string)
JWT_SECRET=my-super-secret-key-12345

# Email (Optional - can skip for testing)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**✨ That's it! Only the Gemini API key is required to start.**

---

## 📦 STEP 3: Install Dependencies

Open **2 terminals** in the project folder:

### Terminal 1 - Backend
```bash
cd backend
npm install
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
```

**⏰ This takes 2-3 minutes...**

---

## ▶️ STEP 4: Start Both Servers

### Terminal 1 - Start Backend
```bash
cd backend
npm run dev
```

✅ You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm start
```

✅ Browser will open automatically at: **http://localhost:3000**

---

## 🎉 STEP 5: Test the Features!

### 1. **AI Chatbot**
   - Click the chat bubble (bottom right corner)
   - Type: "What services do you offer?"
   - Watch AI respond!

### 2. **AI Theme Toggle**
   - Click the ✨ sparkle icon in navbar
   - See the theme change dynamically!

### 3. **Contact Form with AI Email**
   - Go to Contact page
   - Fill the form
   - AI generates a personalized response!

### 4. **Dark Mode**
   - Click the 🌙 moon icon
   - Toggle between light and dark!

---

## 🆘 Troubleshooting

### MongoDB Connection Error?
**Solution 1:** Install MongoDB locally
- Download: https://www.mongodb.com/try/download/community
- Install and start the service

**Solution 2:** Use MongoDB Atlas (Cloud - FREE)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Paste in `.env` as `MONGODB_URI`

### Port Already in Use?
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### npm install errors?
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Gemini API not working?
- Make sure you copied the FULL API key
- Check if you have any spaces before/after the key
- Verify the key is valid at: https://makersuite.google.com/app/apikey

---

## 📍 Where to Find Important Files

### 🔑 Where to paste Gemini API Key:
```
backend/.env
```
Line 15: `GEMINI_API_KEY=paste-your-key-here`

### 🎨 Frontend Code:
```
frontend/src/pages/        → All pages (Home, About, etc.)
frontend/src/components/   → Navbar, Footer, Chatbot
```

### 🔧 Backend Code:
```
backend/controllers/       → Business logic
backend/models/           → Database models
backend/routes/           → API routes
```

---

## ✅ Quick Checklist

- [ ] Got Gemini API key from https://makersuite.google.com/app/apikey
- [ ] Created `backend/.env` file
- [ ] Pasted Gemini API key in `.env`
- [ ] Installed backend dependencies (`npm install`)
- [ ] Installed frontend dependencies (`npm install`)
- [ ] Started backend server (`npm run dev`)
- [ ] Started frontend server (`npm start`)
- [ ] Website opens at http://localhost:3000
- [ ] AI Chatbot responds to messages
- [ ] All pages load correctly

---

## 🎯 Key Features to Demo

1. **AI Chatbot** - Real-time conversation with voice support
2. **AI Theme Toggle** - Dynamic visual customization
3. **Contact Form** - AI-generated email responses
4. **Blog Summaries** - One-click AI article summaries
5. **Resume Scoring** - Smart candidate evaluation
6. **Dark Mode** - Beautiful theme switching
7. **Admin Dashboard** - Complete management system

---

## 💡 Pro Tips

- **MongoDB Optional:** The app works without MongoDB for testing (some features may be limited)
- **Email Optional:** Skip email setup for initial testing
- **Gemini is Free:** No credit card required, generous free tier
- **Fast Debugging:** Check browser console (F12) and terminal for errors

---

## 🎊 You're Ready!

Your AI-powered website is now running! 

**Next:** Test all features and prepare your demo presentation!

Need help? Check the error messages in:
1. Backend terminal
2. Frontend terminal  
3. Browser console (Press F12)

**Good luck with your hackathon! 🚀**
