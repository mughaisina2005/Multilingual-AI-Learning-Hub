const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'hub_users.db');
const db = new sqlite3.Database(dbPath);

// Promisified helpers
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function initDb() {
  // Create users table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL COLLATE NOCASE,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT,
      recovery_hash TEXT,
      auth_provider TEXT DEFAULT 'local',
      google_id TEXT UNIQUE,
      failed_login_attempts INTEGER DEFAULT 0,
      lockout_until INTEGER DEFAULT 0,
      failed_recovery_attempts INTEGER DEFAULT 0,
      recovery_lockout_until INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create sessions table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_settings table (Theme: light, dark, system; Language preferences)
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      theme TEXT DEFAULT 'system',
      explanation_lang TEXT DEFAULT 'en',
      target_lang TEXT DEFAULT 'ta',
      learning_level TEXT DEFAULT 'beginner',
      sound_enabled INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_learning_progress table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_learning_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      explanation_lang TEXT NOT NULL,
      target_lang TEXT NOT NULL,
      learning_level TEXT NOT NULL,
      unit_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER DEFAULT 1,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      xp_earned INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, explanation_lang, target_lang, learning_level, unit_id, lesson_id)
    )
  `);

  // Create user_stats table (XP, Streak, Lessons Completed)
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_stats (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      total_xp INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      last_active_date TEXT,
      lessons_completed INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_mistakes table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_mistakes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_lang TEXT NOT NULL,
      unit_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      user_answer TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_studio_history table (Module 5)
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_studio_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      topic TEXT NOT NULL,
      mode TEXT NOT NULL,
      language TEXT NOT NULL,
      content_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_tutor_history table (Module 6)
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_tutor_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      topic TEXT,
      language TEXT NOT NULL,
      role TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_practice_sessions table (Module 7: Practice & Mistake Memory)
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_practice_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      practice_type TEXT NOT NULL,
      topic TEXT,
      target_lang TEXT NOT NULL,
      explanation_lang TEXT NOT NULL,
      learning_level TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      score_percentage INTEGER NOT NULL,
      xp_earned INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_game_sessions table (Brain Break: Brain Games)
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_game_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id TEXT NOT NULL,
      round_number INTEGER NOT NULL,
      score INTEGER NOT NULL,
      max_score INTEGER NOT NULL,
      moves INTEGER DEFAULT 0,
      accuracy INTEGER DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Safe column migration for user_mistakes (Module 7 enhancements)
  try {
    const mistakeColumns = await allQuery(`PRAGMA table_info(user_mistakes)`);
    const colNames = mistakeColumns.map(c => c.name);
    if (!colNames.includes('topic')) {
      await runQuery(`ALTER TABLE user_mistakes ADD COLUMN topic TEXT`);
    }
    if (!colNames.includes('attempts')) {
      await runQuery(`ALTER TABLE user_mistakes ADD COLUMN attempts INTEGER DEFAULT 1`);
    }
    if (!colNames.includes('correct_attempts')) {
      await runQuery(`ALTER TABLE user_mistakes ADD COLUMN correct_attempts INTEGER DEFAULT 0`);
    }
    if (!colNames.includes('is_resolved')) {
      await runQuery(`ALTER TABLE user_mistakes ADD COLUMN is_resolved INTEGER DEFAULT 0`);
    }
    if (!colNames.includes('last_attempt_at')) {
      await runQuery(`ALTER TABLE user_mistakes ADD COLUMN last_attempt_at DATETIME`);
    }
    if (!colNames.includes('last_result')) {
      await runQuery(`ALTER TABLE user_mistakes ADD COLUMN last_result TEXT DEFAULT 'incorrect'`);
    }
    if (!colNames.includes('exercise_type')) {
      await runQuery(`ALTER TABLE user_mistakes ADD COLUMN exercise_type TEXT DEFAULT 'multiple_choice'`);
    }
    if (!colNames.includes('options_json')) {
      await runQuery(`ALTER TABLE user_mistakes ADD COLUMN options_json TEXT`);
    }
  } catch (migErr) {
    console.error('Safe migration warning on user_mistakes:', migErr.message);
  }

  // Index for fast lookups
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
  // Create user_vocabulary table (Practice Zone - Select Topic / AI Search & Learn)
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      original_text TEXT NOT NULL,
      input_lang TEXT NOT NULL,
      target_lang TEXT NOT NULL,
      translation TEXT NOT NULL,
      english_meaning TEXT,
      pronunciation TEXT,
      usage_example TEXT,
      explanation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, original_text, target_lang)
    )
  `);

  await runQuery(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`);
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_learning_progress ON user_learning_progress(user_id, target_lang)`);
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_user_mistakes ON user_mistakes(user_id)`);
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_user_mistakes_resolved ON user_mistakes(user_id, is_resolved)`);
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_studio_history ON user_studio_history(user_id, created_at)`);
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_tutor_history ON user_tutor_history(user_id, created_at)`);
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_practice_sessions ON user_practice_sessions(user_id, created_at)`);
  await runQuery(`CREATE INDEX IF NOT EXISTS idx_user_vocab ON user_vocabulary(user_id, target_lang)`);
}

module.exports = {
  initDb,
  db,

  async createUser({ fullName, username, email, passwordHash, recoveryHash, authProvider = 'local', googleId = null }) {
    const res = await runQuery(
      `INSERT INTO users (full_name, username, email, password_hash, recovery_hash, auth_provider, google_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullName.trim(), username.trim().toLowerCase(), email.trim().toLowerCase(), passwordHash, recoveryHash, authProvider, googleId]
    );
    return res.id;
  },

  async findUserById(id) {
    return getQuery(`SELECT * FROM users WHERE id = ?`, [id]);
  },

  async findUserByUsername(username) {
    return getQuery(`SELECT * FROM users WHERE username = ? COLLATE NOCASE`, [username.trim().toLowerCase()]);
  },

  async findUserByEmail(email) {
    return getQuery(`SELECT * FROM users WHERE email = ? COLLATE NOCASE`, [email.trim().toLowerCase()]);
  },

  async findUserByIdentifier(identifier) {
    const cleaned = identifier.trim().toLowerCase();
    return getQuery(
      `SELECT * FROM users WHERE username = ? COLLATE NOCASE OR email = ? COLLATE NOCASE`,
      [cleaned, cleaned]
    );
  },

  async findUserByGoogleId(googleId) {
    return getQuery(`SELECT * FROM users WHERE google_id = ?`, [googleId]);
  },

  async updatePasswordAndRecovery(userId, newPasswordHash, newRecoveryHash) {
    await runQuery(
      `UPDATE users 
       SET password_hash = ?, recovery_hash = ?, failed_login_attempts = 0, lockout_until = 0,
           failed_recovery_attempts = 0, recovery_lockout_until = 0, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newPasswordHash, newRecoveryHash, userId]
    );
  },

  async recordFailedLogin(userId, currentAttempts) {
    const nextAttempts = (currentAttempts || 0) + 1;
    let lockoutUntil = 0;
    if (nextAttempts >= 5) {
      // 15-minute lockout after 5 consecutive failures
      lockoutUntil = Date.now() + 15 * 60 * 1000;
    }
    await runQuery(
      `UPDATE users SET failed_login_attempts = ?, lockout_until = ? WHERE id = ?`,
      [nextAttempts, lockoutUntil, userId]
    );
    return { attempts: nextAttempts, isLocked: nextAttempts >= 5, lockoutUntil };
  },

  async resetFailedLogin(userId) {
    await runQuery(
      `UPDATE users SET failed_login_attempts = 0, lockout_until = 0 WHERE id = ?`,
      [userId]
    );
  },

  async recordFailedRecovery(userId, currentAttempts) {
    const nextAttempts = (currentAttempts || 0) + 1;
    let lockoutUntil = 0;
    if (nextAttempts >= 5) {
      // 15-minute lockout after 5 failed recovery code attempts
      lockoutUntil = Date.now() + 15 * 60 * 1000;
    }
    await runQuery(
      `UPDATE users SET failed_recovery_attempts = ?, recovery_lockout_until = ? WHERE id = ?`,
      [nextAttempts, lockoutUntil, userId]
    );
    return { attempts: nextAttempts, isLocked: nextAttempts >= 5, lockoutUntil };
  },

  async resetFailedRecovery(userId) {
    await runQuery(
      `UPDATE users SET failed_recovery_attempts = 0, recovery_lockout_until = 0 WHERE id = ?`,
      [userId]
    );
  },

  async createSession(token, userId, expiresAt) {
    await runQuery(
      `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
      [token, userId, expiresAt]
    );
  },

  async getSessionWithUser(token) {
    const row = await getQuery(
      `SELECT s.token, s.expires_at, u.id, u.full_name, u.username, u.email, u.auth_provider, u.created_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = ?`,
      [token]
    );
    if (!row) return null;
    if (row.expires_at < Date.now()) {
      await runQuery(`DELETE FROM sessions WHERE token = ?`, [token]);
      return null;
    }
    return row;
  },

  async deleteSession(token) {
    await runQuery(`DELETE FROM sessions WHERE token = ?`, [token]);
  },

  async deleteUserSessions(userId) {
    await runQuery(`DELETE FROM sessions WHERE user_id = ?`, [userId]);
  },

  async cleanupExpiredSessions() {
    await runQuery(`DELETE FROM sessions WHERE expires_at < ?`, [Date.now()]);
  },

  // ==========================================
  // MODULE 3: THEME & USER SETTINGS
  // ==========================================
  async getUserSettings(userId) {
    const row = await getQuery(`SELECT * FROM user_settings WHERE user_id = ?`, [userId]);
    if (!row) {
      return {
        user_id: userId,
        theme: 'system',
        explanation_lang: 'en',
        target_lang: 'ta',
        learning_level: 'beginner',
        sound_enabled: 1
      };
    }
    return row;
  },

  async saveUserSettings(userId, { theme = 'system', explanation_lang = 'en', target_lang = 'ta', learning_level = 'beginner', sound_enabled = 1 }) {
    await runQuery(
      `INSERT INTO user_settings (user_id, theme, explanation_lang, target_lang, learning_level, sound_enabled, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         theme = excluded.theme,
         explanation_lang = excluded.explanation_lang,
         target_lang = excluded.target_lang,
         learning_level = excluded.learning_level,
         sound_enabled = excluded.sound_enabled,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, theme, explanation_lang, target_lang, learning_level, sound_enabled ? 1 : 0]
    );
    return this.getUserSettings(userId);
  },

  // ==========================================
  // MODULE 4: GAMIFICATION & LEARNING STATS
  // ==========================================
  async getUserStats(userId) {
    const row = await getQuery(`SELECT * FROM user_stats WHERE user_id = ?`, [userId]);
    if (!row) {
      return {
        user_id: userId,
        total_xp: 0,
        streak_days: 0,
        last_active_date: null,
        lessons_completed: 0
      };
    }
    return row;
  },

  async getUserProgress(userId, explanationLang, targetLang, level) {
    // Preserve completed lessons even if explanation language is switched
    return allQuery(
      `SELECT * FROM user_learning_progress 
       WHERE user_id = ? AND target_lang = ? AND learning_level = ?
       ORDER BY completed_at ASC`,
      [userId, targetLang, level]
    );
  },

  async getAllUserCompletedLessons(userId) {
    return allQuery(
      `SELECT * FROM user_learning_progress WHERE user_id = ? ORDER BY completed_at DESC`,
      [userId]
    );
  },

  async getCompletedLesson(userId, explanationLang, targetLang, level, unitId, lessonId) {
    // Check for existing completion matching lessonId or legacy/canonical alias in both directions
    const matchLegacy = lessonId.match(/lesson_(\d+)_(\d+)/);
    const matchCanonical = lessonId.match(/^l_[bia]_u(\d+)_(\d+)$/);
    const altId = matchLegacy
      ? `l_${level.toLowerCase()[0]}_u${matchLegacy[1]}_${matchLegacy[2]}`
      : (matchCanonical ? `lesson_${matchCanonical[1]}_${matchCanonical[2]}` : lessonId);
    return getQuery(
      `SELECT * FROM user_learning_progress 
       WHERE user_id = ? AND target_lang = ? AND learning_level = ? AND unit_id = ? 
         AND (lesson_id = ? OR lesson_id = ?)`,
      [userId, targetLang, level, unitId, lessonId, altId]
    );
  },

  async recordLessonCompletion({ userId, explanationLang, targetLang, level, unitId, lessonId, score, totalQuestions, xpEarned }) {
    const existing = await this.getCompletedLesson(userId, explanationLang, targetLang, level, unitId, lessonId);
    const isFirstTime = !existing;

    // Award XP only when conditions are satisfied (score > 0)
    // Repeat attempts grant only small practice bonus (max 5 XP) to prevent duplicate reward abuse
    let actualXpGranted = 0;
    if (score > 0) {
      actualXpGranted = isFirstTime ? xpEarned : Math.min(5, Math.floor(xpEarned / 3));
    }

    // Upsert into user_learning_progress
    await runQuery(
      `INSERT INTO user_learning_progress (user_id, explanation_lang, target_lang, learning_level, unit_id, lesson_id, completed, score, total_questions, xp_earned, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, explanation_lang, target_lang, learning_level, unit_id, lesson_id) DO UPDATE SET
         score = MAX(user_learning_progress.score, excluded.score),
         completed_at = CURRENT_TIMESTAMP`,
      [userId, explanationLang, targetLang, level, unitId, lessonId, score, totalQuestions, actualXpGranted]
    );

    // Update user stats & streak calculation
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const stats = await this.getUserStats(userId);

    let newStreak = stats.streak_days || 0;
    if (!stats.last_active_date) {
      newStreak = 1;
    } else {
      const lastDate = stats.last_active_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === today) {
        // Already active today, streak remains unchanged
      } else if (lastDate === yesterday) {
        newStreak += 1; // Consecutive day!
      } else {
        newStreak = 1; // Streak reset
      }
    }

    const newTotalXp = (stats.total_xp || 0) + actualXpGranted;
    const newLessonsCompleted = (stats.lessons_completed || 0) + (isFirstTime ? 1 : 0);

    await runQuery(
      `INSERT INTO user_stats (user_id, total_xp, streak_days, last_active_date, lessons_completed, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         total_xp = excluded.total_xp,
         streak_days = excluded.streak_days,
         last_active_date = excluded.last_active_date,
         lessons_completed = excluded.lessons_completed,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, newTotalXp, newStreak, today, newLessonsCompleted]
    );

    return {
      isFirstTime,
      actualXpGranted,
      totalXp: newTotalXp,
      streakDays: newStreak,
      lessonsCompleted: newLessonsCompleted
    };
  },

  async recordQuestionAnswer({
    userId,
    targetLang = 'ta',
    unitId = 'u1',
    lessonId = 'practice',
    topic = '',
    questionText = '',
    userAnswer = '',
    correctAnswer = '',
    isCorrect = false,
    explanation = '',
    exerciseType = 'multiple_choice',
    options = null
  }) {
    if (!userId || !questionText) return null;
    const cleanQ = questionText.trim();
    const cleanUserAns = (userAnswer || '').toString().trim();
    const cleanCorrectAns = (correctAnswer || '').toString().trim();
    const optionsStr = options ? (typeof options === 'string' ? options : JSON.stringify(options)) : null;

    // Check if an existing mistake record exists for this question & user
    const existing = await getQuery(
      `SELECT * FROM user_mistakes WHERE user_id = ? AND target_lang = ? AND TRIM(question_text) = ?`,
      [userId, targetLang, cleanQ]
    );

    if (existing) {
      const newAttempts = (existing.attempts || 1) + 1;
      const newCorrectAttempts = (existing.correct_attempts || 0) + (isCorrect ? 1 : 0);
      const isResolved = isCorrect ? 1 : 0;
      const lastResult = isCorrect ? 'correct' : 'incorrect';
      const resolvedTopic = topic || existing.topic || unitId || 'General Practice';

      await runQuery(
        `UPDATE user_mistakes 
         SET attempts = ?,
             correct_attempts = ?,
             user_answer = ?,
             is_resolved = ?,
             last_result = ?,
             last_attempt_at = CURRENT_TIMESTAMP,
             topic = COALESCE(?, topic),
             options_json = COALESCE(?, options_json)
         WHERE id = ?`,
        [newAttempts, newCorrectAttempts, cleanUserAns, isResolved, lastResult, resolvedTopic, optionsStr, existing.id]
      );

      return {
        id: existing.id,
        attempts: newAttempts,
        correctAttempts: newCorrectAttempts,
        isResolved: isResolved === 1,
        lastResult
      };
    } else {
      // Only record in user_mistakes if it was answered incorrectly
      if (!isCorrect) {
        const resolvedTopic = topic || unitId || 'General Practice';
        const res = await runQuery(
          `INSERT INTO user_mistakes (
             user_id, target_lang, unit_id, lesson_id, topic, question_text, 
             user_answer, correct_answer, explanation, exercise_type, options_json, 
             attempts, correct_attempts, is_resolved, last_result, last_attempt_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 'incorrect', CURRENT_TIMESTAMP)`,
          [userId, targetLang, unitId, lessonId, resolvedTopic, cleanQ, cleanUserAns, cleanCorrectAns, explanation, exerciseType, optionsStr]
        );
        return {
          id: res.id,
          attempts: 1,
          correctAttempts: 0,
          isResolved: false,
          lastResult: 'incorrect'
        };
      }
      return null;
    }
  },

  async recordMistake({ userId, targetLang, unitId, lessonId, questionText, userAnswer, correctAnswer, explanation = '', topic = '', exerciseType = 'multiple_choice', options = null }) {
    return this.recordQuestionAnswer({
      userId,
      targetLang,
      unitId,
      lessonId,
      topic,
      questionText,
      userAnswer,
      correctAnswer,
      isCorrect: false,
      explanation,
      exerciseType,
      options
    });
  },

  async resolveMistake(userId, mistakeId, isCorrect, newAnswer = '') {
    const existing = await getQuery(
      `SELECT * FROM user_mistakes WHERE id = ? AND user_id = ?`,
      [mistakeId, userId]
    );
    if (!existing) return null;

    const newAttempts = (existing.attempts || 1) + 1;
    const newCorrectAttempts = (existing.correct_attempts || 0) + (isCorrect ? 1 : 0);
    const isResolved = isCorrect ? 1 : 0;
    const lastResult = isCorrect ? 'correct' : 'incorrect';

    await runQuery(
      `UPDATE user_mistakes 
       SET attempts = ?,
           correct_attempts = ?,
           user_answer = COALESCE(NULLIF(?, ''), user_answer),
           is_resolved = ?,
           last_result = ?,
           last_attempt_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newAttempts, newCorrectAttempts, (newAnswer || '').trim(), isResolved, lastResult, mistakeId]
    );

    return {
      id: mistakeId,
      attempts: newAttempts,
      correctAttempts: newCorrectAttempts,
      isResolved: isResolved === 1,
      lastResult
    };
  },

  async getUserMistakes(userId, optionsOrLimit = 50) {
    let limit = 50;
    let status = 'all';
    let topic = null;
    let targetLang = null;

    if (typeof optionsOrLimit === 'number') {
      limit = optionsOrLimit;
    } else if (typeof optionsOrLimit === 'object' && optionsOrLimit !== null) {
      if (optionsOrLimit.limit) limit = optionsOrLimit.limit;
      if (optionsOrLimit.status) status = optionsOrLimit.status;
      if (optionsOrLimit.topic) topic = optionsOrLimit.topic;
      if (optionsOrLimit.targetLang) targetLang = optionsOrLimit.targetLang;
    }

    let sql = `SELECT * FROM user_mistakes WHERE user_id = ?`;
    const params = [userId];

    if (status === 'unresolved' || status === 'unmastered') {
      sql += ` AND (is_resolved = 0 OR is_resolved IS NULL)`;
    } else if (status === 'resolved' || status === 'mastered') {
      sql += ` AND is_resolved = 1`;
    }

    if (topic && topic !== 'all') {
      sql += ` AND (topic = ? OR unit_id = ?)`;
      params.push(topic, topic);
    }

    if (targetLang && targetLang !== 'all') {
      sql += ` AND target_lang = ?`;
      params.push(targetLang);
    }

    sql += ` ORDER BY is_resolved ASC, last_attempt_at DESC LIMIT ?`;
    params.push(limit);

    return allQuery(sql, params);
  },

  async recordPracticeSession({
    userId,
    practiceType = 'topic_practice',
    topic = 'General Practice',
    targetLang = 'ta',
    explanationLang = 'en',
    level = 'beginner',
    totalQuestions = 5,
    correctCount = 5,
    scorePercentage = 100
  }) {
    // Award modest XP for completing practice (5 XP if score > 0)
    // Avoid exploit by limiting practice XP to max 5 XP per session
    const practiceXp = scorePercentage >= 60 ? 5 : 0;

    const res = await runQuery(
      `INSERT INTO user_practice_sessions (
         user_id, practice_type, topic, target_lang, explanation_lang, 
         learning_level, total_questions, correct_count, score_percentage, xp_earned
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, practiceType, topic, targetLang, explanationLang, level, totalQuestions, correctCount, scorePercentage, practiceXp]
    );

    // Update user stats
    const stats = await this.getUserStats(userId);
    const newTotalXp = (stats.total_xp || 0) + practiceXp;
    await runQuery(
      `UPDATE user_stats SET total_xp = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [newTotalXp, userId]
    );

    return {
      sessionId: res.id,
      xpEarned: practiceXp,
      totalXp: newTotalXp
    };
  },

  async getPracticeHistory(userId, limit = 20) {
    return allQuery(
      `SELECT * FROM user_practice_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit]
    );
  },

  async getTopicWeaknessStats(userId, targetLang = null) {
    let curriculumUnits = [];
    try {
      const curriculum = require('./curriculum');
      curriculumUnits = curriculum.UNITS || [];
    } catch (_) {}

    // 1. Fetch user's mistakes
    const mistakes = await this.getUserMistakes(userId, { limit: 200, targetLang });

    // 2. Fetch user's completed lessons
    const progressSql = targetLang
      ? `SELECT * FROM user_learning_progress WHERE user_id = ? AND target_lang = ?`
      : `SELECT * FROM user_learning_progress WHERE user_id = ?`;
    const progressParams = targetLang ? [userId, targetLang] : [userId];
    const lessonProgress = await allQuery(progressSql, progressParams);

    // 3. Fetch practice sessions
    const sessionSql = targetLang
      ? `SELECT * FROM user_practice_sessions WHERE user_id = ? AND target_lang = ?`
      : `SELECT * FROM user_practice_sessions WHERE user_id = ?`;
    const sessionParams = targetLang ? [userId, targetLang] : [userId];
    const practiceSessions = await allQuery(sessionSql, sessionParams);

    // Build a map of topic stats
    const topicMap = {};

    function getOrCreateTopic(topicName, unitId = null) {
      const key = (topicName || unitId || 'General Practice').trim();
      if (!topicMap[key]) {
        // Find matching curriculum unit for display name and icon
        const matchedUnit = curriculumUnits.find(u => u.id === unitId || u.title?.en === key || u.title === key);
        topicMap[key] = {
          topic: key,
          unitId: unitId || (matchedUnit ? matchedUnit.id : null),
          title: matchedUnit?.title?.en || key,
          icon: matchedUnit?.icon || '🎯',
          totalAttempts: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          unresolvedMistakes: 0,
          masteredCount: 0,
          accuracyPercentage: 0,
          status: 'insufficient_data',
          statusLabel: 'More Practice Needed',
          recommendation: 'Complete more questions to analyze proficiency.'
        };
      }
      return topicMap[key];
    }

    // A. Aggregate from completed lessons
    for (const prog of lessonProgress) {
      const matchedUnit = curriculumUnits.find(u => u.id === prog.unit_id);
      const topicName = matchedUnit ? (matchedUnit.title?.en || matchedUnit.title) : prog.unit_id;
      const t = getOrCreateTopic(topicName, prog.unit_id);
      const totalQ = prog.total_questions || 8;
      const correct = Math.min(totalQ, prog.score || 0);
      const incorrect = Math.max(0, totalQ - correct);
      t.totalAttempts += totalQ;
      t.correctAnswers += correct;
      t.incorrectAnswers += incorrect;
    }

    // B. Aggregate from practice sessions
    for (const sess of practiceSessions) {
      const t = getOrCreateTopic(sess.topic || 'General Practice');
      t.totalAttempts += (sess.total_questions || 0);
      t.correctAnswers += (sess.correct_count || 0);
      t.incorrectAnswers += Math.max(0, (sess.total_questions || 0) - (sess.correct_count || 0));
    }

    // C. Aggregate and adjust from mistake records
    for (const m of mistakes) {
      const matchedUnit = curriculumUnits.find(u => u.id === m.unit_id);
      const topicName = m.topic || (matchedUnit ? (matchedUnit.title?.en || matchedUnit.title) : (m.unit_id || 'General Practice'));
      const t = getOrCreateTopic(topicName, m.unit_id);

      const attempts = Math.max(1, m.attempts || 1);
      const correctAttempts = m.correct_attempts || 0;
      
      // If retried beyond initial lesson attempt, add extra retry attempts
      if (attempts > 1) {
        const extraAttempts = attempts - 1;
        t.totalAttempts += extraAttempts;
        t.correctAnswers += correctAttempts;
        t.incorrectAnswers += Math.max(0, extraAttempts - correctAttempts);
      }

      if (m.is_resolved === 1) {
        t.masteredCount += 1;
      } else {
        t.unresolvedMistakes += 1;
      }
    }

    // D. Compute percentages and categorize weak vs strong topics
    const allTopics = Object.values(topicMap);
    const weakTopics = [];

    for (const t of allTopics) {
      if (t.totalAttempts > 0) {
        t.accuracyPercentage = Math.round((t.correctAnswers / t.totalAttempts) * 100);
      } else {
        t.accuracyPercentage = 0;
      }

      if (t.totalAttempts < 2) {
        t.status = 'insufficient_data';
        t.statusLabel = 'More Practice Needed';
        t.recommendation = 'Answer at least 2 questions in this topic for an accurate assessment.';
      } else if (t.accuracyPercentage < 75 || t.unresolvedMistakes > 0) {
        t.status = 'needs_improvement';
        t.statusLabel = 'Needs Improvement';
        t.recommendation = `Accuracy is ${t.accuracyPercentage}% with ${t.unresolvedMistakes} active mistake(s). Recommended for focused practice!`;
        weakTopics.push(t);
      } else if (t.accuracyPercentage < 90) {
        t.status = 'good_progress';
        t.statusLabel = 'Good Progress';
        t.recommendation = `Consistent performance at ${t.accuracyPercentage}%. A few more practice sessions will achieve complete mastery.`;
      } else {
        t.status = 'mastered';
        t.statusLabel = 'Strong & Mastered';
        t.recommendation = `High accuracy (${t.accuracyPercentage}%) with zero unmastered mistakes. Great job!`;
      }
    }

    // Sort weak topics: lowest accuracy and highest unresolved mistakes first
    weakTopics.sort((a, b) => {
      if (a.accuracyPercentage !== b.accuracyPercentage) {
        return a.accuracyPercentage - b.accuracyPercentage;
      }
      return b.unresolvedMistakes - a.unresolvedMistakes;
    });

    // Sort all topics: needs_improvement first, then by attempts
    allTopics.sort((a, b) => {
      const order = { 'needs_improvement': 0, 'insufficient_data': 1, 'good_progress': 2, 'mastered': 3 };
      return (order[a.status] ?? 4) - (order[b.status] ?? 4);
    });

    return {
      allTopics,
      weakTopics,
      weakTopicsCount: weakTopics.length
    };
  },

  async getPracticeSummary(userId, targetLang = null) {
    const mistakes = await this.getUserMistakes(userId, { limit: 100, targetLang });
    const unresolvedMistakes = mistakes.filter(m => !m.is_resolved || m.is_resolved === 0);
    const resolvedMistakes = mistakes.filter(m => m.is_resolved === 1);

    const sessions = await this.getPracticeHistory(userId, 50);
    const weaknessStats = await this.getTopicWeaknessStats(userId, targetLang);

    // Calculate overall totals
    let totalQuestionsAnswered = 0;
    let totalCorrectAnswers = 0;

    for (const s of sessions) {
      totalQuestionsAnswered += s.total_questions;
      totalCorrectAnswers += s.correct_count;
    }
    for (const m of mistakes) {
      totalQuestionsAnswered += (m.attempts || 1);
      totalCorrectAnswers += (m.correct_attempts || 0);
    }

    const overallAccuracy = totalQuestionsAnswered > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
      : (sessions.length > 0 ? 100 : 0);

    return {
      totalMistakes: mistakes.length,
      unresolvedMistakesCount: unresolvedMistakes.length,
      masteredMistakesCount: resolvedMistakes.length,
      totalSessionsCompleted: sessions.length,
      totalQuestionsAnswered,
      overallAccuracy,
      topicsToImprove: weaknessStats.weakTopics,
      allTopicStats: weaknessStats.allTopics
    };
  },

  async getRecentActivity(userId, limit = 5) {
    return allQuery(
      `SELECT * FROM user_learning_progress 
       WHERE user_id = ? 
       ORDER BY completed_at DESC 
       LIMIT ?`,
      [userId, limit]
    );
  },

  async saveStudioHistory({ userId, topic, mode, language, contentJson }) {
    return runQuery(
      `INSERT INTO user_studio_history (user_id, topic, mode, language, content_json)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, topic, mode, language, typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson)]
    );
  },

  async saveStudioItem(args) {
    return this.saveStudioHistory(args);
  },

  async getStudioHistory(userId, limit = 10) {
    return allQuery(
      `SELECT * FROM user_studio_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit]
    );
  },

  async saveTutorMessage({ userId, topic, language, role, message }) {
    return runQuery(
      `INSERT INTO user_tutor_history (user_id, topic, language, role, message)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, topic || '', language, role, message]
    );
  },

  async getTutorHistory(userId, topic = null, limit = 30) {
    if (topic) {
      return allQuery(
        `SELECT * FROM user_tutor_history WHERE user_id = ? AND topic = ? ORDER BY created_at ASC LIMIT ?`,
        [userId, topic, limit]
      );
    }
    return allQuery(
      `SELECT * FROM user_tutor_history WHERE user_id = ? ORDER BY created_at ASC LIMIT ?`,
      [userId, limit]
    );
  },

  async recordGameSession({ userId, gameId, roundNumber, score, maxScore, moves = 0, accuracy = 100 }) {
    return runQuery(
      `INSERT INTO user_game_sessions (user_id, game_id, round_number, score, max_score, moves, accuracy)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, gameId, roundNumber, score, maxScore, moves, accuracy]
    );
  },

  async getUserGameStats(userId) {
    const totalSessions = await getQuery(
      `SELECT COUNT(*) as count, COALESCE(SUM(score), 0) as totalScore FROM user_game_sessions WHERE user_id = ?`,
      [userId]
    );
    const recentSessions = await allQuery(
      `SELECT * FROM user_game_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );
    const byGame = await allQuery(
      `SELECT game_id, COUNT(*) as sessionsCount, MAX(score) as highScore, MAX(round_number) as maxRound 
       FROM user_game_sessions WHERE user_id = ? GROUP BY game_id`,
      [userId]
    );
    const count = totalSessions ? totalSessions.count : 0;
    const score = totalSessions ? totalSessions.totalScore : 0;
    return {
      totalSessions: count,
      totalGamesPlayed: count,
      totalScore: score,
      recent: recentSessions || [],
      recentSessions: recentSessions || [],
      byGame: byGame || []
    };
  },

  async saveVocabulary({ userId, originalText, inputLang, targetLang, translation, englishMeaning, pronunciation, usageExample, explanation }) {
    if (!userId || !originalText || !translation) return null;
    const cleanOrig = originalText.trim();
    const cleanTrans = translation.trim();
    const cleanInp = (inputLang || 'en').toLowerCase();
    const cleanTgt = (targetLang || 'ta').toLowerCase();

    // Check if already exists for this user and target language
    const existing = await getQuery(
      `SELECT * FROM user_vocabulary WHERE user_id = ? AND original_text = ? AND target_lang = ?`,
      [userId, cleanOrig, cleanTgt]
    );

    if (existing) {
      return { ...existing, isNew: false };
    }

    const res = await runQuery(
      `INSERT INTO user_vocabulary (user_id, original_text, input_lang, target_lang, translation, english_meaning, pronunciation, usage_example, explanation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, cleanOrig, cleanInp, cleanTgt, cleanTrans, englishMeaning || null, pronunciation || null, usageExample || null, explanation || null]
    );

    return {
      id: res.id,
      user_id: userId,
      original_text: cleanOrig,
      input_lang: cleanInp,
      target_lang: cleanTgt,
      translation: cleanTrans,
      english_meaning: englishMeaning,
      pronunciation,
      usage_example: usageExample,
      explanation,
      isNew: true
    };
  },

  async getUserVocabulary(userId, { search = '', targetLang = null } = {}) {
    let sql = `SELECT * FROM user_vocabulary WHERE user_id = ?`;
    const params = [userId];

    if (targetLang) {
      sql += ` AND target_lang = ?`;
      params.push(targetLang.toLowerCase());
    }

    if (search && search.trim()) {
      sql += ` AND (original_text LIKE ? OR translation LIKE ? OR english_meaning LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY created_at DESC`;
    return allQuery(sql, params);
  },

  async deleteVocabulary(userId, id) {
    return runQuery(`DELETE FROM user_vocabulary WHERE id = ? AND user_id = ?`, [id, userId]);
  }
};
