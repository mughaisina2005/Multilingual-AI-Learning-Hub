const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./database');
const curriculum = require('./curriculum');
const aiService = require('./ai_service');
const gamesService = require('./games_service');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'multilingual_ai_learning_hub_default_secret_key';
const ROOT_DIR = process.env.VERCEL ? process.cwd() : __dirname;

// Middleware (with generous body limits for study material & PDF processing)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser(SESSION_SECRET));

// Database readiness middleware: guarantees DB schema & migrations are ready before handling requests
app.use(async (req, res, next) => {
  try {
    await db.initDb();
    next();
  } catch (err) {
    console.error('Database readiness error:', err);
    res.status(500).json({ error: 'DATABASE_INITIALIZATION_ERROR', message: 'Database initialization failed. Please retry.' });
  }
});

// Helper: Format recovery code into readable chunks (e.g. HUB-4829-KDJ8-912A)
function generateFormattedRecoveryCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // High-contrast, no confusing 0/O, 1/I
  let code = 'HUB';
  for (let block = 0; block < 3; block++) {
    code += '-';
    for (let i = 0; i < 4; i++) {
      const idx = crypto.randomInt(0, chars.length);
      code += chars[idx];
    }
  }
  return code;
}

// Clean recovery code for comparison (uppercase, remove non-alphanumeric except keep raw or normalized)
function normalizeRecoveryCode(rawCode) {
  if (!rawCode) return '';
  return rawCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Authentication Middleware for Route Protection
async function requireAuth(req, res, next) {
  const token = req.cookies.hub_session || req.query.token;
  if (!token) {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ authenticated: false, error: 'UNAUTHORIZED', message: 'Authentication required' });
    }
    return res.redirect('/auth.html?redirect=' + encodeURIComponent(req.originalUrl || '/dashboard'));
  }
  if (req.query.token) {
    res.cookie('hub_session', req.query.token, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
  }

  try {
    const sessionUser = await db.getSessionWithUser(token);
    if (!sessionUser) {
      res.clearCookie('hub_session');
      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(401).json({ authenticated: false, error: 'SESSION_EXPIRED', message: 'Session expired. Please log in again.' });
      }
      return res.redirect('/auth.html?redirect=' + encodeURIComponent(req.originalUrl || '/dashboard'));
    }

    req.user = sessionUser;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Authentication verification failed' });
  }
}

// Optional Auth (populates req.user if session cookie exists)
async function optionalAuth(req, res, next) {
  const token = req.cookies.hub_session;
  if (token) {
    try {
      const sessionUser = await db.getSessionWithUser(token);
      if (sessionUser) {
        req.user = sessionUser;
      }
    } catch (err) {
      // Ignore in optional
    }
  }
  next();
}

// ==========================================
// AUTHENTICATION API ROUTES
// ==========================================

// 1. Google OAuth Config Info (Safe to expose client ID, never secrets)
app.get('/api/auth/google-config', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.trim() : '';
  const isConfigured = clientId.length > 5 && !clientId.includes('replace_with');
  res.json({
    isConfigured,
    clientId: isConfigured ? clientId : null
  });
});

// 2. Sign Up (Account Registration)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;

    // Field validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'All fields (Full Name, Username, Email, Password, Confirm Password) are required.'
      });
    }

    const trimmedName = fullName.trim();
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2 || trimmedName.length > 70) {
      return res.status(400).json({
        error: 'INVALID_NAME',
        message: 'Full Name must be between 2 and 70 characters.'
      });
    }

    // Username regex: 3 to 30 chars, alphanumeric or underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return res.status(400).json({
        error: 'INVALID_USERNAME',
        message: 'Username must be 3-30 characters long and contain only letters, numbers, and underscores.'
      });
    }

    // Email regex format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        error: 'INVALID_EMAIL',
        message: 'Please provide a valid email address.'
      });
    }

    // Password requirements
    if (password.length < 8) {
      return res.status(400).json({
        error: 'WEAK_PASSWORD',
        message: 'Password must be at least 8 characters long.'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'PASSWORD_MISMATCH',
        message: 'Password and Confirm Password do not match.'
      });
    }

    // Check for existing username or email
    const existingUser = await db.findUserByUsername(trimmedUsername);
    if (existingUser) {
      return res.status(400).json({
        error: 'USERNAME_TAKEN',
        message: 'This username is already taken. Please choose another username.'
      });
    }

    const existingEmail = await db.findUserByEmail(trimmedEmail);
    if (existingEmail) {
      return res.status(400).json({
        error: 'EMAIL_EXISTS',
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    // Secure password hash (bcrypt with 12 salt rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate random recovery code (NO EMAILS requirement)
    const plainRecoveryCode = generateFormattedRecoveryCode();
    const normalizedCode = normalizeRecoveryCode(plainRecoveryCode);
    const recoveryHash = await bcrypt.hash(normalizedCode, 10);

    // Persist to database
    const userId = await db.createUser({
      fullName: trimmedName,
      username: trimmedUsername,
      email: trimmedEmail,
      passwordHash,
      recoveryHash,
      authProvider: 'local'
    });

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours initial session
    await db.createSession(sessionToken, userId, expiresAt);

    // Set secure HTTP-only cookie
    res.cookie('hub_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      recoveryCode: plainRecoveryCode,
      user: {
        id: userId,
        fullName: trimmedName,
        username: trimmedUsername,
        email: trimmedEmail,
        authProvider: 'local'
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'An unexpected server error occurred during registration. Please try again.'
    });
  }
});

// 3. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'MISSING_CREDENTIALS',
        message: 'Please enter both your Username/Email and Password.'
      });
    }

    const user = await db.findUserByIdentifier(identifier);
    if (!user) {
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid Username/Email or Password.'
      });
    }

    // Check account lockout
    if (user.lockout_until && user.lockout_until > Date.now()) {
      const waitMinutes = Math.ceil((user.lockout_until - Date.now()) / 60000);
      return res.status(429).json({
        error: 'ACCOUNT_LOCKED',
        message: `Account temporarily locked due to too many failed attempts. Please try again in ${waitMinutes} minute(s).`
      });
    }

    // Check if account was created strictly with Google and has no local password
    if (user.auth_provider === 'google' && !user.password_hash) {
      return res.status(400).json({
        error: 'GOOGLE_AUTH_REQUIRED',
        message: 'This account was registered using Google Sign-In. Please click "Sign in with Google" below.'
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      const failure = await db.recordFailedLogin(user.id, user.failed_login_attempts);
      if (failure.isLocked) {
        return res.status(429).json({
          error: 'ACCOUNT_LOCKED',
          message: 'Too many consecutive failed login attempts. Account temporarily locked for 15 minutes.'
        });
      }
      const remaining = Math.max(0, 5 - failure.attempts);
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: `Invalid Username/Email or Password. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before temporary lockout)`
      });
    }

    // Reset failed login attempts on success
    await db.resetFailedLogin(user.id);

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const durationMs = rememberMe ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000);
    const expiresAt = Date.now() + durationMs;

    await db.createSession(sessionToken, user.id, expiresAt);

    res.cookie('hub_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: durationMs
    });

    return res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        authProvider: user.auth_provider
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'An unexpected server error occurred during sign in.'
    });
  }
});

