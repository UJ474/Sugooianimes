import http from 'k6/http';
import { check, sleep } from 'k6';

const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:5001';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

export const options = {
  vus: 1,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  // 1. Health check
  const healthRes = http.get(`${TARGET_URL}/`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health body contains text': (r) => r.body && r.body.includes('API running'),
  });

  // 2. Authenticated endpoint (if token provided)
  if (AUTH_TOKEN) {
    const params = {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const protectedRes = http.get(`${TARGET_URL}/api/protected`, params);
    check(protectedRes, {
      'protected status is 200': (r) => r.status === 200,
    });

    const watchlistRes = http.get(`${TARGET_URL}/api/weeb/watchlist`, params);
    check(watchlistRes, {
      'watchlist status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);
}

