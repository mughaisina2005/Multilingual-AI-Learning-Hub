const { execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity-ide\\brain\\40473dc8-e81b-468a-ab82-5fc4caace491';

function post(pathUrl, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: pathUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (e) {}
        resolve({ res, json });
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  const username = 'perfect_user_' + Date.now();
  const signup = await post('/api/auth/signup', {
    fullName: 'Mughaisina Dashboard User',
    username,
    email: `${username}@test.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!'
  });

  const setCookie = signup.res.headers['set-cookie'];
  const sessionToken = setCookie ? setCookie[0].split(';')[0].split('=')[1] : '';

  // Complete a French lesson
  const compReq = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `hub_session=${sessionToken}`
    }
  });
  compReq.write(JSON.stringify({
    unit_id: 'unit_1',
    lesson_id: 'lesson_1_1',
    target_lang: 'fr',
    explanation_lang: 'ta',
    learning_level: 'beginner',
    score: 9,
    total_questions: 9
  }));
  compReq.end();
  await new Promise(r => setTimeout(r, 600));

  // Capture 390px mobile dashboard
  const dash390 = path.join(artifactDir, 'dashboard_390_v2.png');
  execSync(`"${chromePath}" --headless=new --force-device-scale-factor=1 --hide-scrollbars --window-size=390,844 --virtual-time-budget=2500 --screenshot="${dash390}" "http://localhost:3000/dashboard?token=${sessionToken}"`, { stdio: 'ignore' });
  console.log('Saved dashboard_390_v2.png, size:', fs.statSync(dash390).size);

  // Capture 390px mobile learn page
  const learn390 = path.join(artifactDir, 'learn_390_v2.png');
  execSync(`"${chromePath}" --headless=new --force-device-scale-factor=1 --hide-scrollbars --window-size=390,844 --virtual-time-budget=2500 --screenshot="${learn390}" "http://localhost:3000/learn.html?token=${sessionToken}"`, { stdio: 'ignore' });
  console.log('Saved learn_390_v2.png, size:', fs.statSync(learn390).size);

  // Capture 1366px desktop dark dashboard
  const darkReq = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/settings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `hub_session=${sessionToken}`
    }
  });
  darkReq.write(JSON.stringify({ theme: 'dark' }));
  darkReq.end();
  await new Promise(r => setTimeout(r, 600));

  const dashDark = path.join(artifactDir, 'dashboard_dark_theme.png');
  execSync(`"${chromePath}" --headless=new --force-device-scale-factor=1 --hide-scrollbars --window-size=1366,768 --virtual-time-budget=2500 --screenshot="${dashDark}" "http://localhost:3000/dashboard?token=${sessionToken}"`, { stdio: 'ignore' });
  console.log('Saved dashboard_dark_theme.png, size:', fs.statSync(dashDark).size);
}

main().catch(console.error);
