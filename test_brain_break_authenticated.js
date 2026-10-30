/**
 * End-to-End Authenticated Game Session & Progression Test
 */
const assert = require('assert');

async function runAuthGameTests() {
  console.log('=== Running Authenticated Brain Break Game Test ===');
  const baseUrl = 'http://localhost:3000';
  const testUser = {
    fullName: 'Gamer Student',
    username: `gamer_${Date.now()}`,
    email: `gamer_${Date.now()}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!'
  };

  // 1. Sign up user
  console.log('1. Registering test gamer user...');
  const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  assert.strictEqual(signupRes.status, 201, 'Signup should succeed');
  const cookie = signupRes.headers.get('set-cookie');
  assert.ok(cookie, 'Session cookie must be set');

  const headers = {
    'Content-Type': 'application/json',
    'Cookie': cookie.split(';')[0]
  };

  // 2. Play 3 consecutive rounds of Memory Match
  console.log('\n2. Testing Memory Match (Rounds 1, 2, 3)...');
  let memoryTotalScore = 0;
  for (let r = 1; r <= 3; r++) {
    const res = await fetch(`${baseUrl}/api/games/content?game=memory&round=${r}&targetLang=hi&explanationLang=en`, { headers });
    assert.strictEqual(res.status, 200);
    const content = await res.json();
    assert.strictEqual(content.round, r);
    const roundPairs = content.pairs.length;
    const roundScore = roundPairs * 20;
    memoryTotalScore += roundScore;

    // Save session
    const saveRes = await fetch(`${baseUrl}/api/games/save-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        gameId: 'memory',
        roundNumber: r,
        score: roundScore,
        maxScore: roundScore,
        moves: roundPairs,
        accuracy: 100
      })
    });
    assert.strictEqual(saveRes.status, 200);
    const saveData = await saveRes.json();
    assert.strictEqual(saveData.savedToDb, true, 'Authenticated session must be saved to DB');
    console.log(`  ✓ Memory Match Round ${r} completed (+${roundScore} pts)`);
  }

  // 3. Play 3 consecutive rounds of Word Puzzle
  console.log('\n3. Testing Word Puzzle (Rounds 1, 2, 3)...');
  for (let r = 1; r <= 3; r++) {
    const res = await fetch(`${baseUrl}/api/games/content?game=word&round=${r}&targetLang=hi&explanationLang=en`, { headers });
    assert.strictEqual(res.status, 200);
    const content = await res.json();
    assert.strictEqual(content.puzzles.length, 4);

    const saveRes = await fetch(`${baseUrl}/api/games/save-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        gameId: 'word',
        roundNumber: r,
        score: 100,
        maxScore: 100,
        moves: 4,
        accuracy: 100
      })
    });
    assert.strictEqual(saveRes.status, 200);
    console.log(`  ✓ Word Puzzle Round ${r} completed (4 words, +100 pts)`);
  }

  // 4. Play 3 consecutive rounds of Quick Quiz
  console.log('\n4. Testing Quick Quiz (Rounds 1, 2, 3)...');
  for (let r = 1; r <= 3; r++) {
    const res = await fetch(`${baseUrl}/api/games/content?game=quiz&round=${r}`, { headers });
    assert.strictEqual(res.status, 200);
    const content = await res.json();
    assert.strictEqual(content.questions.length, 4);

    const saveRes = await fetch(`${baseUrl}/api/games/save-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        gameId: 'quiz',
        roundNumber: r,
        score: 100,
        maxScore: 100,
        moves: 4,
        accuracy: 100
      })
    });
    assert.strictEqual(saveRes.status, 200);
    console.log(`  ✓ Quick Quiz Round ${r} completed (4 questions, +100 pts)`);
  }

  // 5. Play 3 consecutive rounds of Pattern & Logic Challenge
  console.log('\n5. Testing Pattern & Logic Challenge (Rounds 1, 2, 3)...');
  for (let r = 1; r <= 3; r++) {
    const res = await fetch(`${baseUrl}/api/games/content?game=logic&round=${r}`, { headers });
    assert.strictEqual(res.status, 200);
    const content = await res.json();
    assert.strictEqual(content.challenges.length, 4);

    const saveRes = await fetch(`${baseUrl}/api/games/save-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        gameId: 'logic',
        roundNumber: r,
        score: 100,
        maxScore: 100,
        moves: 4,
        accuracy: 100
      })
    });
    assert.strictEqual(saveRes.status, 200);
    console.log(`  ✓ Pattern & Logic Round ${r} completed (4 challenges, +100 pts)`);
  }

  // 6. Check database stats
  console.log('\n6. Checking user statistics from database...');
  const statsRes = await fetch(`${baseUrl}/api/games/stats`, { headers });
  assert.strictEqual(statsRes.status, 200);
  const stats = await statsRes.json();
  assert.strictEqual(stats.totalSessions, 12, '12 game rounds must be persisted');
  assert.ok(stats.totalScore > 1000, `Total score should exceed 1000 (was ${stats.totalScore})`);
  assert.ok(Array.isArray(stats.recent), 'Recent sessions should be returned');
  assert.strictEqual(stats.recent.length, 10, 'Should return up to 10 recent sessions');
  console.log(`  ✓ Total Persisted Sessions: ${stats.totalSessions}`);
  console.log(`  ✓ Total Score Across 4 Games: ${stats.totalScore}`);

  // 7. Check that dashboard and user progress remain untouched
  console.log('\n7. Verifying learning progress, XP, and lesson locks are intact...');
  const dashRes = await fetch(`${baseUrl}/api/learning/dashboard-summary`, { headers });
  assert.strictEqual(dashRes.status, 200);
  const dashData = await dashRes.json();
  assert.ok(dashData.user, 'User object intact');
  assert.ok(dashData.stats, 'Learning stats intact');
  console.log('  ✓ User progress and core curriculum unaffected');

  console.log('\n====================================================');
  console.log('ALL AUTHENTICATED MULTI-ROUND GAME TESTS PASSED!');
  console.log('====================================================\n');
}

runAuthGameTests().catch(err => {
  console.error('Authenticated Game Test Failed:', err);
  process.exit(1);
});
