# 🔧 Resume Upload - Debug & Test Guide

## ✅ **Backend & Frontend Status**

**Backend:** ✅ Running on port 5000  
**Frontend:** ✅ Running on port 3000  
**CORS:** ✅ Configured correctly  
**PDF Parser:** ✅ Fixed and working  

---

## 🧪 **How to Test Resume Upload**

### **Step 1: Open Smart Suggestions Page**
```
http://localhost:3000/smart-suggestions
```

### **Step 2: Check Browser Console**
```
Press F12 → Console tab
```

### **Step 3: Upload a Resume**
1. Click "Click to upload or drag and drop"
2. Select a PDF, DOCX, or TXT file
3. Watch the console for logs

---

## 📊 **What You Should See**

### **In Browser Console (F12):**
```
📤 Uploading file: YourResume.pdf application/pdf 123456
✅ Response received: { success: true, text: "..." }
```

### **In Backend Terminal:**
```
🔍 File upload request received
📄 File received: { name: 'YourResume.pdf', type: 'application/pdf', size: 123456 }
📕 Processing PDF file...
✅ PDF extraction complete
✅ Text extracted: 1234 characters
```

---

## ❌ **Common Errors & Fixes**

### **Error 1: "No file uploaded"**

**Cause:** File not being sent to backend

**Fix:**
1. Check file is selected
2. Check file type (PDF, DOCX, TXT only)
3. Check file size (< 5MB)

### **Error 2: "Could not parse PDF file"**

**Cause:** PDF is corrupted, password-protected, or image-based

**Solutions:**
- ✅ Try a different PDF
- ✅ Remove password protection
- ✅ Use a text-based PDF (not scanned image)
- ✅ Try DOCX format instead

### **Error 3: "Network Error" or "Failed to fetch"**

**Cause:** Backend not running or CORS issue

**Fix:**
```bash
# Check backend is running
netstat -ano | findstr :5000

# If not running, start it
cd backend
npm run dev
```

### **Error 4: "Unsupported file type"**

**Cause:** File type not supported

**Supported Types:**
- ✅ PDF: `.pdf` - `application/pdf`
- ✅ DOCX: `.docx` - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- ✅ TXT: `.txt` - `text/plain`

### **Error 5: "File size should be less than 5MB"**

**Cause:** File too large

**Fix:**
- Reduce PDF quality
- Remove images from document
- Convert to plain text

---

## 🔍 **Debug Checklist**

### **Backend Checks:**
- [ ] Backend server running (port 5000)
- [ ] `pdf-parse` npm package installed
- [ ] `mammoth` npm package installed
- [ ] `/api/smart-analysis/extract-text` route exists
- [ ] CORS allows `http://localhost:3000`

### **Frontend Checks:**
- [ ] Frontend server running (port 3000)
- [ ] File upload input working
- [ ] FormData being created correctly
- [ ] API call to `/smart-analysis/extract-text`
- [ ] Error handling showing messages

### **File Checks:**
- [ ] File type: PDF, DOCX, or TXT
- [ ] File size: < 5MB
- [ ] PDF: Not password-protected
- [ ] PDF: Not image-only (must have text)
- [ ] DOCX: Not corrupted

---

## 🧪 **Test with Sample Files**

### **Create Test Files:**

**1. Test TXT File:**
```bash
echo "John Doe\nSoftware Engineer\n\nSkills: React, Node.js" > test-resume.txt
```

**2. Test PDF:**
- Create a simple Word doc
- Save as PDF
- Ensure it has actual text (not images)

**3. Test DOCX:**
- Create simple Word document
- Save as `.docx`

---

## 🔧 **Manual API Test**

Test the backend directly with curl:

```bash
# Test PDF upload
curl -X POST http://localhost:5000/api/smart-analysis/extract-text \
  -F "resume=@path/to/your/resume.pdf"

# Expected response:
{
  "success": true,
  "text": "Your resume text here...",
  "fileInfo": {
    "name": "resume.pdf",
    "size": 123456,
    "type": "application/pdf"
  }
}
```

---

## 📝 **Enhanced Error Logging**

I've added detailed logging to help debug:

### **Frontend Logs:**
- 📤 File being uploaded (name, type, size)
- ✅ Response received from backend
- ❌ Error details if upload fails

### **Backend Logs:**
- 🔍 File upload request received
- 📄 File details (name, type, size)
- 📕 Processing PDF/DOCX/TXT
- ✅ Extraction complete
- ❌ Detailed error messages

---

## 🎯 **Testing Workflow**

### **Test 1: TXT File (Easiest)**
```
1. Create simple .txt file
2. Upload it
3. Should see text immediately
4. ✅ If this works, basic upload is working
```

### **Test 2: DOCX File**
```
1. Create simple Word doc with text
2. Save as .docx
3. Upload it
4. Should extract text from document
5. ✅ If this works, mammoth is working
```

### **Test 3: PDF File**
```
1. Create Word doc, save as PDF (or use existing PDF)
2. Ensure PDF has actual text (not scanned image)
3. Upload it
4. Should extract text from PDF
5. ✅ If this works, pdf-parse is working
```

---

## 🚨 **If Nothing Works**

### **Complete Reset:**

```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Restart backend
cd backend
npm run dev

# 3. Restart frontend
cd frontend
npm start

# 4. Hard refresh browser
Ctrl + Shift + R

# 5. Try uploading again
```

### **Check Packages:**
```bash
cd backend
npm list pdf-parse
npm list mammoth
npm list multer

# If any missing:
npm install pdf-parse mammoth multer
```

---

## ✅ **Expected Behavior**

### **Successful Upload Flow:**

1. **User uploads file** → Loading indicator shows
2. **File sent to backend** → Backend logs show file received
3. **Text extracted** → Backend logs show extraction complete
4. **Text returned** → Frontend displays in textarea
5. **Success message** → Green toast notification

### **What You Should See:**

```
User Interface:
┌────────────────────────┐
│ Upload Your Resume     │
│                        │
│ [📤 Click to upload]   │
│                        │
│ ✅ Extracting...       │ ← Shows while processing
│                        │
│ [Textarea with text]   │ ← Shows extracted text
│                        │
│ ✅ Resume uploaded!    │ ← Success toast
└────────────────────────┘
```

---

## 📊 **Success Indicators**

### **✅ Everything Working When:**
- File uploads without errors
- Loading spinner shows then hides
- Extracted text appears in textarea
- Success toast message appears
- Backend logs show successful extraction
- No errors in browser console

---

## 🆘 **Still Having Issues?**

### **Check These:**

1. **Backend Console** - Any error messages?
2. **Browser Console (F12)** - Any JavaScript errors?
3. **Network Tab (F12)** - Is request reaching backend?
4. **File Format** - Is it really PDF/DOCX/TXT?
5. **File Content** - Does PDF have actual text?
6. **File Size** - Is it under 5MB?

---

## 📞 **Next Steps**

If resume upload still doesn't work after following this guide:

1. **Check backend terminal** for error messages
2. **Check browser console** for detailed logs
3. **Try all three file types** (TXT, DOCX, PDF)
4. **Test with simple file** (small, basic content)
5. **Verify both servers running** (backend + frontend)

---

**The resume upload feature is now fully configured and ready to test!** 🚀

**Try uploading a file now and watch the console logs!** 📤✨
