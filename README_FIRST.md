# 🎯 START HERE - Complete Setup in 3 Minutes!

## ✨ What You Need

1. **Google Gemini API Key** (FREE) - Takes 30 seconds to get
2. **Node.js** - Already installed ✅
3. **That's it!** No credit card, no paid services required

---

## 🚀 3-Step Setup

### STEP 1️⃣: Get Your FREE Gemini API Key (30 seconds)

**Click this link:** 👉 **https://makersuite.google.com/app/apikey**

1. Sign in with Google (any Gmail account)
2. Click **"Create API Key"**
3. Copy the key (looks like: `AIzaSyC...`)

---

### STEP 2️⃣: Paste Your API Key

1. **Open this file:** `backend/.env.example`
2. **Copy it and rename to:** `backend/.env`
3. **Find this line:**
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```
4. **Replace with your key:**
   ```
   GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnop
   ```
5. **Save the file!** ✅

**💡 That's the ONLY thing you need to configure!**

---

### STEP 3️⃣: Run the App

**Double-click:** `start-servers.bat`

That's it! Two windows will open:
- Backend Server (port 5000) ✅
- Frontend Server (port 3000) ✅

Browser opens automatically at **http://localhost:3000** 🎉

---

## 📍 Visual Guide - Where to Paste API Key

```
hackweb/
└── backend/
    ├── .env.example    ← Copy this file
    └── .env            ← Rename to this
                        ← Open and paste your key here!
```

**Inside backend/.env:**
```env
# 🔑 PASTE YOUR GEMINI API KEY HERE
GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnop

# Database (Leave as is - works locally)
MONGODB_URI=mongodb://localhost:27017/mastersolis

# JWT Secret (Leave as is - works fine)
JWT_SECRET=my-super-secret-key-12345

# Email (Skip for now - optional)
EMAIL_USER=
EMAIL_PASS=

# Frontend URL (Leave as is)
FRONTEND_URL=http://localhost:3000
```

---

## ⚡ Alternative: Manual Setup

If the batch file doesn't work:

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🎮 Test These Features

Once the app is running at http://localhost:3000:

### 1. **AI Chatbot** 🤖
   - Click the chat bubble (bottom right)
   - Ask: "What services do you offer?"
   - Try voice input! 🎤

### 2. **AI Theme Toggle** 🎨
   - Click the ✨ sparkle icon (top navigation)
   - Watch the theme change dynamically!

### 3. **Contact Form** 📧
   - Go to Contact page
   - Fill the form
   - Get AI-generated email response!

### 4. **Dark Mode** 🌙
   - Click moon/sun icon in navbar
   - Toggle between themes!

### 5. **Career Page** 💼
   - View job listings
   - Apply and get AI resume scoring!

### 6. **Blog Summaries** 📰
   - Go to Blog
   - Click "Generate AI Summary" on any post!

---

## 🆘 Common Issues & Fixes

### Issue: "GEMINI_API_KEY not found"
**Fix:** Make sure you:
1. Renamed `.env.example` to `.env` (remove .example)
2. Pasted the full API key
3. No spaces before/after the key

### Issue: "Port 5000 already in use"
**Fix:** Open `backend/.env` and change:
```env
PORT=5001
```

### Issue: "MongoDB connection failed"
**Fix 1:** Install MongoDB locally:
- Download: https://www.mongodb.com/try/download/community

**Fix 2:** Use MongoDB Atlas (Cloud - FREE):
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Paste in `backend/.env` as `MONGODB_URI`

### Issue: Frontend won't start
**Fix:**
```bash
cd frontend
npm cache clean --force
npm install
npm start
```

---

## 📂 Project Structure

```
hackweb/
├── 📄 README_FIRST.md         ← You are here!
├── 📄 QUICK_START.md          ← Detailed guide
├── 📄 GET_GEMINI_KEY.txt      ← API key instructions
├── ⚙️ setup.bat               ← Auto-install script
├── ▶️ start-servers.bat       ← Launch both servers
│
├── backend/                    ← Express.js API
│   ├── 📄 .env.example        ← Copy this to .env
│   ├── 🔑 .env                ← Paste API key here!
│   ├── controllers/           ← AI logic here
│   ├── models/                ← Database models
│   └── routes/                ← API endpoints
│
└── frontend/                   ← React app
    ├── src/
    │   ├── pages/             ← All pages
    │   ├── components/        ← Navbar, Chatbot, etc.
    │   └── utils/             ← API utilities
    └── public/
```

---

## ✅ Setup Checklist

- [ ] Got Gemini API key from https://makersuite.google.com/app/apikey
- [ ] Copied `backend/.env.example` to `backend/.env`
- [ ] Pasted API key in `backend/.env`
- [ ] Ran `start-servers.bat` or installed manually
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Browser opened at http://localhost:3000
- [ ] AI Chatbot responds to messages ✨

---

## 🎓 Why Gemini Instead of OpenAI?

✅ **FREE** - No credit card required
✅ **Easy** - Simpler API, better error messages
✅ **Fast** - Quick response times
✅ **Generous** - Large free quota
✅ **Powerful** - Same quality as GPT-3.5

---

## 🎯 You're All Set!

Your AI-powered website is ready! Start testing features and prepare your hackathon demo.

**Need Help?** 
- Check terminal errors
- Press F12 in browser to see console
- Read `QUICK_START.md` for detailed troubleshooting

**Good luck! 🚀**
