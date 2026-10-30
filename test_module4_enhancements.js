// test_module4_enhancements.js - Verification of Module 4 Fixes and Enhancements
const http = require('http');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          json: json
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

function parseCookies(resHeaders) {
  const setCookie = resHeaders['set-cookie'];
  if (!setCookie) return '';
  return setCookie.map(c => c.split(';')[0]).join('; ');
}

async function run() {
  console.log('--- STARTING MODULE 4 ENHANCEMENTS VERIFICATION SUITE ---');
  let failures = 0;
  function assert(condition, message) {
    if (condition) {
      console.log('  [PASS]', message);
    } else {
      console.error('  [FAIL]', message);
      failures++;
    }
  }

  // 1. Create a fresh test user
  const testUsername = 'm4_test_' + Date.now();
  const testPassword = 'Password123!';
  const testEmail = `${testUsername}@example.com`;
  console.log(`\n1. Creating test learner: ${testUsername}`);

  const signupRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Mughaisina Module 4 Tester',
    username: testUsername,
    email: testEmail,
    password: testPassword,
    confirmPassword: testPassword
  });

  assert(signupRes.statusCode === 201, 'Signup returns 201 Created');
  const sessionCookie = parseCookies(signupRes.headers);
  assert(sessionCookie.includes('hub_session'), 'Received valid hub_session cookie');

  // 2. Test Beginner Level Units & 50+ distinct lessons
  console.log('\n2. Testing Beginner Learning Path (50+ Lessons)');
  const bUnitsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?exp=en&tgt=fr&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });

  assert(bUnitsRes.statusCode === 200, 'Beginner units endpoint returns 200');
  assert(bUnitsRes.json.units && bUnitsRes.json.units.length === 10, `Beginner has 10 units (actual: ${bUnitsRes.json.units?.length})`);
  const bLessons = bUnitsRes.json.units.flatMap(u => u.lessons);
  assert(bLessons.length >= 50, `Beginner contains ${bLessons.length} lessons (>= 50 required)`);

  // 3. Test Intermediate Level Units & 50+ distinct lessons
  console.log('\n3. Testing Intermediate Learning Path (50+ Lessons)');
  const iUnitsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?exp=en&tgt=fr&level=intermediate',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });

  assert(iUnitsRes.statusCode === 200, 'Intermediate units endpoint returns 200');
  assert(iUnitsRes.json.units && iUnitsRes.json.units.length === 10, `Intermediate has 10 units (actual: ${iUnitsRes.json.units?.length})`);
  const iLessons = iUnitsRes.json.units.flatMap(u => u.lessons);
  assert(iLessons.length >= 50, `Intermediate contains ${iLessons.length} lessons (>= 50 required)`);

  // Check that intermediate content is completely distinct from beginner
  const bFirstUnitTitle = bUnitsRes.json.units[0].title;
  const iFirstUnitTitle = iUnitsRes.json.units[0].title;
  assert(bFirstUnitTitle !== iFirstUnitTitle, `Beginner Unit 1 ("${bFirstUnitTitle}") is distinct from Intermediate Unit 1 ("${iFirstUnitTitle}")`);

  // 4. Test Advanced Level Units & 50+ distinct lessons
  console.log('\n4. Testing Advanced Learning Path (50+ Lessons)');
  const aUnitsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?exp=en&tgt=fr&level=advanced',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });

  assert(aUnitsRes.statusCode === 200, 'Advanced units endpoint returns 200');
  assert(aUnitsRes.json.units && aUnitsRes.json.units.length === 10, `Advanced has 10 units (actual: ${aUnitsRes.json.units?.length})`);
  const aLessons = aUnitsRes.json.units.flatMap(u => u.lessons);
  assert(aLessons.length >= 50, `Advanced contains ${aLessons.length} lessons (>= 50 required)`);

  const aFirstUnitTitle = aUnitsRes.json.units[0].title;
  assert(aFirstUnitTitle !== iFirstUnitTitle && aFirstUnitTitle !== bFirstUnitTitle, `Advanced Unit 1 ("${aFirstUnitTitle}") is distinct from Intermediate and Beginner`);

  // 5. Test Unique Lesson IDs Across Whole Curriculum
  console.log('\n5. Verifying Lesson ID Uniqueness Across All 156 Lessons');
  const allIds = [...bLessons, ...iLessons, ...aLessons].map(l => l.id);
  const uniqueIds = new Set(allIds);
  assert(allIds.length === 156, `Total lessons across 3 levels: ${allIds.length} (expected 156)`);
  assert(uniqueIds.size === 156, `All 156 lesson IDs are strictly unique (unique count: ${uniqueIds.size})`);

  // 6. Test Exercise Types Generation for Beginner, Intermediate, and Advanced
  console.log('\n6. Testing Interactive Exercises for Beginner, Intermediate, and Advanced');
  const bLessonRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/learning/lesson/${bUnitsRes.json.units[0].id}/${bLessons[0].id}?exp=ta&tgt=fr&level=beginner`,
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(bLessonRes.statusCode === 200, 'Fetch beginner lesson returns 200');
  const bTypes = new Set(bLessonRes.json.exercises.map(e => e.type));
  console.log('   Beginner exercise types:', Array.from(bTypes).join(', '));
  assert(bTypes.has('vocabulary_flashcard'), 'Contains vocabulary_flashcard');
  assert(bTypes.has('multiple_choice'), 'Contains multiple_choice');
  assert(bTypes.has('word_matching'), 'Contains word_matching');
  assert(bTypes.has('listen_and_repeat'), 'Contains listen_and_repeat with microphone');
  assert(bTypes.has('robot_conversation'), 'Contains robot_conversation practice');

  const iLessonRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/learning/lesson/${iUnitsRes.json.units[0].id}/${iLessons[0].id}?exp=en&tgt=ja&level=intermediate`,
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(iLessonRes.statusCode === 200, 'Fetch intermediate lesson returns 200');
  const iTypes = new Set(iLessonRes.json.exercises.map(e => e.type));
  console.log('   Intermediate exercise types:', Array.from(iTypes).join(', '));
  assert(iTypes.has('robot_conversation'), 'Intermediate contains robot_conversation');

  const aLessonRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/learning/lesson/${aUnitsRes.json.units[0].id}/${aLessons[0].id}?exp=en&tgt=hi&level=advanced`,
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(aLessonRes.statusCode === 200, 'Fetch advanced lesson returns 200');
  const aConvo = aLessonRes.json.exercises.find(e => e.type === 'robot_conversation');
  assert(aConvo && aConvo.robotQuestion.length > 10, 'Advanced robot conversation has complex prompt');

  // 7. Test AI Robot Conversation Evaluation Endpoint
  console.log('\n7. Testing Robot Conversation Evaluation API');
  const convoEvalRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/evaluate-conversation',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    }
  }, {
    userSpeech: 'Je crois que la technologie rapproche les cultures du monde entier',
    robotQuestion: 'Que pensez-vous de la technologie ?',
    targetLang: 'fr',
    explanationLang: 'en',
    level: 'advanced'
  });

  assert(convoEvalRes.statusCode === 200, 'Conversation evaluation returns 200');
  assert(convoEvalRes.json.isAdequate === true, 'Response rated adequate');
  assert(convoEvalRes.json.feedback && convoEvalRes.json.feedback.length > 10, 'Feedback provided');

  // 8. Test Lesson Completion & Reward Progression
  console.log('\n8. Testing Lesson Completion & Unlocking Progression');
  const completeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    }
  }, {
    unit_id: bUnitsRes.json.units[0].id,
    lesson_id: bLessons[0].id,
    target_lang: 'fr',
    explanation_lang: 'ta',
    learning_level: 'beginner',
    score: 8,
    total_questions: 8,
    mistakes: []
  });

  assert(completeRes.statusCode === 200, 'Lesson completion recorded with 200');
  assert(completeRes.json.isFirstTime === true, 'Recognized as first completion');
  assert(completeRes.json.totalXp >= 15, `Earned XP recorded: ${completeRes.json.totalXp}`);

  // Check that unit progress now shows lesson completed
  const updatedUnitsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?exp=ta&tgt=fr&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  const u1Lessons = updatedUnitsRes.json.units[0].lessons;
  assert(u1Lessons[0].completed === true, 'Lesson 1 marked completed');

  // 9. Test Level Selection Persistence
  console.log('\n9. Testing Level Persistence Across User Settings');
  await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/settings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    }
  }, {
    theme: 'dark',
    explanation_lang: 'ta',
    target_lang: 'fr',
    learning_level: 'intermediate'
  });

  const settingsCheck = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/settings',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(settingsCheck.json.settings.learning_level === 'intermediate', 'learning_level persisted as intermediate');

  console.log('\n--- MODULE 4 VERIFICATION TEST SUMMARY ---');
  if (failures === 0) {
    console.log('✅ ALL MODULE 4 TESTS PASSED (0 failures)!\n');
    process.exit(0);
  } else {
    console.error(`❌ ${failures} TEST(S) FAILED.\n`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
