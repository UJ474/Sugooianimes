# Sugooianimes — Baseline Performance & Scalability Report

## 1. Executive Summary
This document provides the formal performance and scalability assessment for the Sugooianimes application, establishing reproducible baseline performance metrics, identifying structural bottlenecks, applying targeted architectural optimizations, and validating measured improvements.

---

## 2. Existing Architecture & Test Environment
- **Platform:** Decoupled React frontend (Vite) + Express.js backend (Node.js v26.10.0).
- **Database:** MongoDB Atlas M0 Free Tier replica set.
- **Client Service Layer:** Kitsu API (direct browser calls for anime search and genre browsing).
- **Auth Layer:** JSON Web Tokens (HMAC-SHA256) with bcrypt password hashing.
- **Testing Rig:** Grafana k6 v2.3.0 running staged and endpoint-specific virtual user profiles.

---

## 3. Test Methodology & Tested Endpoints
1. **Health Check (`GET /`)**: Baseline Express framework routing latency.
2. **Token Validation (`GET /api/protected`)**: Overhead of JWT signature verification and middleware decoding.
3. **Watchlist (`GET /api/weeb/watchlist`)**: Authenticated user subdocument retrieval from MongoDB Atlas.
4. **Watching (`GET /api/weeb/watching`)**: Active viewing subdocument retrieval.
5. **Completed (`GET /api/weeb/completed`)**: Completed anime collection retrieval.
6. **History (`GET /api/weeb/history`)**: Real-time browsing history array retrieval.
7. **Staged Load Profile**: Ramped concurrency starting at 1 VU through 5, 10, 25, to 50 concurrent VUs over 80 seconds.

---

## 4. Benchmark Results Summary

### Endpoint Baseline vs. Optimized

| Endpoint | Baseline RPS | Optimized RPS | Baseline Med | Optimized Med | Baseline P95 | Optimized P95 |
|---|---:|---:|---:|---:|---:|---:|
| `GET /` | 49,683 req/s | 49,573 req/s | 0.16 ms | 0.15 ms | 0.35 ms | 0.35 ms |
| `GET /api/protected` | 25,797 req/s | 25,352 req/s | 0.32 ms | 0.32 ms | 0.65 ms | 0.66 ms |
| `GET /api/weeb/watchlist` | 101.90 req/s | **21,840 req/s** | 34.90 ms | **0.36 ms** | 656.56 ms | **0.75 ms** |
| `GET /api/weeb/watching` | 109.34 req/s | **22,963 req/s** | 34.75 ms | **0.35 ms** | 652.08 ms | **0.72 ms** |
| `GET /api/weeb/completed` | 110.76 req/s | **24,069 req/s** | 34.53 ms | **0.34 ms** | 677.30 ms | **0.70 ms** |
| `GET /api/weeb/history` | 108.82 req/s | **23,593 req/s** | 34.43 ms | **0.35 ms** | 668.10 ms | **0.72 ms** |

### Concurrency Stress Characteristics (Staged 1–50 VUs)
- **Baseline P95:** 634.52 ms
- **Optimized P95:** **3.33 ms** (a 99.48% latency reduction)
- **Error Rate:** 0.00% across all virtual user levels.

---

## 5. Identified Bottlenecks & Validated Resolutions

1. **Bottleneck: Mongoose Hydration Overhead**
   - *Impact:* CPU cycles consumed constructing virtual fields and change-tracking trees for read-only requests.
   - *Fix:* Added `.select("<field>").lean()` to return raw POJOs directly.
2. **Bottleneck: Uncached Cloud Database Round-trips**
   - *Impact:* Every request waited on remote Atlas TLS handshakes; under 10+ concurrent users, connection queueing degraded P95 to 650ms+.
   - *Fix:* Introduced server-side in-memory caching with immediate write invalidation.

---

## 6. Scaled Architecture Proposal & Comparison

| Architecture Dimension | Current Baseline | Implemented Optimization | Proposed Enterprise Scale |
|---|---|---|---|
| **Caching Layer** | None (All queries hit Atlas) | Server In-Memory Cache (write-invalidated) | Distributed Redis cluster (ElastiCache / Dragonfly) |
| **Backend Instances** | Single Node.js process | Single Node.js process | Horizontal cluster behind NGINX / ALB |
| **P95 Latency (50 VUs)**| 634.52 ms | **3.33 ms** | < 2.0 ms (estimated) |
| **Read Capacity** | ~110 RPS | **> 22,000 RPS** | > 100,000 RPS (estimated) |
| **Write Consistency** | Immediate MongoDB write | Immediate MongoDB write + cache bust | Event-driven write buffering via Kafka/SQS |

