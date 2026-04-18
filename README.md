# 🚀 Family Habit Tracker - Professional Mobile App

**By Sahil Yadav** 👋  
[![GitHub](https://img.shields.io/badge/GitHub-SahilYadav--01-181717?logo=github)](https://github.com/Sahilyadav-01)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue.svg)](https://tailwindcss.com/)

## ✨ **Live Demo Screenshots**

| Login Screen | Create Account |
|--------------|----------------|
| ![Login](web%20data/login.png) | ![Register](web%20data/create%20account.png) |

| Profile Edit | Dashboard Navbar |
|--------------|------------------|
| ![Profile](web%20data/profile.png) | ![Navbar](web%20data/navbar.png) |

## 🎯 **Features**

### **Mobile-First Auth**
- Phone/OTP login
- Email/Password register
- Persistent localStorage
- Reset password modal

### **Personal & Family Dashboards**
```
👤 Personal Habits     👨‍👩‍👧‍👦 Family Habits
📊 Streak tracking     👥 Multi-member progress
📈 Consistency %       📱 Fully responsive
🔥 Optimistic updates  🎨 Gradient UI
```

### **Profile Management**
```
👤 Full editable profile
📸 Image upload/preview
📋 Name/DOB/Age/Height/Weight
📞 Phone/Email
💾 Auto-save localStorage
```

### **Navbar Integration**
```
👤 Clickable profile logo
📱 User name display  
🏠 Personal ↔ Family switch
🔐 Logout
```

### **Advanced UI/UX**
```
⚡ Loading skeletons
🎭 Animations/transitions
📱 Touch-friendly mobile
🎨 TailwindCSS gradients
✅ Error toasts
```

## 🚀 **Quick Start**

```bash
# Clone & Install
git clone [your-repo]
cd habit-tracker
npm install

# MongoDB Setup (Required for full features)
# 1. Install MongoDB locally or use MongoDB Atlas
# 2. Create .env.local:
#    MONGODB_URI=mongodb://localhost:27017/habittracker
#       OR your Atlas connection string

# Development
npm run dev

# Production
npm run build
npm start
```


**Live:** `http://localhost:3001`

## 📱 **Mobile Screenshots**
```
├── 📱 Login (OTP)
├── 📝 Register  
├── 👤 Profile Edit + Image
├── 📊 Personal Dashboard
├── 👨‍👩‍👧‍👦 Family Dashboard  
└── 🎨 Navbar w/ Name + Logo
```

## 🛠 **Tech Stack**
```
Frontend: Next.js 14 + React 18
CSS: TailwindCSS 3.4 + Gradients
State: localStorage + Hooks
Images: Native File API
Routing: Next.js Router
Icons: Native Emojis
Responsive: Mobile-First
```

## 🎨 **Custom Components**
```
components/
├── Navbar.js           👤 Profile name/logo
├── HabitCard.js        📊 Streak/consistency cards
├── Profile.js          📸 Image upload + form
├── ReminderPopup.js    ⏰ Notifications
├── HabitSuggestion.js  💡 Smart suggestions
└── DemoData.js         📈 Sample habits
```

## 📂 **Project Structure**
```
pages/
├── index.js         📱 Login/Register
├── dashboard.js     👤 Personal habits
├── family.js        👨‍👩‍👧‍👦 Family habits
└── profile.js       👤 Edit profile

components/
├── Navbar.js        🧭 Navigation w/ name
└── (other components)

"web data/"
└── screenshots      📸 Demo images
```

## 🌍 **Environment Variables**

Create `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/habittracker
# or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/habittracker
```

## 🔧 **Customization**

### **Add Profile Image**
```js
localStorage.setItem('profileImage', 'data:image/jpeg;base64,...')
localStorage.setItem('name', 'John Doe')
localStorage.setItem('phone', '+1 234 567 8900')
```

### **New Habit Categories**
Edit `DemoData.js`:
```js
{ name: 'Custom Habit', streak: 5, consistency: 85 }
```

## 📱 **Mobile Testing**
```
Chrome DevTools → Toggle Device Toolbar
iPhone 12 → Perfect fit
Touch-friendly buttons
Swipe gestures supported
```

## 🎯 **Future Features**
```
[ ] Full user authentication (JWT backend)
[ ] Family habit sharing & invites
[ ] Advanced streak analytics charts
[ ] PWA with offline support
[ ] Push notifications
[ ] Dark mode toggle
[ ] Export progress reports
```

## 🙌 **Demo Flow**
```
1. Login → Dashboard
2. Profile → Edit + Image → Save
3. Navbar shows "John's Habits"
4. Personal ↔ Family switch
5. Add/Edit/Delete habits
6. Image persists on refresh
```

## 📄 **License**
MIT - Free to use/modify

**Made with ❤️ using Next.js + TailwindCSS**