// 4. Google Sign-In Verification
app.post('/api/auth/google', async (req, res) => {
  try {
    const configuredClientId = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.trim() : '';

    if (!configuredClientId || configuredClientId.includes('replace_with')) {
      return res.status(400).json({
        error: 'GOOGLE_NOT_CONFIGURED',
        message: 'Google Sign-In has not yet been configured on this server.',
        setupGuide: {
          step1: 'Go to Google Cloud Console (https://console.cloud.google.com/)',
          step2: 'Navigate to APIs & Services -> Credentials',
          step3: 'Create an OAuth 2.0 Client ID for Web Application',
          step4: 'Add your localhost URL as an Authorized JavaScript Origin',
          step5: 'Add GOOGLE_CLIENT_ID to the .env file and restart the server'
        }
      });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({
        error: 'MISSING_CREDENTIAL',
        message: 'Google authentication credential is required.'
      });
    }

    // Verify token with Google's public tokeninfo endpoint securely
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const googleRes = await fetch(googleVerifyUrl);

    if (!googleRes.ok) {
      const errText = await googleRes.text();
      console.error('Google token verification failed:', errText);
      return res.status(401).json({
        error: 'INVALID_GOOGLE_TOKEN',
        message: 'Google token verification failed or token has expired.'
      });
    }

    const payload = await googleRes.json();

    // Verify audience matches configured Google Client ID
    if (payload.aud !== configuredClientId) {
      return res.status(401).json({
        error: 'AUDIENCE_MISMATCH',
        message: 'Google token audience does not match configured Client ID.'
      });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const fullName = payload.name || payload.given_name || 'Google Learner';

    // Check if user exists by google_id or email
    let user = await db.findUserByGoogleId(googleId);
    if (!user) {
      user = await db.findUserByEmail(email);
    }

    let userId;
    if (user) {
      userId = user.id;
    } else {
      // Create new user account linked to Google
      let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20);
      let candidateUsername = baseUsername;
      let counter = 1;
      while (await db.findUserByUsername(candidateUsername)) {
        candidateUsername = `${baseUsername}_${counter++}`;
      }

      userId = await db.createUser({
        fullName,
        username: candidateUsername,
        email,
        passwordHash: null,
        recoveryHash: null,
        authProvider: 'google',
        googleId
      });
      user = await db.findUserById(userId);
    }

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
    await db.createSession(sessionToken, userId, expiresAt);

    res.cookie('hub_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Google authentication successful!',
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        authProvider: 'google'
      }
    });
  } catch (err) {
    console.error('Google Auth error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Failed to process Google authentication.'
    });
  }
});

// 5. Password Recovery with Recovery Code (NO EMAILS)
app.post('/api/auth/recover', async (req, res) => {
  try {
    const { identifier, recoveryCode, newPassword, confirmPassword } = req.body;

    if (!identifier || !recoveryCode || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'All fields (Username/Email, Recovery Code, New Password, Confirm Password) are required.'
      });
    }

    const user = await db.findUserByIdentifier(identifier);
    if (!user) {
      return res.status(400).json({
        error: 'USER_NOT_FOUND',
        message: 'No account found matching this Username or Email.'
      });
    }

    // Google accounts explanation
    if (user.auth_provider === 'google' && !user.recovery_hash) {
      return res.status(400).json({
        error: 'GOOGLE_ACCOUNT_RECOVERY',
        message: 'This account is managed through Google Sign-In. Password recovery must be done directly through your Google Account.'
      });
    }

    // Check lockout on recovery attempts
    if (user.recovery_lockout_until && user.recovery_lockout_until > Date.now()) {
      const waitMinutes = Math.ceil((user.recovery_lockout_until - Date.now()) / 60000);
      return res.status(429).json({
        error: 'RECOVERY_LOCKED',
        message: `Too many failed recovery attempts. Account recovery temporarily locked. Please try again in ${waitMinutes} minute(s).`
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'WEAK_PASSWORD',
        message: 'New password must be at least 8 characters long.'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: 'PASSWORD_MISMATCH',
        message: 'New Password and Confirm Password do not match.'
      });
    }

    // Verify recovery code
    const normalizedInputCode = normalizeRecoveryCode(recoveryCode);
    const isRecoveryValid = await bcrypt.compare(normalizedInputCode, user.recovery_hash);

    if (!isRecoveryValid) {
      const failure = await db.recordFailedRecovery(user.id, user.failed_recovery_attempts);
      if (failure.isLocked) {
        return res.status(429).json({
          error: 'RECOVERY_LOCKED',
          message: 'Too many invalid recovery code attempts. Account recovery locked for 15 minutes to protect your account.'
        });
      }
      const remaining = Math.max(0, 5 - failure.attempts);
      return res.status(400).json({
        error: 'INVALID_RECOVERY_CODE',
        message: `Invalid recovery code. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`
      });
    }

    // Valid recovery code!
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Generate NEW recovery code so old one cannot be reused
    const newPlainRecoveryCode = generateFormattedRecoveryCode();
    const newNormalizedCode = normalizeRecoveryCode(newPlainRecoveryCode);
    const newRecoveryHash = await bcrypt.hash(newNormalizedCode, 10);

    // Update in database and reset lockout
    await db.updatePasswordAndRecovery(user.id, newPasswordHash, newRecoveryHash);

    // Invalidate old active sessions for security
    await db.deleteUserSessions(user.id);
    res.clearCookie('hub_session');

    return res.json({
      success: true,
      message: 'Your password has been successfully reset! A new recovery code has been generated.',
      newRecoveryCode: newPlainRecoveryCode
    });
  } catch (err) {
    console.error('Recovery error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'An unexpected server error occurred during password recovery.'
    });
  }
});

// 6. Current User Session Check
app.get('/api/auth/me', requireAuth, (req, res) => {
  return res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      fullName: req.user.full_name,
      username: req.user.username,
      email: req.user.email,
      authProvider: req.user.auth_provider,
      createdAt: req.user.created_at
    }
  });
});

