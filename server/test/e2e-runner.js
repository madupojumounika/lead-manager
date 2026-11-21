import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import http from 'http';

async function runEndToEndVerification() {
  console.log('--- Starting Live End-to-End API Verification ---');

  // Connect to DB
  await connectDB();

  // Start HTTP server
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099';
  console.log(`Live test server running on ${baseUrl}`);

  try {
    // 1. Health check
    console.log('1. Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    if (healthRes.status !== 200 || healthData.status !== 'ok') {
      throw new Error(`Health check failed: ${JSON.stringify(healthData)}`);
    }
    console.log('   ✓ Health check passed');

    // 2. Create Lead
    console.log('2. Testing POST /api/leads (Valid creation)...');
    const newLeadPayload = {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@merutech.com',
      phone: '+91 98765 43210',
      company: 'Meru Partner Solutions',
      source: 'LinkedIn',
      status: 'New'
    };
    const createRes = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLeadPayload)
    });
    const createData = await createRes.json();
    if (createRes.status !== 201 || !createData.success || !createData.data.id) {
      throw new Error(`Create lead failed: ${JSON.stringify(createData)}`);
    }
    const leadId = createData.data.id;
    console.log(`   ✓ Lead created successfully with ID: ${leadId}`);

    // 3. Reject Duplicate Email
    console.log('3. Testing POST /api/leads (Duplicate email prevention)...');
    const dupRes = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newLeadPayload,
        name: 'Another Person'
      })
    });
    const dupData = await dupRes.json();
    if (dupRes.status !== 409 || dupData.success !== false) {
      throw new Error(`Duplicate prevention failed: Expected 409, got ${dupRes.status}`);
    }
    console.log('   ✓ Duplicate email properly rejected with HTTP 409 Conflict');

    // 4. Reject Validation Errors
    console.log('4. Testing POST /api/leads (Invalid input validation)...');
    const badRes = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A', // too short (<2)
        email: 'not-an-email',
        phone: '12', // too short (<7)
        company: '',
        source: 'InvalidSource',
        status: 'InvalidStatus'
      })
    });
    const badData = await badRes.json();
    if (badRes.status !== 400 || badData.success !== false) {
      throw new Error(`Validation failed: Expected 400, got ${badRes.status}`);
    }
    console.log(`   ✓ Invalid input rejected with HTTP 400: ${badData.message}`);

    // 5. Query Leads with Search and Pagination
    console.log('5. Testing GET /api/leads (Listing, searching, pagination)...');
    const listRes = await fetch(`${baseUrl}/api/leads?search=Aarav&page=1&limit=10`);
    const listData = await listRes.json();
    if (listRes.status !== 200 || !listData.data || listData.data.length === 0) {
      throw new Error(`Listing leads failed: ${JSON.stringify(listData)}`);
    }
    console.log(`   ✓ Listing retrieved ${listData.data.length} lead(s) matching search 'Aarav'`);

    // 6. Retrieve Single Lead by ID
    console.log(`6. Testing GET /api/leads/${leadId}...`);
    const singleRes = await fetch(`${baseUrl}/api/leads/${leadId}`);
    const singleData = await singleRes.json();
    if (singleRes.status !== 200 || singleData.data.email !== newLeadPayload.email) {
      throw new Error(`Get lead by ID failed: ${JSON.stringify(singleData)}`);
    }
    console.log('   ✓ Single lead retrieved successfully');

    // 7. Update Lead
    console.log(`7. Testing PUT /api/leads/${leadId}...`);
    const updateRes = await fetch(`${baseUrl}/api/leads/${leadId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aarav Sharma Updated',
        company: 'Meru Enterprise Solutions'
      })
    });
    const updateData = await updateRes.json();
    if (updateRes.status !== 200 || updateData.data.name !== 'Aarav Sharma Updated') {
      throw new Error(`Update lead failed: ${JSON.stringify(updateData)}`);
    }
    console.log('   ✓ Lead updated successfully');

    // 8. Update Status via PATCH
    console.log(`8. Testing PATCH /api/leads/${leadId}/status...`);
    const patchRes = await fetch(`${baseUrl}/api/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Qualified' })
    });
    const patchData = await patchRes.json();
    if (patchRes.status !== 200 || patchData.data.status !== 'Qualified') {
      throw new Error(`Patch status failed: ${JSON.stringify(patchData)}`);
    }
    console.log('   ✓ Status transitioned to "Qualified" successfully');

    // 9. Verify Dashboard Statistics
    console.log('9. Testing GET /api/dashboard/stats...');
    const statsRes = await fetch(`${baseUrl}/api/dashboard/stats`);
    const statsData = await statsRes.json();
    if (statsRes.status !== 200 || statsData.data.qualified < 1) {
      throw new Error(`Dashboard stats verification failed: ${JSON.stringify(statsData)}`);
    }
    console.log(`   ✓ Dashboard counts verified: Total=${statsData.data.total}, Qualified=${statsData.data.qualified}`);

    // 10. Delete Lead
    console.log(`10. Testing DELETE /api/leads/${leadId}...`);
    const deleteRes = await fetch(`${baseUrl}/api/leads/${leadId}`, {
      method: 'DELETE'
    });
    const deleteData = await deleteRes.json();
    if (deleteRes.status !== 200 || !deleteData.success) {
      throw new Error(`Delete lead failed: ${JSON.stringify(deleteData)}`);
    }
    console.log('   ✓ Lead deleted successfully');

    // 11. Verify 404 after deletion
    const verify404 = await fetch(`${baseUrl}/api/leads/${leadId}`);
    if (verify404.status !== 404) {
      throw new Error(`Expected 404 after deletion, got ${verify404.status}`);
    }
    console.log('   ✓ Verified 404 Not Found after deletion');

    console.log('\n======================================================');
    console.log('ALL LIVE CRUD OPERATIONS COMPLETED & PASSED 100%!');
    console.log('======================================================\n');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await disconnectDB();
  }
}

runEndToEndVerification().catch((err) => {
  console.error('E2E Verification Error:', err);
  process.exit(1);
});
