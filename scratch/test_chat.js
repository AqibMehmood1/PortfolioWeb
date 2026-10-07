const http = require('http');

async function testChat(query) {
  const payload = JSON.stringify({
    message: query,
    history: []
  });

  const options = {
    hostname: 'localhost',
    port: 5175,
    path: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testInquiry() {
  const payload = JSON.stringify({
    name: 'Sarah Jenkins (CTO)',
    email: 'sarah.jenkins@healthscale.io',
    phone: '+1 415 890 1234',
    company: 'HealthScale Technologies',
    topic: 'SaaS Multi-Tenancy Architecture',
    message: 'We are seeking an architecture review and multi-tenant database migration for our 20k enterprise tenants.'
  });

  const options = {
    hostname: 'localhost',
    port: 5175,
    path: '/api/chat/inquiry',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Chat Query: SaaS Multi-Tenancy ---');
  const res1 = await testChat('Tell me about your SaaS multi-tenancy architecture and AI agent experience');
  console.log('Status:', res1.status);
  console.log('Reply:\n', res1.body.data?.reply);
  console.log('Suggested Actions:', res1.body.data?.suggestedActions);
  console.log('Links:', res1.body.data?.links);

  console.log('\n--- 2. Testing Chat Query: Case Studies / ODTool ---');
  const res2 = await testChat('Show me your work on ODTool and banking portals');
  console.log('Status:', res2.status);
  console.log('Reply:\n', res2.body.data?.reply);
  console.log('Links:', res2.body.data?.links);

  console.log('\n--- 3. Testing Lead Capture Inquiry Submission ---');
  const res3 = await testInquiry();
  console.log('Status:', res3.status);
  console.log('Result:', res3.body);
}

run().catch(console.error);