// 7. Secure Logout
app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies.hub_session;
  if (token) {
    try {
      await db.deleteSession(token);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
  res.clearCookie('hub_session');
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// ==========================================
// MODULE 3: THEME & USER SETTINGS APIS
// ==========================================

// Get user settings (theme, languages, level)
app.get('/api/user/settings', requireAuth, async (req, res) => {
  try {
    const settings = await db.getUserSettings(req.user.id);
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to retrieve settings' });
  }
});

// Update user settings (persists theme & language preferences)
app.post('/api/user/settings', requireAuth, async (req, res) => {
  try {
    const theme = req.body.theme;
    const expInput = req.body.explanation_lang || req.body.explanationLanguage || req.body.explanation_language;
    const tgtInput = req.body.target_lang || req.body.targetLanguage || req.body.target_language;
    const lvlInput = req.body.learning_level || req.body.learningLevel || req.body.learning_level;
    const soundInput = req.body.sound_enabled !== undefined ? req.body.sound_enabled : req.body.soundEnabled;

    const validThemes = ['light', 'dark', 'system'];
    const chosenTheme = validThemes.includes(theme) ? theme : 'system';

    const validLangs = Object.keys(curriculum.LANGUAGES);
    const chosenExp = validLangs.includes(expInput) ? expInput : 'en';
    const chosenTgt = validLangs.includes(tgtInput) ? tgtInput : 'ta';

    const validLevels = ['beginner', 'intermediate', 'advanced'];
    const chosenLevel = validLevels.includes(lvlInput) ? lvlInput : 'beginner';

    const updated = await db.saveUserSettings(req.user.id, {
      theme: chosenTheme,
      explanation_lang: chosenExp,
      target_lang: chosenTgt,
      learning_level: chosenLevel,
      sound_enabled: soundInput !== false ? 1 : 0
    });

    res.json({ success: true, settings: updated, message: 'Settings saved successfully' });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to update settings' });
  }
});

// ==========================================
// MODULE 4: LANGUAGE LEARNING & STATS APIS
// ==========================================

// 1. Get supported languages metadata
app.get('/api/learning/languages', (req, res) => {
  res.json({
    success: true,
    languages: Object.values(curriculum.LANGUAGES)
  });
});

// 2. Get main dashboard summary (stats, current level, continue learning area)
app.get('/api/learning/dashboard-summary', requireAuth, async (req, res) => {
  try {
    const settings = await db.getUserSettings(req.user.id);
    const stats = await db.getUserStats(req.user.id);

    const expLang = curriculum.LANGUAGES[settings.explanation_lang] || curriculum.LANGUAGES.en;
    const tgtLang = curriculum.LANGUAGES[settings.target_lang] || curriculum.LANGUAGES.ta;

    // Completed lessons for active language pair
    const completedList = await db.getUserProgress(
      req.user.id,
      settings.explanation_lang,
      settings.target_lang,
      settings.learning_level
    );

    const completedLessonIds = new Set();
    completedList.forEach(c => {
      completedLessonIds.add(c.lesson_id);
      const mLegacy = c.lesson_id.match(/lesson_(\d+)_(\d+)/);
      if (mLegacy) {
        const uIdx = parseInt(mLegacy[1], 10);
        const lIdx = parseInt(mLegacy[2], 10);
        const u = curriculum.UNITS.find(unit => unit.id === `unit_${uIdx}`);
        if (u && u.lessons[lIdx - 1]) {
          completedLessonIds.add(u.lessons[lIdx - 1].id);
        }
      }
      const mCanon = c.lesson_id.match(/^l_[bia]_u(\d+)_(\d+)$/);
      if (mCanon) {
        completedLessonIds.add(`lesson_${mCanon[1]}_${mCanon[2]}`);
      }
    });

    // Calculate progress through units
    let totalLessonsCount = 0;
    let completedInCurrentPair = 0;
    let nextLessonToContinue = null;

    const activeLevel = settings.learning_level || 'beginner';
    const unitsForCurrentLevel = curriculum.UNITS.filter(u => u.level === activeLevel);

    const unitsWithProgress = unitsForCurrentLevel.map(unit => {
      const lessons = unit.lessons.map(lesson => {
        totalLessonsCount++;
        const isDone = completedLessonIds.has(lesson.id);
        if (isDone) completedInCurrentPair++;
        else if (!nextLessonToContinue) {
          nextLessonToContinue = {
            unitId: unit.id,
            unitTitle: unit.title[settings.explanation_lang] || unit.title.en,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            xp: lesson.xp
          };
        }
        return {
          ...lesson,
          completed: isDone
        };
      });

      const unitCompletedCount = lessons.filter(l => l.completed).length;
      return {
        id: unit.id,
        level: unit.level,
        title: unit.title[settings.explanation_lang] || unit.title.en,
        description: unit.description[settings.explanation_lang] || unit.description.en,
        icon: unit.icon,
        totalLessons: lessons.length,
        completedLessons: unitCompletedCount,
        progressPercent: Math.round((unitCompletedCount / lessons.length) * 100),
        lessons
      };
    });

    // If all lessons completed in level, allow review
    if (!nextLessonToContinue && unitsForCurrentLevel.length > 0) {
      const firstUnit = unitsForCurrentLevel[0];
      const firstLesson = firstUnit.lessons[0];
      nextLessonToContinue = {
        unitId: firstUnit.id,
        unitTitle: firstUnit.title[settings.explanation_lang] || firstUnit.title.en,
        lessonId: firstLesson.id,
        lessonTitle: firstLesson.title,
        xp: firstLesson.xp,
        isReview: true
      };
    }

    // Recent activity list
    const recentActivity = await db.getRecentActivity(req.user.id, 5);

    const isNewLearner = (stats.lessons_completed || 0) === 0;

    res.json({
      success: true,
      user: {
        id: req.user.id,
        fullName: req.user.full_name,
        username: req.user.username
      },
      settings,
      explanationLang: expLang,
      targetLang: tgtLang,
      stats: {
        totalXp: stats.total_xp || 0,
        streakDays: stats.streak_days || 0,
        lessonsCompleted: stats.lessons_completed || 0,
        lastActiveDate: stats.last_active_date
      },
      currentPairProgress: {
        completed: completedInCurrentPair,
        total: totalLessonsCount,
        percent: totalLessonsCount > 0 ? Math.round((completedInCurrentPair / totalLessonsCount) * 100) : 0
      },
      nextLesson: nextLessonToContinue,
      units: unitsWithProgress,
      recentActivity,
      isNewLearner
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to compile dashboard summary' });
  }
});

// 3. Get units and curriculum for current language selection & level
app.get('/api/learning/units', requireAuth, async (req, res) => {
  try {
    const settings = await db.getUserSettings(req.user.id);
    const exp = req.query.exp || settings.explanation_lang || 'en';
    const tgt = req.query.tgt || settings.target_lang || 'ta';
    const level = req.query.level || settings.learning_level || 'beginner';

    const completedList = await db.getUserProgress(req.user.id, exp, tgt, level);
    const completedLessonIds = new Set();
    completedList.forEach(c => {
      completedLessonIds.add(c.lesson_id);
      const m = c.lesson_id.match(/lesson_(\d+)_(\d+)/);
      if (m) {
        const uIdx = parseInt(m[1], 10);
        const lIdx = parseInt(m[2], 10);
        const u = curriculum.UNITS.find(unit => unit.id === `unit_${uIdx}`);
        if (u && u.lessons[lIdx - 1]) {
          completedLessonIds.add(u.lessons[lIdx - 1].id);
        }
      }
    });

    // Filter units matching chosen level
    const levelUnits = curriculum.UNITS.filter(u => u.level === level);

    const units = levelUnits.map(unit => {
      const lessons = unit.lessons.map((lesson) => {
        const isDone = completedLessonIds.has(lesson.id);
        return {
          id: lesson.id,
          title: lesson.title,
          xp: lesson.xp,
          completed: isDone
        };
      });

      const completedCount = lessons.filter(l => l.completed).length;

      return {
        id: unit.id,
        unitNumber: unit.unitNumber,
        level: unit.level,
        title: unit.title[exp] || unit.title.en,
        description: unit.description[exp] || unit.description.en,
        icon: unit.icon,
        totalLessons: lessons.length,
        completedLessons: completedCount,
        progressPercent: Math.round((completedCount / lessons.length) * 100),
        lessons
      };
    });

    res.json({
      success: true,
      explanationLang: curriculum.LANGUAGES[exp] || curriculum.LANGUAGES.en,
      targetLang: curriculum.LANGUAGES[tgt] || curriculum.LANGUAGES.ta,
      level,
      units
    });
  } catch (err) {
    console.error('Units fetch error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch units' });
  }
});

// 4. Get specific interactive lesson exercises
app.get('/api/learning/lesson/:unitId/:lessonId', requireAuth, async (req, res) => {
  try {
    const { unitId, lessonId } = req.params;
    const settings = await db.getUserSettings(req.user.id);

    const exp = req.query.exp || settings.explanation_lang || 'en';
    const tgt = req.query.tgt || settings.target_lang || 'ta';
    const level = req.query.level || settings.learning_level || 'beginner';

    if (exp === tgt) {
      return res.status(400).json({
        error: 'SAME_LANGUAGE',
        message: 'Explanation language and target language must be different.'
      });
    }

    // Find unit and lesson (with fallback for legacy IDs like lesson_1_1)
    const unit = curriculum.UNITS.find(u => u.id === unitId);
    if (!unit) {
      return res.status(404).json({ error: 'UNIT_NOT_FOUND', message: 'Unit not found' });
    }

    let lesson = unit.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      const match = lessonId.match(/lesson_(\d+)_(\d+)/);
      if (match) {
        const idx = parseInt(match[2], 10) - 1;
        if (idx >= 0 && idx < unit.lessons.length) {
          lesson = unit.lessons[idx];
        }
      }
    }
    if (!lesson) {
      return res.status(404).json({ error: 'LESSON_NOT_FOUND', message: 'Lesson not found' });
    }

    const actualLessonId = lesson.id;
    const exercises = curriculum.generateLessonExercises(exp, tgt, level, unitId, actualLessonId);

    res.json({
      success: true,
      unitId,
      unitTitle: unit.title[exp] || unit.title.en,
      lessonId: actualLessonId,
      lessonTitle: lesson.title,
      xp: lesson.xp,
      level: unit.level,
      explanationLang: curriculum.LANGUAGES[exp],
      targetLang: curriculum.LANGUAGES[tgt],
      totalQuestions: exercises.length,
      exercises
    });
  } catch (err) {
    console.error('Fetch lesson error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to prepare lesson' });
  }
});

// 4b. Evaluate open-ended AI Tutor Conversation practice
app.post('/api/learning/evaluate-conversation', requireAuth, async (req, res) => {
  try {
    const { userSpeech, robotQuestion, targetLang = 'en', explanationLang = 'en', level = 'beginner' } = req.body;

    if (!userSpeech || !userSpeech.trim()) {
      return res.status(400).json({
        success: false,
        error: 'EMPTY_SPEECH',
        message: 'No speech or text response provided.'
      });
    }

    const trimmed = userSpeech.trim();
    const wordCount = trimmed.split(/\s+/).length;

    let isAdequate = false;
    let feedback = '';

    if (level === 'beginner') {
      isAdequate = wordCount >= 1 && trimmed.length >= 2;
      feedback = isAdequate
        ? `Great job! You said "${trimmed}". The robot tutor understood your greeting clearly!`
        : 'Try saying your name or a friendly greeting, such as "Hello, I am fine".';
    } else if (level === 'intermediate') {
      isAdequate = wordCount >= 3;
      feedback = isAdequate
        ? `Well articulated! Your response of ${wordCount} words communicates your thoughts effectively with good grammar.`
        : 'In Intermediate mode, try expanding your answer with more details about your day or activities.';
    } else {
      isAdequate = wordCount >= 5;
      feedback = isAdequate
        ? `Outstanding complexity! Your response demonstrates advanced vocabulary, critical reasoning, and cultural nuance.`
        : 'In Advanced mode, aim to articulate a detailed perspective with supporting arguments.';
    }

    res.json({
      success: true,
      isAdequate,
      rating: isAdequate ? 'Excellent' : 'Needs Practice',
      feedback,
      evaluator: 'Multilingual Hub Smart Linguistic Engine'
    });
  } catch (err) {
    console.error('Evaluate conversation error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to evaluate conversation' });
  }
});

