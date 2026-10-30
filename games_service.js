/**
 * games_service.js
 * Multi-round game logic and content generators for Brain Break — Brain Games.
 * 
 * Supports:
 * 1. Memory Match (Card pair discovery with vocabulary & translations)
 * 2. Word Puzzle (Interactive word unscrambler)
 * 3. Quick Quiz (Curated subject trivia: science, tech, geography, language)
 * 4. Pattern & Logic Challenge (Number sequences, shape patterns, deductive reasoning)
 */
const curriculum = require('./curriculum');

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ==========================================
// 1. MEMORY MATCH
// ==========================================
function getMemoryMatchRound(round = 1, tgt = 'ta', exp = 'en') {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const lexicon = curriculum.LEXICON || [];
  const total = lexicon.length;

  // Determine pair count based on round (gradual difficulty)
  // Round 1: 4 pairs (8 cards)
  // Round 2: 6 pairs (12 cards)
  // Round 3+: 8 pairs (16 cards)
  let pairCount = 4;
  if (r === 2) pairCount = 6;
  else if (r >= 3) pairCount = 8;

  const startOffset = ((r - 1) * 6) % total;
  const selectedItems = [];
  for (let i = 0; i < pairCount; i++) {
    const item = lexicon[(startOffset + i) % total];
    selectedItems.push(item);
  }

  const cards = [];
  selectedItems.forEach((item, idx) => {
    const pairId = `pair_${item.id || idx}`;
    
    // Resolve target text and explanation text
    const tgtText = (item[tgt] && item[tgt].text) ? item[tgt].text : (item.en ? item.en.text : 'Word');
    const tgtPhonetic = (item[tgt] && item[tgt].phonetic) ? item[tgt].phonetic : '';
    const expText = (item[exp] && item[exp].text) ? item[exp].text : (item.en ? item.en.text : 'Meaning');

    // Card A: Target language word
    cards.push({
      cardId: `${pairId}_tgt`,
      pairId: pairId,
      content: tgtText,
      phonetic: tgtPhonetic,
      subtext: tgt.toUpperCase(),
      role: 'target',
      audioText: tgtText,
      langCode: (curriculum.LANGUAGES[tgt] || {}).bcp47 || 'en-US'
    });

    // Card B: Translation/meaning
    cards.push({
      cardId: `${pairId}_exp`,
      pairId: pairId,
      content: expText,
      subtext: exp.toUpperCase(),
      role: 'meaning',
      audioText: expText,
      langCode: (curriculum.LANGUAGES[exp] || {}).bcp47 || 'en-US'
    });
  });

  const pairs = selectedItems.map((item, idx) => ({
    pairId: `pair_${item.id || idx}`,
    targetWord: (item[tgt] && item[tgt].text) ? item[tgt].text : item.en.text,
    explanationWord: (item[exp] && item[exp].text) ? item[exp].text : item.en.text
  }));

  return {
    gameId: 'memory',
    round: r,
    pairCount: pairCount,
    totalCards: cards.length,
    cards: shuffle(cards),
    pairs: pairs
  };
}

// ==========================================
// 2. WORD PUZZLE
// ==========================================
function getWordPuzzleRound(round = 1, tgt = 'ta', exp = 'en') {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const lexicon = curriculum.LEXICON || [];

  // Scramble letters helper ensuring scrambled !== original
  function scrambleWord(word) {
    const letters = word.split('');
    let scrambled = shuffle(letters).join('');
    let attempts = 0;
    while (scrambled.toLowerCase() === word.toLowerCase() && word.length > 1 && attempts < 10) {
      scrambled = shuffle(letters).join('');
      attempts++;
    }
    // If identical after 10 tries, reverse or swap first two
    if (scrambled.toLowerCase() === word.toLowerCase() && letters.length > 1) {
      const swapped = [...letters];
      [swapped[0], swapped[swapped.length - 1]] = [swapped[swapped.length - 1], swapped[0]];
      scrambled = swapped.join('');
    }
    return scrambled;
  }

  // Filter single words without spaces for clean unscrambling
  const cleanLexicon = lexicon.filter(item => {
    const text = item.en && item.en.text;
    return text && !text.includes(' ') && text.length >= 3 && /^[a-zA-Z]+$/.test(text);
  });

  // Difficulty by round:
  // Round 1: 3-5 letters
  // Round 2: 5-7 letters
  // Round 3+: 7-10 letters
  let lengthFilter;
  if (r === 1) {
    lengthFilter = item => item.en.text.length >= 3 && item.en.text.length <= 5;
  } else if (r === 2) {
    lengthFilter = item => item.en.text.length >= 5 && item.en.text.length <= 7;
  } else {
    lengthFilter = item => item.en.text.length >= 6;
  }

  let pool = cleanLexicon.filter(lengthFilter);
  if (pool.length < 4) pool = cleanLexicon; // fallback if filter too tight

  const wordsPerRound = 4;
  const startOffset = ((r - 1) * wordsPerRound) % pool.length;
  const selectedPuzzles = [];

  for (let i = 0; i < wordsPerRound; i++) {
    const item = pool[(startOffset + i) % pool.length];
    const answerWord = item.en.text.toUpperCase();
    const scrambled = scrambleWord(answerWord);

    const translation = (item[tgt] && item[tgt].text) ? item[tgt].text : item.en.text;
    const meaning = item.en.notes || `Category: ${item.category || 'General vocabulary'}`;

    selectedPuzzles.push({
      id: `puzzle_r${r}_${i + 1}`,
      word: answerWord,
      targetWord: answerWord,
      scrambled: scrambled,
      letters: scrambled.split(''),
      clue: `Meaning in ${curriculum.LANGUAGES[tgt] ? curriculum.LANGUAGES[tgt].name : 'Target'}: "${translation}"`,
      meaning: meaning,
      category: item.category || 'vocabulary'
    });
  }

  return {
    gameId: 'word_puzzle',
    round: r,
    totalPuzzles: selectedPuzzles.length,
    puzzles: selectedPuzzles
  };
}

