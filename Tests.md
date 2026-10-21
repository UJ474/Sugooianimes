# Sugooianimes — Load Testing & Scalability Engineering Specification

This document defines the formal load testing methodology, workload modeling, execution profiles, and architectural benchmark specifications for the **Sugooianimes** platform.

---

## 1. Engineering Objectives

The primary goals of this testing suite are:
1. **Baseline Characterization:** Measure raw throughput (RPS), median latency, and tail latencies (P90, P95, P99) under baseline operational conditions across both public and authenticated routes.
2. **Concurrency & Saturation Limits:** Identify the exact inflection point where concurrent request volume causes latency degradation, connection pool exhaustion, or CPU contention.
3. **Bottleneck Attribution:** Quantify whether bottlenecks originate in the Node.js event loop, Mongoose document hydration, or remote cloud database network roundtrips.
4. **Validation of Architectural Optimizations:** Provide a reproducible harness to evaluate and verify optimizations (such as lean query projection and in-memory TTL caching with write-invalidation) using deterministic metrics.

---

## 2. Workload Modeling & Scenario Catalog

Endpoints are cataloged based on computational intensity, data dependencies, and state-change characteristics:

| Scenario ID | Operation | Target Endpoint | Method | Data Layer Dependency | Auth Required | Traffic Profile |
|---|---|---|---|---|---|---|
| **SC-01** | Health Check | `/` | GET | None (Routing overhead only) | No | Continuous High RPS |
| **SC-02** | Token Validation | `/api/protected` | GET | CPU (JWT verification) | Yes | Continuous High RPS |
| **SC-03** | Watchlist Retrieval | `/api/weeb/watchlist` | GET | MongoDB (`Weeb.watchlist`) | Yes | Ramped 1–50 VUs |
| **SC-04** | Watching List | `/api/weeb/watching` | GET | MongoDB (`Weeb.history.watching`) | Yes | Concurrent Read |
| **SC-05** | Completed List | `/api/weeb/completed` | GET | MongoDB (`Weeb.history.completed`) | Yes | Concurrent Read |
| **SC-06** | Viewing History | `/api/weeb/history` | GET | MongoDB (`Weeb.history.all`) | Yes | Concurrent Read |
| **SC-07** | Watchlist Mutation | `/api/weeb/watchlist` | POST | MongoDB (Write + Re-indexing) | Yes | Isolated Fixture |

---

## 3. Test Suites & Execution Profiles

All tests are implemented using **Grafana k6** and located in [`performance/scripts/`](./performance/scripts/).

### A. Smoke Test (`performance/scripts/smoke.js`)
- **Intent:** Sanity check to verify server availability, network connectivity, and schema contracts.
- **Profile:** 1 Virtual User (VU) for 15 seconds.
- **Pass Criteria:** 100% 200 OK responses, P95 latency < 1,000 ms.

### B. Isolated Endpoint Benchmark (`performance/scripts/endpoint-benchmark.js`)
- **Intent:** Evaluate single-endpoint throughput and latency distribution in isolation.
- **Profile:** Configurable (Default: 10 VUs for 10 seconds per endpoint).
- **Collected Metrics:** Total requests, RPS, Median, P90, P95, P99, and Error Rate.

### C. Staged Concurrency Profile (`performance/scripts/staged-load.js`)
- **Intent:** Measure degradation curves as concurrent users ramp under stepped pressure.
- **Stages:**
  1. **Warm-up / Baseline:** 1 VU for 10 seconds.
  2. **Low Concurrency:** 5 VUs for 15 seconds.
  3. **Moderate Concurrency:** 10 VUs for 15 seconds.
  4. **Intermediate Concurrency:** 25 VUs for 15 seconds.
  5. **High Concurrency:** 50 VUs for 15 seconds.
  6. **Cool-down / Recovery:** Ramp down to 0 VUs over 10 seconds.
- **Safety Gate:** Requires explicit opt-in via `ALLOW_LOAD_TEST=true`.

### D. Stress & Endurance Profiles (`performance/scripts/stress-test.js`, `endurance-test.js`)
- **Stress:** Spikes to 100 concurrent VUs to test error recovery and graceful saturation.
- **Endurance:** Sustained 10 VU concurrency over extended durations to evaluate memory leak risks or connection pool degradation.

---

## 4. Key Performance Indicators (KPIs) & SLA Targets

| Metric | Target SLA | Evaluation Method |
|---|---|---|
| **Error Rate** | `< 0.05%` (Zero tolerance for 5xx errors) | k6 `http_req_failed` counter |
| **Median Latency** | `< 2.0 ms` for cached reads, `< 50 ms` for cold DB reads | k6 `http_req_duration` median |
| **P95 Latency** | `< 10.0 ms` under 50 concurrent VUs | k6 `p(95)` threshold |
| **Throughput Target** | `> 10,000 req/s` for read endpoints | Sustained iterations / sec |

---

## 5. Environment & Execution Safety Protocols

1. **Isolation from Upstream APIs:** External anime providers (Kitsu API) are invoked directly from the browser for catalog discovery and are not subjected to synthetic load to prevent rate-limit violations.
2. **Credential Sanitization:** Test tokens and database URIs are managed strictly via environment variables; credentials are systematically excluded from version control via `.gitignore`.
3. **Dedicated Test Fixture:** Write testing utilizes a dedicated sandbox account (`benchmark_user@sugooianime.test`) to prevent pollution of operational collections.

---

## 6. How to Reproduce

### 1. Prerequisites
- Node.js v18+
- Grafana k6 (`brew install k6`)
- Running backend instance with MongoDB connected

### 2. Run Smoke Test
```bash
TARGET_URL="http://localhost:5001" AUTH_TOKEN="<JWT_TOKEN>" k6 run performance/scripts/smoke.js
```

### 3. Run Automated Full Benchmark Suite
```bash
node performance/scripts/run-all-benchmarks.js performance/results/baseline-metrics.json
```

---

*For detailed benchmark findings, before-and-after metrics, and architectural analysis, refer to [`Results.md`](./Results.md).*
