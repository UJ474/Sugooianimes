# Sugooianimes: Production Scaling, Caching & Feature Roadmap

This document outlines the architectural roadmap for **Sugooianimes** to scale smoothly from 1,000 to millions of active users while preventing third-party API rate limits, eliminating downtime, and introducing advanced anime discovery features.

---

## 1. Feature Specifications & Technical Implementation Guide

### Feature A: Hero Cover Image Banners
- **Objective:** Replace static/blurred fallback banners with high-definition horizontal artwork for each anime.
- **Data Source:** `item.attributes.coverImage` (`original`, `large`, `small`) from Kitsu API.
- **Implementation in `animepage.jsx`:**
  ```javascript
  const coverUrl = animeData.coverImage?.original || 
                   animeData.coverImage?.large || 
                   animeData.images?.jpg?.large_image_url;
  ```
  ```css
  .anime-hero-backdrop {
    background-image: linear-gradient(to bottom, rgba(10, 10, 15, 0.3) 0%, #0a0a0f 100%), url(...);
    background-size: cover;
    background-position: center;
    filter: blur(2px);
  }
  ```

---

### Feature B: Franchise / Sequels & Prequels Timeline
- **Objective:** Show users what to watch before or after the current title (e.g., *Season 1 → Movie → Season 2*).
- **Data Source:** Kitsu endpoint `/anime/:id/media-relationships?include=destination`
  - Relationship types: `prequel`, `sequel`, `parent_story`, `side_story`, `spin_off`, `alternative_setting`.
- **Implementation:**
  1. Add endpoint to `kitsuService.js`:
     ```javascript
     export async function getFranchiseTimeline(animeId) {
       const res = await fetch(`https://kitsu.io/api/edge/anime/${animeId}/media-relationships?include=destination`);
       const data = await res.json();
       const items = (data.included || []).filter(i => i.type === 'anime');
       return items.map(i => ({
         id: i.id,
         title: i.attributes.canonicalTitle,
         imageUrl: i.attributes.posterImage?.small,
         role: data.data.find(d => d.relationships.destination.data.id === i.id)?.attributes?.role
       }));
     }
     ```
  2. Render a horizontal timeline component on `AnimePage` with arrows connecting releases chronologically.

---

### Feature C: Official Streaming Provider Badges
- **Objective:** Give users direct 1-click links to legally watch anime on Crunchyroll, Netflix, Hulu, etc.
- **Data Source:** Kitsu endpoint `/anime/:id/streaming-links?include=streamer`
- **Supported Streamers:** Crunchyroll, Netflix, Hulu, Funimation, Tubi, Amazon Prime.
- **Implementation:**
  ```javascript
  export async function getStreamingLinks(animeId) {
    const res = await fetch(`https://kitsu.io/api/edge/anime/${animeId}/streaming-links?include=streamer`);
    const data = await res.json();
    const streamers = new Map((data.included || []).map(s => [s.id, s.attributes.siteName]));
    return (data.data || []).map(link => ({
      url: link.attributes.url,
      streamer: streamers.get(link.relationships.streamer?.data?.id) || 'Watch Online'
    }));
  }
  ```
  Render glowing badges on `AnimePage` next to the "Watchlist" button.

---

### Feature D: Next Episode Airing Countdown
- **Objective:** For currently airing titles, show a live countdown to the next broadcast.
- **Data Source:** `item.attributes.nextRelease` (ISO 8601 timestamp) & `item.attributes.status === 'current'`.
- **UI Element:** A glowing pill banner: *"Episode 6 airs in 2 days, 4 hours"*.

---

### Feature E: Age Rating & Content Advisory Badges
- **Data Source:** `item.attributes.ageRating` (`G`, `PG`, `R`, `R18`) and `item.attributes.ageRatingGuide` (e.g. *"Violence, Mild Profanity"*).
- **Placement:** Display in the top metadata tags next to the Score and Format badges on `AnimeCard` and `AnimePage`.

---

### Feature F: Characters & Voice Actors (Seiyuu) Grid
- **Data Source:** `/anime/:id/anime-characters?include=character` and `/anime-characters/:id/voices?include=person`.
- **UI:** Tab on `AnimePage` showing character avatars with actor names and language options (Japanese/English).

---

## 2. Multi-Tier Near-User Caching Architecture

To handle 1,000+ to millions of users without triggering Kitsu's rate limits (~60-120 req/min/IP), caching must happen in 3 layers:

```
[User Browser]
      │
      ▼
