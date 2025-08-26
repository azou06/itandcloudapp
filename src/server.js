const http = require('http');

let tickets = [];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'POST' && url.pathname === '/tickets') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { clientName, equipment, description } = JSON.parse(body || '{}');
        const ticket = {
          id: String(Date.now()),
          clientName,
          equipment,
          description,
          status: 'received'
        };
        tickets.push(ticket);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(ticket));
      } catch (err) {
        res.writeHead(400);
        res.end();
      }
    });
  } else if (req.method === 'GET' && url.pathname === '/tickets') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tickets));
  } else if (req.method === 'GET' && url.pathname.startsWith('/tickets/')) {
    const id = url.pathname.split('/')[2];
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(ticket));
    } else {
      res.writeHead(404);
      res.end();
    }
  } else if (req.method === 'PUT' && url.pathname.startsWith('/tickets/') && url.pathname.endsWith('/status')) {
    const id = url.pathname.split('/')[2];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { status } = JSON.parse(body || '{}');
        const ticket = tickets.find(t => t.id === id);
        if (ticket) {
          ticket.status = status;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(ticket));
        } else {
          res.writeHead(404);
          res.end();
        }
      } catch (err) {
        res.writeHead(400);
        res.end();
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

module.exports = { server, tickets };

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
