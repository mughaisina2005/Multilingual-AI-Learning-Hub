/**
 * test_brain_break_all_games.js
 * Comprehensive validation of all 10 Brain Break games, API endpoints,
 * HTML elements, card hints, gameplay containers, and Dashboard status cleanup.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING COMPREHENSIVE BRAIN BREAK & DASHBOARD TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 1: API Content for All 10 Games (3 Rounds each)
  // ----------------------------------------------------
  console.log('--- 1. Testing API Content for All 10 Games Across 3 Rounds ---');
  const games = [
    { key: 'memory', name: 'Memory Match', check: d => Array.isArray(d.cards) && d.cards.length >= 8 },
    { key: 'word', name: 'Word Puzzle', check: d => Array.isArray(d.puzzles) && d.puzzles.length >= 4 },
    { key: 'quiz', name: 'Quick Quiz', check: d => Array.isArray(d.questions) && d.questions.length >= 4 },
    { key: 'logic', name: 'Pattern & Logic', check: d => Array.isArray(d.challenges) && d.challenges.length >= 4 },
    { key: 'search', name: 'Word Search', check: d => Array.isArray(d.words) && d.words.length >= 4 && Array.isArray(d.grid) },
    { key: 'sentence', name: 'Sentence Builder', check: d => Array.isArray(d.challenges) && d.challenges.length >= 4 },
    { key: 'listen', name: 'Listen & Choose', check: d => Array.isArray(d.challenges) && d.challenges.length >= 4 },
    { key: 'odd', name: 'Odd One Out', check: d => Array.isArray(d.challenges) && d.challenges.length >= 4 },
    { key: 'recall', name: 'Quick Recall', check: d => Array.isArray(d.challenges) && d.challenges.length >= 4 },
    { key: 'riddle', name: 'Riddle Challenge', check: d => Array.isArray(d.challenges) && d.challenges.length >= 4 }
  ];

  for (const g of games) {
    for (let r = 1; r <= 3; r++) {
      try {
        const res = await get(`${BASE_URL}/api/games/content?game=${g.key}&round=${r}`);
        assert(res.status === 200, `${g.name} round ${r} returned HTTP 200`);
        const json = JSON.parse(res.body);
        assert(json.success === true, `${g.name} round ${r} returned success: true`);
        assert(g.check(json), `${g.name} round ${r} has valid structured challenge data`);
      } catch (err) {
        assert(false, `${g.name} round ${r} failed with error: ${err.message}`);
      }
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 2: Inspect brain_break.html DOM structure
  // ----------------------------------------------------
  console.log('\n--- 2. Inspecting brain_break.html UI, Cards, & Hints ---');
  const htmlPath = path.join(__dirname, 'brain_break.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Verify all 10 cards exist
  const cardIds = [
    'card-memory-match', 'card-word-puzzle', 'card-quick-quiz', 'card-pattern-logic',
    'card-word-search', 'card-sentence-builder', 'card-listen-choose', 'card-odd-one-out',
    'card-quick-recall', 'card-riddle-challenge'
  ];
  for (const cid of cardIds) {
    assert(html.includes(`id="${cid}"`), `Card exists: #${cid}`);
  }

  // Verify exact required hints
  const requiredHints = [
    { name: 'Word Search', hint: 'Search horizontally, vertically, and diagonally.' },
    { name: 'Sentence Builder', hint: 'Find the subject and verb first.' },
    { name: 'Listen & Choose', hint: 'Listen carefully for the key sounds.' },
    { name: 'Odd One Out', hint: 'Find what most options have in common.' },
    { name: 'Quick Recall', hint: 'Pay attention to the order, not just the items.' },
    { name: 'Riddle Challenge', hint: 'Read the clues carefully before answering.' }
  ];

  for (const h of requiredHints) {
    assert(html.includes(h.hint), `Hint present for ${h.name}: "${h.hint}"`);
  }

  // Verify existing 4 games have hints
  assert(html.includes('Flip cards to find matching pairs and remember locations.'), 'Hint present for Memory Match');
  assert(html.includes('Unscramble letters using the clue to form the word.'), 'Hint present for Word Puzzle');
  assert(html.includes('Read carefully and choose the best answer.'), 'Hint present for Quick Quiz');
  assert(html.includes('Observe the sequence or rule to find the missing item.'), 'Hint present for Pattern & Logic');

  // Verify all 10 gameplay containers exist
  const containerIds = [
    'container-memory-match', 'container-word-puzzle', 'container-quick-quiz', 'container-pattern-logic',
    'container-word-search', 'container-sentence-builder', 'container-listen-choose', 'container-odd-one-out',
    'container-quick-recall', 'container-riddle-challenge'
  ];
  for (const cid of containerIds) {
    assert(html.includes(`id="${cid}"`), `Gameplay container exists: #${cid}`);
  }

  // Verify desktop 4-column layout
  assert(html.includes('grid-template-columns: repeat(4, 1fr)'), 'Desktop 4-column responsive layout defined');

  // ----------------------------------------------------
  // TEST SUITE 3: Dashboard Status Badges Removed
  // ----------------------------------------------------
  console.log('\n--- 3. Verifying Dashboard Status Badges Removed ---');
  const dashPath = path.join(__dirname, 'dashboard.html');
  const dashHtml = fs.readFileSync(dashPath, 'utf8');

  assert(!dashHtml.includes('Module 4 Active'), 'Dashboard: "Module 4 Active" removed');
  assert(!dashHtml.includes('Module 5 Active'), 'Dashboard: "Module 5 Active" removed');
  assert(!dashHtml.includes('Module 6 Active'), 'Dashboard: "Module 6 Active" removed');
  assert(!dashHtml.includes('Module 7 Active'), 'Dashboard: "Module 7 Active" removed');
  assert(!dashHtml.includes('Module 3 Active'), 'Dashboard: "Module 3 Active" removed');
  assert(!dashHtml.includes('<span class="card-status-pill status-active">Active</span>'), 'Dashboard: "Active" badges removed');

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runTests();
