/**
 * Comprehensive Brain Break & Games Test Suite
 */
const assert = require('assert');

async function runTests() {
  console.log('=== Starting Brain Break Test Suite ===');
  const baseUrl = 'http://localhost:3000';

  // Test 1: Page delivery & Welcoming message
  console.log('Test 1: GET /brain_break.html');
  const pageRes = await fetch(`${baseUrl}/brain_break.html`);
  assert.strictEqual(pageRes.status, 200, 'brain_break.html should respond with 200');
  const html = await pageRes.text();

  assert.ok(
    html.includes('Take a little break, refresh your mind, and enjoy learning through games!'),
    'Welcome message must be present'
  );
  assert.ok(html.includes('Memory Match'), 'Memory Match card must be present');
  assert.ok(html.includes('Word Puzzle'), 'Word Puzzle card must be present');
  assert.ok(html.includes('Quick Quiz'), 'Quick Quiz card must be present');
  assert.ok(html.includes('Pattern &amp; Logic Challenge') || html.includes('Pattern & Logic Challenge'), 'Pattern & Logic card must be present');
  assert.ok(html.includes('btn-next-round'), 'Next round button must be present');
  assert.ok(html.includes('btn-restart-round'), 'Restart round button must be present');
  assert.ok(html.includes('btn-return-menu'), 'Return to menu button must be present');
  console.log('✓ Test 1 Passed: Page structure, welcoming message, 4 game cards and controls verified');

  // Test 2: Alias /brain_break
  console.log('Test 2: GET /brain_break alias route');
  const aliasRes = await fetch(`${baseUrl}/brain_break`);
  assert.strictEqual(aliasRes.status, 200, '/brain_break alias should respond with 200');
  console.log('✓ Test 2 Passed: Route alias working');

  // Test 3: Game 1 - Memory Match multi-round content
  console.log('Test 3: Memory Match multi-round progression');
  for (let r = 1; r <= 3; r++) {
    const res = await fetch(`${baseUrl}/api/games/content?game=memory&round=${r}&targetLang=hi&explanationLang=en`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.game, 'memory');
    assert.strictEqual(data.round, r);
    assert.ok(Array.isArray(data.pairs), 'Pairs should be an array');
    assert.ok(data.pairs.length >= 4, `Round ${r} should have at least 4 pairs (found: ${data.pairs.length})`);
    data.pairs.forEach((p, idx) => {
      assert.ok(p.pairId, `Pair ${idx} should have pairId`);
      assert.ok(p.targetWord, `Pair ${idx} should have targetWord`);
      assert.ok(p.explanationWord, `Pair ${idx} should have explanationWord`);
    });
    console.log(`  Round ${r}: ${data.pairs.length} pairs loaded successfully`);
  }
  console.log('✓ Test 3 Passed: Memory Match verified for 3 rounds');

  // Test 4: Game 2 - Word Puzzle multi-round progression
  console.log('Test 4: Word Puzzle multi-round progression');
  let previousWords = [];
  for (let r = 1; r <= 3; r++) {
    const res = await fetch(`${baseUrl}/api/games/content?game=word&round=${r}&targetLang=hi&explanationLang=en`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.game, 'word');
    assert.strictEqual(data.round, r);
    assert.ok(Array.isArray(data.puzzles));
    assert.strictEqual(data.puzzles.length, 4, 'Word puzzle should have 4 words per round');
    
    const roundWords = [];
    data.puzzles.forEach((pz, idx) => {
      assert.ok(pz.targetWord, `Puzzle ${idx} has targetWord`);
      assert.ok(pz.scrambled, `Puzzle ${idx} has scrambled letters`);
      assert.ok(pz.clue, `Puzzle ${idx} has clue`);
      // Validate scrambled contains same letters
      const sortedTarget = pz.targetWord.toUpperCase().split('').sort().join('');
      const sortedScrambled = pz.scrambled.toUpperCase().split('').sort().join('');
      assert.strictEqual(sortedTarget, sortedScrambled, `Scrambled letters must match target word letters (${pz.targetWord})`);
      roundWords.push(pz.targetWord);
    });

    console.log(`  Round ${r}: Words [${roundWords.join(', ')}]`);
    // Ensure distinct progression
    if (previousWords.length > 0) {
      const overlap = roundWords.filter(w => previousWords.includes(w));
      assert.ok(overlap.length < roundWords.length, 'Subsequent rounds must offer fresh words');
    }
    previousWords = roundWords;
  }
  console.log('✓ Test 4 Passed: Word Puzzle verified for 3 rounds with valid letter matching');

  // Test 5: Game 3 - Quick Quiz multi-round progression
  console.log('Test 5: Quick Quiz multi-round progression');
  let previousQuestions = [];
  for (let r = 1; r <= 3; r++) {
    const res = await fetch(`${baseUrl}/api/games/content?game=quiz&round=${r}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.game, 'quiz');
    assert.strictEqual(data.round, r);
    assert.ok(Array.isArray(data.questions));
    assert.strictEqual(data.questions.length, 4, 'Quiz should have 4 questions per round');

    const roundQTexts = [];
    data.questions.forEach((q, idx) => {
      assert.ok(q.question, `Question ${idx} must have prompt`);
      assert.strictEqual(q.options.length, 4, `Question ${idx} must have 4 options`);
      assert.ok(q.options.includes(q.answer), `Answer key "${q.answer}" must be in options`);
      assert.ok(q.explanation, `Question ${idx} must have explanation`);
      roundQTexts.push(q.question);
    });

    console.log(`  Round ${r}: Loaded 4 questions across categories: ${data.questions.map(q => q.category).join(', ')}`);
    if (previousQuestions.length > 0) {
      const overlap = roundQTexts.filter(q => previousQuestions.includes(q));
      assert.strictEqual(overlap.length, 0, 'Consecutive quiz rounds must have distinct questions');
    }
    previousQuestions = roundQTexts;
  }
  console.log('✓ Test 5 Passed: Quick Quiz verified for 3 rounds with verified answer keys');

  // Test 6: Game 4 - Pattern & Logic Challenge multi-round progression
  console.log('Test 6: Pattern & Logic Challenge multi-round progression');
  let previousLogicPrompts = [];
  for (let r = 1; r <= 3; r++) {
    const res = await fetch(`${baseUrl}/api/games/content?game=logic&round=${r}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.game, 'logic');
    assert.strictEqual(data.round, r);
    assert.ok(Array.isArray(data.challenges));
    assert.strictEqual(data.challenges.length, 4, 'Logic should have 4 challenges per round');

    const roundPrompts = [];
    data.challenges.forEach((c, idx) => {
      assert.ok(c.prompt, `Challenge ${idx} must have prompt`);
      assert.strictEqual(c.options.length, 4, `Challenge ${idx} must have 4 options`);
      assert.ok(c.options.includes(c.answer), `Answer key "${c.answer}" must be in options`);
      assert.ok(c.explanation, `Challenge ${idx} must have explanation`);
      roundPrompts.push(c.prompt);
    });

    console.log(`  Round ${r}: Loaded 4 challenges of types: ${data.challenges.map(c => c.type).join(', ')}`);
    if (previousLogicPrompts.length > 0) {
      const overlap = roundPrompts.filter(p => previousLogicPrompts.includes(p));
      assert.strictEqual(overlap.length, 0, 'Consecutive logic rounds must have distinct challenges');
    }
    previousLogicPrompts = roundPrompts;
  }
  console.log('✓ Test 6 Passed: Pattern & Logic verified for 3 rounds with verified answer keys');

  // Test 7: Game Session Storage API
  console.log('Test 7: Game Session Persistence');
  const saveRes = await fetch(`${baseUrl}/api/games/save-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameId: 'memory',
      roundNumber: 1,
      score: 80,
      maxScore: 80,
      moves: 4,
      accuracy: 100
    })
  });
  assert.strictEqual(saveRes.status, 200);
  const saveData = await saveRes.json();
  assert.strictEqual(saveData.success, true);
  console.log('✓ Test 7 Passed: Game session saved successfully');

  // Test 8: Game Stats Endpoint
  console.log('Test 8: Game Stats Retrieval');
  const statsRes = await fetch(`${baseUrl}/api/games/stats`);
  assert.strictEqual(statsRes.status, 200);
  const statsData = await statsRes.json();
  assert.ok(typeof statsData.totalSessions === 'number');
  assert.ok(typeof statsData.totalScore === 'number');
  console.log(`✓ Test 8 Passed: Stats retrieved (Total sessions: ${statsData.totalSessions}, Total score: ${statsData.totalScore})`);

  console.log('\n========================================');
  console.log('ALL BRAIN BREAK TESTS PASSED PERFECTLY!');
  console.log('========================================\n');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
