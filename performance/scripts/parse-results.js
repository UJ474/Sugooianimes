const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, '../results');
const files = [
  { name: 'Health Check', file: 'summary-health-check.json', endpoint: '/' },
  { name: 'Token Validation', file: 'summary-token-validation.json', endpoint: '/api/protected' },
  { name: 'Get Watchlist', file: 'summary-get-watchlist.json', endpoint: '/api/weeb/watchlist' },
  { name: 'Get Watching', file: 'summary-get-watching.json', endpoint: '/api/weeb/watching' },
  { name: 'Get Completed', file: 'summary-get-completed.json', endpoint: '/api/weeb/completed' },
  { name: 'Get History', file: 'summary-get-history.json', endpoint: '/api/weeb/history' },
  { name: 'Staged Load (Watchlist)', file: 'summary-staged-watchlist.json', endpoint: '/api/weeb/watchlist (1-50 VUs)' },
];

const results = {};

for (const item of files) {
  const filePath = path.join(resultsDir, item.file);
  if (fs.existsSync(filePath)) {
    const summary = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const dur = summary.metrics.http_req_duration || {};
    const reqs = summary.metrics.http_reqs || {};
    const failed = summary.metrics.http_req_failed || {};

    const count = reqs.count || 0;
    const rate = Number((reqs.rate || 0).toFixed(2));
    const avg = Number((dur.avg || 0).toFixed(2));
    const med = Number((dur.med || 0).toFixed(2));
    const p90 = Number((dur['p(90)'] || 0).toFixed(2));
    const p95 = Number((dur['p(95)'] || 0).toFixed(2));
    const p99 = Number((dur['p(99)'] || 0).toFixed(2));
    const errRate = ((failed.value !== undefined ? failed.value : (failed.passes / (failed.passes + failed.fails || 1))) * 100).toFixed(2) + '%';

    results[item.name] = {
      endpoint: item.endpoint,
      total_requests: count,
      rps: rate,
      avg_ms: avg,
      med_ms: med,
      p90_ms: p90,
      p95_ms: p95,
      p99_ms: p99,
      error_rate: errRate,
    };
  }
}

const outputFile = process.argv[2] || path.join(resultsDir, 'baseline-metrics.json');
fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`Saved metrics to ${outputFile}:`);
console.table(Object.entries(results).map(([k, v]) => ({
  Name: k,
  Endpoint: v.endpoint,
  RPS: v.rps,
  Med_ms: v.med_ms,
  P95_ms: v.p95_ms,
  P99_ms: v.p99_ms,
  Total: v.total_requests,
  Errors: v.error_rate
})));

