# 🚀 Mastersolis Infotech - AI-Powered Dynamic Website

An intelligent, automated, and customizable company website that uses AI to generate content, personalize visuals, and automate recruitment and engagement workflows.

## 🏗️ Architecture

### Frontend
- **React.js** - Modern component-based UI
- **Tailwind CSS** - Responsive styling
- **Framer Motion** - Smooth animations
- **Axios** - API communication

### Backend
- **Node.js + Express.js** - Server and REST API
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **OpenAI API** - AI content generation
- **Nodemailer** - Email automation

## 🎯 Core Features

1. **AI Content Generation** - Auto-generate home banner, mission, service text
2. **Dynamic Admin Dashboard** - Manage all site content
3. **AI Chatbot** - ChatGPT-style visitor assistant with voice
4. **Career Page** - Resume upload with AI scoring
5. **Email Automation** - AI-generated acknowledgments
6. **Blog System** - AI summarization for articles
7. **Analytics Dashboard** - AI-powered insights
8. **AI Theme Customizer** - Dynamic theme based on time/context

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- OpenAI API Key

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd hackweb
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

4. **Environment Setup**

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

5. **Run the Application**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## 📁 Project Structure

```
hackweb/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── utils/         # Helper functions
│   └── package.json
├── backend/           # Express API
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth & validation
│   └── package.json
└── README.md
```

## 🎨 Unique Features

- **AI Visual Theme Customizer** - Auto theme switching
- **AI Image Generator** - Generate hero banners
- **Voice-Enabled Chatbot** - Talk to the AI assistant
- **Resume Scoring Visualization** - Gauge charts with skill matching
- **AI-Generated Analytics** - Natural language insights
- **Smart Portfolio Section** - Auto-generated project summaries
- **Instant Demo Toggle** - Transform site with AI mode

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI | OpenAI API |
| Email | Nodemailer |
| Auth | JWT |

## 📝 License

MIT License - Mastersolis Infotech
