const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 5175,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  const queries = [
    'how much experience this company have?',
    'how many years have you been in business?',
    'where are you located?',
    'who is nexvoys and what do you do?',
    'please provide me your portfolios',
    'show me your projects',
    'tell me about ODTool CPQ',
    'tell me about Eurobank fintech',
    'do you build SaaS multi-tenant apps?',
    'what AI tools and agent frameworks do you use?',
    'can we migrate legacy .NET 4.8 to .NET 9?',
    'what are your hourly rates or pricing?',
    'how can I hire you or contact the team?',
    'what do your clients say about you?'
  ];

  for (const q of queries) {
    console.log(`\n======================================================`);
    console.log(`💬 USER QUERY: "${q}"`);
    console.log(`======================================================`);
    const res = await postJson('/api/chat', { message: q, history: [] });
    if (res.data?.success && res.data?.data) {
      console.log(`BOT REPLY:\n${res.data.data.reply}`);
      console.log(`\nLINKS:`, res.data.data.links?.map(l => `${l.label} (${l.url})`));
      console.log(`SUGGESTIONS:`, res.data.data.suggestedActions);
    } else {
      console.error('ERROR:', res);
    }
  }
}

runTests().catch(console.error);