// ==========================================
// 3. QUICK QUIZ
// ==========================================
const QUIZ_ROUNDS = {
  1: [
    {
      id: 'quiz_1_1',
      subject: 'Languages & World',
      question: 'Which of the following is considered one of the oldest surviving classical languages in the world?',
      options: ['Tamil', 'Modern English', 'Esperanto', 'HTML'],
      correctAnswer: 'Tamil',
      explanation: 'Tamil has a continuous literary tradition dating back over two millennia (Sangam era) and is widely recognized as one of the world\'s oldest classical languages.'
    },
    {
      id: 'quiz_1_2',
      subject: 'Science & Nature',
      question: 'What is the closest planet to the Sun in our Solar System?',
      options: ['Mercury', 'Venus', 'Mars', 'Earth'],
      correctAnswer: 'Mercury',
      explanation: 'Mercury is the smallest and innermost planet in the Solar System, orbiting the Sun at an average distance of about 58 million kilometers.'
    },
    {
      id: 'quiz_1_3',
      subject: 'Everyday Mathematics',
      question: 'If you have 4 boxes with 6 colorful pencils in each box, how many pencils do you have in total?',
      options: ['24', '18', '20', '28'],
      correctAnswer: '24',
      explanation: '4 multiplied by 6 equals 24 pencils (4 × 6 = 24).'
    },
    {
      id: 'quiz_1_4',
      subject: 'World Geography',
      question: 'Which is the largest ocean on Earth covering more than 30% of the planet\'s surface?',
      options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      correctAnswer: 'Pacific Ocean',
      explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth, spanning over 165 million square kilometers.'
    }
  ],
  2: [
    {
      id: 'quiz_2_1',
      subject: 'Biology & Human Body',
      question: 'Which organ in the human body pumps blood and oxygen through the circulatory system?',
      options: ['Heart', 'Lungs', 'Liver', 'Kidneys'],
      correctAnswer: 'Heart',
      explanation: 'The heart is a muscular organ that beats approximately 100,000 times a day to pump vital oxygenated blood throughout the body.'
    },
    {
      id: 'quiz_2_2',
      subject: 'Technology & Computing',
      question: 'What does "AI" stand for in modern technology and computer science?',
      options: ['Artificial Intelligence', 'Automated Interface', 'Advanced Information', 'Analog Integration'],
      correctAnswer: 'Artificial Intelligence',
      explanation: 'AI stands for Artificial Intelligence, the simulation of human intelligence processes by computer systems.'
    },
    {
      id: 'quiz_2_3',
      subject: 'Physical Science',
      question: 'What state of matter forms when liquid water boils and turns into vapor?',
      options: ['Gas', 'Solid', 'Plasma', 'Gel'],
      correctAnswer: 'Gas',
      explanation: 'When water boils at 100°C (at standard atmospheric pressure), its state changes from a liquid to a gas (steam/water vapor).'
    },
    {
      id: 'quiz_2_4',
      subject: 'World Cultures',
      question: 'The traditional greeting "Namaste" (नमस्ते) in Hindi and Sanskrit literally conveys what respectful sentiment?',
      options: ['I bow to the divine in you', 'Goodbye forever', 'Have a nice lunch', 'Welcome to my home'],
      correctAnswer: 'I bow to the divine in you',
      explanation: 'Namaste is derived from Sanskrit "namas" (bow) and "te" (to you), respectfully acknowledging the inner spark or spirit in another.'
    }
  ],
  3: [
    {
      id: 'quiz_3_1',
      subject: 'Astronomy',
      question: 'Which force keeps planets orbiting around the Sun rather than drifting into deep space?',
      options: ['Gravity', 'Magnetism', 'Friction', 'Atmospheric Pressure'],
      correctAnswer: 'Gravity',
      explanation: 'The Sun\'s immense gravitational pull continuously curves the paths of planets, maintaining their stable elliptical orbits.'
    },
    {
      id: 'quiz_3_2',
      subject: 'Mathematics & Logic',
      question: 'A polygon with exactly five straight sides and five interior angles is called a:',
      options: ['Pentagon', 'Hexagon', 'Octagon', 'Trapezoid'],
      correctAnswer: 'Pentagon',
      explanation: 'A 5-sided polygon is a pentagon. A 6-sided polygon is a hexagon, and an 8-sided polygon is an octagon.'
    },
    {
      id: 'quiz_3_3',
      subject: 'Environmental Science',
      question: 'Which gas do green plants absorb from the atmosphere during photosynthesis to produce oxygen?',
      options: ['Carbon Dioxide (CO2)', 'Helium', 'Nitrogen', 'Methane'],
      correctAnswer: 'Carbon Dioxide (CO2)',
      explanation: 'Through photosynthesis, green chlorophyll captures sunlight to convert absorbed carbon dioxide and water into glucose and oxygen.'
    },
    {
      id: 'quiz_3_4',
      subject: 'World Inventions',
      question: 'Who is widely credited with inventing the World Wide Web (WWW) in 1989 at CERN?',
      options: ['Tim Berners-Lee', 'Alan Turing', 'Thomas Edison', 'Nikola Tesla'],
      correctAnswer: 'Tim Berners-Lee',
      explanation: 'Sir Tim Berners-Lee invented the World Wide Web in 1989 to facilitate automated information-sharing between scientists at universities and institutes worldwide.'
    }
  ]
};

function getQuickQuizRound(round = 1) {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const roundKey = ((r - 1) % 3) + 1; // 1, 2, 3 cyclical
  const questions = QUIZ_ROUNDS[roundKey] || QUIZ_ROUNDS[1];

  // Return questions with options deterministically prepared
  const preparedQuestions = questions.map((q, idx) => ({
    id: `quiz_r${r}_${idx + 1}`,
    subject: q.subject,
    category: q.subject,
    question: q.question,
    options: shuffle(q.options),
    answer: q.correctAnswer,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation
  }));

  return {
    gameId: 'quiz',
    round: r,
    totalQuestions: preparedQuestions.length,
    questions: preparedQuestions
  };
}

