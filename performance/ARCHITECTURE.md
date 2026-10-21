# Sugooianimes — Architecture & Inspection Document

## 1. Overview
Sugooianimes is an anime discovery and tracking platform inspired by MyAnimeList and IMDb. It consists of a decoupled frontend (React + Vite) and backend (Express.js + Node.js), with persistence on MongoDB Atlas.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19.0.0 with Vite 6.3.1
- **UI Library:** Chakra UI 2.10.9, Emotion, Framer Motion 12.23.24, GSAP 3.12.7
- **Routing:** React Router v7 (v7.5.1)
- **HTTP Client:** Axios 1.13.2
- **State Management:** React Context (`AuthContext`) and local component state
- **Hosting:** Vercel (SPA deployment)

### Backend
- **Framework & Runtime:** Node.js (v26.10.0), Express.js 5.1.0
- **Database Driver:** Mongoose 8.19.3 (connecting to MongoDB Atlas)
- **Authentication:** JWT (`jsonwebtoken` 9.0.2) + `bcrypt` 6.0.0
- **Validation:** Joi 18.0.2 / Zod 4.1.13 (schema validation via custom middleware)
- **CORS:** Enabled with configurable `FRONTEND_URL` origin

---

## 3. API Endpoint Inventory

| Endpoint | Method | Auth Required | Handler / Service | Purpose |
|---|---|---|---|---|
| `/` | GET | No | Inline Express handler | Health check ("API running...") |
| `/api/auth/signup` | POST | No | `authController.signup` | Register new user with hashed password |
| `/api/auth/login` | POST | No | `authController.login` | Authenticate and return JWT access & refresh tokens |
| `/api/auth/refresh` | POST | No | `authController.refreshToken` | Issue new access token from refresh token |
| `/api/protected` | GET | Yes (`verifyToken`) | Inline handler | Test token validation and return user payload |
| `/api/weeb/watchlist` | GET | Yes (`verifyToken`) | `watchlistCtrl.getWatchlist` | Retrieve authenticated user's watchlist |
| `/api/weeb/watchlist` | POST | Yes (`verifyToken`) | `watchlistCtrl.addToWatchlist` | Add anime item to user's watchlist |
| `/api/weeb/watchlist/:mal_id` | DELETE | Yes (`verifyToken`) | `watchlistCtrl.removeFromWatchlist` | Remove anime item from watchlist |
| `/api/weeb/watching` | GET | Yes (`verifyToken`) | `watchingCtrl.getWatching` | Retrieve currently watching list |
| `/api/weeb/watching` | POST | Yes (`verifyToken`) | `watchingCtrl.addToWatching` | Add anime item to watching list |
| `/api/weeb/watching/:mal_id` | DELETE | Yes (`verifyToken`) | `watchingCtrl.removeFromWatching` | Remove anime item from watching list |
| `/api/weeb/completed` | GET | Yes (`verifyToken`) | `completedCtrl.getCompleted` | Retrieve completed anime list |
| `/api/weeb/completed` | POST | Yes (`verifyToken`) | `completedCtrl.addToCompleted` | Mark anime item as completed |
| `/api/weeb/completed/:mal_id` | DELETE | Yes (`verifyToken`) | `completedCtrl.removeFromCompleted` | Remove anime item from completed list |
| `/api/weeb/history` | GET | Yes (`verifyToken`) | `historyCtrl.getHistory` | Retrieve user's viewing history |
| `/api/weeb/history` | POST | Yes (`verifyToken`) | `historyCtrl.addToHistory` | Record viewed anime in history |
| `/api/weeb/history/:mal_id` | DELETE | Yes (`verifyToken`) | `historyCtrl.removeFromHistory` | Delete individual history entry |
| `/api/weeb/history` | DELETE | Yes (`verifyToken`) | `historyCtrl.clearHistory` | Wipe all history for user |

---

## 4. Database Interaction & Schemas

### Database Provider
- **Provider:** MongoDB Atlas (Cloud Replica Set)
- **Model:** `Weeb` (in `server/src/models/Weeb.js`)
- **Structure:**
  - `username` (String, unique, required)
  - `email` (String, unique, required)
  - `password` (String, required - bcrypt hash)
  - `watchlist` (Array of embedded subdocuments: `mal_id`, `title`, `imageUrl`, `addedAt`)
  - `history.all` (Array of subdocuments)
  - `history.watching` (Array of subdocuments)
  - `history.completed` (Array of subdocuments)
  - Timestamps (`createdAt`, `updatedAt`)

### Verified Query Behaviors
- **User lookup:** `Weeb.findById(userId)` is used across all list operations (`watchlist`, `watching`, `completed`, `history`).
- **Heavy Document Transfer:** `Weeb.findById(userId)` returns the complete user document including credentials and nested arrays without field projection (`.select()`) or `.lean()`.
- **Write pattern:** Array manipulation occurs in Node.js memory (`filter()`, `unshift()`), followed by `weeb.save()`, re-serializing the whole document rather than using atomic `$push` / `$pull` operations.

---

## 5. External Dependency Map

| External Service | Used For | Called From | Caching | Retries / Limits |
|---|---|---|---|---|
| **Kitsu API** (`kitsu.io/api/edge`) | Top anime, current anime, genre filter, search, anime details | Client browser directly (`client/src/services/kitsuService.js`) | None | None |
| **MongoDB Atlas** | User accounts, watchlists, history storage | Backend server via Mongoose | Mongoose buffer pool | Managed Atlas pool |

*Important observation:* Anime search and discovery queries are **not** proxied through the Express backend; they are performed client-side directly against Kitsu API.

---

## 6. Authentication Flow
1. User submits credentials to `POST /api/auth/login`.
2. Password is verified via `bcrypt.compare`.
3. Server returns signed JWT `accessToken` (1h expiration) and `refreshToken` (7d expiration).
4. Client stores tokens in `localStorage` and injects `Authorization: Bearer <token>` on outgoing requests via an Axios interceptor.
5. `verifyToken` middleware decodes token and injects user identity into `req.user`.

---

## 7. Observed Performance Bottlenecks & Design Characteristics
1. **Redundant Disk I/O in Middleware:** `middleware/verifyToken.js` explicitly invokes `require('dotenv').config()` on every incoming authenticated request.
2. **Full-Document Hydration in MongoDB Queries:** Read services retrieve complete `Weeb` documents using `findById()` without projection (`.select()`) or `.lean()`, causing Mongoose document hydration overhead.
3. **Save-after-filter vs Atomic Operators:** List updates load the entire document into memory and call `.save()` rather than issuing atomic `$pull` or `$push` update queries.

