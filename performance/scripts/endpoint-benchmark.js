import http from 'k6/http';
import { check } from 'k6';

const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:5001';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';
const ENDPOINT = __ENV.ENDPOINT || '/';
const VUS = parseInt(__ENV.VUS || '5', 10);
const DURATION = __ENV.DURATION || '15s';

export const options = {
  vus: VUS,
  duration: DURATION,
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
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

  const url = `${TARGET_URL}${ENDPOINT}`;
  const res = http.get(url, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}

