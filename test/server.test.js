const test = require('node:test');
const assert = require('node:assert');
const { server } = require('../src/server');

const PORT = 3001;

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, body: json };
};

test('ticket lifecycle', async (t) => {
  await new Promise(resolve => server.listen(PORT, resolve));
  t.after(() => server.close());

  const base = `http://localhost:${PORT}`;

  // create ticket
  let res = await fetchJSON(`${base}/tickets`, {
    method: 'POST',
    body: JSON.stringify({ clientName: 'Jean', equipment: 'Laptop', description: 'Ne démarre pas' })
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.status, 'received');
  const id = res.body.id;

  // get ticket
  res = await fetchJSON(`${base}/tickets/${id}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.clientName, 'Jean');

  // update status
  res = await fetchJSON(`${base}/tickets/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'delivered' })
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'delivered');

  // list tickets
  res = await fetchJSON(`${base}/tickets`);
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.strictEqual(res.body.length, 1);
});
