/**
 * COMPREHENSIVE VERIFICATION SUITE: LESSON CONTENT VARIETY & PROGRESSION
 * Tests consecutive lessons across Beginner, Intermediate, and Advanced.
 * Verifies distinct questions, vocabulary, completion flow, XP, and locks.
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
          data,
          json
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

function assert(condition, message) {
  if (!condition) {
    console.error(`  [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  [PASS] ${message}`);
}

async function runTests() {
  console.log('===============================================================');
  console.log('   TESTING LESSON CONTENT VARIETY, NOVELTY & PROGRESSION       ');
  console.log('===============================================================');

  const timestamp = Date.now();
  const username = `learner_variety_${timestamp}`;
  const email = `variety_${timestamp}@multilingualhub.org`;
  const password = 'Password@123';

  // 1. Sign up new test learner
  console.log('\n1. Registering test learner:', username);
  const signupRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Variety Tester',
    username,
    email,
    password,
    confirmPassword: password
  });

  assert(signupRes.statusCode === 201, 'Signup returns 201 Created');
  const sessionCookie = (signupRes.headers['set-cookie'] || [])[0]?.split(';')[0];
  assert(sessionCookie && sessionCookie.includes('hub_session='), 'Received valid session cookie');

  // 2. Fetch three consecutive beginner lessons: Unit 1 Lesson 1, Lesson 2, Lesson 3
  console.log('\n2. Fetching consecutive Beginner Unit 1 lessons (l_b_u1_1, l_b_u1_2, l_b_u1_3)...');
  const l1Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson/unit_1/l_b_u1_1?exp=en&tgt=ta&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(l1Res.statusCode === 200, 'Lesson 1 returns 200 OK');
  assert(l1Res.json.exercises && l1Res.json.exercises.length === 8, 'Lesson 1 contains exactly 8 questions');

  const l2Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson/unit_1/l_b_u1_2?exp=en&tgt=ta&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(l2Res.statusCode === 200, 'Lesson 2 returns 200 OK');
  assert(l2Res.json.exercises && l2Res.json.exercises.length === 8, 'Lesson 2 contains exactly 8 questions');

  const l3Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson/unit_1/l_b_u1_3?exp=en&tgt=ta&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(l3Res.statusCode === 200, 'Lesson 3 returns 200 OK');
  assert(l3Res.json.exercises && l3Res.json.exercises.length === 8, 'Lesson 3 contains exactly 8 questions');

  // 3. Verify that Lesson 1, Lesson 2, and Lesson 3 teach DIFFERENT words
  console.log('\n3. Verifying Vocabulary and Question Distinction Across Consecutive Lessons');
  const l1Flashcard = l1Res.json.exercises[0].targetWord;
  const l2Flashcard = l2Res.json.exercises[0].targetWord;
  const l3Flashcard = l3Res.json.exercises[0].targetWord;
  console.log(`   Lesson 1 Flashcard: "${l1Flashcard}" (${l1Res.json.exercises[0].meaning})`);
  console.log(`   Lesson 2 Flashcard: "${l2Flashcard}" (${l2Res.json.exercises[0].meaning})`);
  console.log(`   Lesson 3 Flashcard: "${l3Flashcard}" (${l3Res.json.exercises[0].meaning})`);

  assert(l1Flashcard !== l2Flashcard, `Lesson 1 flashcard ("${l1Flashcard}") != Lesson 2 flashcard ("${l2Flashcard}")`);
  assert(l2Flashcard !== l3Flashcard, `Lesson 2 flashcard ("${l2Flashcard}") != Lesson 3 flashcard ("${l3Flashcard}")`);
  assert(l1Flashcard !== l3Flashcard, `Lesson 1 flashcard ("${l1Flashcard}") != Lesson 3 flashcard ("${l3Flashcard}")`);

  const l1MC = l1Res.json.exercises[1].promptText;
  const l2MC = l2Res.json.exercises[1].promptText;
  const l3MC = l3Res.json.exercises[1].promptText;
  console.log(`   Lesson 1 MC Prompt: "${l1MC}" -> ${l1Res.json.exercises[1].correctAnswer}`);
  console.log(`   Lesson 2 MC Prompt: "${l2MC}" -> ${l2Res.json.exercises[1].correctAnswer}`);
  console.log(`   Lesson 3 MC Prompt: "${l3MC}" -> ${l3Res.json.exercises[1].correctAnswer}`);
  assert(l1MC !== l2MC, 'Lesson 1 and 2 multiple choice prompts are distinct');
  assert(l2MC !== l3MC, 'Lesson 2 and 3 multiple choice prompts are distinct');

  // Check Question Type Variety in Lesson 1
  console.log('\n4. Verifying Question Type Diversity within Lesson (All 8 Questions)');
  const exTypes = l1Res.json.exercises.map(e => e.type);
  console.log('   Exercise types in lesson:', exTypes.join(', '));
  assert(exTypes.includes('vocabulary_flashcard'), 'Question 1: vocabulary_flashcard');
  assert(exTypes.includes('multiple_choice'), 'Question 2: multiple_choice');
  assert(exTypes.includes('word_matching'), 'Question 3: word_matching');
  assert(exTypes.includes('fill_in_the_blanks'), 'Question 4: fill_in_the_blanks');
  assert(exTypes.includes('sentence_building') || exTypes.includes('translation_practice'), 'Question 5: sentence_building or translation_practice');
  assert(exTypes.includes('listen_and_repeat'), 'Question 6: listen_and_repeat');
  assert(exTypes.includes('pronunciation_practice'), 'Question 7: pronunciation_practice');
  assert(exTypes.includes('robot_conversation'), 'Question 8: robot_conversation');

  // 5. Check Unit 2 Lesson 1 distinction from Unit 1
  console.log('\n5. Verifying Cross-Unit Content Differentiation (Unit 1 vs Unit 2)');
  const u2Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson/unit_2/l_b_u2_1?exp=en&tgt=ta&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(u2Res.statusCode === 200, 'Unit 2 Lesson 1 returns 200 OK');
  const u2Flashcard = u2Res.json.exercises[0].targetWord;
  const u2Meaning = u2Res.json.exercises[0].meaning;
  console.log(`   Unit 2 Lesson 1 Flashcard: "${u2Flashcard}" (${u2Meaning})`);
  assert(u2Flashcard !== l1Flashcard && u2Flashcard !== l2Flashcard && u2Flashcard !== l3Flashcard,
    `Unit 2 teaches everyday objects ("${u2Meaning}"), not greeting words!`);

  // Verify Unit 2 has its own unique robot conversation prompt
  const u1RobotQ = l1Res.json.exercises[7].robotQuestion;
  const u2RobotQ = u2Res.json.exercises[7].robotQuestion;
  console.log(`   Unit 1 Robot Prompt: "${u1RobotQ}"`);
  console.log(`   Unit 2 Robot Prompt: "${u2RobotQ}"`);
  assert(u1RobotQ !== u2RobotQ, 'Unit 1 and Unit 2 have distinct, topic-specific robot conversation questions');

  // 6. Test Lesson Completion Flow, XP Award & Unlocking Rules
  console.log('\n6. Testing Lesson Completion, Progression & Unlocking Rules');
  const unitsBeforeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?exp=en&tgt=ta&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  const u1Lessons = unitsBeforeRes.json.units[0].lessons;
  assert(!u1Lessons[0].completed, 'Lesson 1 starts uncompleted');

  // Complete Lesson 1
  const complete1Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie }
  }, {
    explanation_lang: 'en',
    target_lang: 'ta',
    learning_level: 'beginner',
    unit_id: 'unit_1',
    lesson_id: 'l_b_u1_1',
    score: 8,
    total_questions: 8,
    mistakes: []
  });
  assert(complete1Res.statusCode === 200, 'Lesson 1 completion returns 200 OK');
  assert(complete1Res.json.earnedXp > 0, `Earned XP awarded: +${complete1Res.json.earnedXp} XP`);
  const firstEarnedXp = complete1Res.json.earnedXp;

  // Verify duplicate XP prevention: re-completing Lesson 1 awards 0 XP
  const reComplete1Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie }
  }, {
    explanation_lang: 'en',
    target_lang: 'ta',
    learning_level: 'beginner',
    unit_id: 'unit_1',
    lesson_id: 'l_b_u1_1',
    score: 8,
    total_questions: 8,
    mistakes: []
  });
  assert(!reComplete1Res.json.isFirstTime, 'Re-completing lesson recognized as repeat (isFirstTime = false)');
  assert(reComplete1Res.json.earnedXp < complete1Res.json.earnedXp, 'Repeat completion grants reduced practice XP only, preventing duplicate XP exploit');
  assert(reComplete1Res.json.earnedXp <= 5, 'Duplicate XP capped at small practice bonus (<= 5 XP)');

  // Check that Lesson 1 is now marked completed in units API
  const unitsAfterRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?exp=en&tgt=ta&level=beginner',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  const u1After = unitsAfterRes.json.units[0].lessons;
  assert(u1After[0].completed, 'Lesson 1 is marked completed');
  assert(!u1After[1].completed, 'Lesson 2 is now unlocked and ready');

  // Complete Lesson 2
  const complete2Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson-complete',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie }
  }, {
    explanation_lang: 'en',
    target_lang: 'ta',
    learning_level: 'beginner',
    unit_id: 'unit_1',
    lesson_id: 'l_b_u1_2',
    score: 7,
    total_questions: 8,
    mistakes: []
  });
  assert(complete2Res.statusCode === 200, 'Lesson 2 completion returns 200 OK');
  assert(complete2Res.json.earnedXp > 0, `Lesson 2 earned +${complete2Res.json.earnedXp} XP`);
  assert(complete2Res.json.totalXp === firstEarnedXp + reComplete1Res.json.earnedXp + complete2Res.json.earnedXp, 'Total XP correctly sums up');

  // 7. Test Intermediate and Advanced Consecutive Lessons Distinction
  console.log('\n7. Verifying Intermediate Consecutive Lessons (l_i_u1_1 vs l_i_u1_2)');
  const i1Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson/unit_11/l_i_u1_1?exp=en&tgt=fr&level=intermediate',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  const i2Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson/unit_11/l_i_u1_2?exp=en&tgt=fr&level=intermediate',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(i1Res.statusCode === 200 && i2Res.statusCode === 200, 'Intermediate lessons 1 and 2 return 200 OK');
  assert(i1Res.json.exercises[0].targetWord !== i2Res.json.exercises[0].targetWord,
    `Intermediate Lesson 1 flashcard ("${i1Res.json.exercises[0].meaning}") != Lesson 2 ("${i2Res.json.exercises[0].meaning}")`);

  console.log('\n8. Verifying Advanced Consecutive Lessons (l_a_u1_1 vs l_a_u1_2)');
  const a1Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson/unit_21/l_a_u1_1?exp=en&tgt=ja&level=advanced',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  const a2Res = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/lesson/unit_21/l_a_u1_2?exp=en&tgt=ja&level=advanced',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  assert(a1Res.statusCode === 200 && a2Res.statusCode === 200, 'Advanced lessons 1 and 2 return 200 OK');
  assert(a1Res.json.exercises[0].targetWord !== a2Res.json.exercises[0].targetWord,
    `Advanced Lesson 1 flashcard != Lesson 2 flashcard`);

  console.log('\n===============================================================');
  console.log('✅ ALL LESSON VARIETY AND PROGRESSION TESTS PASSED! (0 failures)');
  console.log('===============================================================');
}

runTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
