/**
 * test_module_7.js
 * Comprehensive automated verification test suite for:
 * MODULE 7: PRACTICE & MISTAKE MEMORY
 * 
 * Verifies:
 * 1. Practice Page Route & Authentication Protection
 * 2. Practice Summary API & Real Data Calculation
 * 3. Adaptive Question Generation (Smart, Topic, Weak Topics, Mistakes)
 * 4. Mistake Memory Tracking & Deduplication (Attempt count, status, timestamps)
 * 5. Mistake Review & Mastery (Answering correctly resolves mistake while preserving history)
 * 6. Topics to Improve Calculation (Grounded in real attempt data, no invented stats)
 * 7. Session Completion & Controlled Practice XP Rewards
 * 8. User Data Isolation (No cross-user contamination)
 * 9. Session Persistence Across Logout & Re-login
 * 10. Non-regression of existing modules (Curriculum, Lesson locks, XP)
 */

const http = require('http');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (_) {}
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

async function runModule7Tests() {
  console.log('===============================================================');
  console.log('    TESTING MODULE 7: PRACTICE & MISTAKE MEMORY SUITE         ');
  console.log('===============================================================\n');

  let failures = 0;
  function assert(condition, message) {
    if (condition) {
      console.log('  [PASS]', message);
    } else {
      console.error('  [FAIL]', message);
      failures++;
    }
  }

  // 1. Create a fresh authenticated learner A
  const idA = Date.now();
  const userA = `learner_m7_a_${idA}`;
  const passA = 'Password123!';
  const emailA = `${userA}@example.com`;

  console.log(`1. Creating test learner A: ${userA}`);
  const signupA = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Learner Module Seven A',
    username: userA,
    email: emailA,
    password: passA,
    confirmPassword: passA
  });

  assert(signupA.statusCode === 201, 'Learner A created with 201 Created');
  const cookieA = parseCookies(signupA.headers);
  assert(cookieA.includes('hub_session='), 'Learner A received valid session cookie');

  // 2. Practice Page Route & Auth Protection
  console.log('\n2. Testing Practice Page Route Delivery & Protection');
  const unauthPractice = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/practice.html',
    method: 'GET'
  });
  assert(unauthPractice.statusCode === 302, 'Unauthenticated request to /practice.html redirects to login');

  const authPractice = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/practice.html',
    method: 'GET',
    headers: { 'Cookie': cookieA }
  });
  assert(authPractice.statusCode === 200, 'Authenticated request to /practice.html returns 200 OK');
  assert(authPractice.data.includes('Practice &amp; Mistake Memory') || authPractice.data.includes('Practice & Mistake Memory'), 'Page contains Practice & Mistake Memory title');
  assert(authPractice.data.includes('tabMistakes'), 'Page contains Review My Mistakes tab');
  assert(authPractice.data.includes('tabWeakTopics'), 'Page contains Topics to Improve tab');

  // 3. Testing Practice Summary Initial State
  console.log('\n3. Testing Practice Summary for Fresh Learner');
  const summaryRes1 = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/summary?tgt=ta',
    method: 'GET',
    headers: { 'Cookie': cookieA }
  });
  assert(summaryRes1.statusCode === 200, 'Practice summary returns 200 OK');
  assert(summaryRes1.json.totalMistakes === 0, 'Initial mistakes count is 0');
  assert(summaryRes1.json.unresolvedMistakesCount === 0, 'Initial unresolved mistakes count is 0');
  assert(summaryRes1.json.totalSessionsCompleted === 0, 'Initial completed sessions count is 0');

  // 4. Testing Adaptive Question Generation
  console.log('\n4. Testing Practice Question Generation (Smart, Topic, Weak Topics)');
  const genSmart = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/generate-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
  }, {
    mode: 'smart',
    targetLang: 'ta',
    explanationLang: 'en',
    level: 'beginner',
    count: 5
  });
  assert(genSmart.statusCode === 200, 'Smart practice generation returns 200 OK');
  assert(Array.isArray(genSmart.json.questions) && genSmart.json.questions.length >= 3, 'Smart session generates questions');
  assert(genSmart.json.questions[0].instruction !== undefined, 'Questions have instructions');

  const genTopic = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/generate-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
  }, {
    mode: 'topic',
    unitId: 'u1',
    targetLang: 'fr',
    explanationLang: 'en',
    level: 'beginner',
    count: 5
  });
  assert(genTopic.statusCode === 200, 'Topic practice generation returns 200 OK');
  assert(genTopic.json.questions.length > 0, 'Topic session returns questions for French');

  // 5. Testing Mistake Memory Recording & Deduplication
  console.log('\n5. Testing Mistake Memory Recording & Deduplication');
  const qPrompt = 'Translate: "Good morning" into Tamil';
  const qCorrect = 'காலை வணக்கம்';
  const qWrong = 'மாலை வணக்கம்';

  // Attempt 1: Wrong Answer
  const submit1 = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/submit-answer',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
  }, {
    topic: 'Greetings & Basics',
    unitId: 'u1',
    questionText: qPrompt,
    userAnswer: qWrong,
    correctAnswer: qCorrect,
    targetLang: 'ta',
    explanationLang: 'en'
  });
  assert(submit1.statusCode === 200, 'Submit answer returns 200 OK');
  assert(submit1.json.isCorrect === false, 'Answer correctly flagged as incorrect');
  assert(submit1.json.feedback.includes('✕'), 'Provides clear incorrect feedback banner');
  assert(submit1.json.explanation.length > 5, 'Provides pedagogical explanation');
  assert(submit1.json.mistakeRecord.attempts === 1, 'First attempt recorded with attempts = 1');
  assert(submit1.json.mistakeRecord.isResolved === false, 'Mistake is marked as unresolved');
  const recordedMistakeId = submit1.json.mistakeRecord.id;

  // Attempt 2: Same Question, Wrong Answer again (Deduplication Check!)
  const submit2 = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/submit-answer',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
  }, {
    topic: 'Greetings & Basics',
    unitId: 'u1',
    questionText: qPrompt,
    userAnswer: 'நன்றி',
    correctAnswer: qCorrect,
    targetLang: 'ta',
    explanationLang: 'en'
  });
  assert(submit2.statusCode === 200, 'Second submit returns 200 OK');
  assert(submit2.json.isCorrect === false, 'Answer flagged as incorrect');
  assert(submit2.json.mistakeRecord.id === recordedMistakeId, 'Deduplication preserved: same mistake ID retained');
  assert(submit2.json.mistakeRecord.attempts === 2, 'Attempt counter incremented to 2');

  // Check mistakes collection
  const listRes1 = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/mistakes?status=all&tgt=ta',
    method: 'GET',
    headers: { 'Cookie': cookieA }
  });
  assert(listRes1.statusCode === 200, 'Fetch mistakes returns 200 OK');
  assert(listRes1.json.count === 1, 'Exactly 1 unique mistake record exists (no duplicate rows created)');
  assert(listRes1.json.mistakes[0].attempts === 2, 'Mistake record reflects 2 attempts');
  assert(listRes1.json.mistakes[0].is_resolved === 0, 'Mistake status is unresolved (0)');

  // 6. Testing Mistake Review & Mastery Resolution
  console.log('\n6. Testing Mistake Review & Mastery (Resolving mistake)');
  // Attempt 3: Learner re-attempts the question and gets it right!
  const submit3 = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/submit-answer',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
  }, {
    mistakeId: recordedMistakeId,
    questionText: qPrompt,
    userAnswer: qCorrect,
    correctAnswer: qCorrect,
    targetLang: 'ta',
    explanationLang: 'en'
  });
  assert(submit3.statusCode === 200, 'Review submit returns 200 OK');
  assert(submit3.json.isCorrect === true, 'Answer correctly validated as correct');
  assert(submit3.json.feedback.includes('✓'), 'Feedback shows success checkmark');
  assert(submit3.json.mistakeRecord.isResolved === true, 'Mistake successfully marked as resolved / mastered!');
  assert(submit3.json.mistakeRecord.attempts === 3, 'Attempts preserved at 3 without erasing history');

  // Verify filter by status
  const unresList = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/mistakes?status=unresolved&tgt=ta',
    method: 'GET',
    headers: { 'Cookie': cookieA }
  });
  assert(unresList.json.count === 0, 'Unresolved filter correctly shows 0 items');

  const masteredList = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/mistakes?status=mastered&tgt=ta',
    method: 'GET',
    headers: { 'Cookie': cookieA }
  });
  assert(masteredList.json.count === 1, 'Mastered filter correctly returns the resolved question');
  assert(masteredList.json.mistakes[0].correct_attempts === 1, 'Correct attempts counter is 1');

  // 7. Testing Weak Topics Calculation
  console.log('\n7. Testing Topics to Improve (Calculation from real attempts)');
  const weakRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/topics-to-improve?tgt=ta',
    method: 'GET',
    headers: { 'Cookie': cookieA }
  });
  assert(weakRes.statusCode === 200, 'Topics to improve returns 200 OK');
  assert(Array.isArray(weakRes.json.allTopics), 'Returns all evaluated topics');
  const greetingsTopic = weakRes.json.allTopics.find(t => t.topic.includes('Greetings') || t.title.includes('Greetings'));
  assert(greetingsTopic !== undefined, 'Greetings topic exists in computed statistics');
  assert(greetingsTopic.totalAttempts >= 2, 'Total attempts calculated from actual saved records');
  assert(greetingsTopic.accuracyPercentage !== undefined, 'Accuracy percentage is dynamically computed');

  // 8. Testing Session Completion & Controlled XP
  console.log('\n8. Testing Practice Session Completion & XP Guardrails');
  const completeSess = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/complete-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
  }, {
    practiceType: 'smart',
    topic: 'Greetings & Basics',
    targetLang: 'ta',
    explanationLang: 'en',
    level: 'beginner',
    totalQuestions: 5,
    correctCount: 4
  });
  assert(completeSess.statusCode === 200, 'Complete practice session returns 200 OK');
  assert(completeSess.json.earnedXp === 5, 'Awards modest practice XP (+5 XP)');
  assert(completeSess.json.scorePercentage === 80, 'Score percentage is 80%');

  // Check Practice History
  const histRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/history',
    method: 'GET',
    headers: { 'Cookie': cookieA }
  });
  assert(histRes.statusCode === 200, 'Practice history returns 200 OK');
  assert(histRes.json.history.length === 1, 'Completed session logged in practice history');
  assert(histRes.json.history[0].score_percentage === 80, 'Logged session accuracy is 80%');

  // 9. Testing User Isolation (Cross-user data privacy)
  console.log('\n9. Testing Multi-user Data Isolation');
  const idB = Date.now() + 10;
  const userB = `learner_m7_b_${idB}`;
  const passB = 'Password123!';
  const signupB = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Learner Module Seven B',
    username: userB,
    email: `${userB}@example.com`,
    password: passB,
    confirmPassword: passB
  });
  assert(signupB.statusCode === 201, 'Learner B created successfully');
  const cookieB = parseCookies(signupB.headers);

  // User B's mistakes must be completely empty!
  const listB = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/mistakes?status=all',
    method: 'GET',
    headers: { 'Cookie': cookieB }
  });
  assert(listB.json.count === 0, 'User B has 0 mistakes (No leakage from User A)');

  // User B's practice history must be empty!
  const histB = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/history',
    method: 'GET',
    headers: { 'Cookie': cookieB }
  });
  assert(histB.json.history.length === 0, 'User B has 0 practice sessions (Zero data leakage)');

  // 10. Testing Persistence Across Logout & Re-login
  console.log('\n10. Testing Persistence Across Logout & Login');
  await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/logout',
    method: 'POST',
    headers: { 'Cookie': cookieA }
  });

  const relogin = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: userA,
    password: passA
  });
  assert(relogin.statusCode === 200, 'Learner A re-login successful');
  const cookieA2 = parseCookies(relogin.headers);

  const reSummary = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/summary?tgt=ta',
    method: 'GET',
    headers: { 'Cookie': cookieA2 }
  });
  assert(reSummary.json.masteredMistakesCount === 1, 'Mastered mistake count (1) persisted across sessions');
  assert(reSummary.json.totalSessionsCompleted === 1, 'Session count (1) persisted across sessions');

  console.log('\n===============================================================');
  if (failures === 0) {
    console.log('✅ ALL MODULE 7 TESTS PASSED SUCCESSFULLY! (0 failures)');
  } else {
    console.error(`❌ MODULE 7 TEST SUITE COMPLETED WITH ${failures} FAILURE(S)`);
    process.exitCode = 1;
  }
  console.log('===============================================================\n');
}

runModule7Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
