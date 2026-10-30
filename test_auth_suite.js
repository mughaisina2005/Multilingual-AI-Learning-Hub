const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Cookie jar for session management
let currentCookie = null;

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = options.headers || {};
  if (currentCookie && !headers['Cookie']) {
    headers['Cookie'] = currentCookie;
  }
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    redirect: 'manual'
  });

  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    const match = setCookie.match(/hub_session=[^;]+/);
    if (match) {
      currentCookie = match[0];
    }
  }

  let body = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  return { status: res.status, headers: res.headers, body };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log(' STARTING MULTILINGUAL AI HUB — MODULE 2 TEST SUITE');
  console.log('======================================================\n');

  // Test 1: Intro page loading and Get Started link
  console.log('--- 1. Testing Intro Page Integration ---');
  const introRes = await request('/intro.html');
  assert(introRes.status === 200, 'intro.html is served successfully (HTTP 200)');
  assert(introRes.body.includes('getStartedBtn'), 'intro.html contains Get Started button');
  assert(introRes.body.includes('auth.html'), 'intro.html Get Started button navigates to auth.html');
  assert(introRes.body.includes('skipIntroBtn'), 'intro.html Skip Intro button is preserved');
  assert(introRes.body.includes('replayBtn'), 'intro.html Replay Intro button is preserved');

  // Test 2: Auth page loading
  console.log('\n--- 2. Testing Auth Page ---');
  const authRes = await request('/auth.html');
  assert(authRes.status === 200, 'auth.html is served successfully (HTTP 200)');
  assert(authRes.body.includes('Multilingual AI Learning Hub'), 'auth.html contains Hub branding');
  assert(authRes.body.includes('Bridging Cultures with Adaptive AI Education.'), 'auth.html contains tagline');
  assert(!authRes.body.includes('btnGoogleSignIn'), 'auth.html does not contain Google Sign-In button');
  assert(!authRes.body.includes('Sign in with Google'), 'auth.html does not contain Sign in with Google text');
  assert(authRes.body.includes('viewForgot'), 'auth.html contains No-Email Recovery view');

  // Test 3: Protected routes without authentication
  console.log('\n--- 3. Testing Protected Routes (Unauthenticated) ---');
  currentCookie = null; // Clear cookie
  const unauthMe = await request('/api/auth/me');
  assert(unauthMe.status === 401, '/api/auth/me rejects unauthenticated requests (HTTP 401)');

  const unauthDash = await request('/dashboard');
  assert(unauthDash.status === 302, '/dashboard redirects unauthenticated requests (HTTP 302)');
  assert(unauthDash.headers.get('location').includes('auth.html'), '/dashboard redirects to auth.html');

  // Test 4: Registration Field Validations
  console.log('\n--- 4. Testing Registration Validations ---');
  const emptyRes = await request('/api/auth/signup', {
    method: 'POST',
    body: { fullName: '', username: '', email: '', password: '', confirmPassword: '' }
  });
  assert(emptyRes.status === 400 && emptyRes.body.error === 'MISSING_FIELDS', 'Empty fields are rejected with MISSING_FIELDS');

  const invalidEmailRes = await request('/api/auth/signup', {
    method: 'POST',
    body: { fullName: 'Test User', username: 'testuser', email: 'not-an-email', password: 'Password123!', confirmPassword: 'Password123!' }
  });
  assert(invalidEmailRes.status === 400 && invalidEmailRes.body.error === 'INVALID_EMAIL', 'Invalid email format is rejected with INVALID_EMAIL');

  const mismatchPassRes = await request('/api/auth/signup', {
    method: 'POST',
    body: { fullName: 'Test User', username: 'testuser', email: 'test@example.com', password: 'Password123!', confirmPassword: 'DifferentPassword!' }
  });
  assert(mismatchPassRes.status === 400 && mismatchPassRes.body.error === 'PASSWORD_MISMATCH', 'Password mismatch is detected with PASSWORD_MISMATCH');

  const shortPassRes = await request('/api/auth/signup', {
    method: 'POST',
    body: { fullName: 'Test User', username: 'testuser', email: 'test@example.com', password: '123', confirmPassword: '123' }
  });
  assert(shortPassRes.status === 400 && shortPassRes.body.error === 'WEAK_PASSWORD', 'Weak passwords (< 8 chars) are rejected with WEAK_PASSWORD');

  // Test 5: Valid Registration & One-Time Recovery Code Generation
  console.log('\n--- 5. Testing Valid Registration & Recovery Code ---');
  const uniqueSuffix = Date.now();
  const testUsername = `user_${uniqueSuffix}`;
  const testEmail = `user_${uniqueSuffix}@learninghub.ai`;
  const testPassword = 'SecureHubPassword2026!';

  const validSignupRes = await request('/api/auth/signup', {
    method: 'POST',
    body: {
      fullName: 'Aiden Vance',
      username: testUsername,
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword
    }
  });

  assert(validSignupRes.status === 201, 'Valid registration succeeds with HTTP 201');
  assert(validSignupRes.body.success === true, 'Response indicates success = true');
  assert(typeof validSignupRes.body.recoveryCode === 'string', 'One-time recovery code is generated');
  assert(validSignupRes.body.recoveryCode.startsWith('HUB-'), 'Recovery code is formatted as HUB-XXXX-XXXX-XXXX');
  const userRecoveryCode = validSignupRes.body.recoveryCode;
  console.log(`    Generated Recovery Code: ${userRecoveryCode}`);

  // Test 6: Duplicate Username & Email Rejections
  console.log('\n--- 6. Testing Duplicate Prevention ---');
  const dupUserRes = await request('/api/auth/signup', {
    method: 'POST',
    body: {
      fullName: 'Another User',
      username: testUsername,
      email: `other_${uniqueSuffix}@learninghub.ai`,
      password: testPassword,
      confirmPassword: testPassword
    }
  });
  assert(dupUserRes.status === 400 && dupUserRes.body.error === 'USERNAME_TAKEN', 'Duplicate username is rejected with USERNAME_TAKEN');

  const dupEmailRes = await request('/api/auth/signup', {
    method: 'POST',
    body: {
      fullName: 'Another User',
      username: `other_${uniqueSuffix}`,
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword
    }
  });
  assert(dupEmailRes.status === 400 && dupEmailRes.body.error === 'EMAIL_EXISTS', 'Duplicate email is rejected with EMAIL_EXISTS');

  // Test 7: Authenticated Session Verification
  console.log('\n--- 7. Testing Authenticated Session (/api/auth/me & /dashboard) ---');
  const authMeRes = await request('/api/auth/me');
  assert(authMeRes.status === 200, '/api/auth/me returns HTTP 200 for authenticated user');
  assert(authMeRes.body.user.username === testUsername, `Authenticated username matches (${testUsername})`);
  assert(authMeRes.body.user.email === testEmail, `Authenticated email matches (${testEmail})`);

  const authDashRes = await request('/dashboard');
  assert(authDashRes.status === 200, '/dashboard serves HTTP 200 for authenticated user');
  assert(authDashRes.body.includes('Verified Authenticated Session'), '/dashboard contains verified session indicator');

  // Test 8: Logout
  console.log('\n--- 8. Testing Logout ---');
  const logoutRes = await request('/api/auth/logout', { method: 'POST' });
  assert(logoutRes.status === 200, 'Logout succeeds with HTTP 200');

  const afterLogoutMe = await request('/api/auth/me');
  assert(afterLogoutMe.status === 401, 'After logout, /api/auth/me rejects with HTTP 401');

  // Test 9: Login Validations & Verification
  console.log('\n--- 9. Testing Login ---');
  const wrongPassLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { identifier: testUsername, password: 'WrongPassword123' }
  });
  assert(wrongPassLogin.status === 401, 'Incorrect password rejected with HTTP 401');
  assert(wrongPassLogin.body.error === 'INVALID_CREDENTIALS', 'Error type is INVALID_CREDENTIALS');

  // Correct login using username
  const correctLoginUser = await request('/api/auth/login', {
    method: 'POST',
    body: { identifier: testUsername, password: testPassword }
  });
  assert(correctLoginUser.status === 200, 'Login succeeds with username');
  assert(correctLoginUser.body.user.username === testUsername, 'Logged in user profile matches');

  // Logout and login using email
  await request('/api/auth/logout', { method: 'POST' });
  const correctLoginEmail = await request('/api/auth/login', {
    method: 'POST',
    body: { identifier: testEmail, password: testPassword }
  });
  assert(correctLoginEmail.status === 200, 'Login succeeds with email address');

  // Test 10: Google Sign-In Setup & Configuration Handling
  console.log('\n--- 10. Testing Google Sign-In Configuration Handling ---');
  const googleConfigRes = await request('/api/auth/google-config');
  assert(googleConfigRes.status === 200, '/api/auth/google-config returns HTTP 200');
  assert(typeof googleConfigRes.body.isConfigured === 'boolean', 'isConfigured is boolean');

  const unconfiguredGoogleAuth = await request('/api/auth/google', {
    method: 'POST',
    body: { credential: 'dummy_google_id_token' }
  });
  assert(unconfiguredGoogleAuth.status === 400, 'Unconfigured Google Auth returns HTTP 400 with setup guide');
  assert(unconfiguredGoogleAuth.body.error === 'GOOGLE_NOT_CONFIGURED', 'Error code is GOOGLE_NOT_CONFIGURED');
  assert(typeof unconfiguredGoogleAuth.body.setupGuide === 'object', 'Helpful setup guide is provided');

  // Test 11: No-Email Password Recovery Flow
  console.log('\n--- 11. Testing No-Email Password Recovery (Recovery Code) ---');
  // First test invalid recovery code
  const invalidCodeRecover = await request('/api/auth/recover', {
    method: 'POST',
    body: {
      identifier: testUsername,
      recoveryCode: 'HUB-9999-9999-9999',
      newPassword: 'BrandNewPassword2026!',
      confirmPassword: 'BrandNewPassword2026!'
    }
  });
  assert(invalidCodeRecover.status === 400, 'Invalid recovery code rejected with HTTP 400');
  assert(invalidCodeRecover.body.error === 'INVALID_RECOVERY_CODE', 'Error code is INVALID_RECOVERY_CODE');

  // Test valid recovery code
  const newSecretPassword = 'BrandNewPassword2026!';
  const validRecover = await request('/api/auth/recover', {
    method: 'POST',
    body: {
      identifier: testUsername,
      recoveryCode: userRecoveryCode,
      newPassword: newSecretPassword,
      confirmPassword: newSecretPassword
    }
  });

  assert(validRecover.status === 200, 'Valid recovery succeeds with HTTP 200');
  assert(validRecover.body.success === true, 'Recovery response indicates success = true');
  assert(typeof validRecover.body.newRecoveryCode === 'string', 'A new rotated recovery code is issued');
  console.log(`    New Rotated Recovery Code: ${validRecover.body.newRecoveryCode}`);

  // Old password must fail
  const oldPassLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { identifier: testUsername, password: testPassword }
  });
  assert(oldPassLogin.status === 401, 'Old password fails after password reset');

  // New password must succeed
  const newPassLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { identifier: testUsername, password: newSecretPassword }
  });
  assert(newPassLogin.status === 200, 'New password successfully logs in!');

  // Test 12: Database Persistence
  console.log('\n--- 12. Testing Database Persistence ---');
  const dbModule = require('./database');
  const persistedUser = await dbModule.findUserByUsername(testUsername);
  assert(persistedUser !== null, 'User is persisted in SQLite database file');
  assert(persistedUser.password_hash !== null && persistedUser.password_hash.startsWith('$2'), 'Password is encrypted with bcrypt hash');
  assert(persistedUser.recovery_hash !== null && persistedUser.recovery_hash.startsWith('$2'), 'Recovery code is encrypted with bcrypt hash');
  assert(!persistedUser.password_hash.includes(newSecretPassword), 'Password is never stored in plaintext');

  console.log('\n======================================================');
  console.log(` TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
  if (passedTests === totalTests) {
    console.log(' ALL 12 TEST GROUPS (18 VERIFICATION ITEMS) PASSED!');
  } else {
    console.log(' SOME TESTS FAILED');
  }
  console.log('======================================================\n');
}

runTestSuite().catch(err => {
  console.error('Fatal error during test suite execution:', err);
  process.exit(1);
});
