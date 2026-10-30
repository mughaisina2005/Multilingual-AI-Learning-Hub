/**
 * test_task_fixes.js
 * Comprehensive automated verification for:
 * Task 1: Practice Question Page (Flashcard flip, speaker audio, validation, question navigation)
 * Task 2: Practice Zone (Smart Adaptive, Mistake Memory, Weak Topics, Select Topic, Tabs, Settings)
 * Task 3: Dashboard & Inspect Analytics (Navigation, accurate stats, achievements, empty states, isolation)
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
          body: data,
          json
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      const dataStr = typeof postData === 'string' ? postData : JSON.stringify(postData);
      req.write(dataStr);
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  [PASS] ${message}`);
}

async function run() {
  console.log('===============================================================');
  console.log('   VERIFYING PRACTICE PAGE, PRACTICE ZONE & ANALYTICS FIXES    ');
  console.log('===============================================================\n');

  const unique = Date.now();

  // 1. Create Learner 1 (Fresh User)
  console.log('--- 1. Authenticating Fresh Learner 1 ---');
  const user1 = {
    fullName: 'Ananya Sharma',
    username: `learner_fix_a_${unique}`,
    email: `ananya_${unique}@example.com`,
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!'
  };

  const regRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, user1);

  assert(regRes.statusCode === 201, 'User 1 registered with 201 Created');
  const cookieHeader = regRes.headers['set-cookie'];
  assert(cookieHeader && cookieHeader.length > 0, 'User 1 received session cookie');
  const sessionCookie = cookieHeader[0].split(';')[0];

  // 2. Test Task 3: Analytics for Fresh Learner (Empty state & 0 metrics)
  console.log('\n--- 2. Testing Task 3: Inspect Analytics for Fresh Learner ---');
  // Check unauthenticated access redirects
  const unauthRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/analytics',
    method: 'GET'
  });
  assert(unauthRes.statusCode === 302, 'Unauthenticated /analytics redirects to auth page');

  // Check authenticated page delivers 200 OK
  const pageRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/analytics',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(pageRes.statusCode === 200, 'Authenticated /analytics loads with 200 OK');
  assert(pageRes.body.includes('Learning Analytics'), 'Analytics page contains title');
  assert(pageRes.body.includes('btnBackDashboard'), 'Analytics page includes back to dashboard navigation');

  // Check analytics API data for fresh learner
  const analyticsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/analytics',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(analyticsRes.statusCode === 200, 'GET /api/learning/analytics returns 200 OK');
  const aData = analyticsRes.json;
  assert(aData.success === true, 'Analytics response is successful');
  assert(aData.isNewLearner === true, 'Fresh learner correctly identified as isNewLearner: true');
  assert(aData.stats.totalXp === 0, 'Initial total XP is 0');
  assert(aData.stats.lessonsCompleted === 0, 'Initial lessons completed is 0');
  assert(aData.stats.totalPracticeSessions === 0, 'Initial practice sessions is 0');
  assert(aData.stats.totalQuestionsAttempted === 0, 'Initial total questions attempted is 0');
  assert(Array.isArray(aData.achievements) && aData.achievements.length >= 6, 'Achievements array exists with all milestones');

  // 3. Test Task 2: Smart Adaptive for Fresh Learner (No fake stats)
  console.log('\n--- 3. Testing Task 2A: Smart Adaptive for Fresh Learner ---');
  const smartRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/generate-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    mode: 'smart',
    targetLang: 'ta',
    explanationLang: 'en',
    level: 'beginner',
    count: 5
  });
  assert(smartRes.statusCode === 200, 'Generate smart practice returns 200 OK');
  const smartData = smartRes.json;
  assert(smartData.questions.length === 5, 'Generates exactly 5 questions for requested count = 5');
  assert(smartData.questions[0].type === 'vocabulary_flashcard', 'First question is vocabulary flashcard');
  assert(smartData.questions[0].targetWord && smartData.questions[0].targetWord.length > 0, 'Flashcard contains native target word');
  assert(smartData.questions[0].englishMeaning && smartData.questions[0].englishMeaning.length > 0, 'Flashcard contains English meaning');
  assert(smartData.questions[0].langCode === 'ta-IN', 'Target audio language code is ta-IN (Tamil)');

  // 4. Test Task 2B: Mistake Memory Empty State for Fresh Learner
  console.log('\n--- 4. Testing Task 2B: Mistake Memory Empty State ---');
  const mistakeSessionRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/generate-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    mode: 'mistakes',
    targetLang: 'ta',
    explanationLang: 'en',
    level: 'beginner',
    count: 5
  });
  assert(mistakeSessionRes.statusCode === 200, 'Mistakes mode returns 200 OK');
  assert(mistakeSessionRes.json.noMistakes === true, 'Correctly flags noMistakes: true when user has 0 mistakes');
  assert(mistakeSessionRes.json.questions.length === 0, 'Does not fabricate fake questions when no mistakes exist');

  // 5. Test Task 2C: Weak Topics Empty State for Fresh Learner
  console.log('\n--- 5. Testing Task 2C: Weak Topics Empty State ---');
  const weakSessionRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/generate-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    mode: 'weak_topics',
    targetLang: 'ta',
    explanationLang: 'en',
    level: 'beginner',
    count: 5
  });
  assert(weakSessionRes.statusCode === 200, 'Weak topics mode returns 200 OK');
  assert(weakSessionRes.json.noWeakTopics === true, 'Correctly flags noWeakTopics: true when insufficient data');

  // 6. Test Task 2D: Select Topic Practice with Custom Count (count = 3)
  console.log('\n--- 6. Testing Task 2D: Select Topic Mode & Question Counts ---');
  const topicRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/generate-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    mode: 'topic',
    unitId: 'unit_1',
    targetLang: 'ta',
    explanationLang: 'en',
    level: 'beginner',
    count: 3
  });
  assert(topicRes.statusCode === 200, 'Select topic returns 200 OK');
  assert(topicRes.json.questions.length === 3, 'Respects custom question count = 3');
  assert(topicRes.json.topic.includes('Greetings') || topicRes.json.topic.includes('Basics'), 'Topic matches selected curriculum unit');

  // 7. Test Task 1C: Prevent Empty Answer Submission
  console.log('\n--- 7. Testing Task 1C: Empty Answer Prevention ---');
  const emptySubRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/submit-answer',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    exerciseType: 'multiple_choice',
    questionText: 'Translate Hello',
    correctAnswer: 'வணக்கம்',
    userAnswer: ''
  });
  assert(emptySubRes.statusCode === 400, 'Submitting empty answer returns 400 Bad Request');
  assert(emptySubRes.json.error === 'EMPTY_ANSWER', 'Error code is EMPTY_ANSWER');

  // 8. Test Task 1B: Flashcard Interaction & Audio Code
  console.log('\n--- 8. Testing Task 1B: Flashcard Interaction & Target Speaker Pronunciation ---');
  const fcSubRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/submit-answer',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    exerciseType: 'vocabulary_flashcard',
    questionText: 'Learn: வணக்கம்',
    correctAnswer: 'வணக்கம்',
    userAnswer: 'viewed',
    targetLang: 'ta'
  });
  assert(fcSubRes.statusCode === 200, 'Submitting flashcard review returns 200 OK');
  assert(fcSubRes.json.isCorrect === true, 'Flashcard review marked as correct');
  assert(fcSubRes.json.feedback.includes('Flashcard completed'), 'Feedback confirms flashcard completion');
  assert(fcSubRes.json.mistakeRecord === null, 'Flashcard review is NOT recorded as a mistake');

  // 9. Test Multiple-Choice Incorrect Submission -> Recorded in Mistake Memory
  console.log('\n--- 9. Testing Task 1C: Multiple-Choice Incorrect Answer & Mistake Recording ---');
  const mcWrongRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/submit-answer',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    exerciseType: 'multiple_choice',
    topic: 'Greetings & Basics',
    unitId: 'unit_1',
    questionText: 'Select translation for வணக்கம்',
    correctAnswer: 'Hello',
    userAnswer: 'Goodbye',
    explanation: '"வணக்கம்" translates to "Hello".',
    targetLang: 'ta'
  });
  assert(mcWrongRes.statusCode === 200, 'Submit answer returns 200 OK');
  assert(mcWrongRes.json.isCorrect === false, 'Wrong answer marked as isCorrect: false');
  assert(mcWrongRes.json.mistakeRecord !== null, 'Mistake record successfully created in user_mistakes');
  const mistakeId = mcWrongRes.json.mistakeRecord.id;

  // 10. Test Mistake Memory Resolution (Try Again / Master Mistake)
  console.log('\n--- 10. Testing Task 2B: Mistake Memory Retry & Resolution ---');
  const resolveRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/submit-answer',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    mistakeId: mistakeId,
    exerciseType: 'multiple_choice',
    questionText: 'Select translation for வணக்கம்',
    correctAnswer: 'Hello',
    userAnswer: 'Hello',
    targetLang: 'ta'
  });
  assert(resolveRes.statusCode === 200, 'Resolve mistake returns 200 OK');
  assert(resolveRes.json.isCorrect === true, 'Correct retry marked as isCorrect: true');
  assert(resolveRes.json.mistakeRecord.isResolved === true, 'Mistake successfully marked as isResolved: true');

  // 11. Test Complete Practice Session & XP
  console.log('\n--- 11. Testing Task 1D: Complete Practice Session & XP Award ---');
  const compRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/practice/complete-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    practiceType: 'smart',
    topic: 'Adaptive Smart Practice',
    targetLang: 'ta',
    explanationLang: 'en',
    level: 'beginner',
    totalQuestions: 5,
    correctCount: 4
  });
  assert(compRes.statusCode === 200, 'Complete practice session returns 200 OK');
  assert(compRes.json.scorePercentage === 80, 'Score percentage is 80%');
  assert(compRes.json.earnedXp === 5, 'Awards +5 XP for >= 60% performance');

  // 12. Complete a Real Lesson to Populate Comprehensive Analytics
  console.log('\n--- 12. Completing a Lesson for Verified Analytics Updates ---');
  const lessonCompRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
  }, {
    unit_id: 'unit_1',
    lesson_id: 'lesson_1_1',
    explanation_lang: 'en',
    target_lang: 'ta',
    learning_level: 'beginner',
    score: 8,
    total_questions: 8
  });
  assert(lessonCompRes.statusCode === 200, 'Lesson completion returns 200 OK');
  assert(lessonCompRes.json.earnedXp > 0, 'Lesson completion awards XP');

  // 13. Verify Analytics Accurately Reflects Completed Activities
  console.log('\n--- 13. Testing Task 3B: Analytics Real Learner Statistics ---');
  const updatedAnalyticsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/analytics',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(updatedAnalyticsRes.statusCode === 200, 'Updated analytics returns 200 OK');
  const uData = updatedAnalyticsRes.json;
  assert(uData.isNewLearner === false, 'Learner is no longer new (isNewLearner: false)');
  assert(uData.stats.totalXp > 5, 'Total XP includes both practice (+5) and lesson (+XP)');
  assert(uData.stats.lessonsCompleted === 1, 'Lessons completed is accurately 1');
  assert(uData.stats.totalPracticeSessions === 1, 'Total practice sessions is accurately 1');
  assert(uData.stats.totalQuestionsAttempted === 13, 'Total questions attempted is accurately 13 (8 lesson + 5 practice)');
  assert(uData.stats.totalCorrectAnswers === 12, 'Total correct answers is accurately 12 (8 lesson + 4 practice)');
  assert(uData.stats.accuracyPercentage === 92, 'Accuracy percentage is accurately 92% (12/13)');
  assert(uData.stats.masteredMistakesCount === 1, 'Mastered mistakes count is accurately 1');
  assert(uData.stats.unresolvedMistakesCount === 0, 'Unresolved mistakes count is accurately 0');

  // Check achievements unlocked
  const firstStepAch = uData.achievements.find(a => a.id === 'first_step');
  const practicePioneerAch = uData.achievements.find(a => a.id === 'practice_pioneer');
  const mistakeConquerorAch = uData.achievements.find(a => a.id === 'mistake_slayer');
  assert(firstStepAch && firstStepAch.unlocked === true, 'Achievement "First Step" is UNLOCKED');
  assert(practicePioneerAch && practicePioneerAch.unlocked === true, 'Achievement "Practice Pioneer" is UNLOCKED');
  assert(mistakeConquerorAch && mistakeConquerorAch.unlocked === true, 'Achievement "Mistake Conqueror" is UNLOCKED');

  // 14. Test Multi-User Data Isolation
  console.log('\n--- 14. Testing Multi-User Data Isolation for Analytics ---');
  const user2 = {
    fullName: 'Rahul Verma',
    username: `learner_fix_b_${unique}`,
    email: `rahul_${unique}@example.com`,
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!'
  };
  const regRes2 = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, user2);
  const user2Cookie = regRes2.headers['set-cookie'][0].split(';')[0];

  const user2AnalyticsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/analytics',
    method: 'GET',
    headers: { 'Cookie': user2Cookie }
  });
  const u2Data = user2AnalyticsRes.json;
  assert(u2Data.user.username === user2.username, 'User 2 analytics belongs to User 2');
  assert(u2Data.stats.totalXp === 0, 'User 2 has 0 XP (Zero leakage from User 1)');
  assert(u2Data.stats.lessonsCompleted === 0, 'User 2 has 0 lessons completed (Strict isolation)');
  assert(u2Data.stats.totalPracticeSessions === 0, 'User 2 has 0 practice sessions (Zero data leakage)');
  assert(u2Data.isNewLearner === true, 'User 2 receives sensible empty state');

  console.log('\n===============================================================');
  console.log('✅ ALL PRACTICE PAGE, ZONE & ANALYTICS TESTS PASSED! (0 failures)');
  console.log('===============================================================');
}

run().catch(err => {
  console.error('\n❌ TEST RUN FAILED:', err.message);
  process.exit(1);
});
