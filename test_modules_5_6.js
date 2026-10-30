// test_modules_5_6.js - Verification Suite for Module 5 (Studio & Mind Maps) and Module 6 (AI Tutor & Voice Assistant)
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
  console.log('===============================================================');
  console.log('  TESTING MODULE 5 (STUDIO & MIND MAPS) & MODULE 6 (AI TUTOR)  ');
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

  // 1. Create a test learner user
  const testUsername = 'tester_m56_' + Date.now();
  const testPassword = 'Password123!';
  const testEmail = `${testUsername}@example.com`;
  console.log(`1. Creating authenticated test learner: ${testUsername}`);

  const signupRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Studio & Tutor Tester',
    username: testUsername,
    email: testEmail,
    password: testPassword,
    confirmPassword: testPassword,
    preferredLang: 'ta',
    targetLang: 'en',
    learningLevel: 'beginner'
  });

  assert(signupRes.statusCode === 201, `Signup succeeds with status 201 (got ${signupRes.statusCode})`);
  const cookie = parseCookies(signupRes.headers);
  assert(cookie.includes('hub_session='), 'Received valid session cookie');

  // 2. Test Studio HTML Delivery
  console.log('\n2. Testing Delivery of studio.html and UI Assets');
  const pageRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/studio.html',
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  assert(pageRes.statusCode === 200, 'studio.html loads with 200 OK');
  assert(pageRes.data.includes('robot_avatar.svg'), 'Robot avatar SVG reference included in studio.html');
  assert(pageRes.data.includes('btn-copy-msg') && pageRes.data.includes('btn-select-msg'), 'Copy and Select All message action buttons present in HTML');
  assert(pageRes.data.includes('btn-mic-voice'), 'Microphone voice button element present in HTML');

  // 3. Test Module 5: Answer Only Mode (English, Tamil, Hindi)
  console.log('\n3. Testing Module 5: Answer Only Mode');
  
  // 3a. English Python
  const answerEnRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/generate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    topic: 'Python',
    mode: 'answer',
    language: 'en'
  });
  assert(answerEnRes.statusCode === 200, 'Answer Only (EN) status is 200');
  assert(answerEnRes.json && answerEnRes.json.success === true, 'Answer Only (EN) returns success: true');
  assert(answerEnRes.json.mode === 'answer', 'Mode correctly returns "answer"');
  assert(answerEnRes.json.content && answerEnRes.json.content.title.includes('Python'), 'Returns proper Python title');
  assert(Array.isArray(answerEnRes.json.content.keyConcepts) && answerEnRes.json.content.keyConcepts.length > 0, 'Contains structured key concepts');
  assert(answerEnRes.json.content.example && answerEnRes.json.content.example.code, 'Contains practical code example');

  // 3b. Tamil Artificial Intelligence
  const answerTaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/generate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    topic: 'Artificial Intelligence',
    mode: 'answer',
    language: 'ta'
  });
  assert(answerTaRes.statusCode === 200, 'Answer Only (Tamil) status is 200');
  assert(answerTaRes.json && answerTaRes.json.language === 'ta', 'Language correctly set to "ta"');
  assert(answerTaRes.json.content && answerTaRes.json.content.title.includes('செயற்கை நுண்ணறிவு'), 'Returns Tamil AI title');

  // 3c. Hindi Machine Learning
  const answerHiRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/generate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    topic: 'Machine Learning',
    mode: 'answer',
    language: 'hi'
  });
  assert(answerHiRes.statusCode === 200, 'Answer Only (Hindi) status is 200');
  assert(answerHiRes.json && answerHiRes.json.language === 'hi', 'Language correctly set to "hi"');
  assert(answerHiRes.json.content && answerHiRes.json.content.title.includes('मशीन लर्निंग'), 'Returns Hindi ML title');

  // 4. Test Module 5: Mind Map Mode (English, Tamil, Hindi)
  console.log('\n4. Testing Module 5: Visual Mind Map Generation');

  // 4a. English Mind Map
  const mindmapEnRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/generate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    topic: 'Python',
    mode: 'mindmap',
    language: 'en'
  });
  assert(mindmapEnRes.statusCode === 200, 'Mind Map (EN) status is 200');
  assert(mindmapEnRes.json && mindmapEnRes.json.mode === 'mindmap', 'Mode correctly returns "mindmap"');
  assert(mindmapEnRes.json.mindmap && mindmapEnRes.json.mindmap.central === 'Python Programming', 'Mind Map has central node');
  assert(Array.isArray(mindmapEnRes.json.mindmap.branches) && mindmapEnRes.json.mindmap.branches.length >= 4, 'Mind Map has multiple radiating branches');
  assert(Array.isArray(mindmapEnRes.json.mindmap.branches[0].subtopics) && mindmapEnRes.json.mindmap.branches[0].subtopics.length > 0, 'Branches contain subtopics');

  // 4b. Tamil Mind Map
  const mindmapTaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/generate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    topic: 'Artificial Intelligence',
    mode: 'mindmap',
    language: 'ta'
  });
  assert(mindmapTaRes.statusCode === 200, 'Mind Map (Tamil) status is 200');
  assert(mindmapTaRes.json.mindmap && mindmapTaRes.json.mindmap.central.includes('செயற்கை நுண்ணறிவு'), 'Tamil central node');

  // 5. Test Module 5: Study Material Grounded Assistance (NotebookLM-Style)
  console.log('\n5. Testing Module 5: Study Materials & Grounded Q&A');

  const sampleDocText = `
Chapter 1: Neural Networks and Deep Learning
Neural networks are composed of layers of interconnected artificial neurons or nodes.
The input layer accepts the raw features, hidden layers perform linear transformations followed by non-linear activation functions (such as ReLU), and the output layer produces the final prediction.
Backpropagation combined with Stochastic Gradient Descent (SGD) adjusts the network weights to minimize the loss function.

Chapter 2: Convolutional Neural Networks (CNNs)
CNNs excel in computer vision tasks. They utilize convolutional kernels that slide over images to detect spatial hierarchies and local patterns like edges, textures, and object shapes.
Pooling layers downsample the spatial dimensions to achieve translation invariance and reduce computational load.
`;

  // 5a. Summarize action
  const summarizeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/document-help',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    documentText: sampleDocText,
    fileName: 'Deep_Learning_Notes.txt',
    action: 'summarize',
    language: 'en'
  });
  assert(summarizeRes.statusCode === 200, 'Document summarize status is 200');
  assert(summarizeRes.json && summarizeRes.json.success === true, 'Summarize returns success');
  assert(Array.isArray(summarizeRes.json.citations) && summarizeRes.json.citations.length > 0, 'Returns grounded citations');
  assert(Array.isArray(summarizeRes.json.groundedPoints) && summarizeRes.json.groundedPoints.length > 0, 'Returns grounded points');
  assert(typeof summarizeRes.json.generalSynthesis === 'string', 'Returns general synthesis');

  // 5b. Grounded Q&A
  const qaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/document-help',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    documentText: sampleDocText,
    fileName: 'Deep_Learning_Notes.txt',
    action: 'qa',
    question: 'What is the role of pooling layers?',
    language: 'en'
  });
  assert(qaRes.statusCode === 200, 'Grounded Q&A status is 200');
  const hasPooling = (qaRes.json && qaRes.json.groundedPoints && qaRes.json.groundedPoints.some(pt => pt.toLowerCase().includes('pooling') || pt.toLowerCase().includes('downsample')));
  if (!hasPooling) console.log('DEBUG qaRes.json:', JSON.stringify(qaRes.json));
  assert(hasPooling, 'Grounded answer quotes the document regarding pooling');

  // 5c. Empty document error handling
  const emptyDocRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/document-help',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    documentText: '',
    fileName: 'Empty.txt',
    action: 'summarize',
    language: 'en'
  });
  assert(emptyDocRes.statusCode === 400, 'Empty document correctly returns 400 Bad Request');
  assert(emptyDocRes.json.success === false, 'Returns success: false for unreadable document');

  // 6. Test Module 6: AI Tutor Conversational Engine & Voice Assistant
  console.log('\n6. Testing Module 6: AI Tutor Conversational Engine');

  // 6a. English Tutor Chat
  const tutorEnRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/tutor/chat',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    message: 'Hello! Can you show me a Python code example?',
    language: 'en',
    topicContext: 'Python Programming'
  });
  assert(tutorEnRes.statusCode === 200, 'AI Tutor chat (EN) returns 200 OK');
  assert(tutorEnRes.json && tutorEnRes.json.success === true, 'Tutor returns success: true');
  assert(typeof tutorEnRes.json.reply === 'string' && tutorEnRes.json.reply.length > 20, 'Tutor generates informative reply');
  assert(Array.isArray(tutorEnRes.json.followUps) && tutorEnRes.json.followUps.length > 0, 'Tutor returns follow-up question chips');

  // 6b. Tamil Tutor Chat
  const tutorTaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/tutor/chat',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    message: 'வணக்கம்! பைத்தானில் குறியீட்டு உதாரணம் தருக',
    language: 'ta',
    topicContext: 'செயற்கை நுண்ணறிவு'
  });
  assert(tutorTaRes.statusCode === 200, 'AI Tutor chat (Tamil) returns 200 OK');
  assert(tutorTaRes.json && tutorTaRes.json.language === 'ta', 'Tutor chat language is Tamil');
  assert(tutorTaRes.json.reply.includes('உதாரணம்') || tutorTaRes.json.reply.includes('நிச்சயமாக') || tutorTaRes.json.reply.includes('வணக்கம்'), 'Tutor replies in Tamil');

  // 6c. Hindi Tutor Chat
  const tutorHiRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/tutor/chat',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
  }, {
    message: 'नमस्ते! एक आसान कोड उदाहरण दें',
    language: 'hi',
    topicContext: 'मशीन लर्निंग'
  });
  assert(tutorHiRes.statusCode === 200, 'AI Tutor chat (Hindi) returns 200 OK');
  assert(tutorHiRes.json && tutorHiRes.json.language === 'hi', 'Tutor chat language is Hindi');
  assert(tutorHiRes.json.reply.includes('उदाहरण') || tutorHiRes.json.reply.includes('नमस्ते') || tutorHiRes.json.reply.includes('बिल्कुल'), 'Tutor replies in Hindi');

  // 7. Test Studio & Tutor History endpoints
  console.log('\n7. Testing Persistence: Studio and Tutor History Endpoints');
  const studioHistoryRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/studio/history',
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  assert(studioHistoryRes.statusCode === 200, 'Studio history endpoint returns 200 OK');
  assert(Array.isArray(studioHistoryRes.json.history), 'Studio history contains list of past creations');

  const tutorHistoryRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/tutor/history',
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  assert(tutorHistoryRes.statusCode === 200, 'Tutor history endpoint returns 200 OK');
  assert(Array.isArray(tutorHistoryRes.json.history), 'Tutor history contains saved conversation turns');

  // 8. Regression Checks: Existing Language Learning & Dashboard
  console.log('\n8. Regression Checks on Existing Functionality');
  const curriculumRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/units?exp=en&tgt=ta&level=beginner',
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  assert(curriculumRes.statusCode === 200, 'Curriculum units API intact (200 OK)');
  assert(curriculumRes.json.units && curriculumRes.json.units.length > 0, 'Curriculum units preserved');

  const statsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/learning/dashboard-summary',
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  assert(statsRes.statusCode === 200, 'User stats & dashboard summary API intact (200 OK)');
  assert(statsRes.json.stats && statsRes.json.stats.totalXp !== undefined, 'Returns user gamification stats');

  console.log('\n===============================================================');
  console.log(`TEST SUITE COMPLETE: ${failures === 0 ? 'ALL TESTS PASSED' : failures + ' TEST(S) FAILED'}`);
  console.log('===============================================================');
  process.exit(failures > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