// ==========================================
// 4. PATTERN & LOGIC CHALLENGE
// ==========================================
const PATTERN_ROUNDS = {
  1: [
    {
      id: 'pat_1_1',
      category: 'Number Sequence',
      prompt: 'What comes next in the sequence?\n3, 6, 9, 12, ?',
      options: ['15', '14', '18', '16'],
      correctAnswer: '15',
      explanation: 'The pattern adds 3 each step (+3 arithmetic progression): 3, 6, 9, 12, 15.'
    },
    {
      id: 'pat_1_2',
      category: 'Shape Pattern',
      prompt: 'Identify the next shape in this repeating pattern:\n🔵 🔺 🔵 🔺 🔵 ?',
      options: ['🔺', '🔵', '🟩', '⭐'],
      correctAnswer: '🔺',
      explanation: 'The pattern alternates between circle (🔵) and triangle (🔺).'
    },
    {
      id: 'pat_1_3',
      category: 'Word Analogy',
      prompt: 'Complete the relationship:\nSun : Day :: Moon : ?',
      options: ['Night', 'Cloud', 'Rain', 'Morning'],
      correctAnswer: 'Night',
      explanation: 'The Sun illuminates the day, while the Moon shines during the night.'
    },
    {
      id: 'pat_1_4',
      category: 'Geometric Doubling',
      prompt: 'Find the missing number in the doubling series:\n2, 4, 8, 16, ?',
      options: ['32', '24', '30', '64'],
      correctAnswer: '32',
      explanation: 'Each term is multiplied by 2 (geometric progression): 16 × 2 = 32.'
    }
  ],
  2: [
    {
      id: 'pat_2_1',
      category: 'Fibonacci Series',
      prompt: 'What is the next number in this famous natural sequence?\n1, 1, 2, 3, 5, 8, ?',
      options: ['13', '11', '14', '16'],
      correctAnswer: '13',
      explanation: 'This is the Fibonacci sequence, where each number is the sum of the previous two: 5 + 8 = 13.'
    },
    {
      id: 'pat_2_2',
      category: 'Increasing Difference',
      prompt: 'Determine the missing number in the sequence:\n2, 5, 10, 17, ?',
      options: ['26', '24', '28', '25'],
      correctAnswer: '26',
      explanation: 'The differences between consecutive numbers increase by 2 (+3, +5, +7, +9): 17 + 9 = 26.'
    },
    {
      id: 'pat_2_3',
      category: 'Symbol Progression',
      prompt: 'What symbol continues the count?\n⭐ 🌙 ⭐ ⭐ 🌙 ⭐ ⭐ ⭐ ?',
      options: ['🌙', '⭐', '☀️', '☁️'],
      correctAnswer: '🌙',
      explanation: 'The number of stars increases by one between each crescent moon: 1 star, moon; 2 stars, moon; 3 stars, moon.'
    },
    {
      id: 'pat_2_4',
      category: 'Deductive Logic',
      prompt: 'All robins are birds. All birds have feathers. Does a robin have feathers?',
      options: ['Yes, definitely', 'No, never', 'Only in winter', 'Cannot be determined'],
      correctAnswer: 'Yes, definitely',
      explanation: 'By deductive syllogism: since every robin is a bird, and all birds have feathers, every robin necessarily has feathers.'
    }
  ],
  3: [
    {
      id: 'pat_3_1',
      category: 'Interleaved Series',
      prompt: 'Find the next term in this dual-interleaved series:\n2, 20, 4, 18, 6, 16, ?',
      options: ['8', '14', '10', '12'],
      correctAnswer: '8',
      explanation: 'There are two alternating series: Series 1 adds 2 (2, 4, 6, 8...), Series 2 subtracts 2 (20, 18, 16...). The next term belongs to Series 1: 6 + 2 = 8.'
    },
    {
      id: 'pat_3_2',
      category: 'Prime Numbers',
      prompt: 'What is the next prime number in sequence?\n2, 3, 5, 7, 11, ?',
      options: ['13', '15', '17', '12'],
      correctAnswer: '13',
      explanation: 'Prime numbers are numbers greater than 1 with no positive divisors other than 1 and themselves. The prime after 11 is 13.'
    },
    {
      id: 'pat_3_3',
      category: 'Square Numbers',
      prompt: 'Discover the next square in the pattern:\n1, 4, 9, 16, 25, ?',
      options: ['36', '30', '49', '32'],
      correctAnswer: '36',
      explanation: 'These are consecutive perfect squares (1², 2², 3², 4², 5², 6²): 6 × 6 = 36.'
    },
    {
      id: 'pat_3_4',
      category: 'Spatial Reasoning',
      prompt: 'A traditional analog clock shows 6:00. What is the angle between the hour hand and minute hand?',
      options: ['180°', '90°', '120°', '360°'],
      correctAnswer: '180°',
      explanation: 'At 6:00, the minute hand points straight up at 12 and the hour hand points straight down at 6, forming a straight line (180°).'
    }
  ]
};

function getPatternLogicRound(round = 1) {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const roundKey = ((r - 1) % 3) + 1; // 1, 2, 3 cyclical
  const challenges = PATTERN_ROUNDS[roundKey] || PATTERN_ROUNDS[1];

  const prepared = challenges.map((c, idx) => {
    // Parse sequence if prompt contains sequence notation (e.g. "3, 6, 9, 12, ?")
    let sequence = [];
    const lines = c.prompt.split('\n');
    if (lines.length > 1) {
      sequence = lines[1].split(',').map(s => s.trim()).filter(Boolean);
    }
    return {
      id: `pat_r${r}_${idx + 1}`,
      category: c.category,
      type: c.category,
      prompt: c.prompt,
      sequence: sequence.length ? sequence : ['●', '▲', '■', '?'],
      options: shuffle(c.options),
      answer: c.correctAnswer,
      correctAnswer: c.correctAnswer,
      explanation: c.explanation
    };
  });

  return {
    gameId: 'pattern',
    round: r,
    totalChallenges: prepared.length,
    challenges: prepared
  };
}

// ==========================================
// 5. WORD SEARCH
// ==========================================
const WORD_SEARCH_WORDS = {
  1: [
    { word: 'SUN', clue: 'Bright center of our solar system' },
    { word: 'MOON', clue: 'Earth\'s natural satellite' },
    { word: 'STAR', clue: 'Luminous celestial sphere' },
    { word: 'MARS', clue: 'The red neighboring planet' }
  ],
  2: [
    { word: 'BOOK', clue: 'Written or printed work of pages' },
    { word: 'LEARN', clue: 'Gain knowledge through study' },
    { word: 'READ', clue: 'Look at and comprehend written text' },
    { word: 'WRITE', clue: 'Mark letters or words on a surface' }
  ],
  3: [
    { word: 'WATER', clue: 'Essential liquid covering most of Earth' },
    { word: 'RIVER', clue: 'Large flowing stream of fresh water' },
    { word: 'OCEAN', clue: 'Vast continuous body of salt water' },
    { word: 'RAIN', clue: 'Moisture condensed from atmosphere' }
  ]
};

