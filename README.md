# Sugooianime – Anime Discovery Platform

Sugooianime is a full-stack anime discovery platform inspired by IMDb, designed to deliver live anime data, personalized experiences, and user interactivity.
It integrates real-time anime information using a public API and combines it with user-specific features like watchlists and recently viewed anime — all backed by a secure authentication system.

-------------------------------------------------------------------------------

## Problem Statement
Most anime websites provide only static or limited data with no personalization.
Users cannot maintain watchlists, track progress, or store preferences.

Sugooianime solves this by combining live anime data with:
- A custom backend (Express.js)
- User accounts (JWT authentication)
- Watchlists
- Recently viewed systems

-------------------------------------------------------------------------------

## System Architecture
Frontend → Backend API → Database

### Frontend
- React.js, HTML, CSS, JavaScript
- React Router for multiple pages:
  Home, Popular, New Releases, Genre, Anime Details, Watchlist, Login, Signup, Profile
- Live data fetching from Jikan/AniList API
- State management using React Hooks

### Backend
- Node.js + Express.js
- CRUD APIs for users, watchlists, recently viewed
- Filtering, searching, sorting, pagination
- Acts as a proxy for external anime API

### Database
- MongoDB Atlas
- Stores users, watchlists, recently viewed
- Designed for efficient querying

### Authentication
- JWT-based system
- Password encryption using bcrypt

### Hosting
| Layer     | Platform |
|-----------|----------|
| Frontend  | Vercel   |
| Backend   | Vercel   |
| Database  | MongoDB Atlas |

-------------------------------------------------------------------------------

## Key Features
- JWT authentication (login/signup)
- CRUD operations
- Search / Filter / Sort / Pagination
- Dynamic data fetching
- Watchlist management
- Recently viewed anime history
- Fully deployed frontend + backend

-------------------------------------------------------------------------------

## Tech Stack

| Layer         | Technologies |
|---------------|--------------|
| Frontend      | React.js, React Router, Axios, HTML, CSS, JS |
| Backend       | Node.js, Express.js |
| Database      | MongoDB Atlas |
| Auth          | JWT, bcrypt |
| External API  | Jikan / AniList |
| Hosting       | Vercel (Frontend + Backend) |

-------------------------------------------------------------------------------

## API Overview

| Endpoint                     | Method | Description                             | Access        |
|-----------------------------|--------|-----------------------------------------|---------------|
| /api/auth/signup           | POST   | Register new user                       | Public        |
| /api/auth/login            | POST   | Authenticate user                       | Public        |
| /api/users/:id             | GET    | Get user profile                        | Authenticated |
| /api/watchlist             | GET    | Get user watchlist                      | Authenticated |
| /api/watchlist             | POST   | Add anime to watchlist                  | Authenticated |
| /api/watchlist/:id         | DELETE | Remove anime from watchlist             | Authenticated |
| /api/recent                | GET    | Fetch recently viewed                   | Authenticated |
| /api/recent                | POST   | Add recently viewed item                | Authenticated |
| /api/anime/search          | GET    | Search, sort, filter anime with pagination | Public |

-------------------------------------------------------------------------------

## Deployment Links

| Component     | URL |
|---------------|-----|
| Frontend      | https://sugooianimes.vercel.app/ |
| Backend       | https://sugooianimes-server.vercel.app/ |

-------------------------------------------------------------------------------

## How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/UJ474/Sugooianimes.git
cd Sugooianime
```

### 2. Install dependencies
# Frontend
```bash
cd client
npm install
```
# Backend
```bash
cd ../server
npm install
```
### 3. Create a .env file inside /server
```bash
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your secret>
PORT=5001
```

### 4. Start both servers
# Frontend
```bash
npm run dev
```

# Backend
```bash
node index.js
```

Visit:
Frontend → http://localhost:5173
Backend → http://localhost:5001

-------------------------------------------------------------------------------

## Folder Structure
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
-------------------------------------------------------------------------------