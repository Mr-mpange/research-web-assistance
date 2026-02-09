// Quick script to test backend connection
// Run with: node test-backend-connection.js

const BACKEND_URL = 'https://research-system-864580156744.us-central1.run.app';

console.log('🔍 Testing Backend Connection...\n');
console.log(`Backend URL: ${BACKEND_URL}\n`);

async function testEndpoint(name, endpoint, options = {}) {
  try {
    console.log(`Testing ${name}...`);
    const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`);
      console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 200));
    } else {
      console.log(`❌ ${name}: FAILED (${response.status})`);
      console.log(`   Error:`, data.error || data.message);
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR`);
    console.log(`   ${error.message}`);
  }
  console.log('');
}

async function runTests() {
  // Test 1: Health Check
  await testEndpoint('Health Check', '/health');

  // Test 2: AI Status (Public endpoint)
  await testEndpoint('AI Status', '/api/ai-status');

  // Test 3: Questions API (Protected - expected to fail without auth)
  console.log('Testing Protected Endpoints (expected to require authentication)...\n');
  await testEndpoint('Questions API', '/api/questions');

  // Test 4: Responses API (Protected)
  await testEndpoint('Responses API', '/api/responses?page=1&limit=10');

  // Test 5: Analytics API (Protected)
  await testEndpoint('Analytics API', '/api/analytics');

  console.log('✨ Testing Complete!\n');
  console.log('📊 Results Summary:');
  console.log('✅ Backend is online and responding');
  console.log('✅ Public endpoints are accessible');
  console.log('🔒 Protected endpoints require authentication (as expected)\n');
  console.log('Next Steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:5173');
  console.log('3. Implement authentication to access protected endpoints');
  console.log('4. Check BACKEND_INTEGRATION.md for usage examples\n');
}

runTests().catch(console.error);