function generateWordSearchGrid(words, size = 8) {
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const placedWords = [];

  // Directions: [rowDelta, colDelta]
  // Horizontal, Vertical, Diagonal down-right
  const directions = [
    { name: 'horizontal', dr: 0, dc: 1 },
    { name: 'vertical', dr: 1, dc: 0 },
    { name: 'diagonal', dr: 1, dc: 1 }
  ];

  words.forEach((item, wIdx) => {
    const word = item.word.toUpperCase();
    let placed = false;
    let attempts = 0;
    const dir = directions[wIdx % directions.length];

    while (!placed && attempts < 100) {
      attempts++;
      const maxRow = dir.dr === 1 ? size - word.length : size - 1;
      const maxCol = dir.dc === 1 ? size - word.length : size - 1;
      if (maxRow < 0 || maxCol < 0) break;

      const r = Math.floor(Math.random() * (maxRow + 1));
      const c = Math.floor(Math.random() * (maxCol + 1));

      // Check collision
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const currR = r + i * dir.dr;
        const currC = c + i * dir.dc;
        if (grid[currR][currC] !== '' && grid[currR][currC] !== word[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
          const currR = r + i * dir.dr;
          const currC = c + i * dir.dc;
          grid[currR][currC] = word[i];
          cells.push({ r: currR, c: currC });
        }
        placedWords.push({
          word: word,
          clue: item.clue,
          direction: dir.name,
          cells: cells
        });
        placed = true;
      }
    }
  });

  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placedWords };
}

function getWordSearchRound(round = 1) {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const roundKey = ((r - 1) % 3) + 1;
  const wordList = WORD_SEARCH_WORDS[roundKey] || WORD_SEARCH_WORDS[1];
  const { grid, placedWords } = generateWordSearchGrid(wordList, 8);

  return {
    gameId: 'search',
    round: r,
    gridSize: 8,
    grid: grid,
    words: placedWords.map(p => ({
      word: p.word,
      clue: p.clue,
      length: p.word.length,
      direction: p.direction
    })),
    solution: placedWords
  };
}

// ==========================================
// 6. SENTENCE BUILDER
// ==========================================
const SENTENCE_ROUNDS = {
  1: [
    {
      id: 'sent_1_1',
      meaning: 'The sun rises in the east.',
      targetSentence: 'The sun rises in the east',
      shuffled: ['rises', 'The', 'east', 'in', 'sun', 'the'],
      explanation: 'In English declarative sentences, the typical word order is Subject (The sun) + Verb (rises) + Prepositional phrase (in the east).'
    },
    {
      id: 'sent_1_2',
      meaning: 'Knowledge is power for everyone.',
      targetSentence: 'Knowledge is power for everyone',
      shuffled: ['power', 'Knowledge', 'everyone', 'for', 'is'],
      explanation: 'Subject "Knowledge" is linked by copula "is" to predicate noun "power", followed by prepositional phrase "for everyone".'
    },
    {
      id: 'sent_1_3',
      meaning: 'She reads a helpful book every morning.',
      targetSentence: 'She reads a helpful book every morning',
      shuffled: ['book', 'She', 'reads', 'morning', 'every', 'helpful', 'a'],
      explanation: 'Subject (She) + Present tense verb (reads) + Direct object (a helpful book) + Time adverbial (every morning).'
    },
    {
      id: 'sent_1_4',
      meaning: 'Water flows down the green mountain.',
      targetSentence: 'Water flows down the green mountain',
      shuffled: ['flows', 'mountain', 'the', 'Water', 'green', 'down'],
      explanation: 'Uncountable subject (Water) takes singular verb (flows) followed by directional preposition (down) and noun phrase (the green mountain).'
    }
  ],
  2: [
    {
      id: 'sent_2_1',
      meaning: 'AI helps students learn languages faster.',
      targetSentence: 'AI helps students learn languages faster',
      shuffled: ['learn', 'helps', 'AI', 'faster', 'students', 'languages'],
      explanation: 'Subject (AI) + Verb (helps) + Object (students) + Bare infinitive (learn) + Object (languages) + Adverb (faster).'
    },
    {
      id: 'sent_2_2',
      meaning: 'Birds sing sweet songs at sunrise.',
      targetSentence: 'Birds sing sweet songs at sunrise',
      shuffled: ['sweet', 'sing', 'Birds', 'at', 'songs', 'sunrise'],
      explanation: 'Plural subject (Birds) + Plural verb (sing) + Modified object (sweet songs) + Temporal phrase (at sunrise).'
    },
    {
      id: 'sent_2_3',
      meaning: 'Practice makes language learning much easier.',
      targetSentence: 'Practice makes language learning much easier',
      shuffled: ['easier', 'Practice', 'much', 'makes', 'learning', 'language'],
      explanation: 'Subject (Practice) + Verb (makes) + Complex object (language learning) + Comparative adjective (much easier).'
    },
    {
      id: 'sent_2_4',
      meaning: 'Kind words open the heaviest doors.',
      targetSentence: 'Kind words open the heaviest doors',
      shuffled: ['doors', 'open', 'Kind', 'heaviest', 'words', 'the'],
      explanation: 'Subject phrase (Kind words) + Transitive verb (open) + Superlative object phrase (the heaviest doors).'
    }
  ],
  3: [
    {
      id: 'sent_3_1',
      meaning: 'Curiosity opens new windows of understanding.',
      targetSentence: 'Curiosity opens new windows of understanding',
      shuffled: ['windows', 'opens', 'Curiosity', 'of', 'new', 'understanding'],
      explanation: 'Subject (Curiosity) + Singular verb (opens) + Direct object (new windows of understanding).'
    },
    {
      id: 'sent_3_2',
      meaning: 'Every great journey begins with one step.',
      targetSentence: 'Every great journey begins with one step',
      shuffled: ['begins', 'journey', 'Every', 'one', 'step', 'great', 'with'],
      explanation: 'Subject noun phrase (Every great journey) + Intransitive verb (begins) + Prepositional phrase (with one step).'
    },
    {
      id: 'sent_3_3',
      meaning: 'Active listening builds mutual respect and trust.',
      targetSentence: 'Active listening builds mutual respect and trust',
      shuffled: ['mutual', 'listening', 'trust', 'builds', 'Active', 'and', 'respect'],
      explanation: 'Gerund subject phrase (Active listening) + Verb (builds) + Compound object (mutual respect and trust).'
    },
    {
      id: 'sent_3_4',
      meaning: 'The gentle breeze cooled the warm evening.',
      targetSentence: 'The gentle breeze cooled the warm evening',
      shuffled: ['cooled', 'evening', 'gentle', 'The', 'warm', 'the', 'breeze'],
      explanation: 'Subject (The gentle breeze) + Past verb (cooled) + Object (the warm evening).'
    }
  ]
};

function getSentenceBuilderRound(round = 1) {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const roundKey = ((r - 1) % 3) + 1;
  const challenges = SENTENCE_ROUNDS[roundKey] || SENTENCE_ROUNDS[1];

  const prepared = challenges.map(item => ({
    id: item.id,
    meaning: item.meaning,
    targetSentence: item.targetSentence,
    shuffled: shuffle(item.shuffled),
    words: item.shuffled,
    explanation: item.explanation
  }));

  return {
    gameId: 'sentence',
    round: r,
    totalChallenges: prepared.length,
    challenges: prepared
  };
}

