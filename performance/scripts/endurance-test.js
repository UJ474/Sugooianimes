import http from 'k6/http';
import { check, sleep } from 'k6';

const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:5001';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';
const ENDPOINT = __ENV.ENDPOINT || '/api/weeb/watchlist';
const DURATION = __ENV.DURATION || '2m'; // Configurable duration
const VUS = parseInt(__ENV.VUS || '10', 10);
const ALLOW_LOAD_TEST = __ENV.ALLOW_LOAD_TEST === 'true';

if (!ALLOW_LOAD_TEST) {
  throw new Error('Endurance testing requires explicit opt-in. Set ALLOW_LOAD_TEST=true.');
}

export const options = {
  vus: VUS,
  duration: DURATION,
  thresholds: {
    http_req_failed: ['rate<0.05'],
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

  sleep(0.5);
}

