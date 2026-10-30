// test_modules_3_4.js - Automated integration test for Module 3 & Module 4
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

async function runTests() {
  console.log('--- STARTING MODULE 3 & MODULE 4 VERIFICATION SUITE ---');
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
  const testUsername = 'testuser_' + Date.now();
  const testPassword = 'Password123!';
  const testEmail = `${testUsername}@example.com`;
  console.log(`\n1. Creating test user: ${testUsername}`);
  
  const signupRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Mughaisina Tester',
    username: testUsername,
    email: testEmail,
    password: testPassword,
    confirmPassword: testPassword
  });

  assert(signupRes.statusCode === 201, 'Signup returns 201 Created');
  assert(signupRes.json && signupRes.json.recoveryCode, 'Signup returns recovery code');
  const recoveryCode = signupRes.json.recoveryCode;
  let sessionCookie = parseCookies(signupRes.headers);
  assert(sessionCookie.includes('hub_session'), 'Session cookie hub_session provided');

  // 2. Test Dashboard Summary for new user (Empty state requirement)
  console.log('\n2. Testing Dashboard Summary for fresh learner (Empty State)');
  const freshSummary = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/dashboard-summary',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });

  assert(freshSummary.statusCode === 200, 'Dashboard summary returns 200');
  assert(freshSummary.json && freshSummary.json.isNewLearner === true, 'Empty state flag is true for new learner');
  assert(freshSummary.json && freshSummary.json.stats.totalXp === 0, 'New learner XP is 0');
  assert(freshSummary.json && freshSummary.json.stats.lessonsCompleted === 0, 'Completed lessons is 0');
  assert(freshSummary.json && freshSummary.json.user.fullName === 'Mughaisina Tester', 'User name is accurate');

  // 3. Test Theme Settings (GET and POST)
  console.log('\n3. Testing Theme Settings Persistence');
  const initialSettings = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/settings',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(initialSettings.statusCode === 200, 'Get user settings returns 200');
  assert(initialSettings.json.settings.theme === 'system', 'Default theme is system');

  // Change theme to 'dark'
  const updateDarkRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/settings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    }
  }, { theme: 'dark', target_language: 'fr', explanation_language: 'ta', learning_level: 'beginner' });
  assert(updateDarkRes.statusCode === 200, 'Update settings to dark returns 200');
  assert(updateDarkRes.json.settings.theme === 'dark', 'Returned setting confirms dark theme');

  // Verify settings persist on subsequent GET
  const getUpdatedSettings = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/settings',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(getUpdatedSettings.json.settings.theme === 'dark', 'Persisted theme is dark');
  assert(getUpdatedSettings.json.settings.target_lang === 'fr', 'Persisted target language is fr');
  assert(getUpdatedSettings.json.settings.explanation_lang === 'ta', 'Persisted explanation language is ta');

  // 4. Test Supported Languages Endpoint (All 7 languages)
  console.log('\n4. Testing Supported Languages');
  const langRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/languages',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(langRes.statusCode === 200, 'Languages endpoint returns 200');
  const expectedCodes = ['ta', 'en', 'hi', 'ml', 'te', 'fr', 'ja'];
  const actualCodes = langRes.json.languages.map(l => l.code);
  const all7Present = expectedCodes.every(c => actualCodes.includes(c));
  assert(all7Present, `All 7 required languages are present: ${actualCodes.join(', ')}`);

  // 5. Test Units Endpoint for French explained in Tamil
  console.log('\n5. Testing Units & Lessons Retrieval (French explained in Tamil)');
  const unitsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?tgt=fr&exp=ta&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(unitsRes.statusCode === 200, 'Units endpoint returns 200');
  assert(unitsRes.json.units && unitsRes.json.units.length >= 5, `Returned ${unitsRes.json.units?.length} units (expected >= 5)`);
  const unit1 = unitsRes.json.units[0];
  assert(unit1.id === 'unit_1' && unit1.lessons.length > 0, 'Unit 1 has lessons');
  const firstLesson = unit1.lessons[0];

  // 6. Test Lesson Content & Interactive Exercise Generation
  console.log(`\n6. Testing Lesson Content for ${firstLesson.id} (Tamil explanation -> French target)`);
  const lessonRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/learning/lesson/${unit1.id}/${firstLesson.id}?tgt=fr&exp=ta&level=beginner`,
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(lessonRes.statusCode === 200, 'Lesson endpoint returns 200');
  const lessonData = lessonRes.json;
  assert(lessonData.exercises && lessonData.exercises.length >= 7, `Lesson contains ${lessonData.exercises?.length} exercises`);
  
  // Inspect question types
  const exerciseTypes = new Set(lessonData.exercises.map(e => e.type));
  console.log('   Exercise types in lesson:', Array.from(exerciseTypes).join(', '));
  assert(exerciseTypes.has('multiple_choice'), 'Contains multiple_choice exercise');
  assert(exerciseTypes.has('word_matching'), 'Contains word_matching exercise');
  assert(exerciseTypes.has('vocabulary_flashcard'), 'Contains vocabulary_flashcard exercise');

  // Verify exercise fields
  for (const ex of lessonData.exercises) {
    assert(ex.instruction && ex.instruction.length > 0, `Exercise ${ex.type} has clear instruction`);
    if (ex.type === 'multiple_choice' || ex.type === 'fill_in_the_blanks' || ex.type === 'translation_practice') {
      assert(ex.correctAnswer !== undefined, `Exercise ${ex.type} has correctAnswer`);
    } else if (ex.type === 'word_matching') {
      assert(Array.isArray(ex.pairs) && ex.pairs.length > 0, 'word_matching has pairs');
    }
  }

  // 7. Complete the lesson and record progress
  console.log('\n7. Testing Lesson Completion & Reward Recording');
  const completionRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    }
  }, {
    unit_id: unit1.id,
    lesson_id: firstLesson.id,
    target_lang: 'fr',
    explanation_lang: 'ta',
    learning_level: 'beginner',
    score: 8,
    total_questions: 9,
    mistakes: [
      {
        questionText: 'Bonjour',
        userAnswer: 'Good night',
        correctAnswer: 'Hello / Good morning',
        explanation: 'Bonjour means Hello / Good morning in French'
      }
    ]
  });
  assert(completionRes.statusCode === 200, 'Lesson completion returns 200');
  assert(completionRes.json.isFirstTime === true, 'Flagged as first completion');
  assert(completionRes.json.totalXp >= 10, `Earned XP recorded: ${completionRes.json.totalXp}`);
  assert(completionRes.json.lessonsCompleted === 1, 'Lessons completed count is 1');
  assert(completionRes.json.streakDays >= 1, `Streak recorded: ${completionRes.json.streakDays}`);

  // 8. Prevent duplicate XP abuse test
  console.log('\n8. Testing Duplicate XP Prevention on Lesson Repeat');
  const duplicateCompletionRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    }
  }, {
    unit_id: unit1.id,
    lesson_id: firstLesson.id,
    target_lang: 'fr',
    explanation_lang: 'ta',
    learning_level: 'beginner',
    score: 9,
    total_questions: 9,
    mistakes: []
  });
  assert(duplicateCompletionRes.statusCode === 200, 'Duplicate completion request returns 200');
  assert(duplicateCompletionRes.json.isFirstTime === false, 'Properly recognized as repeat attempt');
  assert(duplicateCompletionRes.json.earnedXp <= 5, `Duplicate completion does not award base XP again (earned bonus is ${duplicateCompletionRes.json.earnedXp})`);

  // 9. Verify Dashboard Summary reflects real progress
  console.log('\n9. Verifying Dashboard Summary Now Displays Real Progress');
  const updatedSummary = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/dashboard-summary',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(updatedSummary.json.isNewLearner === false, 'isNewLearner is false after completing a lesson');
  assert(updatedSummary.json.stats.lessonsCompleted === 1, 'Dashboard shows 1 completed lesson');
  assert(updatedSummary.json.stats.totalXp > 0, 'Dashboard shows actual XP');
  assert(updatedSummary.json.recentActivity && updatedSummary.json.recentActivity.length >= 1, 'Dashboard has recent activity log');
  assert(updatedSummary.json.recentActivity[0].target_lang === 'fr', 'Recent activity target language is French');

  // 10. Test Multi-language Pair: Japanese taught with English explanation
  console.log('\n10. Testing Target Language Change (Japanese taught in English)');
  const jaUnitsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?tgt=ja&exp=en&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(jaUnitsRes.statusCode === 200, 'Japanese units return 200');
  const jaLessonRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/learning/lesson/unit_1/lesson_1_1?tgt=ja&exp=en&level=beginner`,
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(jaLessonRes.statusCode === 200, 'Japanese lesson returns 200');
  const jaSample = jaLessonRes.json.exercises[0];
  const jaText = jaSample.targetWord || jaSample.promptText || jaSample.instruction;
  assert(jaText && jaText.length > 0, `Japanese exercise generated: ${jaText}`);

  // Complete Japanese lesson
  await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    }
  }, {
    unit_id: 'unit_1',
    lesson_id: 'lesson_1_1',
    target_lang: 'ja',
    explanation_lang: 'en',
    learning_level: 'beginner',
    score: 8,
    total_questions: 8,
    mistakes: []
  });

  // Verify both French and Japanese progress coexist
  const multiProgressSummary = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/dashboard-summary',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(multiProgressSummary.json.stats.lessonsCompleted === 2, 'Total completed lessons is 2 across languages');

  // 11. Test Persistence Across Logout and Re-Login
  console.log('\n11. Testing Persistence Across Logout & Re-Login');
  // Logout
  const logoutRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/logout',
    method: 'POST',
    headers: { 'Cookie': sessionCookie }
  });
  assert(logoutRes.statusCode === 200, 'Logout successful');

  // Re-login
  const reloginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: testUsername,
    password: testPassword
  });
  assert(reloginRes.statusCode === 200, 'Re-login successful');
  const newSessionCookie = parseCookies(reloginRes.headers);

  // Check that settings and progress survived
  const persistedSettings = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/settings',
    method: 'GET',
    headers: { 'Cookie': newSessionCookie }
  });
  assert(persistedSettings.json.settings.theme === 'dark', 'Theme preference (dark) persisted across sessions');

  const persistedSummary = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/dashboard-summary',
    method: 'GET',
    headers: { 'Cookie': newSessionCookie }
  });
  assert(persistedSummary.json.stats.lessonsCompleted === 2, 'Completed lessons (2) persisted across sessions');
  assert(persistedSummary.json.stats.totalXp >= 20, 'XP persisted across sessions');

  console.log('\n--- VERIFICATION TEST SUMMARY ---');
  if (failures === 0) {
    console.log('✅ ALL TESTS PASSED SUCCESSFULLY! (0 failures)\n');
    process.exit(0);
  } else {
    console.error(`❌ ${failures} TEST(S) FAILED.\n`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
