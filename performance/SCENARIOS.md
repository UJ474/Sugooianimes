# Sugooianimes — Benchmark Scenarios

## 1. Scenario Catalog & Classification

Every discovered endpoint is categorized below according to the safety and behavioral taxonomy specified in `Tests.md`.

| Scenario ID | Operation | Endpoint | Method | Classification | Auth Required | Safety Tier |
|---|---|---|---|---|---|---|
| **SC-01** | Health Check | `/` | GET | Dynamic application endpoint | No | Tier 1: Safe (Read-only) |
| **SC-02** | Token Validation | `/api/protected` | GET | Authentication-dependent endpoint | Yes | Tier 1: Safe (Read-only) |
| **SC-03** | Get Watchlist | `/api/weeb/watchlist` | GET | Database-dependent endpoint | Yes | Tier 1: Safe (Read-only) |
| **SC-04** | Get Watching List | `/api/weeb/watching` | GET | Database-dependent endpoint | Yes | Tier 1: Safe (Read-only) |
| **SC-05** | Get Completed List| `/api/weeb/completed` | GET | Database-dependent endpoint | Yes | Tier 1: Safe (Read-only) |
| **SC-06** | Get Viewing History| `/api/weeb/history` | GET | Database-dependent endpoint | Yes | Tier 1: Safe (Read-only) |
| **SC-07** | User Login | `/api/auth/login` | POST | CPU-intensive (bcrypt) + Database | No | Tier 2: Controlled (High CPU) |
| **SC-08** | Add to Watchlist | `/api/weeb/watchlist` | POST | Write / State-changing endpoint | Yes | Tier 3: Isolated test account only |
| **SC-09** | Remove Watchlist | `/api/weeb/watchlist/:id` | DELETE | Write / State-changing endpoint | Yes | Tier 3: Isolated test account only |

---

## 2. Benchmark Prioritization

For the baseline assessment, tests prioritize:
1. **SC-01 (Health Check):** Measures baseline Express.js server overhead without database or authentication overhead.
2. **SC-02 (Token Validation):** Measures JWT verification and middleware latency (including `dotenv` I/O).
3. **SC-03 through SC-06 (Database Retrieval):** Measures user-specific document retrieval through Mongoose and MongoDB Atlas.
4. **Staged Concurrent Load:** Measures latency degradation as concurrent virtual users (VUs) ramp from 1 to 50 VUs.

Write operations (SC-08, SC-09) are restricted to dedicated test fixtures to prevent database pollution.

