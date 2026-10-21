import http from 'k6/http';
import { check, sleep } from 'k6';

const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:5001';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';
const ENDPOINT = __ENV.ENDPOINT || '/api/weeb/watchlist';
const ALLOW_LOAD_TEST = __ENV.ALLOW_LOAD_TEST === 'true';

if (!ALLOW_LOAD_TEST) {
  throw new Error('Load testing is not enabled. Set ALLOW_LOAD_TEST=true to proceed.');
}

export const options = {
  stages: [
    { duration: '10s', target: 1 },   // Warm-up / baseline
    { duration: '15s', target: 5 },   // Low concurrency
    { duration: '15s', target: 10 },  // Moderate concurrency
    { duration: '15s', target: 25 },  // Intermediate concurrency
    { duration: '15s', target: 50 },  // Higher concurrency
    { duration: '10s', target: 0 },   // Recovery
  ],
  thresholds: {
    http_req_failed: ['rate<0.10'],
    http_req_duration: ['p(95)<3000'],
  },
};

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (AUTH_TOKEN) {
    params.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  const res = http.get(`${TARGET_URL}${ENDPOINT}`, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.1);
}