// ==========================================
// 7. LISTEN & CHOOSE
// ==========================================
const LISTEN_ROUNDS = {
  1: [
    {
      id: 'listen_1_1',
      spokenText: 'Namaste',
      langCode: 'hi-IN',
      displayLang: 'Hindi',
      prompt: 'Listen to the spoken greeting and select its English translation:',
      options: ['Hello / Greetings', 'Thank you', 'Goodbye', 'Good night'],
      correctAnswer: 'Hello / Greetings',
      explanation: '"Namaste" is the traditional respectful Hindi/Sanskrit greeting meaning Hello.'
    },
    {
      id: 'listen_1_2',
      spokenText: 'Vanakkam',
      langCode: 'ta-IN',
      displayLang: 'Tamil',
      prompt: 'Listen to the spoken word and select its meaning:',
      options: ['Greetings / Welcome', 'Delicious food', 'Hurry up', 'Beautiful flower'],
      correctAnswer: 'Greetings / Welcome',
      explanation: '"Vanakkam" (வணக்கம்) is the classical Tamil greeting of respect and welcome.'
    },
    {
      id: 'listen_1_3',
      spokenText: 'Merci beaucoup',
      langCode: 'fr-FR',
      displayLang: 'French',
      prompt: 'Listen to the spoken French phrase and choose the translation:',
      options: ['Thank you very much', 'You are welcome', 'See you tomorrow', 'Excuse me please'],
      correctAnswer: 'Thank you very much',
      explanation: '"Merci beaucoup" in French translates directly to "Thank you very much".'
    },
    {
      id: 'listen_1_4',
      spokenText: 'Arigatou gozaimasu',
      langCode: 'ja-JP',
      displayLang: 'Japanese',
      prompt: 'Listen to the polite Japanese expression and select its meaning:',
      options: ['Thank you politely', 'Good morning', 'How are you?', 'Nice to meet you'],
      correctAnswer: 'Thank you politely',
      explanation: '"Arigatou gozaimasu" is polite Japanese for "Thank you very much".'
    }
  ],
  2: [
    {
      id: 'listen_2_1',
      spokenText: 'Dhanyavaad',
      langCode: 'hi-IN',
      displayLang: 'Hindi',
      prompt: 'Listen to the spoken Hindi phrase and pick the English meaning:',
      options: ['Thank you', 'Please enter', 'Listen here', 'Where is it?'],
      correctAnswer: 'Thank you',
      explanation: '"Dhanyavaad" (धन्यवाद) is standard formal Hindi for "Thank you".'
    },
    {
      id: 'listen_2_2',
      spokenText: 'Nandri',
      langCode: 'ta-IN',
      displayLang: 'Tamil',
      prompt: 'Listen to the spoken Tamil word and choose the meaning:',
      options: ['Thank you', 'Friend', 'Book', 'Teacher'],
      correctAnswer: 'Thank you',
      explanation: '"Nandri" (நன்றி) means "Thank you" in Tamil.'
    },
    {
      id: 'listen_2_3',
      spokenText: 'Bonjour tout le monde',
      langCode: 'fr-FR',
      displayLang: 'French',
      prompt: 'Listen to the spoken French greeting and choose the correct meaning:',
      options: ['Hello everyone', 'Good night friends', 'Goodbye class', 'Happy holiday'],
      correctAnswer: 'Hello everyone',
      explanation: '"Bonjour tout le monde" translates to "Hello everyone" or "Good morning everyone".'
    },
    {
      id: 'listen_2_4',
      spokenText: 'Namaskaaram',
      langCode: 'ml-IN',
      displayLang: 'Malayalam',
      prompt: 'Listen to the spoken Malayalam greeting and select the meaning:',
      options: ['Greetings / Hello', 'Goodbye', 'Welcome inside', 'Come here'],
      correctAnswer: 'Greetings / Hello',
      explanation: '"Namaskaaram" (നമസ്കാരം) is the traditional respectful greeting in Malayalam.'
    }
  ],
  3: [
    {
      id: 'listen_3_1',
      spokenText: 'Shukriya mere dost',
      langCode: 'hi-IN',
      displayLang: 'Hindi / Urdu',
      prompt: 'Listen carefully and select the English translation:',
      options: ['Thank you my friend', 'Hello my teacher', 'Where are you going?', 'Have a good trip'],
      correctAnswer: 'Thank you my friend',
      explanation: '"Shukriya" means thank you, and "mere dost" means my friend.'
    },
    {
      id: 'listen_3_2',
      spokenText: 'Konnichiwa tomodachi',
      langCode: 'ja-JP',
      displayLang: 'Japanese',
      prompt: 'Listen to the Japanese phrase and choose the translation:',
      options: ['Hello friend', 'Goodbye tomorrow', 'Thank you teacher', 'Good evening all'],
      correctAnswer: 'Hello friend',
      explanation: '"Konnichiwa" is Hello/Good afternoon, and "tomodachi" means friend.'
    },
    {
      id: 'listen_3_3',
      spokenText: 'S\'il vous plaît',
      langCode: 'fr-FR',
      displayLang: 'French',
      prompt: 'Listen to the polite French phrase and identify the meaning:',
      options: ['Please', 'Pardon me', 'Of course', 'Never mind'],
      correctAnswer: 'Please',
      explanation: '"S\'il vous plaît" is polite French for "Please" (literally: if it pleases you).'
    },
    {
      id: 'listen_3_4',
      spokenText: 'Subhakaankshalu',
      langCode: 'te-IN',
      displayLang: 'Telugu',
      prompt: 'Listen to the Telugu expression and select its meaning:',
      options: ['Best wishes / Congratulations', 'Thank you very much', 'Come quickly', 'Good night'],
      correctAnswer: 'Best wishes / Congratulations',
      explanation: '"Subhakaankshalu" (శుభాకాంక్షలు) in Telugu means "Best Wishes" or "Greetings / Congratulations".'
    }
  ]
};

function getListenChooseRound(round = 1) {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const roundKey = ((r - 1) % 3) + 1;
  const challenges = LISTEN_ROUNDS[roundKey] || LISTEN_ROUNDS[1];

  const prepared = challenges.map(item => ({
    id: item.id,
    spokenText: item.spokenText,
    langCode: item.langCode,
    displayLang: item.displayLang,
    prompt: item.prompt,
    options: shuffle(item.options),
    answer: item.correctAnswer,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation
  }));

  return {
    gameId: 'listen',
    round: r,
    totalChallenges: prepared.length,
    challenges: prepared
  };
}

