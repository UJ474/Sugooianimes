import http from 'k6/http';
import { check, sleep } from 'k6';

const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:5001';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';
const ENDPOINT = __ENV.ENDPOINT || '/api/weeb/watchlist';
const ALLOW_LOAD_TEST = __ENV.ALLOW_LOAD_TEST === 'true';

if (!ALLOW_LOAD_TEST) {
  throw new Error('Stress testing requires explicit opt-in. Set ALLOW_LOAD_TEST=true.');
}

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 60 },
    { duration: '20s', target: 100 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.20'],
    http_req_duration: ['p(95)<5000'],
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

  sleep(0.05);
}

