const http = require('http');
function check(host, port, path = '/') {
  return new Promise((res) => {
    const opts = { host, port, path, timeout: 2000 };
    const req = http.get(opts, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res({ host, port, status: r.statusCode, body: d.slice(0, 200) }));
    });
    req.on('error', (e) => res({ host, port, error: e.message }));
    req.setTimeout(2000, () => {
      req.abort();
      res({ host, port, error: 'timeout' });
    });
  });
}

(async () => {
  const checks = [
    ['127.0.0.1', 4000, '/api/hello'],
    ['::1', 4000, '/api/hello'],
    ['127.0.0.1', 3001, '/'],
    ['::1', 3001, '/'],
  ];
  for (const [h, p, path] of checks) {
    const r = await check(h, p, path);
    console.log(JSON.stringify(r));
  }
})();