// ==========================================
// 8. ODD ONE OUT
// ==========================================
const ODD_ROUNDS = {
  1: [
    {
      id: 'odd_1_1',
      category: 'Botany & Food',
      prompt: 'Which item does NOT belong with the other three?',
      options: ['Apple', 'Banana', 'Mango', 'Carrot'],
      oddItem: 'Carrot',
      commonFeature: 'Apple, Banana, and Mango are all sweet tree fruits; Carrot is an underground root vegetable.',
      explanation: 'Carrot is an underground root vegetable, whereas apple, banana, and mango are all culinary and botanical fruits that grow above ground.'
    },
    {
      id: 'odd_1_2',
      category: 'Transportation',
      prompt: 'Which vehicle does NOT belong in this group?',
      options: ['Airplane', 'Helicopter', 'Submarine', 'Hot Air Balloon'],
      oddItem: 'Submarine',
      commonFeature: 'Airplane, Helicopter, and Hot Air Balloon are aerial transport vehicles; Submarine travels underwater.',
      explanation: 'Airplane, helicopter, and hot air balloon are aerial vehicles that operate in the sky, while a submarine operates underwater in the ocean.'
    },
    {
      id: 'odd_1_3',
      category: 'Computer Science',
      prompt: 'Which technology does NOT belong with the other programming languages?',
      options: ['Python', 'JavaScript', 'HTML', 'Ruby'],
      oddItem: 'HTML',
      commonFeature: 'Python, JavaScript, and Ruby are full Turing-complete programming languages; HTML is a markup language for structuring documents.',
      explanation: 'HTML (HyperText Markup Language) is a markup format defining document structure, not a Turing-complete procedural/object-oriented programming language like Python, JavaScript, or Ruby.'
    },
    {
      id: 'odd_1_4',
      category: 'Zoology',
      prompt: 'Which creature is the odd one out?',
      options: ['Dolphin', 'Whale', 'Shark', 'Seal'],
      oddItem: 'Shark',
      commonFeature: 'Dolphin, Whale, and Seal are warm-blooded air-breathing mammals; Shark is a cartilaginous fish with gills.',
      explanation: 'Sharks are cartilaginous fish that breathe through gills and lay eggs or give birth without nursing, while dolphins, whales, and seals are warm-blooded marine mammals that breathe air through lungs.'
    }
  ],
  2: [
    {
      id: 'odd_2_1',
      category: 'Astronomy',
      prompt: 'Which celestial body does NOT belong in this astronomical classification?',
      options: ['Earth', 'Mars', 'Jupiter', 'The Moon'],
      oddItem: 'The Moon',
      commonFeature: 'Earth, Mars, and Jupiter are planets directly orbiting the Sun; The Moon is a natural satellite orbiting Earth.',
      explanation: 'The Moon is a natural satellite orbiting a planet, whereas Earth, Mars, and Jupiter are major planets directly orbiting the Sun.'
    },
    {
      id: 'odd_2_2',
      category: 'Musical Instruments',
      prompt: 'Which musical instrument does NOT belong in this family?',
      options: ['Violin', 'Cello', 'Flute', 'Guitar'],
      oddItem: 'Flute',
      commonFeature: 'Violin, Cello, and Guitar are stringed instruments; Flute is an aerophone woodwind instrument.',
      explanation: 'Violin, cello, and guitar produce sound by vibrating strings (chordophones), whereas the flute is a woodwind instrument played by directing a stream of air (aerophone).'
    },
    {
      id: 'odd_2_3',
      category: 'Geometry',
      prompt: 'Which geometric shape is the odd one out?',
      options: ['Square', 'Rectangle', 'Rhombus', 'Triangle'],
      oddItem: 'Triangle',
      commonFeature: 'Square, Rectangle, and Rhombus are 4-sided quadrilaterals; Triangle has only 3 sides.',
      explanation: 'Square, rectangle, and rhombus are all four-sided polygons (quadrilaterals), whereas a triangle is a three-sided polygon.'
    },
    {
      id: 'odd_2_4',
      category: 'Language Families',
      prompt: 'Which classical language is the odd one out by language family?',
      options: ['Tamil', 'Telugu', 'Malayalam', 'French'],
      oddItem: 'French',
      commonFeature: 'Tamil, Telugu, and Malayalam belong to the Dravidian language family; French belongs to the Indo-European Romance family.',
      explanation: 'Tamil, Telugu, and Malayalam are members of the South Indian Dravidian linguistic family, whereas French is a Romance language derived from Latin within the Indo-European family.'
    }
  ],
  3: [
    {
      id: 'odd_3_1',
      category: 'Human Anatomy',
      prompt: 'Which organ is NOT part of the human digestive tract?',
      options: ['Stomach', 'Small Intestine', 'Lungs', 'Esophagus'],
      oddItem: 'Lungs',
      commonFeature: 'Stomach, Small Intestine, and Esophagus belong to the digestive system; Lungs belong to the respiratory system.',
      explanation: 'The lungs are primary organs of the respiratory system used for gas exchange, whereas the esophagus, stomach, and small intestine form parts of the digestive tract.'
    },
    {
      id: 'odd_3_2',
      category: 'Chemistry & Elements',
      prompt: 'Which substance is NOT a noble gas?',
      options: ['Helium', 'Neon', 'Argon', 'Oxygen'],
      oddItem: 'Oxygen',
      commonFeature: 'Helium, Neon, and Argon are inert noble gases (Group 18); Oxygen is a reactive chalcogen gas (Group 16).',
      explanation: 'Helium, neon, and argon are inert noble gases with full outer electron shells in Group 18 of the periodic table, whereas oxygen is a reactive nonmetal in Group 16.'
    },
    {
      id: 'odd_3_3',
      category: 'Units of Measurement',
      prompt: 'Which unit does NOT measure distance or length?',
      options: ['Meter', 'Kilometer', 'Light-year', 'Liter'],
      oddItem: 'Liter',
      commonFeature: 'Meter, Kilometer, and Light-year measure length/distance; Liter measures fluid volume.',
      explanation: 'A liter measures volume/capacity, whereas meters, kilometers, and light-years all measure linear distance.'
    },
    {
      id: 'odd_3_4',
      category: 'Literature & Genres',
      prompt: 'Which form of writing is the odd one out?',
      options: ['Sonnet', 'Haiku', 'Limerick', 'Encyclopedia'],
      oddItem: 'Encyclopedia',
      commonFeature: 'Sonnet, Haiku, and Limerick are poetic verse forms; Encyclopedia is a comprehensive non-fiction reference prose work.',
      explanation: 'Sonnets, haikus, and limericks are structured poetic verse forms, while an encyclopedia is an informational reference prose work.'
    }
  ]
};

