# 📧 Email Setup Guide - Complete Instructions

## Problem
Applications submit successfully but users don't receive email confirmation.

## Solution
Configure email credentials in your `.env` file.

---

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Get Gmail App Password**

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Or click your profile → "Manage your Google Account"

2. **Enable 2-Factor Authentication**
   - Go to "Security" tab
   - Find "2-Step Verification"
   - Click "Get Started"
   - Follow steps to enable (if not already enabled)

3. **Generate App Password**
   - Still in "Security" tab
   - Scroll down to "App passwords"
   - If you don't see it, make sure 2FA is enabled
   - Click "App passwords"
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter: "Mastersolis Website"
   - Click "Generate"

4. **Copy the Password**
   - You'll see a 16-character code like: `abcd efgh ijkl mnop`
   - Copy this code (spaces don't matter)
   - **Important:** Save it somewhere - you can't see it again!

### **Step 2: Update Backend .env File**

1. **Open** `backend/.env` file (create if doesn't exist)

2. **Add these lines:**
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   GEMINI_API_KEY=your-gemini-key
   ```

3. **Replace with YOUR values:**
   ```bash
   EMAIL_USER=yourcompany@gmail.com
   EMAIL_PASS=xyzt abcd efgh ijkl
   GEMINI_API_KEY=AIza...
   ```

   **Example:**
   ```bash
   EMAIL_USER=mastersolis@gmail.com
   EMAIL_PASS=xpqr vwxy zabc defg
   GEMINI_API_KEY=AIzaSyD...
   ```

4. **Save the file**

### **Step 3: Restart Backend**

```bash
cd backend
# Press Ctrl+C to stop the server
npm run dev
```

**You should see:**
```
Server running on port 5000
✅ MongoDB Connected
✅ Email server is ready to send messages
```

**If you see an error:**
```
❌ Email transporter error: Invalid login
```
→ Check your EMAIL_USER and EMAIL_PASS are correct

### **Step 4: Test It**

1. Go to `http://localhost:3000/careers`
2. Click "Apply Now" on any job
3. Fill form with **YOUR real email**
4. Submit application
5. Check backend terminal for:
   ```
   📧 Attempting to send email to your@email.com...
   ✅ Confirmation email sent successfully
   ```
6. **Check your email** (inbox and spam) - should arrive in 1-2 minutes

---

## 🔍 Verification Checklist

Use this to verify everything is set up correctly:

### **Backend Terminal Shows:**
- [ ] `Server running on port 5000`
- [ ] `✅ MongoDB Connected`
- [ ] `✅ Email server is ready to send messages` ← **This is key!**

### **When Submitting Application:**
- [ ] `📧 Attempting to send email to...`
- [ ] `Email from: your-email@gmail.com`
- [ ] `✅ Confirmation email sent successfully`
- [ ] `Message ID: <some-id>`

### **In Email Inbox:**
- [ ] Email received within 1-2 minutes
- [ ] From: Your configured email
- [ ] Subject: "Application Received - [Job] at Mastersolis"
- [ ] Professional HTML format
- [ ] Contains applicant name and job title

---

## 🐛 Troubleshooting

### **Error: "Invalid login"**

**Problem:** Email credentials are wrong

**Solutions:**
1. Check `EMAIL_USER` is correct email address
2. Check `EMAIL_PASS` is the **App Password** (not your regular Gmail password)
3. Make sure you copied the full 16-character code
4. Remove any spaces from the password
5. Regenerate App Password if needed

### **Error: "Email transporter error"**

**Problem:** Email not configured or 2FA not enabled

**Solutions:**
1. Make sure `.env` file exists in `backend/` folder
2. Check `.env` has `EMAIL_USER` and `EMAIL_PASS`
3. Enable 2-Factor Authentication on Gmail
4. Generate new App Password

### **No error but email not received**

**Possible causes:**

1. **Check Spam Folder**
   - Gmail might mark it as spam first time
   - Mark as "Not Spam" for future emails

2. **Email Delay**
   - Can take 1-5 minutes
   - Check backend logs for "sent successfully"

3. **Wrong Email Address**
   - Check you typed your email correctly
   - Check for typos

4. **Gmail Blocking**
   - Gmail might block emails from new senders
   - Try sending to different email (Yahoo, Outlook, etc.)
   - Check Gmail's spam rules

### **Backend shows "Email not configured"**

**Problem:** `.env` file not found or variables missing

**Solutions:**
1. Create `backend/.env` file if it doesn't exist
2. Copy from `backend/.env.example`
3. Update with your actual values
4. Restart backend

---

## 📋 Common Mistakes

### **❌ Using Regular Gmail Password**
```bash
# WRONG:
EMAIL_PASS=MyGmailPassword123

# CORRECT:
EMAIL_PASS=xpqr vwxy zabc defg  # 16-char App Password
```

### **❌ Not Enabling 2FA**
- App Passwords only work with 2FA enabled
- Must enable 2-Factor Authentication first

### **❌ Wrong .env Location**
```bash
# WRONG:
/frontend/.env  ← Frontend folder

# CORRECT:
/backend/.env  ← Backend folder!
```

### **❌ Not Restarting Backend**
- Changes to `.env` require restart
- Press Ctrl+C and run `npm run dev` again

### **❌ Hardcoding in Code**
```javascript
// WRONG - Don't do this:
EMAIL_USER=myemail@gmail.com

// CORRECT - Use .env:
process.env.EMAIL_USER
```

---

## 🎯 Testing Email System

### **Test 1: Transporter Verification**

**Start backend and look for:**
```
✅ Email server is ready to send messages
```

**If you see this:** Email configuration is correct!

**If you see error:** Check your credentials

### **Test 2: Send Test Application**

1. Apply for a job
2. Watch backend terminal:
   ```
   📧 Attempting to send email to john@example.com...
   Email from: yourcompany@gmail.com
   ✅ Confirmation email sent successfully to john@example.com
   Message ID: <1234@gmail.com>
   ```

3. Check email (wait 1-2 min)

### **Test 3: Check Database**

Even if email fails, application should be saved:
```bash
mongo
use mastersolis
db.applications.find().pretty()
```

You should see the application data.

---

## 🔐 Security Best Practices

### **Do's:**
- ✅ Use App Password (never regular password)
- ✅ Keep `.env` in `.gitignore`
- ✅ Use environment variables
- ✅ Regenerate App Password if exposed
- ✅ Use different App Passwords for different apps

### **Don'ts:**
- ❌ Don't commit `.env` to Git
- ❌ Don't share App Password
- ❌ Don't hardcode credentials in code
- ❌ Don't use same password for everything
- ❌ Don't expose credentials in logs (our code filters them)

---

## 🌐 Alternative Email Services

If Gmail doesn't work, you can use other services:

### **Option 1: Outlook/Hotmail**
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password

# In code, change service:
service: 'hotmail'
```

### **Option 2: SendGrid (Professional)**
```bash
# Sign up at sendgrid.com
# Get API key
# Install: npm install @sendgrid/mail

# Much more reliable for production
# Free tier: 100 emails/day
```

### **Option 3: Mailgun**
```bash
# Sign up at mailgun.com
# Get API credentials
# Install: npm install mailgun-js

# Free tier: 100 emails/day
# Good for testing
```

### **Option 4: SMTP2GO**
```bash
# Simple SMTP service
# Easy setup
# Good for small projects
```

---

## 📧 Email Configuration Examples

### **Gmail (Recommended for Testing)**
```bash
EMAIL_USER=yourcompany@gmail.com
EMAIL_PASS=xpqr vwxy zabc defg
```

### **Custom SMTP Server**
```javascript
// In jobs.js, replace transporter with:
const transporter = nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

## ✅ Success Indicators

**You'll know it's working when:**

1. **Backend starts with:**
   ```
   ✅ Email server is ready to send messages
   ```

2. **Application submission shows:**
   ```
   📧 Attempting to send email...
   ✅ Confirmation email sent successfully
   Message ID: <...>
   ```

3. **User receives email with:**
   - Professional HTML format
   - Mastersolis branding
   - Personalized content
   - Proper subject line

4. **No errors in terminal**

---

## 🎊 Quick Commands

```bash
# Check if .env exists
cat backend/.env

# Create .env from example
cp backend/.env.example backend/.env

# Edit .env (Windows)
notepad backend\.env

# Edit .env (Mac/Linux)
nano backend/.env

# Restart backend
cd backend
npm run dev

# Test email configuration
# (Application will show if email is configured)
```

---

## 📞 Still Not Working?

### **Get Detailed Error Info:**

1. **Check backend terminal** when starting:
   ```
   ❌ Email transporter error: [Error message]
   ```

2. **Check during application submission:**
   ```
   ❌ Email sending error: [Error message]
   ```

3. **Common error messages:**
   - "Invalid login" → Wrong credentials
   - "Authentication failed" → Wrong password
   - "Service unavailable" → Gmail is down or blocking
   - "Connection timeout" → Network/firewall issue

### **Debug Steps:**

1. **Verify credentials:**
   ```bash
   # In backend terminal:
   node -e "console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)"
   ```

2. **Test with different email:**
   - Try Gmail, Yahoo, Outlook
   - Check which one receives

3. **Check Gmail settings:**
   - "Less secure app access" should be OFF (we use App Password)
   - 2FA should be ON
   - App Passwords should be enabled

---

## 🎯 Summary

**To get emails working:**

1. ✅ Enable 2FA on Gmail
2. ✅ Generate App Password
3. ✅ Add to `backend/.env`:
   ```bash
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=16-char-code
   ```
4. ✅ Restart backend
5. ✅ Look for "✅ Email server is ready"
6. ✅ Test application
7. ✅ Check email inbox

**Expected behavior:**
- Application saves to database (always)
- Email sent to applicant (if configured)
- Backend logs show success/failure
- User sees appropriate message

**Your email system will work once these steps are complete!** 📧
