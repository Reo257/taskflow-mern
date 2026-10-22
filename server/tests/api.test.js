/**
 * TaskFlow API Integration & Regression Test Suite
 * Tests all endpoints, status codes, input validations, error scenarios, and ownership checks.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/app.js';
import http from 'http';

let mongoServer;
let server;
let baseUrl;

const runTests = async () => {
  console.log('====================================================');
  console.log('    ICTAK MERN Project - Automated Test Runner     ');
  console.log('====================================================\n');

  // 1. Setup in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // 2. Start HTTP server on random free port
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}/api`;
  console.log(`[Test Env] Test server active at ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;

  const assert = (name, condition, details = '') => {
    if (condition) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  };

  let user1Token = '';
  let user1Id = '';
  let user2Token = '';
  let user2Id = '';
  let createdTaskId = '';

  try {
    // TEST 1: Health check
    console.log('--- 1. System Health ---');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert('GET /api/health returns 200 OK', healthRes.status === 200 && healthData.success === true);

    // TEST 2: User 1 Registration
    console.log('\n--- 2. Authentication & Authorization ---');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Johnson',
        email: 'alice@ictak.edu',
        password: 'Password123!',
      }),
    });
    const regData = await regRes.json();
    assert('POST /api/auth/register returns 201 Created', regRes.status === 201);
    assert('Registration returns valid JWT and user info', Boolean(regData.token && regData.user?.id));
    user1Token = regData.token;
    user1Id = regData.user?.id;

    // TEST 3: Duplicate Registration (Conflict)
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Duplicate',
        email: 'alice@ictak.edu',
        password: 'Password123!',
      }),
    });
    assert('POST /api/auth/register with duplicate email returns 409 Conflict', dupRes.status === 409);

    // TEST 4: Invalid Validation on Register
    const invalidRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        email: 'bad-email',
        password: '123',
      }),
    });
    assert('POST /api/auth/register with invalid data returns 400 Bad Request', invalidRegRes.status === 400);

    // TEST 5: User 1 Login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@ictak.edu',
        password: 'Password123!',
      }),
    });
    const loginData = await loginRes.json();
    assert('POST /api/auth/login returns 200 OK with valid credentials', loginRes.status === 200 && Boolean(loginData.token));

    // TEST 6: User Login with wrong password
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@ictak.edu',
        password: 'WrongPassword',
      }),
    });
    assert('POST /api/auth/login with wrong password returns 401 Unauthorized', badLoginRes.status === 401);

    // TEST 7: Register User 2 (for data isolation testing)
    const reg2Res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bob Smith',
        email: 'bob@ictak.edu',
        password: 'Password123!',
      }),
    });
    const reg2Data = await reg2Res.json();
    user2Token = reg2Data.token;
    user2Id = reg2Data.user?.id;
    assert('User 2 registered successfully', reg2Res.status === 201);

    // TEST 8: Protected route without token
    console.log('\n--- 3. Task Management & Ownership Protection ---');
    const noAuthRes = await fetch(`${baseUrl}/tasks`);
    assert('GET /api/tasks without token returns 401 Unauthorized', noAuthRes.status === 401);

    // TEST 9: Create Task (Validation error - empty title)
    const emptyTaskRes = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        title: '   ',
      }),
    });
    assert('POST /api/tasks with empty title returns 400 Bad Request', emptyTaskRes.status === 400);

    // TEST 10: Create Task (Valid)
    const createTaskRes = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        title: 'Complete MERN Architecture Documentation',
        description: 'Prepare diagrams and complete README.md according to ICTAK guidelines',
        priority: 'high',
        status: 'in-progress',
        tags: ['ictak', 'mern', 'assignment'],
      }),
    });
    const createTaskData = await createTaskRes.json();
    assert('POST /api/tasks returns 201 Created', createTaskRes.status === 201 && createTaskData.success === true);
    createdTaskId = createTaskData.task?._id;

    // TEST 11: Get User 1 Tasks
    const getTasksRes = await fetch(`${baseUrl}/tasks?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const getTasksData = await getTasksRes.json();
    assert('GET /api/tasks returns 200 OK with pagination metadata', getTasksRes.status === 200 && getTasksData.tasks.length === 1);

    // TEST 12: Data Isolation: User 2 should NOT see User 1 tasks
    const user2TasksRes = await fetch(`${baseUrl}/tasks`, {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    const user2TasksData = await user2TasksRes.json();
    assert("User 2 cannot see User 1's tasks (Isolated collection)", user2TasksData.tasks.length === 0);

    // TEST 13: Data Protection: User 2 trying to read User 1 task by ID returns 403 Forbidden
    const forbiddenGetRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    assert('Accessing another user’s task returns 403 Forbidden', forbiddenGetRes.status === 403);

    // TEST 14: Data Protection: User 2 trying to edit User 1 task returns 403 Forbidden
    const forbiddenPutRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user2Token}`,
      },
      body: JSON.stringify({ title: 'Hacked by User 2' }),
    });
    assert('Updating another user’s task returns 403 Forbidden', forbiddenPutRes.status === 403);

    // TEST 15: User 1 updates own task
    const updateRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        status: 'completed',
        priority: 'high',
      }),
    });
    const updateData = await updateRes.json();
    assert('Owner can update task (returns 200 OK)', updateRes.status === 200 && updateData.task.status === 'completed');

    // TEST 16: Task Stats endpoint
    const statsRes = await fetch(`${baseUrl}/tasks/stats`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const statsData = await statsRes.json();
    assert('GET /api/tasks/stats returns accurate metrics', statsRes.status === 200 && statsData.stats.completed === 1);

    // TEST 17: User 1 deletes own task
    const delRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert('Owner can delete task (returns 200 OK)', delRes.status === 200);

    // TEST 18: Verify task is gone
    const verifyGetRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert('Fetching deleted task returns 404 Not Found', verifyGetRes.status === 404);

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    server.close();

    console.log('\n====================================================');
    console.log(`Test Results: ${passed} passed, ${failed} failed`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  }
};

runTests();
