# Sugooianimes Performance & Benchmarking Suite

This directory contains the automated performance benchmarking infrastructure using Grafana k6.

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB
- Grafana k6 (`brew install k6`)

## Directory Structure
```
performance/
├── ARCHITECTURE.md          # Architectural analysis & component breakdown
├── SCENARIOS.md             # Scenario catalog & endpoint classifications
├── README.md                # Usage instructions & safety guidelines
├── config/
│   └── example.env          # Example configuration parameters
├── scripts/
│   ├── smoke.js             # Basic reachability and sanity testing
│   ├── endpoint-benchmark.js# Isolated endpoint benchmarking
│   ├── staged-load.js       # Ramped concurrent load testing (1 to 50 VUs)
│   ├── stress-test.js       # Limit-testing under heavy concurrency
│   └── endurance-test.js    # Sustained duration stability testing
├── results/                 # Raw JSON and summary benchmark data
└── reports/
    └── BASELINE_REPORT.md   # Comprehensive baseline and comparison report
```

## Running Benchmarks

### 1. Smoke Test
```bash
k6 run performance/scripts/smoke.js
```
With target URL and Auth token:
```bash
TARGET_URL=http://localhost:5001 AUTH_TOKEN=<token> k6 run performance/scripts/smoke.js
```

### 2. Isolated Endpoint Benchmark
```bash
TARGET_URL=http://localhost:5001 \
AUTH_TOKEN=<token> \
ENDPOINT=/api/weeb/watchlist \
VUS=10 \
DURATION=15s \
k6 run performance/scripts/endpoint-benchmark.js
```

### 3. Staged Load Test
```bash
TARGET_URL=http://localhost:5001 \
AUTH_TOKEN=<token> \
ALLOW_LOAD_TEST=true \
ENDPOINT=/api/weeb/watchlist \
k6 run performance/scripts/staged-load.js
```

### Safety Controls
- All load tests require `ALLOW_LOAD_TEST=true` explicitly.
- Never run high-concurrency benchmarks against third-party upstream APIs (e.g. Jikan, Kitsu) or production Vercel environments without written authorization.