// 5. Complete a lesson and record progress & gamification XP
app.post('/api/learning/lesson-complete', requireAuth, async (req, res) => {
  try {
    const unit_id = req.body.unit_id || req.body.unitId;
    const lesson_id = req.body.lesson_id || req.body.lessonId;
    const explanation_lang = req.body.explanation_lang || req.body.explanationLanguage || req.body.exp || 'en';
    const target_lang = req.body.target_lang || req.body.targetLanguage || req.body.tgt || 'ta';
    const learning_level = req.body.learning_level || req.body.learningLevel || req.body.level || 'beginner';
    const score = req.body.score !== undefined ? req.body.score : 0;
    const total_questions = req.body.total_questions || req.body.totalQuestions || 8;
    const mistakes = req.body.mistakes || [];

    if (!unit_id || !lesson_id) {
      return res.status(400).json({
        error: 'MISSING_DATA',
        message: 'unit_id and lesson_id are required.'
      });
    }

    const unit = curriculum.UNITS.find(u => u.id === unit_id);
    let lesson = unit ? unit.lessons.find(l => l.id === lesson_id) : null;
    let actualLessonId = lesson_id;
    if (!lesson && unit) {
      const match = lesson_id.match(/lesson_(\d+)_(\d+)/);
      if (match) {
        const idx = parseInt(match[2], 10) - 1;
        if (idx >= 0 && idx < unit.lessons.length) {
          lesson = unit.lessons[idx];
          actualLessonId = lesson.id;
        }
      }
    }
    const baseUnitXp = lesson ? lesson.xp : 15;

    // Bonus for 100% accuracy
    const isPerfect = score >= total_questions;
    const finalEarnedXp = req.body.xpEarned || req.body.xp_earned || (isPerfect ? baseUnitXp + 5 : Math.max(5, Math.round(baseUnitXp * (score / total_questions))));

    const result = await db.recordLessonCompletion({
      userId: req.user.id,
      explanationLang: explanation_lang || 'en',
      targetLang: target_lang || 'ta',
      level: learning_level,
      unitId: unit_id,
      lessonId: actualLessonId,
      score: parseInt(score, 10),
      totalQuestions: parseInt(total_questions, 10),
      xpEarned: finalEarnedXp
    });

    // Record mistakes if any occurred
    if (Array.isArray(mistakes) && mistakes.length > 0) {
      const topicTitle = unit ? (unit.title?.en || unit.title) : 'General Practice';
      for (const m of mistakes) {
        await db.recordMistake({
          userId: req.user.id,
          targetLang: target_lang || 'ta',
          unitId: unit_id,
          lessonId: lesson_id,
          topic: m.topic || topicTitle,
          questionText: m.questionText || '',
          userAnswer: m.userAnswer || '',
          correctAnswer: m.correctAnswer || '',
          explanation: m.explanation || '',
          exerciseType: m.exerciseType || 'multiple_choice',
          options: m.options || null
        });
      }
    }

    return res.json({
      success: true,
      message: 'Lesson recorded successfully!',
      earnedXp: result.actualXpGranted,
      totalXp: result.totalXp,
      streakDays: result.streakDays,
      lessonsCompleted: result.lessonsCompleted,
      isFirstTime: result.isFirstTime
    });
  } catch (err) {
    console.error('Lesson completion error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to record lesson completion' });
  }
});

// 6. Get user mistake memory
app.get('/api/learning/mistakes', requireAuth, async (req, res) => {
  try {
    const mistakes = await db.getUserMistakes(req.user.id, 20);
    res.json({ success: true, mistakes });
  } catch (err) {
    console.error('Mistakes fetch error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch mistakes' });
  }
});

// ==========================================
// MODULE 5: AI LEARNING STUDIO & MIND MAPS API
// ==========================================

// 1. Generate Learning Studio topic (Answer Only or Mind Map)
app.post('/api/studio/generate', requireAuth, async (req, res) => {
  try {
    const { topic, mode = 'answer', language = 'en' } = req.body;
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'MISSING_TOPIC', message: 'Please provide a topic to learn.' });
    }

    const cleanMode = (mode === 'mindmap') ? 'mindmap' : 'answer';
    const lang = aiService.validateLang(language);

    const result = await aiService.generateStudioTopic({
      topic: topic.trim(),
      mode: cleanMode,
      language: lang
    });

    // Save to user history without losing past data
    try {
      await db.saveStudioHistory({
        userId: req.user.id,
        topic: topic.trim(),
        mode: cleanMode,
        language: lang,
        contentJson: result
      });
    } catch (saveErr) {
      console.warn('Non-fatal: could not log studio history:', saveErr.message);
    }

    res.json(result);
  } catch (err) {
    console.error('Studio generation error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to generate study content. Please try again.' });
  }
});

// 2. NotebookLM-Style Study Material Helper (PDF/Text document processing with citations)
app.post('/api/studio/document-help', requireAuth, async (req, res) => {
  try {
    const { documentText, fileName, action = 'summarize', question = '', language = 'en' } = req.body;
    const lang = aiService.validateLang(language);

    const result = await aiService.processDocumentStudy({
      documentText,
      fileName,
      action,
      question,
      language: lang
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error('Document study error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Document analysis failed.' });
  }
});

// 2b. PDF Extraction Route (Clean text extraction using pdf-parse)
app.post('/api/studio/extract-pdf', requireAuth, async (req, res) => {
  try {
    const { pdfBase64, fileName } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({ success: false, error: 'NO_DATA', message: 'No PDF data received' });
    }

    const cleanBase64 = pdfBase64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const result = await aiService.extractPdfText(buffer, fileName || 'Uploaded Document');

    if (!result || !result.text || result.text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'EXTRACTION_EMPTY',
        message: 'Could not extract readable text from this PDF. It may be scanned or image-only.'
      });
    }

    res.json({
      success: true,
      fileName: fileName || 'Uploaded Document',
      text: result.text,
      pages: result.pages,
      wordCount: result.text.split(/\s+/).length
    });
  } catch (err) {
    console.error('PDF extraction route error:', err);
    res.status(500).json({ success: false, error: 'EXTRACTION_FAILED', message: 'Failed to extract text from PDF: ' + err.message });
  }
});

// 2c. Mind Map Interactive Node Explanation Route
app.post('/api/studio/node-explain', requireAuth, async (req, res) => {
  try {
    const { centralTopic, branchTitle, nodeTitle, nodeType, language = 'en' } = req.body;
    const lang = aiService.validateLang(language);

    const explanation = await aiService.explainMindmapNode({
      centralTopic,
      branchTitle,
      nodeTitle,
      nodeType,
      language: lang
    });

    res.json(explanation);
  } catch (err) {
    console.error('Mind map node explain error:', err);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: 'Failed to explain node.' });
  }
});

// 3. Get Studio History
app.get('/api/studio/history', requireAuth, async (req, res) => {
  try {
    const history = await db.getStudioHistory(req.user.id, 10);
    res.json({ success: true, history });
  } catch (err) {
    console.error('Studio history fetch error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch studio history.' });
  }
});

// ==========================================
// MODULE 6: AI TUTOR & VOICE ASSISTANT API
// ==========================================

