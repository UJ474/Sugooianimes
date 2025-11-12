# Sugooianime – Anime Discovery Platform

Sugooianime is a full-stack anime discovery platform inspired by IMDb, designed to deliver live anime data, personalized experiences, and user interactivity.  
It integrates real-time anime information using a public API and combines it with user-specific features like watchlists and recently viewed anime — all backed by a secure authentication system.

---

## Problem Statement
Most anime websites provide only static or limited data with no personalization.  
Users cannot maintain watchlists, track progress, or store preferences.  
**Sugooianime** bridges this gap by combining live anime data from a public API with a custom backend that manages user accounts, personalized watchlists, and recently viewed anime — creating a dynamic, full-stack anime experience.

---

## System Architecture

**Frontend → Backend (API) → Database**

### Frontend
- Built with **React.js**, **HTML**, **CSS**, and **JavaScript**
- Uses **React Router** for multi-page navigation:
  - Home, Popular, New Releases, Genre, Details, Watchlist, Login, Signup, Profile
- Fetches live anime data from a public API (Jikan/AniList)
- Dynamic rendering with React Hooks and state management

### Backend
- **Node.js + Express.js**
- CRUD APIs for users, watchlists, and recently viewed anime
- Supports **Filtering**, **Sorting**, **Searching**, and **Pagination**
- Acts as a proxy between frontend and the external anime API

### Database
- **MongoDB Atlas**
- Stores user credentials, watchlist, recently viewed, and ratings
- Optimized for efficient queries and dynamic fetching

### Authentication
- Secure **JWT-based login/signup system**
- Passwords encrypted with **bcrypt**

### Hosting
| Layer | Platform |
|--------|-----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |

---

## Key Features
- **Authentication & Authorization:** Secure login/signup using JWT
- **CRUD Operations:** Manage user data, watchlist, and recently viewed
- **Search, Filter, Sort, Pagination:** Query anime by title, genre, or rating
- **Dynamic Fetching:** Live API integration with Jikan/AniList
- **Watchlist Management:** Add/remove anime; track viewing progress
- **Recently Viewed:** Records user’s last 10 anime views
- **Multi-Page Routing:** Seamless navigation using React Router
- **Hosting:** Fully deployed with Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

---

## Tech Stack

| Layer | Technologies |
|--------|---------------|
| **Frontend** | React.js, React Router, Axios, HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, bcrypt |
| **External API** | Jikan / AniList |
| **Hosting** | Vercel, Render / Railway, MongoDB Atlas |

---

## API Overview

| Endpoint | Method | Description | Access |
|-----------|---------|-------------|---------|
| `/api/auth/signup` | POST | Register new user | Public |
| `/api/auth/login` | POST | Authenticate user | Public |
| `/api/users/:id` | GET | Get user profile details | Authenticated |
| `/api/watchlist` | GET | Retrieve user’s watchlist | Authenticated |
| `/api/watchlist` | POST | Add anime to watchlist | Authenticated |
| `/api/watchlist/:id` | DELETE | Remove anime from watchlist | Authenticated |
| `/api/recent` | GET | Fetch recently viewed anime | Authenticated |
| `/api/recent` | POST | Add anime to recently viewed | Authenticated |
| `/api/anime/search` | GET | Search, sort, or filter anime with pagination | Public |

---

## Deployment Links

| Component | URL |
|------------|-----|
| **Frontend (Vercel)** | [https://sugooianimes.vercel.app/](https://sugooianimes.vercel.app/) |
| **Backend (Render)** | [https://sugooianimes-backend.onrender.com](https://sugooianimes-backend.onrender.com) |

---

## How to Run Locally

### 1 Clone the repository
```bash
git clone https://github.com/UJ474/Sugooianimes.git
cd Sugooianime
```
### 2 Install dependencies
- Frontend
```bash
cd client
npm install
```
-Backend
```bash
cd ../server
npm install
```
### 3 Create a .env file in /server
```bash
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your secret>
PORT=5001
```
### 4 Run both servers
- Frontend
```bash
npm run dev
```
- Backend
```bash
node index.js
```

### Folder Structure
```bash
Sugooianime/
│
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
│
├── .gitignore
└── README.md
```

