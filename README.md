# Habit Tracker - Production Ready

Track habits, streaks, and consistency with robust backend logic.

## 🎯 Features
- ✅ User auth (JWT)
- ✅ CRUD habits per user
- ✅ Daily completions (unique habit+date)
- ✅ Backend streak calculation (consecutive days)
- ✅ Consistency % (completions / days since created)
- ✅ Duplicate prevention
- ✅ Input validation (Zod)

## 🛠 Tech Stack
```
Next.js 14 (Pages Router) | Mongoose/MongoDB | Tailwind CSS | Zod Validation
```

## 📋 Schema

**User**
```js
{ email: String (unique), password: String }
```

**Habit**
```js
{ userId: ObjectId, name: String, createdAt: Date, updatedAt: Date }
```

**Completion** 
```js
{ habitId: ObjectId, date: String (YYYY-MM-DD) } // unique index {habitId, date}
```

## 🚀 API Endpoints

### Auth
`POST /api/auth/register {email, password}`
`POST /api/auth/login {email, password}`

### Habits
`GET /api/habits` → [{id, name, streak, consistency, completions}]
`POST /api/habits {name}` → 201 created
`DELETE /api/habits/:id` → 200 deleted

### Completions
`POST /api/habits/:id/complete` → 201 created (atomic upsert)
`GET /api/habits/:id/complete` → [{date}]
`GET /api/habits/:id/streak` → {streak: number}

## 🔬 Edge Cases Handled
- ✅ Duplicate daily complete → 400 "Already completed"
- ✅ Invalid habit ID/ownership → 404
- ✅ Missing auth → 401
- ✅ Empty name → 400 validation
- ✅ High volume (1000+ completions) → optimized queries
- ✅ Concurrent requests → DB unique index

## 🧪 Stress Test Results
1. **Double-click**: Returns 400
2. **DB fail**: 500, unique constraint protects
3. **1000 completions**: Paginated, fast

## 🚀 Setup
```bash
npm install
# Add .env.local: MONGODB_URI, JWT_SECRET
npm run dev
```

## 🌐 Deployment
Vercel (set env vars). MongoDB Atlas recommended.

## 📈 Production Ready ✅
- Unique constraints
- Backend business logic
- Input validation
- Optimized queries
- Proper error handling