function getOddOneOutRound(round = 1) {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const roundKey = ((r - 1) % 3) + 1;
  const challenges = ODD_ROUNDS[roundKey] || ODD_ROUNDS[1];

  const prepared = challenges.map(item => ({
    id: item.id,
    category: item.category,
    prompt: item.prompt,
    options: shuffle(item.options),
    oddItem: item.oddItem,
    answer: item.oddItem,
    correctAnswer: item.oddItem,
    commonFeature: item.commonFeature,
    explanation: item.explanation
  }));

  return {
    gameId: 'odd',
    round: r,
    totalChallenges: prepared.length,
    challenges: prepared
  };
}

// ==========================================
// 9. QUICK RECALL
// ==========================================
const RECALL_ROUNDS = {
  1: [
    {
      id: 'rec_1_1',
      sequence: ['🌟 Star', '🌊 Ocean', '🔥 Flame', '🍃 Leaf'],
      prompt: 'Which item was at position 3 in the memorized sequence?',
      options: ['🔥 Flame', '🌊 Ocean', '🌟 Star', '🍃 Leaf'],
      correctAnswer: '🔥 Flame',
      memorizeDuration: 4,
      explanation: 'The original sequence was: 1. Star, 2. Ocean, 3. Flame, 4. Leaf.'
    },
    {
      id: 'rec_1_2',
      sequence: ['🍎 Apple', '🍇 Grapes', '🍋 Lemon', '🍒 Cherries'],
      prompt: 'Which fruit was the FIRST item shown in the sequence?',
      options: ['🍎 Apple', '🍋 Lemon', '🍇 Grapes', '🍒 Cherries'],
      correctAnswer: '🍎 Apple',
      memorizeDuration: 4,
      explanation: 'Apple was in the very first slot (1. Apple, 2. Grapes, 3. Lemon, 4. Cherries).'
    },
    {
      id: 'rec_1_3',
      sequence: ['Blue', 'Gold', 'Emerald', 'Crimson'],
      prompt: 'Which color was the LAST item in the sequence?',
      options: ['Crimson', 'Emerald', 'Gold', 'Blue'],
      correctAnswer: 'Crimson',
      memorizeDuration: 4,
      explanation: 'The order was: Blue (1), Gold (2), Emerald (3), Crimson (4).'
    },
    {
      id: 'rec_1_4',
      sequence: ['Tamizh', 'Hindi', 'English', 'Malayalam'],
      prompt: 'Which language was positioned SECOND in the sequence?',
      options: ['Hindi', 'Tamizh', 'English', 'Malayalam'],
      correctAnswer: 'Hindi',
      memorizeDuration: 4,
      explanation: 'The order was: 1. Tamizh, 2. Hindi, 3. English, 4. Malayalam.'
    }
  ],
  2: [
    {
      id: 'rec_2_1',
      sequence: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      prompt: 'Which gas giant was the second planet shown?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
      correctAnswer: 'Saturn',
      memorizeDuration: 4,
      explanation: 'The planets appeared as: 1. Jupiter, 2. Saturn, 3. Uranus, 4. Neptune.'
    },
    {
      id: 'rec_2_2',
      sequence: ['Diamond', 'Ruby', 'Sapphire', 'Topaz'],
      prompt: 'Which gemstone was at position 3?',
      options: ['Sapphire', 'Diamond', 'Topaz', 'Ruby'],
      correctAnswer: 'Sapphire',
      memorizeDuration: 4,
      explanation: 'The sequence was: 1. Diamond, 2. Ruby, 3. Sapphire, 4. Topaz.'
    },
    {
      id: 'rec_2_3',
      sequence: ['Falcon', 'Eagle', 'Hawk', 'Owl'],
      prompt: 'Which bird was the final (fourth) item shown?',
      options: ['Owl', 'Hawk', 'Eagle', 'Falcon'],
      correctAnswer: 'Owl',
      memorizeDuration: 4,
      explanation: 'The order of birds was: 1. Falcon, 2. Eagle, 3. Hawk, 4. Owl.'
    },
    {
      id: 'rec_2_4',
      sequence: ['Triangle', 'Square', 'Pentagon', 'Hexagon'],
      prompt: 'Which shape had exactly 5 sides and was placed at position 3?',
      options: ['Pentagon', 'Square', 'Triangle', 'Hexagon'],
      correctAnswer: 'Pentagon',
      memorizeDuration: 4,
      explanation: 'The polygon sequence was: 1. Triangle (3 sides), 2. Square (4 sides), 3. Pentagon (5 sides), 4. Hexagon (6 sides).'
    }
  ],
  3: [
    {
      id: 'rec_3_1',
      sequence: ['North', 'East', 'South', 'West'],
      prompt: 'Which cardinal direction appeared immediately after East?',
      options: ['South', 'North', 'West', 'East'],
      correctAnswer: 'South',
      memorizeDuration: 4,
      explanation: 'The sequence was: North (1), East (2), South (3), West (4).'
    },
    {
      id: 'rec_3_2',
      sequence: ['Spring', 'Summer', 'Autumn', 'Winter'],
      prompt: 'Which season was placed in position 1?',
      options: ['Spring', 'Summer', 'Autumn', 'Winter'],
      correctAnswer: 'Spring',
      memorizeDuration: 4,
      explanation: 'The sequence started with Spring at position 1.'
    },
    {
      id: 'rec_3_3',
      sequence: ['Hydrogen', 'Helium', 'Lithium', 'Beryllium'],
      prompt: 'Which element with atomic number 3 was at position 3?',
      options: ['Lithium', 'Hydrogen', 'Helium', 'Beryllium'],
      correctAnswer: 'Lithium',
      memorizeDuration: 4,
      explanation: 'The sequence followed the first four elements: 1. Hydrogen, 2. Helium, 3. Lithium, 4. Beryllium.'
    },
    {
      id: 'rec_3_4',
      sequence: ['Mercury', 'Venus', 'Earth', 'Mars'],
      prompt: 'Which terrestrial planet was placed at position 3?',
      options: ['Earth', 'Venus', 'Mars', 'Mercury'],
      correctAnswer: 'Earth',
      memorizeDuration: 4,
      explanation: 'The order was: 1. Mercury, 2. Venus, 3. Earth, 4. Mars.'
    }
  ]
};

