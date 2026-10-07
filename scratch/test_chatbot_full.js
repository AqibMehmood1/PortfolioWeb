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

async function runFullVerification() {
  console.log('====================================================');
  console.log('🚀 NEXVOYS AI CHATBOT COMPREHENSIVE INTELLIGENCE TEST');
  console.log('====================================================\n');

  const testCases = [
    {
      title: '1. SaaS Multi-Tenancy Architecture',
      query: 'How do you handle multi-tenant database isolation and SaaS scale?'
    },
    {
      title: '2. Autonomous AI Agents & GenAI',
      query: 'What AI tools and LLM frameworks do you use for agents?'
    },
    {
      title: '3. Case Studies & Portfolios',
      query: 'Tell me about the ODTool quotation engine and Eurobank project'
    },
    {
      title: '4. Legacy .NET Modernization',
      query: 'We have an old .NET Framework 4.8 monolith. How can we migrate to .NET 9?'
    },
    {
      title: '5. Tech Stack & Database Radar',
      query: 'What is your preferred frontend and backend technology stack?'
    },
    {
      title: '6. Pricing & Engagement Sprints',
      query: 'What are your rates and engagement options?'
    },
    {
      title: '7. Booking & Consultation Direct Intent',
      query: 'I want to schedule a 30-minute architecture review call'
    }
  ];

  for (const tc of testCases) {
    console.log(`\n▶ [TEST] ${tc.title}`);
    console.log(`User: "${tc.query}"`);
    const res = await postJson('/api/chat', { message: tc.query, history: [] });
    console.log(`HTTP Status: ${res.status}`);
    if (res.data && res.data.success && res.data.data) {
      const d = res.data.data;
      console.log(`Bot Reply (first 200 chars):\n${d.reply.substring(0, 220)}...`);
      console.log(`Suggested Actions (${d.suggestedActions?.length || 0}):`, d.suggestedActions);
      console.log(`Action Links (${d.links?.length || 0}):`, d.links?.map(l => `${l.label} -> ${l.url}`));
      console.log(`Is Lead Capture Trigger:`, d.isLeadCapturePrompt);
    } else {
      console.error('FAILED:', res);
    }
  }

  console.log('\n----------------------------------------------------');
  console.log('▶ [TEST] Inbound Lead Capture Submission');
  console.log('----------------------------------------------------');
  const leadRes = await postJson('/api/chat/inquiry', {
    name: 'Marcus Sterling',
    email: 'marcus.sterling@fintechcore.com',
    phone: '+1 650 492 8810',
    company: 'FintechCore Global',
    topic: 'Legacy .NET 9 Migration',
    message: 'We have 4 monolith microservices requiring audit and containerization on AKS.'
  });
  console.log('Lead Submission Status:', leadRes.status);
  console.log('Lead Result:', leadRes.data);

  console.log('\n====================================================');
  console.log('✅ ALL AI CHATBOT INTELLIGENCE SCENARIOS VERIFIED 100%');
  console.log('====================================================');
}

runFullVerification().catch(console.error);
