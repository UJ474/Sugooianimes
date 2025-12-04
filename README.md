# Sugooianime – Anime Discovery Platform

Sugooianime is a full‑stack anime browsing and tracking platform inspired by IMDb and MyAnimeList.  
It delivers **live anime data**, **personalized user dashboards**, **watchlists**, **watching/completed tracking**, and a **history system**, all backed by a secure authentication layer and a custom API.

---

##  Problem Statement

Most anime‑browsing websites only show static lists with no personalization. Users cannot:

- Track what they’re watching
- Maintain a watchlist
- Mark anime as completed
- View history of what they opened
- Enjoy a consistent design system

Sugooianime solves this by combining real‑time API data + a custom backend + user‑specific collections.

---

<<<<<<< HEAD

=======
>>>>>>> bf2d7c6f06ea7f8338ebb72f45197d629c793580
##  System Architecture  
**Frontend → Backend API → Database**

### **Frontend**
- React.js (Vite)
- Chakra UI + Custom CSS
- React Router for pages:
  - Home  
  - Popular  
  - New Releases  
  - Genre  
  - Anime Details  
  - Watchlist  
  - History  
  - Profile  
  - Login / Signup
- Reusable components (AnimeCard, Header, Profile, etc.)
- Fully responsive & consistent UI system
- State management with React Hooks

### **Backend**
- Node.js + Express.js
- Custom REST API for all anime interactions
- CRUD routes:
  - Watchlist  
  - Watching list  
  - Completed list  
  - History  
- Token‑based auth middleware
- External API proxy for Jikan / AniList

### **Database**
- MongoDB Atlas (Cloud)
- Collections:
  - users
  - watchlist
  - watching
  - completed
  - history

### **Authentication**
- JWT‑based login sessions
- Password hashing via bcrypt
- Secure protected routes

---

##  Key Features

- Full authentication system (Login, Signup, Protected Routes)
- Watchlist (Add / Remove)
- Watching list (Start watching / Remove)
- Completed list (Mark completed / Move from watching)
- History tracking (Auto‑track visited anime)
- Clear History (for all / watching / completed)
- Toast + popup feedback UX
- Anime search with live suggestions
- Genre filtering
- Popular / Current Season pages

---

## ️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React.js, Chakra UI, CSS Modules, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
| External API | Jikan / AniList |
| Hosting | Vercel (Frontend + Backend) |

---

##  Deployment Links

| Component | URL |
|----------|-----|
| **Frontend** | https://sugooianimes.vercel.app/ |
| **Backend** | https://sugooianimes-server.vercel.app/ |

---

##  API Routes Summary

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| /api/auth/signup | POST | Register user | Public |
| /api/auth/login | POST | Login user | Public |
| /api/watchlist | GET | Fetch watchlist | Protected |
| /api/watchlist | POST | Add anime | Protected |
| /api/watchlist/:id | DELETE | Remove anime | Protected |
| /api/watching | GET | Fetch watching list | Protected |
| /api/watching | POST | Move to watching | Protected |
| /api/watching/:id | DELETE | Remove | Protected |
| /api/completed | GET | Fetch completed list | Protected |
| /api/completed | POST | Add to completed | Protected |
| /api/completed/:id | DELETE | Remove | Protected |
| /api/history | GET | Fetch history | Protected |
| /api/history | DELETE | Clear all history | Protected |
| /api/history/:id | DELETE | Remove one | Protected |
| /api/anime/search | GET | Search / paginate | Public |

---

##  How to Run Locally

### 1. Clone Repository
```bash
git clone https://github.com/UJ474/Sugooianimes.git
cd Sugooianime
```

### 2. Install Dependencies
**Frontend**
```bash
cd client
npm install
```

**Backend**
```bash
cd ../server
npm install
```

### 3. Setup Environment Variables  
Create `/server/.env`:

```
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_secret_key>
PORT=5001
```

### 4. Run Development Servers  
Frontend:
```bash
npm run dev
```

Backend:
```bash
node run dev
```

---

##  Folder Structure

```
Sugooianime/
│
├── client/           # React frontend
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── server/           # Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── services/
│   ├── utils/
│   └── index.js
│
└── README.md
```