// 1. AI Tutor Multi-turn Conversational Chat
app.post('/api/tutor/chat', requireAuth, async (req, res) => {
  try {
    const { message, language = 'en', conversationHistory = [], topicContext = '' } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'MISSING_MESSAGE', message: 'Message content cannot be empty.' });
    }

    const lang = aiService.validateLang(language);
    const tutorResult = await aiService.tutorChat({
      message: message.trim(),
      language: lang,
      conversationHistory,
      topicContext
    });

    // Save to user tutor message history
    try {
      await db.saveTutorMessage({
        userId: req.user.id,
        topic: topicContext,
        language: lang,
        role: 'user',
        message: message.trim()
      });
      await db.saveTutorMessage({
        userId: req.user.id,
        topic: topicContext,
        language: lang,
        role: 'assistant',
        message: tutorResult.reply
      });
    } catch (saveErr) {
      console.warn('Non-fatal: could not log tutor message:', saveErr.message);
    }

    res.json(tutorResult);
  } catch (err) {
    console.error('Tutor chat error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'AI Tutor service encountered an error. Please try again.' });
  }
});

// 2. Get Tutor conversation history
app.get('/api/tutor/history', requireAuth, async (req, res) => {
  try {
    const topic = req.query.topic || null;
    const history = await db.getTutorHistory(req.user.id, topic, 30);
    res.json({ success: true, history });
  } catch (err) {
    console.error('Tutor history fetch error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch tutor conversation history.' });
  }
});

// ==========================================
// MODULE 7: PRACTICE & MISTAKE MEMORY API
// ==========================================

// 1. Get Practice Summary & Weak Topics (Grounded in real attempt data)
app.get('/api/practice/summary', requireAuth, async (req, res) => {
  try {
    const targetLang = req.query.targetLang || req.query.tgt || null;
    const summary = await db.getPracticeSummary(req.user.id, targetLang);
    res.json({ success: true, ...summary });
  } catch (err) {
    console.error('Practice summary error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch practice summary' });
  }
});

// 2. Get User Mistakes with filtering (all, unresolved, resolved)
app.get('/api/practice/mistakes', requireAuth, async (req, res) => {
  try {
    const status = req.query.status || 'all';
    const topic = req.query.topic || null;
    const targetLang = req.query.targetLang || req.query.tgt || null;
    const limit = parseInt(req.query.limit, 10) || 50;

    const mistakes = await db.getUserMistakes(req.user.id, { limit, status, topic, targetLang });
    res.json({ success: true, count: mistakes.length, mistakes });
  } catch (err) {
    console.error('Practice mistakes fetch error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch mistakes' });
  }
});

// 3. Get Topics to Improve (Computed weak areas from actual user records)
app.get('/api/practice/topics-to-improve', requireAuth, async (req, res) => {
  try {
    const targetLang = req.query.targetLang || req.query.tgt || null;
    const stats = await db.getTopicWeaknessStats(req.user.id, targetLang);
    res.json({ success: true, ...stats });
  } catch (err) {
    console.error('Topics to improve error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to calculate weak topics' });
  }
});

// 3b. AI Search & Learn (Module 7: Select Topic Expansion)
app.post('/api/practice/search-learn', requireAuth, async (req, res) => {
  try {
    const { text, inputLang = 'en', targetLang = 'ta' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'EMPTY_TEXT', message: 'Please enter a sentence, phrase, or topic to search.' });
    }

    const result = await aiService.searchAndLearn({
      text: text.trim(),
      inputLang,
      targetLang
    });

    // Check if text matches any curriculum unit
    const lower = text.trim().toLowerCase();
    const matchedUnit = curriculum.UNITS.find(u => {
      const en = (u.title?.en || '').toLowerCase();
      const ta = (u.title?.ta || '').toLowerCase();
      const hi = (u.title?.hi || '').toLowerCase();
      const te = (u.title?.te || '').toLowerCase();
      return en.includes(lower) || lower.includes(en) || ta.includes(lower) || hi.includes(lower) || te.includes(lower);
    });

    if (matchedUnit) {
      result.curriculumUnit = {
        id: matchedUnit.id,
        title: matchedUnit.title?.en || matchedUnit.title,
        icon: matchedUnit.icon
      };
    }

    // Ensure both targetTranslation and translation are available for client compatibility
    result.targetTranslation = result.translation;
    res.json({
      success: true,
      result,
      ...result
    });
  } catch (err) {
    console.error('search-learn error:', err);
    res.status(500).json({ error: 'TRANSLATION_ERROR', message: err.message || 'Failed to search and generate learning breakdown' });
  }
});

// 3c. Get User's Saved Vocabulary
app.get('/api/vocabulary', requireAuth, async (req, res) => {
  try {
    const { search = '', targetLang = null, target_lang = null } = req.query;
    const tgt = targetLang || target_lang;
    const items = await db.getUserVocabulary(req.user.id, { search, targetLang: tgt });
    res.json({ success: true, count: items.length, vocabulary: items });
  } catch (err) {
    console.error('Get vocabulary error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch saved vocabulary' });
  }
});

// 3d. Save Expression to User Vocabulary
app.post('/api/vocabulary', requireAuth, async (req, res) => {
  try {
    const {
      originalText,
      original_text,
      inputLang,
      input_lang,
      targetLang,
      target_lang,
      translation,
      target_translation,
      englishMeaning,
      english_meaning,
      pronunciation,
      usageExample,
      usage_example,
      explanation
    } = req.body;

    const orig = originalText || original_text;
    const trans = translation || target_translation;
    const inLang = inputLang || input_lang || 'en';
    const tgtLang = targetLang || target_lang || 'ta';
    const enMeaning = englishMeaning || english_meaning || '';
    const pron = pronunciation || '';
    const usage = usageExample || usage_example || '';
    const expl = explanation || '';

    if (!orig || !trans) {
      return res.status(400).json({ error: 'MISSING_DATA', message: 'Original text and translation are required.' });
    }

    const saved = await db.saveVocabulary({
      userId: req.user.id,
      originalText: orig,
      inputLang: inLang,
      targetLang: tgtLang,
      translation: trans,
      englishMeaning: enMeaning,
      pronunciation: pron,
      usageExample: typeof usage === 'object' ? JSON.stringify(usage) : usage,
      explanation: expl
    });

    res.json({ success: true, saved, message: saved.isNew ? 'Saved to My Vocabulary!' : 'Already in your saved vocabulary.' });
  } catch (err) {
    console.error('Save vocabulary error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to save expression to vocabulary' });
  }
});

// 3e. Delete Saved Vocabulary
app.delete('/api/vocabulary/:id', requireAuth, async (req, res) => {
  try {
    const vocabId = parseInt(req.params.id, 10);
    await db.deleteVocabulary(req.user.id, vocabId);
    res.json({ success: true, message: 'Removed from vocabulary' });
  } catch (err) {
    console.error('Delete vocabulary error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to delete vocabulary item' });
  }
});

// 3e. Custom AI Chat (Practice Zone - Multi-turn conversational companion)
app.post('/api/practice/chat', requireAuth, async (req, res) => {
  try {
    const { message, language = 'en', conversationHistory = [] } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'MISSING_MESSAGE', message: 'Message content cannot be empty.' });
    }

    const result = await aiService.customPracticeChat({
      message: message.trim(),
      language,
      conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : []
    });

    res.json(result);
  } catch (err) {
    console.error('Custom AI Chat error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message || 'Custom AI Chat failed to respond.' });
  }
});

