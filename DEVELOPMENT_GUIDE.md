# Development Server Guide

## 🚀 **Running the Application**

### **For Frontend Development (Recommended for GitHub Pages)**
```bash
npm run dev:client
```
- **Purpose:** Runs only the React frontend (no backend/database required)
- **URL:** http://localhost:5173/Dementia-Assistant/
- **Best for:** Testing UI/UX, GitHub Pages deployment development
- **No dependencies:** Works without MongoDB or backend services

### **For Full-Stack Development**
```bash
npm run dev
```
- **Purpose:** Runs both frontend + backend server
- **Requires:** MongoDB Atlas connection or local MongoDB
- **Best for:** Testing full application with database features
- **Port:** Backend on 5001, Frontend on Vite dev server

---

## 🔧 **Current Setup Status**

### **✅ Fixed Issues:**
1. **Router Base Paths:** Updated from `/Clarity/` to `/Dementia-Assistant/`
2. **MongoDB Configuration:** Cleaned up duplicate entries in .env
3. **GitHub Pages Deployment:** Corrected all configuration files
4. **Asset Imports:** Fixed logo and static file references

### **🌐 Live Deployment:**
- **GitHub Pages URL:** https://AdityaxDeore.github.io/Dementia-Assistant/
- **Status:** Deployed with latest router fixes
- **Features Available:** All Phase 1 components (Voice Analysis, Memory Diary, SOS)

---

## 🧠 **Phase 1 Features Available for Testing**

### **1. Voice-Based Cognitive Analysis**
- **Local URL:** http://localhost:5173/Dementia-Assistant/assessment
- **Features:** Real-time voice recording, speech pattern analysis, cognitive scoring

### **2. Enhanced Memory Diary**
- **Local URL:** http://localhost:5173/Dementia-Assistant/diary
- **Features:** Multimedia journaling, mood tracking, memory clarity ratings

### **3. Advanced SOS System**
- **Local URL:** http://localhost:5173/Dementia-Assistant/dashboard (SOS button visible)
- **Features:** Emergency activation, AI monitoring, contact management

---

## 🛠️ **Development Commands**

### **Build Commands:**
```bash
npm run build:client          # Build frontend for production
npm run build                 # Build both frontend and backend
```

### **Testing Commands:**
```bash
npm run dev:client            # Frontend only (recommended)
npm run dev                   # Full stack (requires MongoDB)
```

### **Deployment Commands:**
```bash
npm run deploy                # Deploy to GitHub Pages
git add . && git commit -m "message" && git push origin master  # Manual deploy
```

---

## 📱 **Testing Checklist**

### **Frontend Testing (Current Setup):**
- ✅ Homepage loads correctly
- ✅ Navigation between pages works
- ✅ All Phase 1 components accessible
- ✅ Responsive design on mobile/desktop
- ✅ Voice recording functionality (browser permissions required)
- ✅ Photo upload in memory diary
- ✅ SOS system interface

### **Browser Testing:**
- Test in Chrome, Firefox, Safari, Edge
- Test mobile responsiveness
- Test voice permissions and recording
- Test file upload functionality

---

## 🔍 **Troubleshooting**

### **If MongoDB Errors Appear:**
- Use `npm run dev:client` instead of `npm run dev`
- MongoDB is only needed for full-stack features (user accounts, data persistence)
- GitHub Pages deployment doesn't use backend/database

### **If Pages Still Look Blank:**
- Clear browser cache (Ctrl+F5)
- Check browser console for JavaScript errors
- Ensure you're accessing http://localhost:5173/Dementia-Assistant/ (with trailing slash)

### **If Assets Don't Load:**
- Verify the base path matches in vite.config.ts and App.tsx
- Rebuild with `npm run build:client`
- Check that files exist in dist/public/assets/

---

## 🎯 **Next Development Steps**

### **Phase 2 Implementation Ready:**
1. **Smart Location Sharing** - GPS tracking and geofencing
2. **Interactive Learning Guide** - Cognitive exercises and tutorials  
3. **Professional Connect Hub** - Healthcare provider integration

### **Backend Integration (Optional):**
- Set up MongoDB Atlas properly for data persistence
- Implement user authentication and accounts
- Add real-time features with WebSocket connections

---

## 📋 **Current Status Summary**

✅ **Frontend Development:** Fully functional with Phase 1 features
✅ **GitHub Pages Deployment:** Working with correct routing
✅ **Local Development Server:** Running at http://localhost:5173/Dementia-Assistant/
✅ **Mobile Responsive:** Complete responsive design
✅ **Accessibility:** WCAG compliant components

**🎉 Your Dementia Assistant platform is ready for testing and further development!**