┌──────────────────────────────────────────────┐
│ Tier 1: Client-Side Cache (IndexedDB / Query) │  <-- 0ms (Instant, Offline Capable)
└──────────────────────────────────────────────┘
      │ (Cache Miss)
      ▼
┌──────────────────────────────────────────────┐
│ Tier 2: Edge CDN (Cloudflare Workers / CDN)  │  <-- <20ms (Global PoP Cache)
└──────────────────────────────────────────────┘
      │ (Cache Miss)
      ▼
┌──────────────────────────────────────────────┐
│ Tier 3: Backend Reverse Proxy (Node + Redis) │  <-- <50ms (Server In-Memory)
└──────────────────────────────────────────────┘
      │ (Cache Miss)
      ▼
[Kitsu Public API] (Less than 0.1% of all hits reach here)
```

---

### Tier 1: Client-Side (Local Cache via IndexedDB & TanStack Query)
- **Why not `localStorage`?** `localStorage` is synchronous, blocks the main UI thread, and is hard-capped at 5MB.
- **Solution:** Use `@tanstack/react-query` with an `idb-keyval` persister.
- **Configuration:**
  ```javascript
  import { QueryClient } from '@tanstack/react-query';
  import { persistQueryClient } from '@tanstack/react-query-persist-client';
  import { createIndexedDBPersister } from './idbPersister';

  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60 * 2,  // 2 hours fresh
        gcTime: 1000 * 60 * 60 * 24,    // 24 hours in IndexedDB
        refetchOnWindowFocus: false,
      },
    },
  });
  ```

---

### Tier 2: Edge CDN Caching (Cloudflare Cache Rules / Workers)
- **Objective:** Absorb 95%+ of all read traffic at Cloudflare edge servers near the user.
- **Cloudflare Worker Script Sample (`edge-cache.js`):**
  ```javascript
  export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const cache = caches.default;
      
      // Check edge cache
      let response = await cache.match(request);
      if (response) return response;

      // Forward to origin / backend proxy
      response = await fetch(request);

      // Cache successful GET requests for 6 hours
      if (request.method === 'GET' && response.status === 200) {
        const headers = new Headers(response.headers);
        headers.set('Cache-Control', 'public, max-age=21600, s-maxage=21600, stale-while-revalidate=86400');
        
        response = new Response(response.body, { ...response, headers });
        ctx.waitUntil(cache.put(request, response.clone()));
      }

      return response;
    }
  };
  ```

---

### Tier 3: Backend Reverse Proxy (Node.js + Redis)
- **Objective:** Prevent clients from making direct outbound requests to Kitsu, hiding rate limits behind a single consolidated origin cache.
- **Node.js Express + Redis Proxy Sample:**
  ```javascript
  const express = require('express');
  const Redis = require('ioredis');
  const redis = new Redis(process.env.REDIS_URL);
  const router = express.Router();

  router.get('/anime/popular', async (req, res) => {
    const page = req.query.page || 1;
    const cacheKey = `anime:popular:page:${page}`;

    // 1. Check Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // 2. Fetch from Kitsu
    const offset = (page - 1) * 20;
    const response = await fetch(`https://kitsu.io/api/edge/anime?sort=-userCount&page[limit]=20&page[offset]=${offset}`);
    const data = await response.json();

    // 3. Save to Redis (TTL 4 hours = 14400s)
    await redis.set(cacheKey, JSON.stringify(data), 'EX', 14400);

    return res.json(data);
  });

  module.exports = router;
  ```

---

## 3. Backend Integration & Data Model Compatibility

The backend uses MongoDB with Mongoose ([`server/src/models/Weeb.js`](file:///Users/utkarshjain/Desktop/Sugooianimes/server/src/models/Weeb.js)):

```javascript
const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});
```

### Full Compatibility Rules:
1. **Numeric ID Preservation:** Kitsu anime IDs are positive integers (e.g. `7442`, `46474`). In [`kitsuService.js`](file:///Users/utkarshjain/Desktop/Sugooianimes/client/src/services/kitsuService.js), `mal_id` is stored as `Number(item.id)`, ensuring seamless compatibility with Mongoose's `Number` type and existing routes:
   - `POST /api/weeb/watchlist`
   - `DELETE /api/weeb/watchlist/:mal_id`
   - `POST /api/weeb/watching`
   - `POST /api/weeb/completed`
   - `POST /api/weeb/history`
2. **Backward Compatibility with Legacy MAL IDs:** When an old user visits a profile with existing MyAnimeList IDs, `getAnimeById()` automatically queries Kitsu's `/mappings` endpoint to resolve the legacy MAL ID to the active Kitsu metadata.

---

## 4. Scaling to Millions of Users: Problems & Solutions

### Problem 1: Third-Party API Deprecation / Downtime
- **The Risk:** Like Jikan shutting down on October 1, 2026, Kitsu or any external API could change policies or experience outages.
- **The Solution:** **Periodic Database Ingestion**.
  - Maintain an internal MongoDB / PostgreSQL `Anime` collection.
  - Run a nightly cron worker (`bullmq` / `node-cron`) that fetches new season updates.
  - The client queries *your own API*, not external third parties.

### Problem 2: Image Hotlinking & Referrer Blocking
- **The Risk:** When serving millions of users, Kitsu's CDN (`media.kitsu.app`) may block hotlinked requests from your domain.
- **The Solution:**
  - Route poster images through Cloudflare Image Resizing or self-hosted `wsrv.nl` / `imgproxy`.
  - Convert images on the fly to `.webp` or `.avif` with 75% smaller file sizes.

### Problem 3: Database Write Hotspots on Watchlist & History
- **The Risk:** Millions of concurrent users clicking "Watching" or visiting pages will trigger millions of write operations on `Weeb.js`.
- **The Solution:**
  - **Write-Behind Caching:** Buffer history logging in a Redis List (`LPUSH history_queue`).
  - Flush buffered entries in batch inserts every 5 seconds to MongoDB (`insertMany`).
  - Configure MongoDB read replicas for watchlist retrieval queries.

### Problem 4: Search Latency Spikes
- **The Risk:** Hitting external APIs or database regex queries for live search will bottleneck CPU under heavy traffic.
- **The Solution:**
  - Deploy **Meilisearch** or **Typesense** populated with title synonyms and Japanese romaji.
  - Delivers sub-15ms typo-tolerant search results.

---

## 5. Implementation Roadmap Checklist

- [x] Migrate client from discontinued Jikan API to Kitsu API
- [x] Create centralized `kitsuService.js` normalization layer
- [x] Implement dynamic `Pagination.jsx` component with boundary and count limits
- [x] Ensure numeric `mal_id` compatibility with MongoDB backend
- [ ] Implement Cover Image Hero Banners on `AnimePage`
- [ ] Add Franchise Timeline component using Kitsu `/media-relationships`
- [ ] Add Official Streaming Links (Crunchyroll, Netflix)
- [ ] Set up Cloudflare Edge Caching rules on `/api`
- [ ] Implement Redis-backed Node.js caching proxy
- [ ] Setup image proxy / CDN caching for posters and backdrops