// 4. Generate Practice Session (Personalized adaptive practice)
app.post('/api/practice/generate-session', requireAuth, async (req, res) => {
  try {
    const {
      mode = 'smart', // 'smart', 'mistakes', 'topic', 'weak_topics', 'phrase_practice'
      topic = null,
      unitId = null,
      targetLang = 'ta',
      explanationLang = 'en',
      level = 'beginner',
      count = 5,
      practiceMode = 'learn', // 'learn', 'test'
      questionType = 'mixed', // 'mixed', 'multiple_choice', 'fill_in_the_blanks', 'match_the_meaning', 'sentence_completion'
      phraseData = null
    } = req.body;

    const exp = curriculum.LANGUAGES[explanationLang] || curriculum.LANGUAGES.en;
    const tgt = curriculum.LANGUAGES[targetLang] || curriculum.LANGUAGES.ta;
    const requestedCount = Math.max(1, Math.min(50, parseInt(count, 10) || 5));

    let questions = [];
    let sessionTopic = topic || 'Personalized Practice';
    let sessionNotice = null;

    // A. PHRASE PRACTICE MODE (Practise a searched expression)
    if (mode === 'phrase_practice' && phraseData) {
      sessionTopic = `Practise: "${phraseData.translation || phraseData.originalText}"`;
      questions = curriculum.generatePracticeSessionExercises({
        exp,
        tgt,
        level,
        questionType,
        count: requestedCount,
        phraseData
      });
    }

    // B. MISTAKES REVIEW MODE
    else if (mode === 'mistakes') {
      const userMistakes = await db.getUserMistakes(req.user.id, { limit: 50, status: 'unresolved', targetLang });
      const pool = userMistakes.length > 0 ? userMistakes : await db.getUserMistakes(req.user.id, { limit: 50, targetLang });

      if (pool.length === 0) {
        return res.json({
          success: true,
          mode: 'mistakes',
          noMistakes: true,
          topic: 'Review My Mistakes',
          targetLang: tgt.code,
          explanationLang: exp.code,
          level,
          totalQuestions: 0,
          questions: [],
          message: 'No recorded mistakes found for this language. Excellent work! Complete lessons or practice sessions to automatically build your Mistake Memory.'
        });
      }

      sessionTopic = 'Review My Mistakes';
      const availableCount = pool.length;
      const picked = pool.slice(0, requestedCount);

      if (availableCount < requestedCount) {
        sessionNotice = `Showing all ${availableCount} saved mistakes available for this language.`;
      }

      questions = picked.map((m, idx) => {
        let opts = [];
        if (m.options_json) {
          try {
            opts = typeof m.options_json === 'string' ? JSON.parse(m.options_json) : m.options_json;
          } catch (_) {}
        }
        if (!opts || !Array.isArray(opts) || opts.length < 2) {
          const correctText = m.correct_answer || '';
          const lexiconDistractors = curriculum.LEXICON
            .filter(l => l[tgt.code]?.text && l[tgt.code].text !== correctText)
            .slice(0, 3)
            .map(d => ({ text: d[tgt.code].text, isCorrect: false }));
          opts = [
            { text: correctText, isCorrect: true },
            ...lexiconDistractors
          ].sort(() => 0.5 - Math.random());
        }

        return {
          id: `mistake_q_${m.id}_${idx}`,
          mistakeId: m.id,
          isMistakeReview: true,
          type: m.exercise_type || 'multiple_choice',
          topic: m.topic || 'Review Mistakes',
          unitId: m.unit_id || 'u1',
          instruction: m.question_text || `Select the correct translation:`,
          promptText: m.question_text,
          correctAnswer: m.correct_answer,
          previousWrongAnswer: m.user_answer,
          attempts: m.attempts || 1,
          isResolved: m.is_resolved === 1,
          explanation: m.explanation || `The expected expression is: "${m.correct_answer}".`,
          options: opts,
          audioText: m.correct_answer,
          langCode: tgt.bcp47
        };
      });
    }

    // C. WEAK TOPICS MODE
    else if (mode === 'weak_topics') {
      const weaknessStats = await db.getTopicWeaknessStats(req.user.id, targetLang);
      const weak = (weaknessStats.weakTopics || [])[0];

      if (!weak) {
        return res.json({
          success: true,
          mode: 'weak_topics',
          noWeakTopics: true,
          topic: 'Topics to Improve',
          targetLang: tgt.code,
          explanationLang: exp.code,
          level,
          totalQuestions: 0,
          questions: [],
          message: 'Not enough performance data to identify weak topics yet. Complete more practice questions to analyze proficiency.'
        });
      }

      sessionTopic = weak.title || weak.topic;
      questions = curriculum.generatePracticeSessionExercises({
        exp,
        tgt,
        level,
        unitId: weak.unitId,
        questionType,
        count: requestedCount
      });
    }

    // D. TOPIC PRACTICE MODE (Learner chose a specific topic)
    else if (mode === 'topic') {
      let matchedUnit = null;
      if (unitId) {
        matchedUnit = curriculum.UNITS.find(u => u.id === unitId);
      }
      if (!matchedUnit && topic) {
        matchedUnit = curriculum.UNITS.find(u => u.title?.en === topic || u.title === topic || u.id === topic);
      }
      if (!matchedUnit) matchedUnit = curriculum.UNITS[0];

      sessionTopic = matchedUnit.title?.en || matchedUnit.title;
      questions = curriculum.generatePracticeSessionExercises({
        exp,
        tgt,
        level,
        unitId: matchedUnit.id,
        questionType,
        count: requestedCount
      });
    }

    // E. SMART ADAPTIVE / DEFAULT MODE
    if (questions.length === 0) {
      sessionTopic = 'Adaptive Smart Practice';
      // Pick up to 2 unmastered mistakes if available
      const unresolvedMistakes = await db.getUserMistakes(req.user.id, { limit: 2, status: 'unresolved', targetLang });
      const mistakeQuestions = unresolvedMistakes.map((m, idx) => {
        let opts = [];
        if (m.options_json) {
          try { opts = JSON.parse(m.options_json); } catch (_) {}
        }
        if (!opts || !Array.isArray(opts) || opts.length < 2) {
          const correctText = m.correct_answer || '';
          const distractors = curriculum.LEXICON
            .filter(l => l[tgt.code]?.text && l[tgt.code].text !== correctText)
            .slice(0, 3)
            .map(d => ({ text: d[tgt.code].text, isCorrect: false }));
          opts = [{ text: correctText, isCorrect: true }, ...distractors].sort(() => 0.5 - Math.random());
        }
        return {
          id: `mistake_q_${m.id}_${idx}`,
          mistakeId: m.id,
          isMistakeReview: true,
          type: m.exercise_type || 'multiple_choice',
          topic: m.topic || 'Review Mistakes',
          unitId: m.unit_id || 'u1',
          instruction: m.question_text || `Select the correct translation:`,
          promptText: m.question_text,
          correctAnswer: m.correct_answer,
          previousWrongAnswer: m.user_answer,
          attempts: m.attempts || 1,
          isResolved: m.is_resolved === 1,
          explanation: m.explanation || `The expected expression is: "${m.correct_answer}".`,
          options: opts,
          audioText: m.correct_answer,
          langCode: tgt.bcp47
        };
      });

      // Avoid showing already mastered questions repeatedly
      const masteredMistakes = await db.getUserMistakes(req.user.id, { limit: 50, status: 'mastered', targetLang });
      const masteredTexts = masteredMistakes.map(m => m.correct_answer);

      const remainingNeeded = Math.max(1, requestedCount - mistakeQuestions.length);
      const levelUnits = curriculum.UNITS.filter(u => u.level === level);
      const defaultUnit = levelUnits[0] || curriculum.UNITS[0];

      const curriculumQuestions = curriculum.generatePracticeSessionExercises({
        exp,
        tgt,
        level,
        unitId: defaultUnit.id,
        questionType,
        count: remainingNeeded,
        excludeQuestions: masteredTexts
      });

      questions = [...mistakeQuestions, ...curriculumQuestions].slice(0, requestedCount);
    }

    res.json({
      success: true,
      mode,
      practiceMode,
      questionType,
      topic: sessionTopic,
      targetLang: tgt.code,
      explanationLang: exp.code,
      level,
      totalQuestions: questions.length,
      requestedCount,
      notice: sessionNotice,
      questions
    });
  } catch (err) {
    console.error('Generate practice session error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to generate practice session' });
  }
});

