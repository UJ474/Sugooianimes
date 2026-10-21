const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tokenPath = path.join(__dirname, '../config/test-token.txt');
const token = fs.readFileSync(tokenPath, 'utf8').trim();

const targetUrl = process.env.TARGET_URL || 'http://localhost:5001';

const endpoints = [
  { name: 'Health Check', path: '/', vus: 10, duration: '10s' },
  { name: 'Token Validation', path: '/api/protected', vus: 10, duration: '10s' },
  { name: 'Get Watchlist', path: '/api/weeb/watchlist', vus: 10, duration: '10s' },
  { name: 'Get Watching', path: '/api/weeb/watching', vus: 10, duration: '10s' },
  { name: 'Get Completed', path: '/api/weeb/completed', vus: 10, duration: '10s' },
  { name: 'Get History', path: '/api/weeb/history', vus: 10, duration: '10s' },
];

const results = {};

console.log('=== Starting Benchmark Suite ===');
console.log('Target URL:', targetUrl);

for (const ep of endpoints) {
  console.log(`\nBenchmarking ${ep.name} (${ep.path}) with ${ep.vus} VUs for ${ep.duration}...`);
  const summaryFile = path.join(__dirname, `../results/summary-${ep.name.toLowerCase().replace(/\s+/g, '-')}.json`);
  
  const cmd = `TARGET_URL="${targetUrl}" AUTH_TOKEN="${token}" ENDPOINT="${ep.path}" VUS=${ep.vus} DURATION="${ep.duration}" k6 run --summary-export="${summaryFile}" performance/scripts/endpoint-benchmark.js`;
  
  try {
    const output = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    if (fs.existsSync(summaryFile)) {
      const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
      const dur = summary.metrics.http_req_duration || {};
      const reqs = summary.metrics.http_reqs || {};
      const failed = summary.metrics.http_req_failed || {};
      
      const count = reqs.count || 0;
      const rate = (reqs.rate || 0).toFixed(2);
      const avg = (dur.avg || 0).toFixed(2);
      const med = (dur.med || 0).toFixed(2);
      const p90 = (dur['p(90)'] || 0).toFixed(2);
      const p95 = (dur['p(95)'] || 0).toFixed(2);
      const p99 = (dur['p(99)'] || 0).toFixed(2);
      const errRate = (failed.value !== undefined ? (failed.value * 100).toFixed(2) : '0.00') + '%';

      results[ep.name] = {
        endpoint: ep.path,
        total_requests: count,
        rps: rate,
        avg_ms: avg,
        med_ms: med,
        p90_ms: p90,
        p95_ms: p95,
        p99_ms: p99,
        error_rate: errRate,
      };
      console.log(`Done: RPS: ${rate}, Median: ${med}ms, P95: ${p95}ms`);
    }
  } catch (err) {
    console.error(`Error running benchmark for ${ep.name}:`, err.message);
  }
}

// Now run staged load test
console.log('\nBenchmarking Staged Load on /api/weeb/watchlist (1 to 50 VUs)...');
const stagedSummaryFile = path.join(__dirname, '../results/summary-staged-watchlist.json');
try {
  const stagedCmd = `TARGET_URL="${targetUrl}" AUTH_TOKEN="${token}" ALLOW_LOAD_TEST=true ENDPOINT="/api/weeb/watchlist" k6 run --summary-export="${stagedSummaryFile}" performance/scripts/staged-load.js`;
  execSync(stagedCmd, { encoding: 'utf8', stdio: 'pipe' });
  if (fs.existsSync(stagedSummaryFile)) {
    const summary = JSON.parse(fs.readFileSync(stagedSummaryFile, 'utf8'));
    const dur = summary.metrics.http_req_duration || {};
    const reqs = summary.metrics.http_reqs || {};
    const failed = summary.metrics.http_req_failed || {};
    const count = reqs.count || 0;
    const rate = (reqs.rate || 0).toFixed(2);
    const avg = (dur.avg || 0).toFixed(2);
    const med = (dur.med || 0).toFixed(2);
    const p90 = (dur['p(90)'] || 0).toFixed(2);
    const p95 = (dur['p(95)'] || 0).toFixed(2);
    const p99 = (dur['p(99)'] || 0).toFixed(2);
    const errRate = (failed.value !== undefined ? (failed.value * 100).toFixed(2) : '0.00') + '%';

    results['Staged Load (Watchlist)'] = {
      endpoint: '/api/weeb/watchlist (1-50 VUs)',
      total_requests: count,
      rps: rate,
      avg_ms: avg,
      med_ms: med,
      p90_ms: p90,
      p95_ms: p95,
      p99_ms: p99,
      error_rate: errRate,
    };
    console.log(`Staged Load Complete: RPS: ${rate}, Median: ${med}ms, P95: ${p95}ms`);
  }
} catch (err) {
  console.error('Error running staged load test:', err.message);
}

const outputFile = process.argv[2] || path.join(__dirname, '../results/baseline-metrics.json');
fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`\nAll benchmark results saved to ${outputFile}`);
console.log(JSON.stringify(results, null, 2));