function getQuickRecallRound(round = 1) {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const roundKey = ((r - 1) % 3) + 1;
  const challenges = RECALL_ROUNDS[roundKey] || RECALL_ROUNDS[1];

  const prepared = challenges.map(item => ({
    id: item.id,
    sequence: item.sequence,
    prompt: item.prompt,
    options: shuffle(item.options),
    answer: item.correctAnswer,
    correctAnswer: item.correctAnswer,
    memorizeDuration: item.memorizeDuration || 4,
    explanation: item.explanation
  }));

  return {
    gameId: 'recall',
    round: r,
    totalChallenges: prepared.length,
    challenges: prepared
  };
}

// ==========================================
// 10. RIDDLE CHALLENGE
// ==========================================
const RIDDLE_ROUNDS = {
  1: [
    {
      id: 'rid_1_1',
      riddle: 'I have keys but no locks. I have space but no room. You can enter, but you cannot go inside. What am I?',
      hint: 'You are using one right now to interact with computers!',
      options: ['A Computer Keyboard', 'A Grand Piano', 'A Locked Chest', 'A Prison Cell'],
      correctAnswer: 'A Computer Keyboard',
      explanation: 'A computer keyboard has letter/function keys, a space bar, and an Enter key, but no physical rooms or locks.'
    },
    {
      id: 'rid_1_2',
      riddle: 'What gets wetter the more it dries?',
      hint: 'You use it after taking a shower or swimming.',
      options: ['A Towel', 'A Sponge', 'A Raincoat', 'A Hairdryer'],
      correctAnswer: 'A Towel',
      explanation: 'A towel absorbs water to dry your body, so as it dries you, it becomes wetter!'
    },
    {
      id: 'rid_1_3',
      riddle: 'What has a head and a tail, but no body or legs?',
      hint: 'It can be found in your pocket or piggy bank.',
      options: ['A Coin', 'A Snake', 'A Kite', 'A Comet'],
      correctAnswer: 'A Coin',
      explanation: 'A coin has two sides conventionally called "heads" and "tails", but no torso or limbs.'
    },
    {
      id: 'rid_1_4',
      riddle: 'What can travel around the world while staying tucked into a single corner?',
      hint: 'It gets affixed to an envelope before mailing.',
      options: ['A Postage Stamp', 'A Postcard', 'An Airplane', 'A Compass'],
      correctAnswer: 'A Postage Stamp',
      explanation: 'A postage stamp stays stuck in the top corner of an envelope while traveling across continents to its destination.'
    }
  ],
  2: [
    {
      id: 'rid_2_1',
      riddle: 'What belongs to you, but everyone else uses it much more than you do?',
      hint: 'People use it whenever they want to get your attention.',
      options: ['Your Name', 'Your Phone', 'Your Shoes', 'Your Shadow'],
      correctAnswer: 'Your Name',
      explanation: 'Your name belongs uniquely to you, but other people say and write it far more often to address you.'
    },
    {
      id: 'rid_2_2',
      riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
      hint: 'You often hear me shouting back in a large canyon or empty hall.',
      options: ['An Echo', 'A Radio', 'A Cloud', 'A Whistle'],
      correctAnswer: 'An Echo',
      explanation: 'An echo repeats acoustic sounds and voices carried by sound waves, without possessing physical organs.'
    },
    {
      id: 'rid_2_3',
      riddle: 'What has many teeth, but cannot chew a single bite of food?',
      hint: 'You use it to tidy and style your hair.',
      options: ['A Comb', 'A Saw', 'A Zipper', 'A Gear'],
      correctAnswer: 'A Comb',
      explanation: 'A hair comb has a row of slender teeth used to detangle hair, but cannot bite or eat.'
    },
    {
      id: 'rid_2_4',
      riddle: 'The more you take out of me, the bigger I become. What am I?',
      hint: 'Think of digging in the ground or sand.',
      options: ['A Hole', 'A Balloon', 'A Pocket', 'A Cave'],
      correctAnswer: 'A Hole',
      explanation: 'The more dirt or sand you remove from a hole, the larger the hole becomes!'
    }
  ],
  3: [
    {
      id: 'rid_3_1',
      riddle: 'What has cities, but no houses; forests, but no trees; and water, but no fish?',
      hint: 'Explorers and navigators consult it to find their way.',
      options: ['A Map', 'A Globe', 'A Painting', 'A Mirage'],
      correctAnswer: 'A Map',
      explanation: 'A map depicts cities, boundaries, geographic terrain, and waterways symbolically without containing physical buildings or creatures.'
    },
    {
      id: 'rid_3_2',
      riddle: 'I have branches, but no fruit, trunk, or leaves. What am I?',
      hint: 'You deposit money or open a savings account here.',
      options: ['A Bank', 'A Tree', 'A River', 'A Railway'],
      correctAnswer: 'A Bank',
      explanation: 'A financial bank has corporate branch locations across cities, but no biological trunk or leaves.'
    },
    {
      id: 'rid_3_3',
      riddle: 'What can run but never walks, has a mouth but never talks, has a head but never weeps, and has a bed but never sleeps?',
      hint: 'A flowing body of fresh water.',
      options: ['A River', 'A Clock', 'A Train', 'A Windmill'],
      correctAnswer: 'A River',
      explanation: 'A river has a source (head), riverbed, mouth where it meets the sea, and running current, but is non-living.'
    },
    {
      id: 'rid_3_4',
      riddle: 'What goes up but never comes back down?',
      hint: 'It increases by one each time you celebrate a birthday!',
      options: ['Your Age', 'A Rocket', 'Smoke', 'Temperature'],
      correctAnswer: 'Your Age',
      explanation: 'A person\'s age continuously advances with time and can never decrease.'
    }
  ]
};

function getRiddleChallengeRound(round = 1) {
  const r = Math.max(1, parseInt(round, 10) || 1);
  const roundKey = ((r - 1) % 3) + 1;
  const challenges = RIDDLE_ROUNDS[roundKey] || RIDDLE_ROUNDS[1];

  const prepared = challenges.map(item => ({
    id: item.id,
    riddle: item.riddle,
    hint: item.hint,
    options: shuffle(item.options),
    answer: item.correctAnswer,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation
  }));

  return {
    gameId: 'riddle',
    round: r,
    totalChallenges: prepared.length,
    challenges: prepared
  };
}

module.exports = {
  getMemoryMatchRound,
  getWordPuzzleRound,
  getQuickQuizRound,
  getPatternLogicRound,
  getWordSearchRound,
  getSentenceBuilderRound,
  getListenChooseRound,
  getOddOneOutRound,
  getQuickRecallRound,
  getRiddleChallengeRound
};