// 5. Submit Practice / Review Answer
app.post('/api/practice/submit-answer', requireAuth, async (req, res) => {
  try {
    const {
      mistakeId = null,
      topic = 'General Practice',
      unitId = 'u1',
      lessonId = 'practice',
      questionText = '',
      userAnswer = '',
      correctAnswer = '',
      explanation = '',
      exerciseType = 'multiple_choice',
      options = null,
      targetLang = 'ta',
      explanationLang = 'en',
      level = 'beginner'
    } = req.body;

    if (!questionText && !mistakeId) {
      return res.status(400).json({ error: 'MISSING_DATA', message: 'Question text or mistakeId is required.' });
    }

    // Require answer for all non-flashcard types
    if (exerciseType !== 'vocabulary_flashcard' && (userAnswer === undefined || userAnswer === null || userAnswer === '')) {
      return res.status(400).json({ error: 'EMPTY_ANSWER', message: 'Please provide an answer before submitting.' });
    }

    function cleanString(str) {
      if (!str) return '';
      return str.toString().trim().toLowerCase().replace(/[.,!?;:()'"-]/g, '').replace(/\s+/g, ' ');
    }

    const normUser = cleanString(userAnswer);
    const normCorrect = cleanString(correctAnswer);

    let isCorrect = false;

    if (exerciseType === 'vocabulary_flashcard') {
      // Flashcard is viewed and understood
      isCorrect = true;
    } else if (exerciseType === 'word_matching' || exerciseType === 'match_the_meaning') {
      isCorrect = (normUser === 'all_matched' || normUser === 'true' || normUser === 'matched');
    } else if (exerciseType === 'sentence_building' || exerciseType === 'sentence_completion') {
      const cleanUserWords = Array.isArray(userAnswer) ? cleanString(userAnswer.join(' ')) : normUser;
      isCorrect = (cleanUserWords === normCorrect || cleanUserWords.replace(/\s+/g, '') === normCorrect.replace(/\s+/g, ''));
    } else if (exerciseType === 'fill_in_the_blanks') {
      isCorrect = (normUser === normCorrect || normCorrect.includes(normUser));
    } else if (exerciseType === 'listen_and_repeat' || exerciseType === 'pronunciation_practice') {
      const cleanU = cleanString(userAnswer).replace(/[^a-z0-9\u0B80-\u0BFF\u0900-\u097F\u0D00-\u0D7F\u0C00-\u0C7F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
      const cleanC = cleanString(correctAnswer).replace(/[^a-z0-9\u0B80-\u0BFF\u0900-\u097F\u0D00-\u0D7F\u0C00-\u0C7F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
      isCorrect = (cleanU === cleanC || cleanC.includes(cleanU) || (cleanU.length >= 2 && cleanC.length >= 2 && (cleanC.startsWith(cleanU) || cleanU.startsWith(cleanC))));
    } else if (exerciseType === 'robot_conversation') {
      const cleanU = (userAnswer || '').toString().trim();
      isCorrect = cleanU.length >= 2;
    } else {
      if (normUser.length > 0 && normCorrect.length > 0) {
        isCorrect = (normUser === normCorrect);
      }
      if (!isCorrect && Array.isArray(userAnswer)) {
        isCorrect = (cleanString(userAnswer.join(' ')) === normCorrect);
      }
    }

    // Build pedagogical feedback
    let feedback = '';
    if (exerciseType === 'vocabulary_flashcard') {
      feedback = `✓ Flashcard completed! Vocabulary term reviewed.`;
    } else if (isCorrect) {
      feedback = `✓ Brilliant! Your answer is completely correct.`;
    } else {
      feedback = `✕ Not quite. The correct answer is: "${correctAnswer}".`;
    }

    let conceptTip = explanation || '';
    if (!conceptTip) {
      if (exerciseType === 'vocabulary_flashcard') {
        conceptTip = `Consistent vocabulary review cements native recall.`;
      } else {
        conceptTip = isCorrect
          ? `Great job remembering "${correctAnswer}". Consistent practice cements vocabulary retention.`
          : `Take note of "${correctAnswer}". Try reviewing the spelling and pronunciation to strengthen your recall.`;
      }
    }

    let mistakeRecord = null;
    if (mistakeId) {
      mistakeRecord = await db.resolveMistake(req.user.id, parseInt(mistakeId, 10), isCorrect, userAnswer);
    } else if (exerciseType !== 'vocabulary_flashcard') {
      mistakeRecord = await db.recordQuestionAnswer({
        userId: req.user.id,
        targetLang,
        unitId,
        lessonId,
        topic,
        questionText,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: conceptTip,
        exerciseType,
        options
      });
    }

    res.json({
      success: true,
      isCorrect,
      feedback,
      explanation: conceptTip,
      correctAnswer,
      userAnswer,
      mistakeRecord
    });
  } catch (err) {
    console.error('Submit practice answer error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to evaluate practice answer' });
  }
});

// 6. Complete Practice Session
app.post('/api/practice/complete-session', requireAuth, async (req, res) => {
  try {
    const {
      practiceType = 'topic_practice',
      topic = 'General Practice',
      targetLang = 'ta',
      explanationLang = 'en',
      level = 'beginner',
      totalQuestions = 5,
      correctCount = 5
    } = req.body;

    const total = parseInt(totalQuestions, 10) || 1;
    const correct = parseInt(correctCount, 10) || 0;
    const scorePercentage = Math.round((correct / total) * 100);

    const result = await db.recordPracticeSession({
      userId: req.user.id,
      practiceType,
      topic,
      targetLang,
      explanationLang,
      level,
      totalQuestions: total,
      correctCount: correct,
      scorePercentage
    });

    res.json({
      success: true,
      earnedXp: result.xpEarned,
      totalXp: result.totalXp,
      scorePercentage,
      totalQuestions: total,
      correctCount: correct
    });
  } catch (err) {
    console.error('Complete practice session error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to record practice session' });
  }
});

// 7. Practice History
app.get('/api/practice/history', requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const history = await db.getPracticeHistory(req.user.id, limit);
    res.json({ success: true, history });
  } catch (err) {
    console.error('Practice history error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch practice history' });
  }
});

// ==========================================
// MODULE 8: LEARNING PROGRESS & INSPECT ANALYTICS API
// ==========================================
app.get('/api/learning/analytics', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await db.getUserSettings(userId);
    const stats = await db.getUserStats(userId);
    const progressList = await db.getAllUserCompletedLessons(userId);
    const practiceHistory = await db.getPracticeHistory(userId, 50);
    const targetLang = settings.target_lang || 'ta';
    const mistakes = await db.getUserMistakes(userId, { limit: 100 });
    const weaknessStats = await db.getTopicWeaknessStats(userId, targetLang);

    // Calculate distinct completed units
    const distinctUnits = new Set(progressList.map(p => p.unit_id));

    // Lesson questions totals
    const totalLessonQuestions = progressList.reduce((sum, p) => sum + (p.total_questions || 8), 0);
    const totalLessonCorrect = progressList.reduce((sum, p) => sum + Math.min(p.total_questions || 8, p.score || 0), 0);

    // Practice totals
    const totalPracticeSessions = practiceHistory.length;
    const totalPracticeQuestions = practiceHistory.reduce((sum, s) => sum + (s.total_questions || 0), 0);
    const totalPracticeCorrect = practiceHistory.reduce((sum, s) => sum + (s.correct_count || 0), 0);

    // Overall combined questions
    const totalQuestionsAttempted = totalLessonQuestions + totalPracticeQuestions;
    const totalCorrectAnswers = totalLessonCorrect + totalPracticeCorrect;
    const totalIncorrectAnswers = Math.max(0, totalQuestionsAttempted - totalCorrectAnswers);
    const accuracyPercentage = totalQuestionsAttempted > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
      : 0;

    // Mistakes stats
    const unresolvedMistakes = mistakes.filter(m => !m.is_resolved || m.is_resolved === 0);
    const masteredMistakes = mistakes.filter(m => m.is_resolved === 1);

    // Dynamic achievements based on actual user accomplishments
    const totalXp = stats.total_xp || 0;
    const streakDays = stats.streak_days || 0;
    const lessonsCompleted = stats.lessons_completed || progressList.length || 0;

    const achievements = [
      {
        id: 'first_step',
        title: 'First Step',
        description: 'Complete your first language lesson',
        icon: '🌱',
        unlocked: lessonsCompleted >= 1,
        progress: `${Math.min(lessonsCompleted, 1)}/1`
      },
      {
        id: 'practice_pioneer',
        title: 'Practice Pioneer',
        description: 'Complete your first interactive practice session',
        icon: '🎯',
        unlocked: totalPracticeSessions >= 1,
        progress: `${Math.min(totalPracticeSessions, 1)}/1`
      },
      {
        id: 'xp_collector',
        title: 'XP Explorer',
        description: 'Earn at least 50 XP across lessons and practice',
        icon: '⚡',
        unlocked: totalXp >= 50,
        progress: `${Math.min(totalXp, 50)}/50 XP`
      },
      {
        id: 'centurion',
        title: 'Centurion Scholar',
        description: 'Amass 100 or more total XP',
        icon: '🏆',
        unlocked: totalXp >= 100,
        progress: `${Math.min(totalXp, 100)}/100 XP`
      },
      {
        id: 'streak_keeper',
        title: 'Streak Keeper',
        description: 'Build a continuous learning streak of 3+ days',
        icon: '🔥',
        unlocked: streakDays >= 3,
        progress: `${Math.min(streakDays, 3)}/3 days`
      },
      {
        id: 'mistake_slayer',
        title: 'Mistake Conqueror',
        description: 'Review and master a previously missed question',
        icon: '🧠',
        unlocked: masteredMistakes.length >= 1,
        progress: `${Math.min(masteredMistakes.length, 1)}/1 mastered`
      },
      {
        id: 'unit_explorer',
        title: 'Curriculum Navigator',
        description: 'Complete lessons across 2 or more distinct units',
        icon: '🗺️',
        unlocked: distinctUnits.size >= 2,
        progress: `${Math.min(distinctUnits.size, 2)}/2 units`
      }
    ];

    const isNewLearner = (totalQuestionsAttempted === 0 && lessonsCompleted === 0);

    res.json({
      success: true,
      user: {
        id: req.user.id,
        fullName: req.user.full_name,
        username: req.user.username
      },
      targetLang,
      explanationLang: settings.explanation_lang || 'en',
      stats: {
        totalXp,
        streakDays,
        lessonsCompleted,
        lastActiveDate: stats.last_active_date,
        distinctUnitsCompleted: distinctUnits.size,
        totalPracticeSessions,
        totalQuestionsAttempted,
        totalCorrectAnswers,
        totalIncorrectAnswers,
        accuracyPercentage,
        totalMistakes: mistakes.length,
        unresolvedMistakesCount: unresolvedMistakes.length,
        masteredMistakesCount: masteredMistakes.length
      },
      achievements,
      recentLessonHistory: progressList.slice(0, 10),
      practiceHistory: practiceHistory.slice(0, 10),
      weakTopics: weaknessStats.weakTopics,
      isNewLearner
    });
  } catch (err) {
    console.error('Learning analytics API error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to compile learning analytics' });
  }
});

