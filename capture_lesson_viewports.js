const { execSync } = require('child_process');
const http = require('http');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\acer\\.gemini\\antigravity-ide\\brain\\0ed574a9-468e-4c25-b84f-ec9eaa62eb4c';

async function getSessionToken() {
  const postData = JSON.stringify({
    loginIdentifier: 'm4_test_user',
    password: 'Password123!'
  });

  return new Promise((resolve) => {
    const req = http.request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      const cookies = res.headers['set-cookie'];
      if (cookies && cookies.length > 0) {
        const match = cookies[0].match(/hub_session=([^;]+)/);
        if (match) return resolve(match[1]);
      }
      createTestUser().then(resolve);
    });
    req.on('error', () => createTestUser().then(resolve));
    req.write(postData);
    req.end();
  });
}

async function createTestUser() {
  const username = 'm4_vp_' + Date.now();
  const postData = JSON.stringify({
    fullName: 'Viewport Tester',
    username,
    email: username + '@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  });

  return new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      const cookies = res.headers['set-cookie'];
      if (cookies && cookies.length > 0) {
        const match = cookies[0].match(/hub_session=([^;]+)/);
        if (match) return resolve(match[1]);
      }
      reject(new Error('Failed to create user session'));
    });
    req.write(postData);
    req.end();
  });
}

async function capture() {
  const token = await getSessionToken();
  console.log('Session token:', token.substring(0, 10));

  const viewports = [
    { w: 320,  h: 600,  name: '320' },
    { w: 360,  h: 800,  name: '360' },
    { w: 375,  h: 667,  name: '375' },
    { w: 390,  h: 844,  name: '390' },
    { w: 430,  h: 932,  name: '430' },
    { w: 768,  h: 1024, name: '768' },
    { w: 1024, h: 768,  name: '1024' },
    { w: 1366, h: 768,  name: '1366' }
  ];

  for (const vp of viewports) {
    const shotPath = path.join(ARTIFACT_DIR, `m4_active_lesson_${vp.name}.png`);
    const targetUrl = `http://localhost:3000/learn.html?token=${token}&autostart=1`;
    const cmd = `"${CHROME}" --headless=new --force-device-scale-factor=1 --virtual-time-budget=3500 --window-size=${vp.w},${vp.h} --screenshot="${shotPath}" "${targetUrl}"`;
    try {
      execSync(cmd, { stdio: 'ignore' });
      console.log(`Captured active lesson at ${vp.name}px -> ${shotPath}`);
    } catch (err) {
      console.error(`Failed ${vp.name}px:`, err.message);
    }
  }
}

capture().catch(console.error);