// ==========================================
// PROTECTED PAGES & PAGE ROUTING
// ==========================================

// Protected dashboard route
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'dashboard.html'));
});

app.get('/dashboard.html', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'dashboard.html'));
});

// Protected language learning route (Module 4)
app.get('/learn', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'learn.html'));
});

app.get('/learn.html', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'learn.html'));
});

// Protected AI Learning Studio & AI Tutor route (Modules 5 & 6)
app.get('/studio', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'studio.html'));
});

app.get('/studio.html', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'studio.html'));
});

// Protected Practice & Mistake Memory route (Module 7)
app.get('/practice', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'practice.html'));
});

app.get('/practice.html', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'practice.html'));
});

// Protected Learning Analytics route (Module 8)
app.get('/analytics', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'analytics.html'));
});

app.get('/analytics.html', requireAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'analytics.html'));
});

// Brain Break — Brain Games route (Module: Brain Break)
app.get('/brain_break', optionalAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'brain_break.html'));
});

app.get('/brain_break.html', optionalAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'brain_break.html'));
});

app.get('/brain-break', optionalAuth, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'brain_break.html'));
});

// ==========================================
// BRAIN BREAK MINI-GAME API ROUTES
// ==========================================

// 1. Get mini-game round content
app.get('/api/games/content', optionalAuth, async (req, res) => {
  try {
    const game = req.query.game || 'memory';
    const round = parseInt(req.query.round, 10) || 1;
    const tgt = req.query.tgt || req.query.targetLang || 'hi';
    const exp = req.query.exp || req.query.explanationLang || 'en';
    let data;
    if (game === 'memory') {
      data = gamesService.getMemoryMatchRound(round, tgt, exp);
    } else if (game === 'word_puzzle' || game === 'word') {
      data = gamesService.getWordPuzzleRound(round, tgt, exp);
    } else if (game === 'quiz') {
      data = gamesService.getQuickQuizRound(round);
    } else if (game === 'pattern' || game === 'logic') {
      data = gamesService.getPatternLogicRound(round);
    } else if (game === 'search' || game === 'word_search') {
      data = gamesService.getWordSearchRound(round, tgt, exp);
    } else if (game === 'sentence' || game === 'sentence_builder') {
      data = gamesService.getSentenceBuilderRound(round, tgt, exp);
    } else if (game === 'listen' || game === 'listen_choose') {
      data = gamesService.getListenChooseRound(round, tgt, exp);
    } else if (game === 'odd' || game === 'odd_one_out') {
      data = gamesService.getOddOneOutRound(round, tgt, exp);
    } else if (game === 'recall' || game === 'quick_recall') {
      data = gamesService.getQuickRecallRound(round, tgt, exp);
    } else if (game === 'riddle' || game === 'riddle_challenge') {
      data = gamesService.getRiddleChallengeRound(round, tgt, exp);
    } else {
      return res.status(400).json({ error: 'INVALID_GAME', message: 'Unknown game type.' });
    }
    return res.json({ success: true, game, ...data });
  } catch (err) {
    console.error('Game content error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to load game round.' });
  }
});

// 2. Save completed mini-game round session
app.post('/api/games/save-session', optionalAuth, async (req, res) => {
  try {
    const { gameId, roundNumber = 1, score = 0, maxScore = 100, moves = 0, accuracy = 100 } = req.body;
    if (!gameId) {
      return res.status(400).json({ error: 'MISSING_DATA', message: 'gameId is required.' });
    }
    let savedToDb = false;
    const userId = req.user && req.user.id ? req.user.id : null;
    if (userId) {
      await db.recordGameSession({
        userId,
        gameId,
        roundNumber: parseInt(roundNumber, 10) || 1,
        score: parseInt(score, 10) || 0,
        maxScore: parseInt(maxScore, 10) || 100,
        moves: parseInt(moves, 10) || 0,
        accuracy: parseInt(accuracy, 10) || 100
      });
      savedToDb = true;
    }
    return res.json({
      success: true,
      savedToDb,
      session: { gameId, roundNumber, score, accuracy, savedAt: new Date().toISOString() }
    });
  } catch (err) {
    console.error('Save game session error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to save game session.' });
  }
});

// 3. Get user game statistics
app.get('/api/games/stats', optionalAuth, async (req, res) => {
  try {
    const userId = req.user && req.user.id ? req.user.id : null;
    if (userId) {
      const stats = await db.getUserGameStats(userId);
      return res.json({ success: true, ...stats });
    }
    return res.json({
      success: true,
      totalSessions: 0,
      totalScore: 0,
      recent: [],
      guest: true
    });
  } catch (err) {
    console.error('Fetch game stats error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to load game stats.' });
  }
});

// ==========================================
// INTRO AUDIO API ROUTE
// ==========================================
// Public endpoint for intro greeting audio (supports Gemini TTS & resilient native audio)
app.get('/api/intro/audio', async (req, res) => {
  try {
    const lang = (req.query.lang || 'en').toString();
    const text = (req.query.text || 'Hello').toString();

    const ttsResult = await aiService.generateTtsAudio({ text, lang });
    res.setHeader('Content-Type', ttsResult.mimeType || 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(ttsResult.buffer);
  } catch (err) {
    console.error('Intro audio generation error:', err);
    return res.status(500).json({ error: 'AUDIO_GENERATION_FAILED', message: err.message });
  }
});

// Serve static directory files
app.use(express.static(ROOT_DIR));

// Default root redirect
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Start Server
async function startServer() {
  try {
    await db.initDb();
    
    // Asynchronously pre-warm the 7 intro greeting audio clips for instant playback
    aiService.prewarmIntroAudio().catch(e => console.warn('Intro audio prewarm notice:', e.message));

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` Multilingual AI Learning Hub Server Started`);
      console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Local URL: http://localhost:${PORT}`);
      console.log(` Intro Page: http://localhost:${PORT}/intro.html`);
      console.log(` Login / Sign Up: http://localhost:${PORT}/auth.html`);
      console.log(` Dashboard: http://localhost:${PORT}/dashboard`);
      console.log(` Database: SQLite file persisted in /data/hub_users.db`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Export Express app for Vercel and serverless platforms
module.exports = app;

// Only start standalone HTTP server when server.js is executed directly (e.g. `node server.js`)
if (require.main === module) {
  startServer();
}
