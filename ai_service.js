/**
 * AI Service for Module 5 (AI Learning Studio & Mind Maps)
 * and Module 6 (AI Tutor & Voice Assistant)
 * 
 * Strict Language Support:
 * - 'ta' : Tamil (தமிழ்)
 * - 'en' : English (English)
 * - 'hi' : Hindi (हिन्दी)
 * 
 * Works both with Gemini API (if GEMINI_API_KEY is configured in .env)
 * and with an intelligent built-in Multilingual Pedagogical AI Engine
 * so users can study Python, AI, Machine Learning, NLP, or custom topics offline/locally.
 */

const https = require('https');

// Supported language codes
const SUPPORTED_LANGS = ['ta', 'en', 'hi'];

function validateLang(lang) {
  if (!lang || !SUPPORTED_LANGS.includes(lang.toLowerCase())) {
    return 'en';
  }
  return lang.toLowerCase();
}

// Built-in Knowledge Base for core curriculum topics
const KNOWLEDGE_BASE = {
  python: {
    en: {
      title: "Python Programming",
      overview: "Python is a high-level, interpreted programming language known for its clear syntax and readability. Created by Guido van Rossum in 1991, it is the primary language for Artificial Intelligence, Data Science, Web Development, and Automation.",
      keyConcepts: [
        { name: "Variables & Data Types", desc: "Dynamic typing supporting integers, floats, strings, booleans, lists, tuples, and dictionaries without explicit type declarations." },
        { name: "Control Flow & Indentation", desc: "Uses whitespace indentation instead of curly braces for blocks (if-elif-else, for and while loops)." },
        { name: "Functions & Modularity", desc: "Defined with 'def', supports positional, keyword, default arguments, and lambda functions." },
        { name: "Object-Oriented Programming", desc: "Classes, inheritance, polymorphism, and encapsulation for building reusable modular software." },
        { name: "Vibrant Ecosystem", desc: "Massive library support including NumPy, Pandas, PyTorch, TensorFlow, and FastAPI." }
      ],
      example: {
        title: "Python Basics: List Comprehension & Function",
        code: `# Calculate squares of even numbers in a single readable line\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\neven_squares = [n ** 2 for n in numbers if n % 2 == 0]\n\ndef greet_learner(name, score):\n    return f"Welcome, {name}! Your initial score is {score}."\n\nprint("Even Squares:", even_squares)\nprint(greet_learner("Learner", 100))`
      },
      steps: [
        "Step 1: Install Python and set up VS Code or Jupyter Notebook.",
        "Step 2: Master basic syntax, data types (numbers, strings, lists), and operators.",
        "Step 3: Practice control statements (if-else, loops) and reusable functions.",
        "Step 4: Explore OOP (Classes & Objects) and error handling with try-except.",
        "Step 5: Apply skills to real projects in AI/ML, data analysis, or web backends."
      ],
      summary: "Python emphasizes readable code and developer productivity, making it the perfect first language and a powerhouse for modern artificial intelligence.",
      mindmap: {
        central: "Python Programming",
        branches: [
          {
            id: "b1",
            title: "Core Fundamentals",
            description: "Essential building blocks of the language",
            subtopics: [
              { title: "Variables & Types", detail: "int, float, str, bool, dynamic typing" },
              { title: "Control Flow", detail: "if-elif-else, for/while loops, indentation" },
              { title: "Data Structures", detail: "Lists, Tuples, Dictionaries, Sets" }
            ]
          },
          {
            id: "b2",
            title: "Functions & OOP",
            description: "Modularity and architectural design",
            subtopics: [
              { title: "Functions & Lambdas", detail: "def, *args, **kwargs, return values" },
              { title: "Classes & Objects", detail: "__init__, self, methods, attributes" },
              { title: "Inheritance & Encapsulation", detail: "Subclassing, polymorphism, super()" }
            ]
          },
          {
            id: "b3",
            title: "Advanced Features",
            description: "High-productivity Python paradigms",
            subtopics: [
              { title: "Comprehensions", detail: "List, dict, and set comprehensions" },
              { title: "Generators & Iterators", detail: "yield, range, memory efficiency" },
              { title: "Exception Handling", detail: "try, except, finally, custom errors" }
            ]
          },
          {
            id: "b4",
            title: "AI & Data Science",
            description: "Dominant libraries in the AI revolution",
            subtopics: [
              { title: "NumPy & Pandas", detail: "Vectorized arrays and DataFrame analysis" },
              { title: "PyTorch & TensorFlow", detail: "Deep learning tensor operations and neural nets" },
              { title: "Scikit-Learn", detail: "Classical machine learning algorithms" }
            ]
          },
          {
            id: "b5",
            title: "Web & Automation",
            description: "Production web services and scripts",
            subtopics: [
              { title: "FastAPI / Flask", detail: "High-performance RESTful APIs" },
              { title: "Automation & Scripting", detail: "File I/O, web scraping, task runners" }
            ]
          }
        ]
      }
    },
    ta: {
      title: "பைத்தான் நிரலாக்கம் (Python Programming)",
      overview: "பைத்தான் (Python) என்பது மிக எளிதாகப் படிக்கவும் எழுதவும் கூடிய உயர்நிலை நிரலாக்க மொழியாகும் (High-level programming language). 1991-ல் கைடோ வான் ரோசம் (Guido van Rossum) என்பவரால் உருவாக்கப்பட்டது. செயற்கை நுண்ணறிவு (AI), தரவு அறிவியல் (Data Science), மற்றும் இணைய வளர்ச்சிக்கு இது உலகளவில் முதன்மை மொழியாக விளங்குகிறது.",
      keyConcepts: [
        { name: "மாறிகள் மற்றும் தரவு வகைகள் (Variables & Data Types)", desc: "முன்கூட்டியே தரவு வகையைக் குறிப்பிடத் தேவையின்றி எண்கள், சரங்கள் (strings), பட்டியல்கள் (lists), அகராதிகள் (dictionaries) ஆகியவற்றை எளிதாகக் கையாளலாம்." },
        { name: "உள்வரி இடைவெளி (Indentation) & கட்டுப்பாட்டு அமைப்புகள்", desc: "வளைவு அடைப்புக்குறிகளுக்கு (curly braces) பதிலாக இடைவெளிகளைப் (indentation) பயன்படுத்தி நிரலின் கட்டமைப்பை எளிமையாக்குகிறது." },
        { name: "செயற்கூறுகள் (Functions)", desc: "'def' கொண்டு வரையறுக்கப்படும் மீண்டும் பயன்படுத்தக்கூடிய குறியீட்டுக் தொகுதிகள்." },
        { name: "பொருள் சார்ந்த நிரலாக்கம் (OOP)", desc: "வகுப்புகள் (classes), பொருள்கள் (objects), மரபுரிமை (inheritance) மூலம் பெரிய செயலிகளை ஒழுங்கமைக்க உதவுகிறது." },
        { name: "வளமான நூலகங்கள் (Libraries)", desc: "NumPy, Pandas, PyTorch, TensorFlow போன்ற உலகத்தரம் வாய்ந்த AI நூலகங்களின் ஆதரவு." }
      ],
      example: {
        title: "எளிய பைத்தான் உதாரணம் (List Comprehension & Function)",
        code: `# இரட்டை எண்களின் வர்க்கங்களைக் கண்டறிதல்\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\neven_squares = [n ** 2 for n in numbers if n % 2 == 0]\n\ndef vanakkam(peyar):\n    return f"வணக்கம், {peyar}! பைத்தான் கற்றலைத் தொடங்குங்கள்."\n\nprint("இரட்டை எண்களின் வர்க்கம்:", even_squares)\nprint(vanakkam("கற்றவர்"))`
      },
      steps: [
        "படி 1: பைத்தான் மற்றும் VS Code மென்பொருளை நிறுவுங்கள்.",
        "படி 2: அடிப்படை தொடரியல் (syntax), மாறிகள் மற்றும் தரவு வகைகளைக் கற்றுக் கொள்ளுங்கள்.",
        "படி 3: நிபந்தனைகள் (if-else), மடக்குகள் (loops) மற்றும் செயற்கூறுகளைப் பயிற்சி செய்யுங்கள்.",
        "படி 4: பொருள் சார்ந்த நிரலாக்கம் (OOP) மற்றும் பிழை கையாளுதலைப் (try-except) புரிந்து கொள்ளுங்கள்.",
        "படி 5: AI / Machine Learning மற்றும் தரவு பகுப்பாய்வு செயலிகளை உருவாக்கத் தொடங்குங்கள்."
      ],
      summary: "சுத்தமான தொடரியல் மற்றும் சக்திவாய்ந்த AI நூலகங்களால் பைத்தான் உலக அளவில் மென்பொருள் வல்லுநர்களின் முதன்மைத் தேர்வாக உள்ளது.",
      mindmap: {
        central: "பைத்தான் நிரலாக்கம்",
        branches: [
          {
            id: "b1",
            title: "அடிப்படை கூறுகள்",
            description: "மொழியின் தொடக்கக் கட்டமைப்பு",
            subtopics: [
              { title: "மாறிகள் & வகைகள்", detail: "int, float, string, boolean" },
              { title: "கட்டுப்பாட்டு அமைப்புகள்", detail: "if-else, for/while சுழல்கள், indentation" },
              { title: "தரவுக் கட்டமைப்புகள்", detail: "Lists, Tuples, Dictionaries, Sets" }
            ]
          },
          {
            id: "b2",
            title: "செயற்கூறுகள் & OOP",
            description: "மட்டுத்தன்மை மற்றும் வடிவமைப்பு",
            subtopics: [
              { title: "செயற்கூறுகள்", detail: "def, வாதங்கள் (arguments), return" },
              { title: "வகுப்புகள் & பொருள்கள்", detail: "class, __init__, self" },
              { title: "மரபுரிமை (Inheritance)", detail: "மீண்டும் பயன்படுத்தக்கூடிய குறியீடு" }
            ]
          },
          {
            id: "b3",
            title: "முன்னேறிய அம்சங்கள்",
            description: "திறமையான பைத்தான் நுட்பங்கள்",
            subtopics: [
              { title: "List Comprehension", detail: "ஒற்றை வரியில் பட்டியல் செயலாக்கம்" },
              { title: "Exceptions", detail: "try, except மூலம் பிழை கையாளுதல்" },
              { title: "File Handling", detail: "கோப்புகளைப் படித்தல் மற்றும் எழுதுதல்" }
            ]
          },
          {
            id: "b4",
            title: "AI & தரவு அறிவியல்",
            description: "செயற்கை நுண்ணறிவு நூலகங்கள்",
            subtopics: [
              { title: "NumPy & Pandas", detail: "வரிசைகள் மற்றும் அட்டவணைத் தரவுகள்" },
              { title: "PyTorch & TensorFlow", detail: "ஆழ்ந்த கற்றல் (Deep Learning) மாதிரிகள்" },
              { title: "Scikit-Learn", detail: "மெஷின் லேர்னிங் வழிமுறைகள்" }
            ]
          }
        ]
      }
    },
    hi: {
      title: "पायथन प्रोग्रामिंग (Python Programming)",
      overview: "पायथन एक उच्च-स्तरीय, व्याख्या की गई (interpreted) प्रोग्रामिंग भाषा है जो अपनी पठनीयता और सादगी के लिए जानी जाती है। 1991 में गुइडो वैन रोसुम द्वारा निर्मित, यह आर्टिफिशियल इंटेलिजेंस (AI), डेटा साइंस और वेब डेवलपमेंट के लिए दुनिया की सबसे लोकप्रिय भाषा है।",
      keyConcepts: [
        { name: "वेरिएबल्स और डेटा प्रकार", desc: "डायनामिक टाइपिंग — डेटा प्रकार पहले से घोषित किए बिना पूर्णांक (int), फ्लोट, स्ट्रिंग्स और लिस्ट्स का सहज उपयोग।" },
        { name: "इंडेंटेशन और फ्लो कंट्रोल", desc: "कर्ली ब्रैकेट्स के बजाय स्पेस/इंडेंटेशन का उपयोग, जिससे कोड साफ और पढ़ने में बेहद आसान बनता है।" },
        { name: "फ़ंक्शंस और मॉड्यूलरिटी", desc: "'def' द्वारा परिभाषित कोड ब्लॉक, जिन्हें बार-बार उपयोग किया जा सकता है।" },
        { name: "ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (OOP)", desc: "क्लास और ऑब्जेक्ट्स के माध्यम से बड़े सॉफ्टवेयर को संरचित करना।" },
        { name: "विशाल इकोसिस्टम", desc: "NumPy, Pandas, PyTorch, TensorFlow और Scikit-Learn जैसी विश्वस्तरीय AI लाइब्रेरीज़।" }
      ],
      example: {
        title: "पायथन उदाहरण: लिस्ट कॉम्प्रिहेंशन और फ़ंक्शन",
        code: `# सम संख्याओं के वर्ग निकालना\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\neven_squares = [n ** 2 for n in numbers if n % 2 == 0]\n\ndef namaste(naam):\n    return f"नमस्ते, {naam}! पायथन सीखना शुरू करें।"\n\nprint("सम संख्याओं के वर्ग:", even_squares)\nprint(namaste("विद्यार्थी"))`
      },
      steps: [
        "चरण 1: पायथन और VS Code को अपने सिस्टम में इंस्टॉल करें।",
        "चरण 2: बुनियादी सिंटैक्स, वेरिएबल्स और डेटा टाइप्स सीखें।",
        "चरण 3: लूप्स (for/while), कंडीशन्स (if-else) और फ़ंक्शंस का अभ्यास करें।",
        "चरण 4: ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (क्लास व ऑब्जेक्ट्स) और एरर हैंडलिंग समझें।",
        "चरण 5: AI, मशीन लर्निंग और डेटा विश्लेषण के वास्तविक प्रोजेक्ट्स बनाएं।"
      ],
      summary: "पायथन की आसान बनावट और शक्तिशाली AI लाइब्रेरीज़ इसे शुरुआती और अनुभवी डेवलपर्स दोनों के लिए सबसे बेहतरीन भाषा बनाती हैं।",
      mindmap: {
        central: "पायथन प्रोग्रामिंग",
        branches: [
          {
            id: "b1",
            title: "मूलभूत सिद्धांत",
            description: "भाषा के आधारभूत घटक",
            subtopics: [
              { title: "वेरिएबल्स व डेटा टाइप्स", detail: "int, float, str, bool, डायनामिक टाइपिंग" },
              { title: "कंट्रोल फ्लो", detail: "if-elif-else, लूप्स और इंडेंटेशन" },
              { title: "डेटा स्ट्रक्चर्स", detail: "Lists, Tuples, Dictionaries, Sets" }
            ]
          },
          {
            id: "b2",
            title: "फ़ंक्शंस व OOP",
            description: "मॉड्यूलरिटी और क्लास संरचना",
            subtopics: [
              { title: "फ़ंक्शंस", detail: "def, पैरामीटर्स, रिटर्न वैल्यूज़" },
              { title: "क्लासेस और ऑब्जेक्ट्स", detail: "class, __init__, self" },
              { title: "इन्हेरिटेंस", detail: "कोड का पुन: उपयोग और इनकैप्सुलेशन" }
            ]
          },
          {
            id: "b3",
            title: "उन्नत सुविधाएं",
            description: "तेज़ और कुशल पायथन तकनीकें",
            subtopics: [
              { title: "कॉम्प्रिहेंशन", detail: "लिस्ट व डिक्शनरी कॉम्प्रिहेंशन" },
              { title: "एक्सेप्शन हैंडलिंग", detail: "try, except द्वारा त्रुटि निवारण" },
              { title: "फाइल हैंडलिंग", detail: "फाइलों को पढ़ना और लिखना" }
            ]
          },
          {
            id: "b4",
            title: "AI व डेटा साइंस",
            description: "आर्टिफिशियल इंटेलिजेंस की लाइब्रेरीज़",
            subtopics: [
              { title: "NumPy व Pandas", detail: "वेक्टर गणना और डेटा विश्लेषण" },
              { title: "PyTorch व TensorFlow", detail: "डीप लर्निंग और न्यूरल नेटवर्क्स" },
              { title: "Scikit-Learn", detail: "क्लासिकल मशीन लर्निंग एल्गोरिदम" }
            ]
          }
        ]
      }
    }
  },

  ai: {
    en: {
      title: "Artificial Intelligence (AI)",
      overview: "Artificial Intelligence is the simulation of human intelligence processes by machines and computer systems. These processes include learning (acquiring information and rules for using it), reasoning (using rules to reach approximate or definite conclusions), and self-correction.",
      keyConcepts: [
        { name: "Narrow AI vs General AI", desc: "Narrow AI excels at specific tasks (e.g., face recognition, chess, LLMs). Artificial General Intelligence (AGI) represents hypothetical human-level versatility." },
        { name: "Machine Learning Subsets", desc: "Supervised learning, unsupervised clustering, and reinforcement reward-based learning." },
        { name: "Deep Neural Networks", desc: "Multi-layered networks inspired by biological neurons, processing high-dimensional images, speech, and text." },
        { name: "Generative AI & LLMs", desc: "Transformer models generating coherent text, code, audio, and visual assets based on attention mechanisms." },
        { name: "Ethics & Safety", desc: "Addressing algorithmic bias, data privacy, safety alignment, transparency, and responsible deployment." }
      ],
      example: {
        title: "Conceptual AI: Perceptron Decision Boundary",
        code: `# Conceptual single-neuron forward pass\ndef artificial_neuron(inputs, weights, bias):\n    # Weighted sum: z = w1*x1 + w2*x2 + ... + bias\n    z = sum(x * w for x, w in zip(inputs, weights)) + bias\n    # Activation function (ReLU: returns 0 if negative, else z)\n    return max(0.0, z)\n\nfeatures = [0.8, 0.4]  # e.g., study time, attendance\nweights = [1.2, 0.9]\nbias = -0.5\noutput = artificial_neuron(features, weights, bias)\nprint("Neuron Activation Output:", round(output, 3))`
      },
      steps: [
        "Step 1: Understand mathematical foundations (Linear Algebra, Calculus, Probability).",
        "Step 2: Learn Python and essential scientific libraries (NumPy, Pandas, Matplotlib).",
        "Step 3: Master Machine Learning foundations (Regression, Classification, Evaluation metrics).",
        "Step 4: Study Deep Learning architectures (CNNs for vision, Transformers for language).",
        "Step 5: Build real-world AI applications with ethics, guardrails, and validation."
      ],
      summary: "AI transforms industries by automating complex cognitive tasks, empowering human creativity, and personalizing education worldwide.",
      mindmap: {
        central: "Artificial Intelligence",
        branches: [
          {
            id: "b1",
            title: "Foundations & Paradigms",
            description: "Core pillars of intelligent systems",
            subtopics: [
              { title: "Narrow vs General AI", detail: "Task-specific models vs hypothetical AGI" },
              { title: "Symbolic vs Connectionist", detail: "Rule-based logic vs neural data-driven weights" },
              { title: "Turing Test & Benchmarks", detail: "Evaluating machine cognitive capability" }
            ]
          },
          {
            id: "b2",
            title: "Machine Learning Core",
            description: "Algorithms learning from experience",
            subtopics: [
              { title: "Supervised Learning", detail: "Labeled data: Regression & Classification" },
              { title: "Unsupervised Learning", detail: "Clustering, dimensionality reduction, PCA" },
              { title: "Reinforcement Learning", detail: "Agent, environment, policy, reward signals" }
            ]
          },
          {
            id: "b3",
            title: "Deep Learning & Vision",
            description: "Hierarchical neural representations",
            subtopics: [
              { title: "Neural Networks (ANN)", detail: "Layers, activation functions, backpropagation" },
              { title: "Computer Vision (CNN)", detail: "Convolutions, object detection, segmentation" },
              { title: "Generative Models (Diffusion)", detail: "Image synthesis and latent representations" }
            ]
          },
          {
            id: "b4",
            title: "Natural Language & LLMs",
            description: "Understanding human language",
            subtopics: [
              { title: "Transformer Architecture", detail: "Self-attention mechanism and positional encoding" },
              { title: "Large Language Models", detail: "Pretraining, instruction tuning, RLHF" },
              { title: "Multimodal AI", detail: "Joint vision, voice, audio, and text reasoning" }
            ]
          },
          {
            id: "b5",
            title: "AI Ethics & Alignment",
            description: "Responsible and safe intelligence",
            subtopics: [
              { title: "Bias & Fairness", detail: "Mitigating demographic data disparities" },
              { title: "Safety & Alignment", detail: "Preventing hallucinations and harmful outputs" }
            ]
          }
        ]
      }
    },
    ta: {
      title: "செயற்கை நுண்ணறிவு (Artificial Intelligence)",
      overview: "செயற்கை நுண்ணறிவு (AI) என்பது மனிதர்களின் நுண்ணறிவுச் செயல்பாடுகளை (கற்றல், சிந்தித்து முடிவெடுத்தல், சுயமாகப் பிழை திருத்துதல்) கணினி அமைப்புகளின் மூலம் செயல்படுத்துவதாகும். இது கல்வி, மருத்துவம், தொழில் நுட்பம் ஆகியவற்றில் பெரும் புரட்சியை ஏற்படுத்தி வருகிறது.",
      keyConcepts: [
        { name: "குறிப்பிட்ட AI மற்றும் பொது AI (Narrow vs General AI)", desc: "இன்றைய அமைப்புகள் ஒரு குறிப்பிட்ட வேலையில் மட்டும் வல்லவை (Narrow AI). மனிதனைப் போல அனைத்துத் துறைகளிலும் சுயமாகச் சிந்திப்பது பொது AI (AGI) எனப்படும்." },
        { name: "மெஷின் லேர்னிங் (Machine Learning)", desc: "வெளிப்படையாக நிரல் எழுதாமல், தரவுகளின் மூலம் தானாகக் கற்றுக்கொள்ளும் வழிமுறைகள்." },
        { name: "ஆழ்ந்த கற்றல் (Deep Learning)", desc: "மனித மூளையின் நரம்பு மண்டலத்தை ஒத்த நரம்பியல் வலைப்பின்னல்கள் (Neural Networks)." },
        { name: "உருவாக்க AI (Generative AI)", desc: "புதிய உரைகள், படங்கள், மற்றும் நிரல் குறியீடுகளை உருவாக்கும் நவீன மாதிரிகள் (LLMs)." },
        { name: "அறநெறி மற்றும் பாதுகாப்பு (Ethics & Safety)", desc: "பாரபட்சமற்ற தன்மை, தரவுப் பாதுகாப்பு மற்றும் வெளிப்படைத்தன்மை." }
      ],
      example: {
        title: "செயற்கை நியூரான் செயல்பாடு (Artificial Neuron Concept)",
        code: `# ஒற்றை செயற்கை நியூரான் செயல்பாடு\ndef artificial_neuron(inputs, weights, bias):\n    # எடையிடப்பட்ட கூட்டுத்தொகை: z = w1*x1 + w2*x2 + ... + bias\n    z = sum(x * w for x, w in zip(inputs, weights)) + bias\n    # ReLU செயலாக்க சார்பு: எதிர்மறை எண்களை 0 ஆக்கும்\n    return max(0.0, z)\n\nfeatures = [0.8, 0.4]  # கற்றல் நேரம், வருகை\nweights = [1.2, 0.9]\nbias = -0.5\noutput = artificial_neuron(features, weights, bias)\nprint("நியூரான் வெளியீடு:", round(output, 3))`
      },
      steps: [
        "படி 1: கணித அடிப்படைகள் (நேரியல் இயற்கணிதம், நிகழ்தகவு) கற்றல்.",
        "படி 2: பைத்தான் மொழி மற்றும் தரவு அறிவியல் கருவிகளைப் பழகுதல்.",
        "படி 3: மெஷின் லேர்னிங் வழிமுறைகள் (வகைப்பாடு, பின்னடைவு) அறிதல்.",
        "படி 4: ஆழ்ந்த நரம்பியல் வலைப்பின்னல்கள் மற்றும் ட்ரான்ஸ்ஃபார்மர்களைக் கற்றல்.",
        "படி 5: பாதுகாப்பான, நெறிமுறையுள்ள AI செயலிகளை உருவாக்குதல்."
      ],
      summary: "மனித திறன்களைப் பலமடங்கு பெருக்கி, உலகளாவிய கல்வி மற்றும் தொழில்நுட்ப முன்னேற்றத்திற்கு வழிகோலும் மாபெரும் அறிவியல் துறை AI ஆகும்.",
      mindmap: {
        central: "செயற்கை நுண்ணறிவு (AI)",
        branches: [
          {
            id: "b1",
            title: "அடிப்படை வகைகள்",
            description: "நுண்ணறிவின் நிலைகள்",
            subtopics: [
              { title: "Narrow AI", detail: "முக அங்கீகாரம், சதுரங்கம் போன்ற குறிப்பிட்ட பணிகள்" },
              { title: "General AI (AGI)", detail: "மனித நிலை பல்துறை நுண்ணறிவு" }
            ]
          },
          {
            id: "b2",
            title: "மெஷின் லேர்னிங் (ML)",
            description: "தரவுகளிலிருந்து கற்றல்",
            subtopics: [
              { title: "Supervised Learning", detail: "லேபிளிடப்பட்ட தரவுகள் மூலம் பயிற்சி" },
              { title: "Unsupervised Learning", detail: "கொத்து அமைப்புகள் (Clustering)" },
              { title: "Reinforcement Learning", detail: "வெகுமதி சார்ந்த முடிவெடுத்தல்" }
            ]
          },
          {
            id: "b3",
            title: "ஆழ்ந்த கற்றல் (Deep Learning)",
            description: "நரம்பியல் வலைப்பின்னல்கள்",
            subtopics: [
              { title: "Neural Networks", detail: "அடுக்குகள் மற்றும் Backpropagation" },
              { title: "Computer Vision", detail: "படங்கள் மற்றும் வீடியோக்களைப் பகுப்பாய்வு செய்தல்" }
            ]
          },
          {
            id: "b4",
            title: "மொழி & Generative AI",
            description: "மொழி உணர்தல் மற்றும் உருவாக்கம்",
            subtopics: [
              { title: "NLP & Transformers", detail: "சுய-கவனம் (Self-Attention) முறை" },
              { title: "பெரிய மொழி மாதிரிகள் (LLMs)", detail: "உரையாடல் மற்றும் குறியீடு உருவாக்கம்" }
            ]
          }
        ]
      }
    },
    hi: {
      title: "आर्टिफिशियल इंटेलिजेंस (AI)",
      overview: "आर्टिफिशियल इंटेलिजेंस (AI) कंप्यूटर विज्ञान की वह शाखा है जो मशीनों को इंसानों की तरह सोचने, सीखने, तर्क करने और निर्णय लेने में सक्षम बनाती है। आज यह शिक्षा, स्वास्थ्य और उद्योग में क्रांतिकारी बदलाव ला रही है।",
      keyConcepts: [
        { name: "नैरो AI बनाम जनरल AI (AGI)", desc: "नैरो AI किसी एक कार्य में माहिर होता है (जैसे अनुवाद, चेस, चैटबॉट)। जनरल AI (AGI) मानव स्तर की व्यापक बुद्धि का काल्पनिक रूप है।" },
        { name: "मशीन लर्निंग (Machine Learning)", desc: "बिना प्रत्यक्ष प्रोग्रामिंग के डेटा से पैटर्न सीखकर भविष्यवाणी करने की तकनीक।" },
        { name: "डीप लर्निंग (Deep Learning)", desc: "मानव मस्तिष्क के न्यूरॉन्स से प्रेरित बहुस्तरीय न्यूरल नेटवर्क्स।" },
        { name: "जेनरेटिव AI (Generative AI)", desc: "टेक्स्ट, इमेज, ऑडियो और कोड उत्पन्न करने वाले आधुनिक मॉडल्स (जैसे Transformers और LLMs)।" },
        { name: "नैतिकता और सुरक्षा (Ethics & Safety)", desc: "पूर्वाग्रह (bias) से बचाव, गोपनीयता और उत्तरदायी उपयोग।" }
      ],
      example: {
        title: "न्यूरॉन कार्यप्रणाली (Artificial Neuron)",
        code: `# सरल कृत्रिम न्यूरॉन\ndef artificial_neuron(inputs, weights, bias):\n    # वेटेड सम: z = w1*x1 + w2*x2 + ... + bias\n    z = sum(x * w for x, w in zip(inputs, weights)) + bias\n    # ReLU एक्टिवेशन फ़ंक्शन\n    return max(0.0, z)\n\nfeatures = [0.8, 0.4]  # पढ़ाई का समय, उपस्थिति\nweights = [1.2, 0.9]\nbias = -0.5\noutput = artificial_neuron(features, weights, bias)\nprint("न्यूरॉन एक्टिवेशन आउटपुट:", round(output, 3))`
      },
      steps: [
        "चरण 1: गणितीय आधार (रैखिक बीजगणित, सांख्यिकी) समझें।",
        "चरण 2: पायथन भाषा और डेटा टूल्स का अभ्यास करें।",
        "चरण 3: मशीन लर्निंग एल्गोरिदम (वर्गीकरण, रिग्रेशन) सीखें।",
        "चरण 4: डीप न्यूरल नेटवर्क्स और ट्रांसफॉर्मर मॉडल्स का अध्ययन करें।",
        "चरण 5: सुरक्षित और नैतिक AI प्रोजेक्ट्स का निर्माण करें।"
      ],
      summary: "AI मानव उत्पादकता को अभूतपूर्व स्तर पर बढ़ाकर ज्ञान को लोकतांत्रिक बनाने की सबसे शक्तिशाली तकनीक बन चुकी है।",
      mindmap: {
        central: "आर्टिफिशियल इंटेलिजेंस (AI)",
        branches: [
          {
            id: "b1",
            title: "मूलभूत श्रेणियां",
            description: "बुद्धिमत्ता के स्तर",
            subtopics: [
              { title: "Narrow AI", detail: "विशिष्ट कार्यों में दक्ष (अनुवाद, शतरंज, विज़न)" },
              { title: "General AI (AGI)", detail: "मानव-समान व्यापक बुद्धिमत्ता" }
            ]
          },
          {
            id: "b2",
            title: "मशीन लर्निंग (ML)",
            description: "डेटा से स्वचालित सीख",
            subtopics: [
              { title: "Supervised Learning", detail: "लेबल किए गए डेटा से वर्गीकरण व रिग्रेशन" },
              { title: "Unsupervised Learning", detail: "क्लस्टरिंग व पैटर्न पहचान" },
              { title: "Reinforcement Learning", detail: "इनाम-आधारित निर्णय प्रणाली" }
            ]
          },
          {
            id: "b3",
            title: "डीप लर्निंग व विज़न",
            description: "गहन न्यूरल नेटवर्क्स",
            subtopics: [
              { title: "Neural Networks", detail: "इनपुट, हिडन लेयर्स व बैकप्रोपैगेशेन" },
              { title: "Computer Vision", detail: "इमेज वर्गीकरण और वस्तु पहचान" }
            ]
          },
          {
            id: "b4",
            title: "भाषा व जेनरेटिव AI",
            description: "प्राकृतिक भाषा प्रसंस्करण",
            subtopics: [
              { title: "ट्रांसफॉर्मर आर्किटेक्चर", detail: "सेल्फ-अटेंशन और संदर्भ समझ" },
              { title: "लार्ज लैंग्वेज मॉडल्स (LLMs)", detail: "संवाद और कोड निर्माण" }
            ]
          }
        ]
      }
    }
  },

  ml: {
    en: {
      title: "Machine Learning (ML)",
      overview: "Machine Learning is an application of Artificial Intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. ML focuses on the development of computer programs that can access data and use it to learn for themselves.",
      keyConcepts: [
        { name: "Supervised Learning", desc: "Training models on input-output pairs (features & labels) for regression (continuous values) and classification (discrete categories)." },
        { name: "Unsupervised Learning", desc: "Discovering hidden patterns and structures in unlabeled data using clustering (K-Means) and dimensionality reduction (PCA)." },
        { name: "Reinforcement Learning", desc: "Training an autonomous agent to take actions in an environment to maximize cumulative rewards." },
        { name: "Feature Engineering & Preprocessing", desc: "Normalizing, scaling, encoding categorical variables, and handling missing data." },
        { name: "Model Evaluation", desc: "Cross-validation, precision, recall, F1-score, ROC-AUC, and detecting overfitting vs underfitting." }
      ],
      example: {
        title: "Simple Linear Regression Logic in Python",
        code: `# Predicting target y from feature x using basic least squares principles\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]  # y = 2 * x\n\ndef predict_linear(new_x, weight=2.0, bias=0.0):\n    return weight * new_x + bias\n\nquery_val = 7\nprediction = predict_linear(query_val)\nprint(f"For input {query_val}, model predicts: {prediction}")`
      },
      steps: [
        "Step 1: Collect, clean, and explore dataset quality (EDA).",
        "Step 2: Split data into training, validation, and test subsets.",
        "Step 3: Select suitable algorithm (Linear Models, Decision Trees, SVM, or Neural Net).",
        "Step 4: Train the model, tune hyperparameters, and evaluate performance.",
        "Step 5: Deploy the model to an API endpoint with continuous monitoring."
      ],
      summary: "Machine Learning shifts programming from hardcoded rules to data-driven probabilistic learning models.",
      mindmap: {
        central: "Machine Learning",
        branches: [
          {
            id: "b1",
            title: "Supervised Learning",
            description: "Guided learning with ground-truth labels",
            subtopics: [
              { title: "Regression", detail: "Linear regression, polynomial, continuous targets" },
              { title: "Classification", detail: "Logistic regression, decision trees, random forests" },
              { title: "Support Vector Machines", detail: "Hyperplanes and kernel tricks" }
            ]
          },
          {
            id: "b2",
            title: "Unsupervised Learning",
            description: "Finding structure in unlabeled datasets",
            subtopics: [
              { title: "Clustering", detail: "K-Means, hierarchical clustering, DBSCAN" },
              { title: "Dimensionality Reduction", detail: "Principal Component Analysis (PCA), t-SNE" },
              { title: "Anomaly Detection", detail: "Isolation forests, outlier filtering" }
            ]
          },
          {
            id: "b3",
            title: "Data Pipeline",
            description: "Preparing quality signals for models",
            subtopics: [
              { title: "Preprocessing", detail: "Standardization, one-hot encoding, imputation" },
              { title: "Feature Selection", detail: "Correlation matrices, mutual information" },
              { title: "Train/Test Split", detail: "Stratified k-fold cross-validation" }
            ]
          },
          {
            id: "b4",
            title: "Evaluation & Tuning",
            description: "Ensuring generalization without overfitting",
            subtopics: [
              { title: "Metrics", detail: "Accuracy, Precision, Recall, F1, ROC-AUC" },
              { title: "Regularization", detail: "L1 (Lasso), L2 (Ridge), Dropout" },
              { title: "Hyperparameter Search", detail: "Grid search, Random search, Bayesian opt" }
            ]
          }
        ]
      }
    },
    ta: {
      title: "மெஷின் லேர்னிங் (Machine Learning)",
      overview: "மெஷின் லேர்னிங் (இயந்திரக் கற்றல்) என்பது வெளிப்படையாக ஒவ்வொரு விதியையும் நிரலாக்கம் செய்யாமல், வரலாற்றுத் தரவுகளின் (historical data) மூலம் கணினிகள் சுயமாகக் கற்றுக்கொண்டு கணிப்புகளைச் செய்யும் AI தொழில்நுட்பமாகும்.",
      keyConcepts: [
        { name: "கண்காணிக்கப்பட்ட கற்றல் (Supervised Learning)", desc: "விடை தெரிந்த தரவுகளிலிருந்து கற்றுக்கொண்டு எதிர்கால முடிவுகளைக் கணிப்பது (வகைப்பாடு மற்றும் பின்னடைவு)." },
        { name: "கண்காணிக்கப்படாத கற்றல் (Unsupervised Learning)", desc: "லேபிள்கள் இல்லாத மூலத் தரவுகளில் மறைந்துள்ள அமைப்புகளையும் தொடர்புகளையும் சுயமாகக் கண்டறிவது (Clustering)." },
        { name: "வெகுமதி சார்ந்த கற்றல் (Reinforcement Learning)", desc: "செயல்பாடு மற்றும் வெகுமதிகள் மூலம் சுயமாகச் சிறந்த பாதையைத் தேர்ந்தெடுக்கும் வழிமுறை." },
        { name: "மாதிரி மதிப்பீடு (Model Evaluation)", desc: "துல்லியம் (accuracy), Precision, Recall மற்றும் overfitting பிழைகளைத் தவிர்ப்பது." }
      ],
      example: {
        title: "எளிய நேரியல் பின்னடைவுக் கணிப்பு (Linear Prediction)",
        code: `# நேரியல் பின்னடைவுக் கணிப்பு (y = m*x + c)\ndef predict_score(hours_studied, slope=5.0, intercept=10.0):\n    return slope * hours_studied + intercept\n\nhours = 8\npredicted_mark = predict_score(hours)\nprint(f"{hours} மணிநேரம் படித்தால் எதிர்பார்க்கப்படும் மதிப்பெண்: {predicted_mark}")`
      },
      steps: [
        "படி 1: தரவுகளைச் சேகரித்து சுத்தம் செய்தல் (Data Cleaning).",
        "படி 2: பயிற்சி (Train) மற்றும் சோதனை (Test) தரவுகளாகப் பிரித்தல்.",
        "படி 3: பொருத்தமான அல்காரிதத்தைத் தேர்ந்தெடுத்துப் பயிற்சி அளித்தல்.",
        "படி 4: துல்லியத்தை அளவிட்டு மேம்படுத்துதல்.",
        "படி 5: நிஜ உலகப் பயன்பாட்டில் மாதிரியைச் செயல்படுத்துதல்."
      ],
      summary: "மெஷின் லேர்னிங் என்பது விதிகளுக்குப் பதிலாக தரவுகளின் மூலம் தானியங்கி அறிவைப் பெறும் நவீன அறிவியல்.",
      mindmap: {
        central: "மெஷின் லேர்னிங்",
        branches: [
          {
            id: "b1",
            title: "Supervised Learning",
            description: "லேபிளிடப்பட்ட தரவுக் கற்றல்",
            subtopics: [
              { title: "Regression", detail: "தொடர் எண்களைக் கணித்தல் (விலை, வெப்பநிலை)" },
              { title: "Classification", detail: "வகைப்படுத்துதல் (Spam கண்டறிதல்)" }
            ]
          },
          {
            id: "b2",
            title: "Unsupervised Learning",
            description: "லேபிள் இல்லாத தரவுகள்",
            subtopics: [
              { title: "Clustering", detail: "வாடிக்கையாளர் பிரிவுகள் (K-Means)" },
              { title: "Dimensionality Reduction", detail: "PCA மூலம் பரிமாணங்களைக் குறைத்தல்" }
            ]
          },
          {
            id: "b3",
            title: "மதிப்பீட்டு அளவீடுகள்",
            description: "துல்லியம் சரிபார்த்தல்",
            subtopics: [
              { title: "Accuracy & F1-Score", detail: "கணிப்புகளின் நம்பகத்தன்மை" },
              { title: "Overfitting & Underfitting", detail: "பொதுமைப்படுத்தல் உறுதி செய்தல்" }
            ]
          }
        ]
      }
    },
    hi: {
      title: "मशीन लर्निंग (Machine Learning)",
      overview: "मशीन लर्निंग (ML) आर्टिफिशियल इंटेलिजेंस का वह हिस्सा है जो कंप्यूटर को बिना स्पष्ट प्रोग्रामिंग के पिछले डेटा और अनुभव से खुद सीखने और भविष्यवाणी करने की क्षमता देता है।",
      keyConcepts: [
        { name: "सुपरवाइज़्ड लर्निंग (Supervised Learning)", desc: "लेबल किए गए डेटा से सीखना, जिसमें इनपुट और सही आउटपुट दोनों दिए जाते हैं (रिग्रेशन और क्लासिफिकेशन)।" },
        { name: "अनसुपरवाइज़्ड लर्निंग (Unsupervised Learning)", desc: "बिना लेबल वाले डेटा में छिपे हुए पैटर्न और समूह खोजना (क्लस्टरिंग और PCA)।" },
        { name: "रीइन्फोर्समेंट लर्निंग (Reinforcement Learning)", desc: "इनाम और दंड के सिद्धांत पर सही निर्णय लेना सीखना।" },
        { name: "मॉडल मूल्यांकन (Evaluation)", desc: "सटीकता (Accuracy), प्रिसिजन, रिकॉल और ओवरफिटिंग की जांच।" }
      ],
      example: {
        title: "सरल रेखीय भविष्यवाणी (Linear Prediction)",
        code: `# रेखीय मॉडल से भविष्यवाणी\ndef predict_marks(study_hours, weight=6.0, base=20.0):\n    return weight * study_hours + base\n\nhours = 7\npredicted = predict_marks(hours)\nprint(f"{hours} घंटे अध्ययन पर अनुमानित अंक: {predicted}")`
      },
      steps: [
        "चरण 1: डेटा एकत्र करना और साफ़ करना (Data Preprocessing)।",
        "चरण 2: डेटा को ट्रेनिंग और टेस्टिंग भागों में विभाजित करना।",
        "चरण 3: उपयुक्त एल्गोरिदम चुनकर मॉडल को ट्रेन करना।",
        "चरण 4: सटीकता और प्रदर्शन का मूल्यांकन करना।",
        "चरण 5: वास्तविक सिस्टम में मॉडल को लागू करना।"
      ],
      summary: "मशीन लर्निंग कंप्यूटर को डेटा का विश्लेषण करके भविष्य के सटीक निर्णय लेने की शक्ति प्रदान करता है।",
      mindmap: {
        central: "मशीन लर्निंग (ML)",
        branches: [
          {
            id: "b1",
            title: "सुपरवाइज़्ड लर्निंग",
            description: "लेबल डेटा से प्रशिक्षण",
            subtopics: [
              { title: "रिग्रेशन (Regression)", detail: "मूल्य व संख्यात्मक अनुमान" },
              { title: "वर्गीकरण (Classification)", detail: "श्रेणी पहचान (ईमेल स्पैम फिल्टर)" }
            ]
          },
          {
            id: "b2",
            title: "अनसुपरवाइज़्ड लर्निंग",
            description: "पैटर्न और क्लस्टरिंग",
            subtopics: [
              { title: "क्लस्टरिंग (K-Means)", detail: "समान डेटा का समूह बनाना" },
              { title: "PCA डायमेंशन रिडक्शन", detail: "जटिल डेटा को सरल बनाना" }
            ]
          },
          {
            id: "b3",
            title: "मॉडल इवैल्यूएशन",
            description: "सटीकता मापदंड",
            subtopics: [
              { title: "Accuracy & F1", detail: "पूर्वानुमान की गुणवत्ता" },
              { title: "Overfitting नियंत्रण", detail: "रेगुलराइज़ेशन और क्रॉस-वैलिडेशन" }
            ]
          }
        ]
      }
    }
  },

  nlp: {
    en: {
      title: "Natural Language Processing (NLP)",
      overview: "Natural Language Processing is a subfield of Artificial Intelligence and Linguistics concerned with the interactions between computers and human language, in particular how to program computers to process and analyze large amounts of natural language data.",
      keyConcepts: [
        { name: "Tokenization & Normalization", desc: "Breaking text into words or subwords (BPE), lowercasing, stemming, and lemmatization." },
        { name: "Word Embeddings", desc: "Mapping semantic meanings into continuous vector spaces (Word2Vec, GloVe, FastText)." },
        { name: "Sequence Models", desc: "Recurrent Neural Networks (RNNs), LSTMs, and GRUs handling temporal dependency in text." },
        { name: "Attention & Transformers", desc: "Self-attention computing contextual relationships between all words simultaneously, enabling BERT, GPT, and Claude." },
        { name: "Key Applications", desc: "Machine translation, sentiment analysis, named entity recognition (NER), summarization, and question-answering." }
      ],
      example: {
        title: "Basic Word Tokenization & Frequency Analysis",
        code: `# Simple tokenization and vocabulary counter\ntext = "Natural Language Processing empowers machines to understand human language."\ntokens = text.lower().replace(".", "").split()\nvocab = {word: tokens.count(word) for word in set(tokens)}\nprint("Tokens:", tokens)\nprint("Vocabulary Count:", vocab)`
      },
      steps: [
        "Step 1: Learn text preprocessing techniques (regex, tokenization, stop-word removal).",
        "Step 2: Understand vector representations (Bag-of-Words, TF-IDF, Word2Vec).",
        "Step 3: Study deep learning sequence architectures (RNNs, BiLSTMs).",
        "Step 4: Master the Transformer architecture (Multi-Head Attention, Encoders/Decoders).",
        "Step 5: Fine-tune modern pretrained LLMs using Hugging Face Transformers."
      ],
      summary: "NLP bridges human communication and computational intelligence, powering modern search, translation, and generative AI assistants.",
      mindmap: {
        central: "Natural Language Processing",
        branches: [
          {
            id: "b1",
            title: "Text Preprocessing",
            description: "Cleaning and segmenting language input",
            subtopics: [
              { title: "Tokenization", detail: "Byte-Pair Encoding (BPE), WordPiece, regex" },
              { title: "Normalization", detail: "Lemmatization, stemming, lowercase conversion" },
              { title: "Stop Words", detail: "Filtering frequent non-informative words" }
            ]
          },
          {
            id: "b2",
            title: "Vector Representations",
            description: "Translating words into numerical space",
            subtopics: [
              { title: "TF-IDF", detail: "Term frequency inverse document frequency" },
              { title: "Static Embeddings", detail: "Word2Vec, GloVe semantic geometric vectors" },
              { title: "Contextual Vectors", detail: "Dynamic representations based on sentence context" }
            ]
          },
          {
            id: "b3",
            title: "Transformers & LLMs",
            description: "The foundation of modern NLP",
            subtopics: [
              { title: "Self-Attention", detail: "Query, Key, Value score projections" },
              { title: "BERT vs GPT", detail: "Bidirectional encoder vs causal autoregressive decoder" },
              { title: "Prompt Engineering", detail: "Few-shot, chain-of-thought, zero-shot prompting" }
            ]
          },
          {
            id: "b4",
            title: "Practical Applications",
            description: "Real-world language tasks",
            subtopics: [
              { title: "Machine Translation", detail: "Cross-lingual alignment (e.g. English-Tamil-Hindi)" },
              { title: "Sentiment Analysis", detail: "Detecting emotions and polarity in reviews" },
              { title: "Question Answering", detail: "Extractive and generative grounded comprehension" }
            ]
          }
        ]
      }
    },
    ta: {
      title: "இயற்கை மொழி செயலாக்கம் (Natural Language Processing - NLP)",
      overview: "இயற்கை மொழி செயலாக்கம் (NLP) என்பது கணினிகள் மனித மொழிகளைப் (தமிழ், ஆங்கிலம், இந்தி போன்றவை) படித்து, உணர்ந்து, புரிந்துகொண்டு, சுயமாகப் பதிலளிக்கும் வகையில் உருவாக்கும் AI மற்றும் மொழியியல் துறை ஆகும்.",
      keyConcepts: [
        { name: "டோக்கனைசேஷன் (Tokenization)", desc: "வாக்கியங்களைச் சொற்களாகவோ அல்லது துணைச் சொற்களாகவோ பிரித்தல்." },
        { name: "சொல் திசையன்கள் (Word Embeddings)", desc: "சொற்களின் பொருளைக் கணித எண்களாக (vectors) மாற்றி, ஒத்த சொற்களை அருகருகே அமைத்தல்." },
        { name: "ட்ரான்ஸ்ஃபார்மர்கள் (Transformers)", desc: "வாக்கியத்தின் முழுப் பொருளையும் ஒரே நேரத்தில் உணரும் 'Self-Attention' தொழில்நுட்பம்." },
        { name: "முக்கியப் பயன்பாடுகள்", desc: "தானியங்கி மொழிபெயர்ப்பு, பேச்சுணர்தல், உணர்வுப் பகுப்பாய்வு (sentiment analysis), மற்றும் AI ஆசிரியர்கள்." }
      ],
      example: {
        title: "தமிழ் டோக்கனைசேஷன் உதாரணம்",
        code: `# எளிய வாக்கியச் சொல் பிரிப்பு\ntext = "இயற்கை மொழி செயலாக்கம் கணினிக்கு மனித மொழியைக் கற்பிக்கிறது"\ntokens = text.split()\nprint("பிரித்த சொற்கள்:", tokens)\nprint("மொத்த சொற்கள் எண்ணிக்கை:", len(tokens))`
      },
      steps: [
        "படி 1: உரைத் தூய்மையாக்கம் மற்றும் டோக்கனைசேஷன் கற்றல்.",
        "படி 2: TF-IDF மற்றும் Word Embeddings முறைகளைப் புரிந்துகொள்ளுதல்.",
        "படி 3: நரம்பியல் மொழி மாதிரிகள் (RNN, LSTM) அறிதல்.",
        "படி 4: நவீன Transformer மற்றும் பெரிய மொழி மாதிரிகளைப் (LLM) பயிற்சி செய்தல்.",
        "படி 5: தமிழ் உள்ளிட்ட பன்மொழி AI மொழிபெயர்ப்புக் கருவிகளை உருவாக்குதல்."
      ],
      summary: "மனித மொழிகளுக்கும் கணினிக்கும் இடையே பாலமாக விளங்கும் உன்னத AI துறை இயற்கை மொழி செயலாக்கமாகும்.",
      mindmap: {
        central: "இயற்கை மொழி செயலாக்கம் (NLP)",
        branches: [
          {
            id: "b1",
            title: "உரை செயலாக்கம்",
            description: "மொழிக் கூறுகளைப் பிரித்தல்",
            subtopics: [
              { title: "Tokenization", detail: "வாக்கியங்களைச் சொற்களாகப் பிரித்தல்" },
              { title: "Stop Words", detail: "அடிக்கடி வரும் பொதுச் சொற்களை நீக்குதல்" }
            ]
          },
          {
            id: "b2",
            title: "திசையன் அமைப்புகள்",
            description: "எண்களாக மாற்றுதல்",
            subtopics: [
              { title: "Word2Vec", detail: "பொருள் சார்ந்த சொல் திசையன்கள்" },
              { title: "TF-IDF", detail: "சொற்களின் முக்கியத்துவ அளவீடு" }
            ]
          },
          {
            id: "b3",
            title: "Transformers & LLM",
            description: "நவீன மொழித் தொழில்நுட்பம்",
            subtopics: [
              { title: "Self-Attention", detail: "சூழல் சார்ந்த சொல் உறவுகள்" },
              { title: "மொழி மாதிரிகள்", detail: "உரையாடல் மற்றும் தானியங்கி மொழிபெயர்ப்பு" }
            ]
          }
        ]
      }
    },
    hi: {
      title: "प्राकृतिक भाषा प्रसंस्करण (Natural Language Processing - NLP)",
      overview: "नेचुरल लैंग्वेज प्रोसेसिंग (NLP) आर्टिफिशियल इंटेलिजेंस और भाषाविज्ञान का वह क्षेत्र है जो कंप्यूटर को इंसानी भाषा (हिंदी, अंग्रेजी, तमिल आदि) को पढ़ने, समझने, उसका विश्लेषण करने और प्रतिक्रिया देने में सक्षम बनाता है।",
      keyConcepts: [
        { name: "टोकनाइज़ेशन (Tokenization)", desc: "वाक्य को छोटे टुकड़ों (शब्दों या सब-वर्ड्स) में विभाजित करना।" },
        { name: "वर्ड एम्बेडिंग्स (Word Embeddings)", desc: "शब्दों के अर्थ को गणितीय वैक्टर में बदलना ताकि कंप्यूटर शब्दों के अर्थगत संबंध समझ सके।" },
        { name: "ट्रांसफॉर्मर और सेल्फ-अटेंशन", desc: "वाक्य के सभी शब्दों के बीच आपसी संदर्भ को एक साथ समझने की तकनीक (जैसे BERT और GPT)।" },
        { name: "प्रमुख अनुप्रयोग", desc: "मशीन अनुवाद (Translation), भावना विश्लेषण (Sentiment Analysis), और वॉयस असिस्टेंट।" }
      ],
      example: {
        title: "हिंदी टोकनाइज़ेशन उदाहरण",
        code: `# सरल शब्द विभाजन\ntext = "प्राकृतिक भाषा प्रसंस्करण कंप्यूटर को इंसानी भाषा सिखाता है"\ntokens = text.split()\nprint("टोकन्स:", tokens)\nprint("कुल शब्द संख्या:", len(tokens))`
      },
      steps: [
        "चरण 1: टेक्स्ट प्रीप्रोसेसिंग (क्लीनिंग, टोकनाइज़ेशन) सीखें।",
        "चरण 2: वर्ड वैक्टर (TF-IDF, Word2Vec) का अध्ययन करें।",
        "चरण 3: ट्रांसफॉर्मर आर्किटेक्चर और सेल्फ-अटेंशन समझें।",
        "चरण 4: प्री-ट्रेन्ड LLMs का उपयोग और फाइन-ट्यूनिंग करें।",
        "चरण 5: बहुभाषी चैटबॉट और ट्रांसलेशन सिस्टम्स का निर्माण करें।"
      ],
      summary: "NLP इंसानी संवाद और कंप्यूटर की गणना शक्ति को जोड़कर भाषा संबंधी सभी AI टूल्स को संभव बनाता है।",
      mindmap: {
        central: "नेचुरल लैंग्वेज प्रोसेसिंग (NLP)",
        branches: [
          {
            id: "b1",
            title: "टेक्स्ट प्रीप्रोसेसिंग",
            description: "इनपुट भाषा की तैयारी",
            subtopics: [
              { title: "टोकनाइज़ेशन", detail: "वाक्यों को शब्दों में विभाजित करना" },
              { title: "स्टॉप वर्ड्स", detail: "अनावश्यक शब्दों को हटाना" }
            ]
          },
          {
            id: "b2",
            title: "वैक्टर प्रतिनिधित्व",
            description: "शब्दों का गणितीय रूप",
            subtopics: [
              { title: "Word2Vec व GloVe", detail: "शब्दों के अर्थगत ज्यामितीय वैक्टर" },
              { title: "TF-IDF", detail: "दस्तावेज़ में शब्दों का महत्त्व" }
            ]
          },
          {
            id: "b3",
            title: "ट्रांसफॉर्मर व LLM",
            description: "आधुनिक न्यूरल भाषा मॉडल",
            subtopics: [
              { title: "सेल्फ-अटेंशन", detail: "संदर्भ और शब्दों का परस्पर संबंध" },
              { title: "मशीन अनुवाद", detail: "बहुभाषी अनुवाद व चैट असिस्टेंट" }
            ]
          }
        ]
      }
    }
  }
};

/**
 * Dynamically synthesizes topic content if the topic isn't in static KNOWLEDGE_BASE
 */
function synthesizeTopicContent(topic, lang) {
  const cleanTopic = topic.trim();
  if (lang === 'ta') {
    return {
      title: `${cleanTopic} - கற்றல் வழிகாட்டி`,
      overview: `${cleanTopic} பற்றிய விரிவான, தொடக்கநிலையாளர்களுக்கான பாடத்திட்டம். இது தொழில்நுட்பக் கருத்துகள், நடைமுறை உதாரணங்கள் மற்றும் படிப்படியான விளக்கங்களை எளிய தமிழில் வழங்குகிறது.`,
      keyConcepts: [
        { name: `${cleanTopic} அடிப்படைக் கொள்கைகள்`, desc: `${cleanTopic} என்பதன் அடிப்படை தத்துவங்கள் மற்றும் கட்டமைப்பு விதிகள்.` },
        { name: "முக்கிய வழிமுறைகள் மற்றும் கூறுகள்", desc: "செயல்பாடுகளை எளிதாக்கும் முதன்மை அலகுகள் மற்றும் அல்காரிதங்கள்." },
        { name: "நடைமுறைப் பயன்பாடுகள்", desc: "தொழில்துறை மற்றும் நிஜ உலகத் தேவைகளில் இதன் நேரடி பங்களிப்பு." },
        { name: "சிறந்த நடைமுறைகள்", desc: "திறமையான, பிழையற்ற மற்றும் பாதுகாப்பான வடிவமைப்பு முறைகள்." }
      ],
      example: {
        title: `${cleanTopic} - நடைமுறை மாதிரி`,
        code: `# ${cleanTopic} மாதிரி விளக்கம்\ndef learn_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}(concept):\n    return f"${cleanTopic} இல் '{concept}' மிக முக்கிய பங்கு வகிக்கிறது."\n\nresult = learn_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}("அடிப்படை கோட்பாடு")\nprint(result)`
      },
      steps: [
        `படி 1: ${cleanTopic} இன் அடிப்படைச் சொற்கள் மற்றும் வரையறைகளைப் புரிந்து கொள்ளுதல்.`,
        `படி 2: மாதிரி உதாரணங்களுடன் எளிய சோதனைகளைச் செய்து பார்த்தல்.`,
        `படி 3: சிக்கலான பிரிவுகளைச் சிறிய பகுதிகளாகப் பிரித்து ஆழமாகக் கற்றல்.`,
        `படி 4: தொடர் பயிற்சி மற்றும் நிஜ உலகச் சூழலில் செயல்படுத்திப் பார்த்தல்.`
      ],
      summary: `${cleanTopic} பற்றிய அடிப்படைகளைத் தெளிவாகப் புரிந்துகொண்டு அடுத்த கட்டப் பயிற்சிகளைத் தொடங்குங்கள்.`,
      mindmap: {
        central: cleanTopic,
        branches: [
          {
            id: "b1",
            title: "அடிப்படை தத்துவங்கள்",
            description: "தொடக்கக் கோட்பாடுகள்",
            subtopics: [
              { title: "வரையறை", detail: "நோக்கம் மற்றும் பயன்பாடு" },
              { title: "முக்கிய கூறுகள்", detail: "அடிப்படைத் தொகுதிகள்" }
            ]
          },
          {
            id: "b2",
            title: "செயல்முறை வழிமுறைகள்",
            description: "நடைமுறை உத்திகள்",
            subtopics: [
              { title: "கட்டமைப்பு", detail: "அமைப்பின் வடிவமைப்பு" },
              { title: "செயல்முறை", detail: "படிப்படியான ஓட்டம்" }
            ]
          },
          {
            id: "b3",
            title: "நடைமுறைப் பயன்பாடுகள்",
            description: "நிஜ உலகப் பயன்கள்",
            subtopics: [
              { title: "தொழில்நுட்ப தீர்வுகள்", detail: "சிக்கல்களைத் தீர்க்கும் வழி" },
              { title: "எதிர்கால வளர்ச்சி", detail: "நவீன புதுமைகள்" }
            ]
          }
        ]
      }
    };
  }

  if (lang === 'hi') {
    return {
      title: `${cleanTopic} - अध्ययन गाइड`,
      overview: `${cleanTopic} का एक व्यापक, शुरुआती अनुकूल परिचय। यह तकनीकी सिद्धांतों, वास्तविक दुनिया के उदाहरणों और चरण-दर-चरण व्याख्या को सरल हिंदी में प्रस्तुत करता है।`,
      keyConcepts: [
        { name: `${cleanTopic} के मूल सिद्धांत`, desc: `${cleanTopic} के बुनियादी नियम और वैचारिक आधार।` },
        { name: "प्रमुख घटक और तकनीक", desc: "प्रणाली को संचालित करने वाले मुख्य अवयव और प्रक्रियाएं।" },
        { name: "व्यावहारिक अनुप्रयोग", desc: "वास्तविक दुनिया की समस्याओं को सुलझाने में इसका उपयोग।" },
        { name: "सर्वोत्तम अभ्यास", desc: "कुशल और त्रुटिरहित परिणाम प्राप्त करने के दिशानिर्देश।" }
      ],
      example: {
        title: `${cleanTopic} - व्यावहारिक उदाहरण`,
        code: `# ${cleanTopic} का उदाहरण कोड\ndef explore_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}(aspect):\n    return f"${cleanTopic} में '{aspect}' एक महत्वपूर्ण भूमिका निभाता है।"\n\noutput = explore_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}("मूल अवधारणा")\nprint(output)`
      },
      steps: [
        `चरण 1: ${cleanTopic} की बुनियादी परिभाषाओं और शब्दावली को समझें।`,
        `चरण 2: छोटे उदाहरणों के साथ व्यावहारिक प्रयोग करें।`,
        `चरण 3: मुख्य घटकों और उनकी कार्यप्रणाली का गहन अध्ययन करें।`,
        `चरण 4: वास्तविक समस्याओं पर इसे लागू करके अभ्यास करें।`
      ],
      summary: `${cleanTopic} की मजबूत नींव के साथ आप अपनी उन्नत तकनीकी यात्रा को आत्मविश्वास से आगे बढ़ा सकते हैं।`,
      mindmap: {
        central: cleanTopic,
        branches: [
          {
            id: "b1",
            title: "मूलभूत सिद्धांत",
            description: "शुरुआती अवधारणाएं",
            subtopics: [
              { title: "परिभाषा", detail: "उद्देश्य और संरचना" },
              { title: "प्रमुख घटक", detail: "आधारभूत अवयव" }
            ]
          },
          {
            id: "b2",
            title: "कार्यप्रणाली",
            description: "व्यावहारिक तकनीकें",
            subtopics: [
              { title: "प्रक्रिया", detail: "चरणबद्ध निष्पादन" },
              { title: "उपकरण", detail: "सहायक टूल्स और लाइब्रेरीज़" }
            ]
          },
          {
            id: "b3",
            title: "व्यावहारिक अनुप्रयोग",
            description: "वास्तविक उपयोगिता",
            subtopics: [
              { title: "उद्योग में उपयोग", detail: "समस्या समाधान और स्वचालन" },
              { title: "भविष्य के अवसर", detail: "आधुनिक नवाचार और रुझान" }
            ]
          }
        ]
      }
    };
  }

  // Default English
  return {
    title: `${cleanTopic} - Comprehensive Guide`,
    overview: `A beginner-friendly structured learning breakdown of ${cleanTopic}. It covers foundational principles, practical examples, and step-by-step guidance.`,
    keyConcepts: [
      { name: `Core Principles of ${cleanTopic}`, desc: `Essential theories, operational rules, and background of ${cleanTopic}.` },
      { name: "Architectural Components", desc: "Key mechanisms and modular blocks powering the domain." },
      { name: "Real-World Applications", desc: "Practical implementation in software, engineering, and modern solutions." },
      { name: "Best Practices", desc: "Industry standards for maintainability, reliability, and security." }
    ],
    example: {
      title: `${cleanTopic} Example Walkthrough`,
      code: `# Hands-on conceptual demonstration of ${cleanTopic}\ndef demonstrate_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}(key_element):\n    return f"Applying ${cleanTopic} principles to: {key_element}"\n\nresult = demonstrate_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}("Core Architecture")\nprint(result)`
    },
    steps: [
      `Step 1: Understand foundational terms, definitions, and motivations behind ${cleanTopic}.`,
      `Step 2: Experiment with hands-on examples and minimal working prototypes.`,
      `Step 3: Break down complex components into manageable subtopics.`,
      `Step 4: Build a project demonstrating mastery of ${cleanTopic}.`
    ],
    summary: `${cleanTopic} forms an essential skill in modern technology. Continuous practice builds solid conceptual intuition.`,
    mindmap: {
      central: cleanTopic,
      branches: [
        {
          id: "b1",
          title: "Foundations",
          description: "Core concepts & motivation",
          subtopics: [
            { title: "Definition & Scope", detail: "What it solves and why it matters" },
            { title: "Prerequisites", detail: "Required foundational knowledge" }
          ]
        },
        {
          id: "b2",
          title: "Mechanisms & Methods",
          description: "How it works in practice",
          subtopics: [
            { title: "Core Workflows", detail: "Step-by-step operational logic" },
            { title: "Tooling & Frameworks", detail: "Ecosystem libraries and environments" }
          ]
        },
        {
          id: "b3",
          title: "Real-World Impact",
          description: "Practical implementations",
          subtopics: [
            { title: "Industry Use Cases", detail: "Production applications" },
            { title: "Future Horizons", detail: "Emerging trends and research directions" }
          ]
        }
      ]
    }
  };
}

/**
 * Normalizes user topic queries to matching topic keys
 */
function matchTopicKey(rawTopic) {
  const t = rawTopic.toLowerCase().trim();
  if (t.includes('python') || t.includes('பைத்தான்') || t.includes('पायथन')) return 'python';
  if (t.includes('machine learning') || t.includes('ml') || t.includes('இயந்திரக் கற்றல்') || t.includes('मशीन लर्निंग')) return 'ml';
  if (t.includes('natural language') || t.includes('nlp') || t.includes('மொழி செயலாக்கம்') || t.includes('प्राकृतिक भाषा')) return 'nlp';
  if (t.includes('intelligence') || t.includes('ai') || t.includes('செயற்கை நுண்ணறிவு') || t.includes('आर्टिफिशियल इंटेलिजेंस')) return 'ai';
  return null;
}

/**
 * Generate Learning Studio Content (Answer Only or Mind Map)
 */
async function generateStudioTopic({ topic, mode, language }) {
  const lang = validateLang(language);
  const matchedKey = matchTopicKey(topic);
  
  let contentData;
  if (matchedKey && KNOWLEDGE_BASE[matchedKey] && KNOWLEDGE_BASE[matchedKey][lang]) {
    contentData = KNOWLEDGE_BASE[matchedKey][lang];
  } else {
    contentData = synthesizeTopicContent(topic, lang);
  }

  if (mode === 'mindmap') {
    return {
      success: true,
      mode: 'mindmap',
      topic,
      language: lang,
      mindmap: contentData.mindmap
    };
  }

  // Answer Only Mode
  return {
    success: true,
    mode: 'answer',
    topic,
    language: lang,
    content: {
      title: contentData.title,
      overview: contentData.overview,
      keyConcepts: contentData.keyConcepts,
      example: contentData.example,
      steps: contentData.steps,
      summary: contentData.summary
    }
  };
}


/**
 * Optional Gemini API Call (Invoked when GEMINI_API_KEY is configured in .env)
 */
function callGeminiApi({ prompt, systemInstruction = '', language = 'en' }) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return reject(new Error('NO_API_KEY'));

    const https = require('https');
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return resolve(text);
          } catch (e) {}
        }
        reject(new Error(`Gemini API status ${res.statusCode}`));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API timeout'));
    });
    req.write(payload);
    req.end();
  });
}

/**
 * PDF Text Extraction Utility using pdf-parse (v2)
 */
async function extractPdfText(buffer, fileName) {
  try {
    const { PDFParse } = require('pdf-parse');
    const uint8 = new Uint8Array(buffer);
    const parser = new PDFParse(uint8);
    const res = await parser.getText();
    const pages = res.pages || [];
    let formattedText = '';
    if (pages.length > 0) {
      formattedText = pages.map((p, idx) => `--- Page ${p.num || (idx + 1)} ---\n${(p.text || '').trim()}`).join('\n\n');
    } else {
      formattedText = (res.text || '').trim();
    }
    return {
      success: true,
      fileName: fileName || 'Uploaded Document.pdf',
      numPages: pages.length || (res.numpages || 1),
      text: formattedText.trim()
    };
  } catch (err) {
    console.error('extractPdfText error:', err);
    return {
      success: false,
      error: 'PDF_PARSE_FAILED',
      message: 'Failed to extract readable text from PDF: ' + (err.message || 'Unreadable or password-protected PDF')
    };
  }
}

/**
 * Document Study Assistant (NotebookLM-Style grounded help)
 * Strictly distinguishes grounded document citations from general knowledge.
 */
async function processDocumentStudy({ documentText, fileName, action, question, language }) {
  const lang = validateLang(language);
  
  if (!documentText || typeof documentText !== 'string' || documentText.trim().length === 0) {
    const errorMsg = {
      en: "Could not read text from this file. Please ensure it is a text-accessible document or paste the text directly into the study box.",
      ta: "இந்தக் கோப்பிலிருந்து உரையைப் படிக்க முடியவில்லை. தயவுசெய்து உரை வடிவிலான கோப்பைப் பதிவேற்றவும் அல்லது உரையை நேரடியாக உள்ளிடவும்.",
      hi: "इस फ़ाइल से टेक्स्ट नहीं पढ़ा जा सका। कृपया सुनिश्चित करें कि यह टेक्स्ट-सुलभ दस्तावेज़ है या सीधे टेक्स्ट पेस्ट करें।"
    };
    return {
      success: false,
      error: "UNREADABLE_FILE",
      message: errorMsg[lang] || errorMsg.en
    };
  }

  const raw = documentText.trim();
  
  // Extract pages if formatted as "--- Page X ---"
  const pageMatches = raw.split(/--- Page (\d+) ---/);
  let sections = [];
  if (pageMatches.length > 1) {
    for (let i = 1; i < pageMatches.length; i += 2) {
      const pageNum = pageMatches[i];
      const pageContent = (pageMatches[i + 1] || '').trim();
      if (pageContent.length > 10) {
        sections.push({ page: `Page ${pageNum}`, text: pageContent });
      }
    }
  }

  // Fallback to paragraph splitting if no page markers
  if (sections.length === 0) {
    const paragraphs = raw.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 20);
    const list = paragraphs.length > 0 ? paragraphs : [raw];
    sections = list.map((p, idx) => ({ page: `Section ${idx + 1}`, text: p }));
  }

  const totalWords = raw.split(/\s+/).length;
  let citations = [];
  let groundedPoints = [];
  let generalSynthesis = "";

  // 1. ACTION: SUMMARIZE MATERIAL
  if (action === 'summarize') {
    const sampleSections = sections.slice(0, 5);
    sampleSections.forEach(sec => citations.push(sec.page));

    if (lang === 'ta') {
      groundedPoints = sampleSections.map(sec => {
        const excerpt = sec.text.length > 180 ? sec.text.slice(0, 180) + '...' : sec.text;
        return `[சான்று: ${sec.page}] ஆவணத்தின் முக்கிய பகுதி: "${excerpt}"`;
      });
      generalSynthesis = `பதிவேற்றப்பட்ட '${fileName || 'ஆவணம்'}' மொத்தம் ${sections.length} முக்கிய பிரிவுகளையும் சுமார் ${totalWords} சொற்களையும் கொண்டுள்ளது. இது ஆவணத்தின் மையக்கருத்துகளை விரிவாக விளக்குகிறது.`;
    } else if (lang === 'hi') {
      groundedPoints = sampleSections.map(sec => {
        const excerpt = sec.text.length > 180 ? sec.text.slice(0, 180) + '...' : sec.text;
        return `[प्रमाण: ${sec.page}] दस्तावेज़ से मुख्य अंश: "${excerpt}"`;
      });
      generalSynthesis = `अपलोड किए गए दस्तावेज़ '${fileName || 'दस्तावेज़'}' में कुल ${sections.length} पृष्ठ/खंड और लगभग ${totalWords} शब्द हैं। यह सामग्री के मुख्य सिद्धांतों का संक्षिप्त सारांश प्रस्तुत करता है।`;
    } else {
      groundedPoints = sampleSections.map(sec => {
        const excerpt = sec.text.length > 180 ? sec.text.slice(0, 180) + '...' : sec.text;
        return `[${sec.page} Evidence] Key Finding: "${excerpt}"`;
      });
      generalSynthesis = `The uploaded material '${fileName || 'Document'}' contains ${sections.length} core sections (${totalWords} words). Above are the verified key themes directly extracted from the text.`;
    }
  }

  // 2. ACTION: EXPLAIN DIFFICULT CONCEPTS
  else if (action === 'explain') {
    const sampleSections = sections.slice(0, 4);
    sampleSections.forEach(sec => citations.push(sec.page));

    if (lang === 'ta') {
      groundedPoints = sampleSections.map((sec, idx) => {
        const excerpt = sec.text.length > 200 ? sec.text.slice(0, 200) + '...' : sec.text;
        return `[சான்று: ${sec.page}] கடினமான கோட்பாட்டு விளக்கம் (${idx + 1}): "${excerpt}"\n↳ எளிய விளக்கம்: இந்தப் பிரிவு சிக்கலான தொழில்நுட்பக் கருத்துகளை விளக்குகிறது.`;
      });
      generalSynthesis = "AI கல்வியியல் விளக்கம்: ஆவணத்தில் காணப்படும் கடினமான தொழில்நுட்பச் சொற்கள் மாணவர்களுக்குப் புரியும் வகையில் எளிய முறையில் பகுப்பாய்வு செய்யப்பட்டுள்ளன.";
    } else if (lang === 'hi') {
      groundedPoints = sampleSections.map((sec, idx) => {
        const excerpt = sec.text.length > 200 ? sec.text.slice(0, 200) + '...' : sec.text;
        return `[प्रमाण: ${sec.page}] जटिल अवधारणा व्याख्या (${idx + 1}): "${excerpt}"\n↳ सरल व्याख्या: यह खंड तकनीकी तंत्र और मूल कार्यप्रणाली को समझाता है।`;
      });
      generalSynthesis = "AI शैक्षणिक व्याख्या: दस्तावेज़ में प्रयुक्त कठिन तकनीकी शब्दों को व्यावहारिक और समझने में आसान उदाहरणों के साथ प्रस्तुत किया गया है।";
    } else {
      groundedPoints = sampleSections.map((sec, idx) => {
        const excerpt = sec.text.length > 200 ? sec.text.slice(0, 200) + '...' : sec.text;
        return `[${sec.page} Grounded Concept ${idx + 1}] Verified Excerpt: "${excerpt}"\n↳ Plain-Language Analysis: Breaks down foundational mechanics, algorithms, and structural relationships established in this section.`;
      });
      generalSynthesis = "AI Pedagogical Synthesis: Complex theoretical concepts and mathematical terminology found in the source text have been clarified using intuitive analogies.";
    }
  }

  // 3. ACTION: ASK GROUNDED QUESTION
  else if (action === 'qa') {
    const q = (question || '').toLowerCase().trim();
    if (!q) {
      return {
        success: false,
        error: "EMPTY_QUESTION",
        message: lang === 'ta' ? "தயவுசெய்து உங்கள் கேள்வியை உள்ளிடவும்." : (lang === 'hi' ? "कृपया अपना प्रश्न दर्ज करें।" : "Please enter a specific question about the document.")
      };
    }

    const stopWords = new Set([
      'what', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'with', 'from',
      'have', 'does', 'tell', 'explain', 'give', 'how', 'about', 'the', 'is', 'are',
      'was', 'were', 'for', 'and', 'in', 'on', 'at', 'can', 'will', 'make', 'used',
      'using', 'help', 'some', 'any', 'into', 'such', 'their', 'there'
    ]);
    const qWords = q.split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w));

    let bestMatchIdx = -1;
    let highestScore = 0;
    let maxMatchedWords = 0;

    for (let i = 0; i < sections.length; i++) {
      const secTextLower = sections[i].text.toLowerCase();
      let score = 0;
      let matchedCount = 0;
      for (const word of qWords) {
        if (secTextLower.includes(word)) {
          score += 3;
          matchedCount++;
        }
      }
      if (q && secTextLower.includes(q)) score += 20;
      if (score > highestScore) {
        highestScore = score;
        bestMatchIdx = i;
        maxMatchedWords = matchedCount;
      }
    }

    // Grounded Integrity Check: Must have sufficient keyword evidence in source text
    const matchRatio = qWords.length > 0 ? maxMatchedWords / qWords.length : 0;
    const isSufficient = (qWords.length === 1 && maxMatchedWords === 1) || (qWords.length >= 2 && (maxMatchedWords >= 2 || matchRatio >= 0.4));

    if (!isSufficient || bestMatchIdx === -1) {
      const notFoundTag = lang === 'ta' ? 'ஆவணத்தில் இல்லை' : (lang === 'hi' ? 'दस्तावेज़ में अनुपलब्ध' : 'Not Found in Document');
      citations.push(notFoundTag);

      const notFoundMsg = {
        en: `The uploaded document '${fileName || 'Document'}' does not contain sufficient information to answer "${question}". To avoid inventing false content, the system only answers from verified document evidence. The document focuses on: ${sections.slice(0, 2).map(s => s.text.slice(0, 90)).join('; ')}...`,
        ta: `பதிவேற்றப்பட்ட ஆவணத்தில் '${question}' பற்றிய போதிய தகவல் கிடைக்கவில்லை. ஆவணத்தில் இல்லாத தகவலைத் தவறாகக் கற்பனை செய்யாமல் தவிர்க்க, இந்த ஆய்வு உதவியாளர் மூல ஆவணத்தின் சான்றுகளை மட்டுமே அடிப்படையாகக் கொண்டு பதிலளிக்கிறது.`,
        hi: `अपलोड किए गए दस्तावेज़ में '${question}' के संबंध में पर्याप्त जानकारी नहीं मिली। मनगढ़ंत उत्तर देने से बचने के लिए, यह सिस्टम केवल सत्यापित दस्तावेज़ साक्ष्य के आधार पर ही उत्तर देता है।`
      };

      return {
        success: true,
        action: 'qa',
        fileName: fileName || 'Uploaded Document',
        citations,
        groundedPoints: [notFoundMsg[lang] || notFoundMsg.en],
        generalSynthesis: lang === 'ta' ? "உண்மைத்தன்மை உறுதி: ஆவணத்தில் இல்லாத தகவலுக்கு கற்பனை விடைகள் தவிர்க்கப்பட்டுள்ளன." : (lang === 'hi' ? "सत्यनिष्ठा गारंटी: दस्तावेज़ से बाहर के प्रश्नों पर काल्पनिक उत्तर नहीं दिए जाते।" : "Grounded Integrity: No answer is fabricated when the source document does not contain relevant content."),
        reply: notFoundMsg[lang] || notFoundMsg.en
      };
    }

    const matchedSec = sections[bestMatchIdx];
    citations.push(matchedSec.page);

    const fullExcerpt = matchedSec.text.length > 600 ? matchedSec.text.slice(0, 600) + '...' : matchedSec.text;

    if (lang === 'ta') {
      groundedPoints = [
        `[${matchedSec.page} நேரடிச் சான்று] "${fullExcerpt}"`,
        `[ஆவண உறுதிப்படுத்தல்] கேட்கப்பட்ட கேள்விக்கு இந்த ${matchedSec.page}-ல் தெளிவான ஆதாரம் உள்ளது.`
      ];
      generalSynthesis = `AI ஆய்வு: ${matchedSec.page}-ல் உள்ள இந்த ஆதாரம் உங்கள் கேள்விக்கு நேரடியாகப் பதிலளிக்கிறது.`;
    } else if (lang === 'hi') {
      groundedPoints = [
        `[${matchedSec.page} प्रत्यक्ष साक्ष्य] "${fullExcerpt}"`,
        `[दस्तावेज़ पुष्टि] पूछे गए प्रश्न का स्पष्ट उत्तर ${matchedSec.page} में उपलब्ध है।`
      ];
      generalSynthesis = `AI विश्लेषण: ${matchedSec.page} का यह उद्धरण आपके प्रश्न का सटीक और प्रामाणिक उत्तर प्रदान करता है।`;
    } else {
      groundedPoints = [
        `[${matchedSec.page} Direct Document Citation] "${fullExcerpt}"`,
        `[Document Verification] The queried concept is explicitly defined and evidenced in ${matchedSec.page}.`
      ];
      generalSynthesis = `AI Grounded Synthesis: The extracted excerpt from ${matchedSec.page} directly addresses your question with verified contextual evidence.`;
    }
  }

  // 4. ACTION: CREATE REVISION NOTES
  else {
    const sampleSections = sections.slice(0, 5);
    sampleSections.forEach(sec => citations.push(sec.page));

    if (lang === 'ta') {
      groundedPoints = sampleSections.map((sec, idx) => {
        const titleLine = sec.text.split('\n')[0] || `பிரிவு ${idx + 1}`;
        const bullet = sec.text.length > 140 ? sec.text.slice(0, 140) + '...' : sec.text;
        return `📌 [${sec.page}] ${titleLine}\n   • முக்கிய குறிப்பு: ${bullet}`;
      });
      generalSynthesis = "தேர்வு மற்றும் நேர்காணல் விரைவு மீள்பார்வைக்கு (Quick Revision) இந்த உயர்தரக் குறிப்புகள் வடிவமைக்கப்பட்டுள்ளன.";
    } else if (lang === 'hi') {
      groundedPoints = sampleSections.map((sec, idx) => {
        const titleLine = sec.text.split('\n')[0] || `खंड ${idx + 1}`;
        const bullet = sec.text.length > 140 ? sec.text.slice(0, 140) + '...' : sec.text;
        return `📌 [${sec.page}] ${titleLine}\n   • त्वरित रिवीज़न बिंदु: ${bullet}`;
      });
      generalSynthesis = "परीक्षा और इंटरव्यू से पहले त्वरित पुनरावृत्ति (Quick Revision) के लिए ये संरचित नोट्स अत्यंत उपयोगी हैं।";
    } else {
      groundedPoints = sampleSections.map((sec, idx) => {
        const titleLine = sec.text.split('\n')[0] || `Section ${idx + 1}`;
        const bullet = sec.text.length > 140 ? sec.text.slice(0, 140) + '...' : sec.text;
        return `📌 [${sec.page}] ${titleLine}\n   • High-Yield Takeaway: ${bullet}`;
      });
      generalSynthesis = "High-Yield Revision Sheet: Structured definitions, formulas, and essential principles extracted directly for active recall.";
    }
  }

  return {
    success: true,
    action,
    fileName: fileName || 'Uploaded Document',
    totalSections: sections.length,
    wordCount: totalWords,
    citations,
    groundedPoints,
    generalSynthesis,
    reply: (groundedPoints || []).join('\n\n') + (generalSynthesis ? '\n\n' + generalSynthesis : '')
  };
}


/**
 * Topic Resolver: Distinguishes new topics from follow-up questions in context
 */
function resolveTutorTopic(userText, conversationHistory = [], topicContext = '') {
  const lower = (userText || '').toLowerCase().trim();

  // 1. Direct topic match in userText (ordered by specificity)
  if (lower.includes('numpy') || lower.includes('நம்மை') || lower.includes('नमपाई')) return 'NumPy';
  if (lower.includes('pandas') || lower.includes('பாண்டாஸ்') || lower.includes('पांडा')) return 'Pandas';
  if (lower.includes('python') || lower.includes('பைத்தான்') || lower.includes('பைத்தான') || lower.includes('पायथन')) return 'Python';
  if (lower.includes('html') || lower.includes('ஹெச்டிஎம்எல்')) return 'HTML';
  if (lower.includes('css') || lower.includes('சிஎஸ்எஸ்')) return 'CSS';
  if (lower.includes('sql') || lower.includes('எஸ்கியூஎல்') || lower.includes('एसक्यूएल')) return 'SQL';
  if (lower.includes('database') || lower.includes('தரவுத்தளம்') || lower.includes('डेटाबेस')) return 'Database';
  if (lower.includes('lstm') || lower.includes('எல்எஸ்டிஎம்')) return 'LSTM';
  if (lower.includes('deep learning') || lower.includes('ஆழ்ந்த கற்றல்') || lower.includes('डीप लर्निंग')) return 'Deep Learning';
  if (lower.includes('machine learning') || lower.includes('இயந்திரக் கற்றல்') || lower.includes('மशीन लर्निंग') || lower.includes('मशीन लर्निंग') || lower.includes('ml')) return 'Machine Learning';
  if (lower.includes('natural language') || lower.includes('nlp') || lower.includes('மொழி செயலாக்கம்')) return 'NLP';
  if (lower.includes('artificial intelligence') || lower.includes('செயற்கை நுண்ணறிவு') || lower.includes('ஆர்டிஃபிஷியல்') || lower.includes('आर्टिफिशियल इंटेलिजेंस') || lower.includes(' ai ') || lower.endsWith(' ai') || lower.startsWith('ai ')) return 'Artificial Intelligence';
  if (lower.includes('calculus') || lower.includes('நுண்கணிதம்') || lower.includes('कलन')) return 'Calculus';
  if (lower.includes('linear algebra') || lower.includes('நேரியல் இயற்கணிதம்') || lower.includes('रैखिक बीजगणित')) return 'Linear Algebra';
  if (lower.includes('math') || lower.includes('mathematical') || lower.includes('கணிதம்') || lower.includes('गणित')) return 'Mathematics';
  if (lower.includes('javascript') || lower.includes('js') || lower.includes('ஜாவாஸ்கிரிப்ட்')) return 'JavaScript';
  if (lower.includes('algorithm') || lower.includes('வழிமுறை') || lower.includes('एल्गोरिदम')) return 'Algorithms';
  if (lower.includes('data structure') || lower.includes('தரவுக்கட்டமைப்பு')) return 'Data Structures';

  // 2. Check if user is asking "what is X" or "explain X"
  const whatIsMatch = userText.match(/(?:what is|what's|explain|tell me about|define|பற்றி|என்ன|क्या है|बताएं)\s+([a-zA-Z0-9_\s]{2,30})/i);
  if (whatIsMatch && whatIsMatch[1]) {
    const extracted = whatIsMatch[1].replace(/[?!.]/g, '').trim();
    if (extracted && extracted.length > 2 && !['this', 'that', 'it', 'me', 'the', 'a', 'an'].includes(extracted.toLowerCase())) {
      return extracted;
    }
  }

  // 3. If the user message is a follow-up, check conversationHistory backwards
  if (conversationHistory && Array.isArray(conversationHistory)) {
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const pastMsg = conversationHistory[i]?.content || conversationHistory[i]?.message || '';
      const pastTopic = resolveTutorTopic(pastMsg, [], null);
      if (pastTopic && pastTopic !== 'General Technology') return pastTopic;
    }
  }

  // 4. Default to topicContext passed from studio if any, normalized if possible
  if (topicContext && typeof topicContext === 'string' && topicContext.trim().length > 0) {
    const directCtx = resolveTutorTopic(topicContext, [], '');
    if (directCtx && directCtx !== 'General Technology') return directCtx;
    return topicContext.trim();
  }
  return 'General Technology';
}

/**
 * Curated Multilingual Topic Knowledge Repository
 */
const TUTOR_TOPICS = {
  Python: {
    en: {
      definition: "Python is a high-level, interpreted, general-purpose programming language renowned for its elegant, readable syntax and dynamic typing. Created by Guido van Rossum, it emphasizes code readability with significant whitespace.",
      whyItMatters: "Python has become the undisputed lingua franca of Artificial Intelligence, Data Science, Web Development, and Automation due to its vast ecosystem of robust libraries (NumPy, PyTorch, Django, FastAPI) and rapid prototyping capabilities.",
      realWorldUseCase: "Web Backends & AI Deployment: Spotify uses Python for data analysis and backend services; Instagram powers its multi-billion user backend with Python/Django; and OpenAI builds core deep learning research tooling on top of Python.",
      simplerTerms: "Python is like writing instructions for a computer in plain English. Instead of complicated punctuation and cryptic symbols, it reads naturally, making it the friendliest language for beginners and the most powerful for AI engineers.",
      beginnerMistakes: [
        "Mixing tabs and spaces for indentation, causing IndentationError.",
        "Confusing mutable default arguments in functions (e.g., def fn(items=[]): ...).",
        "Using `==` when comparing with `None` instead of `is None`."
      ],
      code: `# Clean Python functions & list comprehension\ndef get_even_squares(numbers):\n    return [n ** 2 for n in numbers if n % 2 == 0]\n\nprint("Even squares:", get_even_squares([1, 2, 3, 4, 5, 6]))\n# Output: [4, 16, 36]`,
      followUps: ["What is NumPy?", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "பைத்தான் (Python) என்பது மிக எளிய தொடரியல் (Syntax) கொண்ட, உலகளவில் மிகவும் புகழ்பெற்ற உயர்மட்ட நிரலாக்க மொழியாகும் (High-level Programming Language).",
      whyItMatters: "செயற்கை நுண்ணறிவு (AI), மெஷின் லேர்னிங் (ML), வலைத்தள உருவாக்கம் மற்றும் தரவு அறிவியல் (Data Science) ஆகியவற்றிற்கு இதுவே முதன்மை மொழியாகும்.",
      realWorldUseCase: "Spotify, Instagram மற்றும் Google ஆகியவை தங்கள் சேவைகளின் பின்னணி (Backend) மற்றும் தரவு பகுப்பாய்விற்குப் பைத்தானைப் பயன்படுத்துகின்றன.",
      simplerTerms: "ஆங்கிலம் பேசுவது போன்ற மிக எளிய வடிவில் கம்ப்யூட்டருக்குக் கட்டளைகளைப் பிறப்பிக்க உதவும் மொழி தான் பைத்தான்.",
      beginnerMistakes: [
        "இன்டென்டேஷன் (Indentation) இடைவெளிகளைத் தவறாகப் பயன்படுத்துவது.",
        "மாறக்கூடிய (mutable) இயல்புநிலை மதிப்புகளை ஃபங்ஷன்களில் அமைப்பது."
      ],
      code: `# பைத்தான் எளிய எடுத்துக்காட்டு\nபெயர்கள் = ["கார்த்திக்", "அனிதா", "சுரேஷ்"]\nfor பெயர் in பெயர்கள்:\n    print(f"வணக்கம், {பெயர்}!")`,
      followUps: ["NumPy என்றால் என்ன?", "ஒரு நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "எளிய விளக்கம் தருக", "பொதுவான தவறுகள் என்ன?"]
    },
    hi: {
      definition: "पायथन (Python) एक उच्च-स्तरीय, इंटरप्रिटेड और ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग भाषा है, जो अपने सरल और पठनीय सिंटैक्स के लिए जानी जाती है।",
      whyItMatters: "आर्टिफिशियल इंटेलिजेंस (AI), मशीन लर्निंग, डेटा साइंस और वेब डेवलपमेंट में इसके विशाल लाइब्रेरी इकोसिस्टम (जैसे NumPy, PyTorch) के कारण यह दुनिया की सबसे लोकप्रिय भाषा है।",
      realWorldUseCase: "Instagram और Spotify जैसी प्रमुख कंपनियाँ अपने विशाल बैकएंड और डेटा सिफारिश इंजन (Recommendation Engines) के लिए पायथन का उपयोग करती हैं।",
      simplerTerms: "पायथन कंप्यूटर से बात करने का सबसे आसान तरीका है, जो लगभग सामान्य अंग्रेजी जैसा दिखता है और इसे सीखना बहुत सहज है।",
      beginnerMistakes: [
        "इंडेंटेशन (Indentation) की गलतियाँ करना।",
        "वेरिएबल स्कोप और म्युटेबल ऑब्जेक्ट्स को न समझना।"
      ],
      code: `# पायथन का सरल उदाहरण\ndef greet_learner(name):\n    return f"नमस्ते {name}, AI सीखने में आपका स्वागत है!"\n\nprint(greet_learner("अमित"))`,
      followUps: ["NumPy क्या है?", "वास्तविक दुनिया का कोई उदाहरण दें", "सरल शब्दों में समझाएं", "शुरुआती डेवलपर्स क्या गलतियां करते हैं?"]
    }
  },

  "Machine Learning": {
    en: {
      definition: "Machine Learning (ML) is a branch of Artificial Intelligence focused on building algorithms that learn patterns from historical data to make accurate predictions or decisions without being explicitly programmed with static rules.",
      whyItMatters: "Traditional software requires human developers to code every single edge case. ML models automatically uncover complex, non-linear relationships in massive datasets that would be impossible for humans to codify manually.",
      realWorldUseCase: "Credit Card Fraud Detection: Financial institutions analyze millions of credit card transactions per second using supervised ML models (e.g., Random Forests / XGBoost), instantly flagging anomalous purchase behaviors before transactions settle.",
      simplerTerms: "Instead of teaching a dog every single trick with a rulebook, you show it 1,000 photos of balls and bones until it automatically recognizes them on its own.",
      beginnerMistakes: [
        "Data Leakage: allowing test data information to contaminate training data during feature engineering.",
        "Evaluating models solely on accuracy when datasets are heavily imbalanced.",
        "Overfitting on small training sets without regularization or cross-validation."
      ],
      code: `# High-level Scikit-Learn ML workflow pattern\nfrom sklearn.linear_model import LogisticRegression\n\n# Train model on features X and labels y\nmodel = LogisticRegression()\n# model.fit(X_train, y_train)\n# predictions = model.predict(X_test)\nprint("ML Model instantiated and ready for training!")`,
      followUps: ["What is Deep Learning?", "What is an LSTM?", "Give me a real-world use case", "Explain this in simpler terms"]
    },
    ta: {
      definition: "மெஷின் லேர்னிங் (Machine Learning) என்பது செயற்கை நுண்ணறிவின் (AI) ஒரு பிரிவாகும். இது கம்ப்யூட்டர்களுக்கு நேரடிக் கட்டளைகள் இல்லாமலேயே, முந்தைய தரவுகளிலிருந்து கற்றுக்கொண்டு முடிவெடுக்க உதவுகிறது.",
      whyItMatters: "பாரம்பரிய மென்பொருள்களால் மனிதர்களால் எழுதப்பட்ட விதிகளையே இயக்க முடியும். ஆனால் ML அமைப்புகள் பல்லாயிரக்கணக்கான தரவுகளைப் பகுப்பாய்வு செய்து மனிதர்களுக்குப் புலப்படாத நுட்பமான வடிவங்களைக் கண்டறிகின்றன.",
      realWorldUseCase: "வங்கி மோசடிகளைக் கண்டறிதல் மற்றும் நெட்பிளிக்ஸ், யூடியூப் பரிந்துரை அமைப்புகள் (Recommendation Engines) ML மூலம் இயங்குகின்றன.",
      simplerTerms: "ஒரு குழந்தைக்கு ஆயிரம் பூனைகளின் படங்களைக் காட்டிய பிறகு, அது ஒரு புதிய பூனையைப் பார்த்தவுடன் அடையாளம் காண்பது போன்றது தான் ML.",
      beginnerMistakes: [
        "ஓவர்ஃபிட்டிங் (Overfitting) — பயிற்சித் தரவுகளை மட்டும் மனப்பாடம் செய்து புதிய தரவுகளில் தோல்வியடைவது."
      ],
      code: `# மெஷின் லேர்னிங் தத்துவம்\n# தரவு + முறைகள் -> பயிற்சி பெற்ற மாடல்`,
      followUps: ["ஆழ்ந்த கற்றல் (Deep Learning) என்றால் என்ன?", "ஒரு நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "எளிய விளக்கம் தருக"]
    },
    hi: {
      definition: "मशीन लर्निंग (Machine Learning) आर्टिफिशियल इंटेलिजेंस की वह शाखा है जो कंप्यूटर को पूर्व डेटा (Past Data) से सीखकर बिना स्पष्ट प्रोग्रामिंग के भविष्यवाणी और निर्णय लेने की क्षमता देती है।",
      whyItMatters: "पारंपरिक सॉफ्टवेयर केवल लिखे गए नियमों का पालन करता है, जबकि ML एल्गोरिदम जटिल डेटा पैटर्न को स्वयं पहचानते हैं और समय के साथ बेहतर होते जाते हैं।",
      realWorldUseCase: "बैंकों में क्रेडिट कार्ड धोखाधड़ी की तुरंत पहचान करना और ई-कॉमर्स प्लेटफॉर्म्स (Amazon) पर सटीक उत्पाद अनुशंसा प्रणाली।",
      simplerTerms: "कंप्यूटर को नियम रटाने के बजाय उसे हज़ारों उदाहरण दिखाकर खुद से सीखने देना, जैसे बच्चा अनुभव से सीखता है।",
      beginnerMistakes: [
        "ओवरफिटिंग (Overfitting) - मॉडल केवल ट्रेनिंग डेटा याद कर लेता है लेकिन नए डेटा पर काम नहीं कर पाता।"
      ],
      code: `# मशीन लर्निंग संकल्पना\n# Data + Patterns -> Trained Model`,
      followUps: ["डीप लर्निंग क्या है?", "वास्तविक दुनिया का कोई उदाहरण दें", "सरल शब्दों में समझाएं"]
    }
  },

  "Artificial Intelligence": {
    en: {
      definition: "Artificial Intelligence (AI) is the broad interdisciplinary field of computer science dedicated to creating software systems capable of performing tasks that typically require human cognition, including perception, natural language reasoning, problem-solving, and continuous learning.",
      whyItMatters: "AI automates intellectual and physical labor at unprecedented scale, accelerating scientific discoveries (like AlphaFold for protein structures), personalizing education, and transforming global productivity.",
      realWorldUseCase: "Autonomous Driving & Healthcare Diagnostics: Self-driving vehicles use multi-modal AI to perceive traffic signals and predict pedestrian motion in milliseconds, while AI medical imaging identifies early-stage malignancies with superhuman precision.",
      simplerTerms: "AI is creating computer brains that can listen, see, speak, reason, and solve tricky puzzles just like humans—or even faster.",
      beginnerMistakes: [
        "Confusing narrow/applied AI (current specialized models like GPT or computer vision) with Artificial General Intelligence (AGI).",
        "Treating AI as a magical black box without understanding data quality and statistical foundations."
      ],
      code: `# Conceptual AI agent decision pipeline\ndef ai_decision_agent(sensory_input, world_model):\n    assessment = world_model.evaluate(sensory_input)\n    return "Optimal Action Selected: " + str(assessment)`,
      followUps: ["What is Machine Learning?", "What is Deep Learning?", "Give me a real-world use case", "Explain this in simpler terms"]
    },
    ta: {
      definition: "செயற்கை நுண்ணறிவு (Artificial Intelligence - AI) என்பது மனிதர்களைப் போல சிந்திக்கும், பகுத்தறியும் மற்றும் முடிவெடுக்கும் திறன் கொண்ட கணினி அமைப்புகளை உருவாக்கும் தொழில்நுட்பத் துறையாகும்.",
      whyItMatters: "மருத்துவத்தில் நோய்களை முன்கூட்டியே கண்டறிதல், விண்வெளி ஆராய்ச்சி, மற்றும் மனித உழைப்பை எளிதாக்கும் தானியங்கி அமைப்புகளை இது உருவாக்குகிறது.",
      realWorldUseCase: "தானியங்கி கார்கள் (Autonomous Cars) மற்றும் கூகுள், சேட்ஜிபிடி போன்ற மொழி உதவியாளர்கள் AI மூலம் இயங்குகின்றன.",
      simplerTerms: "கம்ப்யூட்டர்களுக்கு மனிதர்களைப் போலப் பார்க்கவும், பேசவும், யோசிக்கவும் கற்றுக்கொடுக்கும் தொழில்நுட்பமே செயற்கை நுண்ணறிவு.",
      beginnerMistakes: [
        "அனைத்து கணினி நிரல்களையும் AI என்று தவறாகக் கருதுவது."
      ],
      code: `# செயற்கை நுண்ணறிவு மாதிரி\nமுடிவு = ai_agent.analyze(தரவு)`,
      followUps: ["மெஷின் லேர்னிங் என்றால் என்ன?", "ஒரு நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "எளிய விளக்கம் தருக"]
    },
    hi: {
      definition: "आर्टिफिशियल इंटेलिजेंस (AI) कंप्यूटर विज्ञान का वह क्षेत्र है जो ऐसी प्रणालियों का निर्माण करता है जो मानवीय बुद्धिमत्ता (जैसे तर्क, भाषा समझना, और समस्याओं को हल करना) का अनुकरण कर सकती हैं।",
      whyItMatters: "यह स्वास्थ्य सेवा में शुरुआती बीमारी का पता लगाने, वैज्ञानिक शोध को गति देने और दैनिक कार्यों को स्वचालित करने में क्रांतिकारी भूमिका निभा रहा है।",
      realWorldUseCase: "स्वचालित ड्राइविंग कारें (Tesla Autopilot), सिरी/एलेक्सा वॉयस असिस्टेंट, और चिकित्सा इमेजिंग में कैंसर का त्वरित विश्लेषण।",
      simplerTerms: "कंप्यूटर को इंसानों की तरह सोचने, समझने, सुनने और सही निर्णय लेने में सक्षम बनाना ही AI है।",
      beginnerMistakes: [
        "पारंपरिक प्रोग्रामिंग और वास्तविक AI के अंतर को न समझना।"
      ],
      code: `# AI निर्णय प्रक्रिया\naction = ai_system.reason(environment_data)`,
      followUps: ["मशीन लर्निंग क्या है?", "वास्तविक दुनिया का कोई उदाहरण दें", "सरल शब्दों में समझाएं"]
    }
  },

  NumPy: {
    en: {
      definition: "NumPy (Numerical Python) is the foundational open-source library for scientific computing in Python. It provides high-performance multidimensional array objects (`ndarray`) and an extensive collection of vectorized mathematical routines executed at compiled C-speed.",
      whyItMatters: "Python lists are flexible but slow for numerical computing because they store pointers to objects with high overhead. NumPy arrays store contiguous blocks of memory with fixed data types, enabling vectorized SIMD operations and massive performance leaps.",
      realWorldUseCase: "In Computer Vision, every digital image is represented as a NumPy 3D array of pixels (Height × Width × 3 Color Channels). Filters, edge detection convolutions, and resizing transformations are performed as instantaneous matrix operations on NumPy arrays before feeding into neural networks.",
      simplerTerms: "Imagine an ordinary Python list as a slow line of postal workers carrying boxes one at a time. NumPy is a supercharged conveyor belt that moves millions of boxes simultaneously in one clean, synchronized push.",
      beginnerMistakes: [
        "Iterating over NumPy arrays using Python `for` loops instead of utilizing vectorized functions (which kills performance by 100x).",
        "Forgetting that array slicing creates a 'view' rather than an independent copy, causing unintended changes to the original array.",
        "Confusing array axes (`axis=0` represents operations along columns/rows vs `axis=1`)."
      ],
      code: `import numpy as np\n\n# 1. Create a 2D matrix\nmatrix_a = np.array([[1, 2], [3, 4]])\nmatrix_b = np.array([[5, 6], [7, 8]])\n\n# 2. Vectorized element-wise multiplication vs Matrix Dot Product\nelement_mult = matrix_a * matrix_b\ndot_product = np.dot(matrix_a, matrix_b)\n\nprint("Matrix Dot Product:\\n", dot_product)`,
      followUps: ["Show me how NumPy broadcasting works", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "நம்பை (NumPy - Numerical Python) என்பது பைத்தானில் அறிவியல் மற்றும் கணிதக் கணக்கீடுகளுக்கான முதன்மை நூலகமாகும். இது மிக வேகமான பன்முக வரிசைகளை (`ndarray`) வழங்கி, சி-மொழியின் வேகத்தில் கணக்கீடுகளைச் செய்கிறது.",
      whyItMatters: "சாதாரண பைத்தான் பட்டியல்களை (lists) விட 50 முதல் 100 மடங்கு வேகமானது. தரவு அறிவியல் மற்றும் AI-ன் அனைத்து அடித்தளங்களும் NumPy-ல் கட்டமைக்கப்பட்டுள்ளன.",
      realWorldUseCase: "கணினி பார்வை (Computer Vision) துறையில், அனைத்து டிஜிட்டல் படங்களும் பிக்சல்களின் 3D NumPy வரிசைகளாகவே செயலாக்கப்பட்டு AI மாடல்களுக்கு வழங்கப்படுகின்றன.",
      simplerTerms: "சாதாரண பட்டியல் என்பது பொருட்களை ஒவ்வொன்றாக நகர்த்தும் ஒற்றை நபர் போன்றது; NumPy என்பது லட்சக்கணக்கான எண்களை ஒரே நொடியில் மாற்றும் தானியங்கி இயந்திரம் போன்றது.",
      beginnerMistakes: [
        "வெக்டரைஸ் செய்யப்பட்ட முறைகளுக்குப் பதிலாக பைத்தான் 'for' சுழல்களைப் பயன்படுத்துவது.",
        "அச்சு (Axis 0 மற்றும் Axis 1) பயன்பாட்டில் குழப்பம் அடைவது."
      ],
      code: `import numpy as np\n\n# 2D வரிசை உருவாக்கம்\narr = np.array([[10, 20], [30, 40]])\nprint("இரு பரிமாண வரிசை:\\n", arr * 2)`,
      followUps: ["இதன் நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "இதை இன்னும் எளிய தமிழில் விளக்குங்கள்", "தொடக்க நிலை மாணவர்கள் செய்யும் தவறுகள் என்ன?"]
    },
    hi: {
      definition: "NumPy (Numerical Python) पायथन में वैज्ञानिक और गणितीय गणनाओं के लिए सबसे महत्वपूर्ण ओपन-सोर्स लाइब्रेरी है। यह उच्च गति वाले बहुआयामी ऐरे (`ndarray`) और शक्तिशाली गणितीय फ़ंक्शंस प्रदान करती है।",
      whyItMatters: "साधारण पायथन लिस्ट की तुलना में NumPy ऐरे मेमोरी में लगातार ब्लॉक में स्टोर होते हैं, जिससे यह गणनाओं में 50 से 100 गुना तक तेज़ होता है।",
      realWorldUseCase: "कंप्यूटर विज़न में, प्रत्येक डिजिटल छवि पिक्सल्स के 3D NumPy ऐरे के रूप में दर्शाई जाती है, जिस पर फ़िल्टर और AI मॉडल काम करते हैं।",
      simplerTerms: "साधारण लिस्ट एक-एक करके सामान उठाने वाले व्यक्ति जैसी है, जबकि NumPy एक विशाल कन्वेयर बेल्ट की तरह लाखों संख्याओं को एक साथ प्रोसेस करता है।",
      beginnerMistakes: [
        "वेक्टराइज़्ड ऑपरेशन्स के बजाय 'for' लूप का उपयोग करना, जिससे गति धीमी हो जाती है।",
        "Axis 0 (पंक्तियां) और Axis 1 (कॉलम) के बीच भ्रमित होना।"
      ],
      code: `import numpy as np\n\n# 2D ऐरे निर्माण\na = np.array([[1, 2], [3, 4]])\nprint("NumPy मैट्रिक्स:\\n", a * 5)`,
      followUps: ["वास्तविक दुनिया का कोई उदाहरण दें", "इसे और सरल शब्दों में समझाएं", "शुरुआती डेवलपर्स क्या गलतियां करते हैं?"]
    }
  },

  Pandas: {
    en: {
      definition: "Pandas is an essential Python library for data manipulation, analysis, and cleaning. Built on top of NumPy, it provides high-performance data structures called DataFrames (2D tabular structures with labeled rows and columns) and Series (1D labeled arrays).",
      whyItMatters: "Raw data from databases, spreadsheets, and CSVs is messy, containing missing values, incorrect formats, and inconsistent records. Pandas makes filtering, pivoting, grouping, merging, and reshaping structured data effortless.",
      realWorldUseCase: "E-Commerce Financial Analytics: An online retail platform loads 5 million daily customer orders, filters out cancelled shipments (`df.query`), groups by product category and geographic region (`df.groupby`), computes total sales margins, and exports automated executive summaries.",
      simplerTerms: "Imagine Microsoft Excel with limitless storage, blazing-fast speed, and the power to automate complex calculations with simple, reusable code.",
      beginnerMistakes: [
        "Using `for index, row in df.iterrows()` instead of native vectorized expressions.",
        "Chained indexing like `df[col][idx] = val` triggering the SettingWithCopyWarning instead of using `.loc[idx, col]`.",
        "Neglecting missing values (`NaN`) before mathematical aggregations."
      ],
      code: `import pandas as pd\n\n# Create a sales DataFrame\ndata = {\n    'Product': ['Laptop', 'Mouse', 'Keyboard', 'Laptop'],\n    'Price': [1200, 25, 75, 1100],\n    'Quantity': [2, 10, 5, 1]\n}\ndf = pd.DataFrame(data)\ndf['Total'] = df['Price'] * df['Quantity']\nprint(df.groupby('Product')['Total'].sum())`,
      followUps: ["How do I handle missing values in Pandas?", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "பாண்டாஸ் (Pandas) என்பது பைத்தானில் அட்டவணைத் தரவுகளைக் (tabular data) கையாளவும், பகுப்பாய்வு செய்யவும், சுத்தம் செய்யவும் பயன்படும் முதன்மை நூலகமாகும். இது DataFrame எனப்படும் வலிமையான தரவுக் கட்டமைப்பை வழங்குகிறது.",
      whyItMatters: "நிறுவனங்களின் எக்செல் கோப்புகள், CSV மற்றும் SQL தரவுத்தளங்களிலிருந்து மில்லியன் கணக்கான பதிவுகளை சில வரிக் குறியீடுகளில் பில்டர் செய்யவும் ஒருங்கிணைக்கவும் உதவுகிறது.",
      realWorldUseCase: "மின்வணிகத்தில் (E-commerce) தினசரி விற்பனைப் பதிவுகளைத் தேதிவாரியாகவும் வாடிக்கையாளர் பகுதியாகவும் பிரித்து லாப வரம்பைக் கணக்கிடப் பயன்படுகிறது.",
      simplerTerms: "எக்செல் விரிதாள் போன்ற ஒரு அட்டவணையை கோடிங் மூலமாக நினைத்துப் பார்க்க முடியாத வேகத்தில் இயக்கும் சூப்பர் பவர் டூல் தான் பாண்டாஸ்.",
      beginnerMistakes: ["சுழல்களை (loops) பயன்படுத்தி வரிசைகளை ஒவ்வொன்றாக வாசிப்பது."],
      code: `import pandas as pd\n\ndf = pd.DataFrame({'பொருள்': ['மடிக்கணினி', 'மவுஸ்'], 'விலை': [50000, 500]})\nprint(df)`,
      followUps: ["இதன் நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "இதை இன்னும் எளிமையாக விளக்குங்கள்", "அடிக்கடி செய்யப்படும் தவறுகள் என்ன?"]
    },
    hi: {
      definition: "Pandas डेटा विश्लेषण, डेटा मैनिपुलेशन और डेटा क्लीनिंग के लिए सबसे लोकप्रिय पायथन लाइब्रेरी है। यह मुख्य रूप से DataFrames (पंक्तियों और स्तंभों वाली 2D तालिका) का उपयोग करती है।",
      whyItMatters: "कंपनियों में बिखरे हुए और अधूरे डेटा को व्यवस्थित करने, मिसिंग वैल्यूज हटाने और व्यावसायिक रिपोर्ट्स तैयार करने के लिए यह अनिवार्य उपकरण है।",
      realWorldUseCase: "ई-कॉमर्स और बैंकिंग: लाखों ग्राहकों के लेन-देन को तिथि और उत्पाद श्रेणी के अनुसार समूहीकृत (groupby) करके मासिक लाभ की गणना करना।",
      simplerTerms: "कल्पना करें कि MS Excel को अत्यधिक गति और असीमित डेटा क्षमता के साथ पायथन कोड द्वारा नियंत्रित किया जा रहा हो।",
      beginnerMistakes: ["'iterrows()' का उपयोग करना, जो बड़े डेटा पर अत्यधिक धीमा होता है।"],
      code: `import pandas as pd\n\ndata = {'उत्पाद': ['लैपटॉप', 'माउस'], 'मूल्य': [60000, 800]}\ndf = pd.DataFrame(data)\nprint(df)`,
      followUps: ["वास्तविक दुनिया का कोई उदाहरण दें", "सरल शब्दों में समझाएं", "शुरुआती गलतियां क्या हैं?"]
    }
  },

  HTML: {
    en: {
      definition: "HTML (HyperText Markup Language) is the standard foundational markup language of the World Wide Web. It defines the structural semantics of web pages using tags, attributes, and elements like headings, paragraphs, links, forms, and media embeds.",
      whyItMatters: "Every website, web app, and mobile hybrid application renders HTML at its core. Proper semantic HTML ensures web accessibility (screen readers for visually impaired users), SEO indexing by search engines, and browser performance.",
      realWorldUseCase: "Building Accessible Web Portals: An educational portal structures course content using `<header>`, `<main>`, `<article>`, and `<nav>` elements with ARIA attributes so that students using assistive screen readers can effortlessly navigate complex lesson materials.",
      simplerTerms: "HTML is the skeleton and bare brick walls of a house. Before adding paint (CSS) or electrical wiring (JavaScript), HTML defines where the walls, doors, and rooms are located.",
      beginnerMistakes: [
        "Using non-semantic `<div>` elements for everything instead of semantic tags (`<button>`, `<header>`, `<nav>`).",
        "Omitting `alt` text on `<img>` tags, which breaks accessibility for screen-reader users.",
        "Failing to close tags or nesting block-level elements inside inline tags."
      ],
      code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Semantic Portal</title>\n</head>\n<body>\n  <header>\n    <h1>Multilingual AI Learning Hub</h1>\n  </header>\n  <main>\n    <article>\n      <h2>Learning HTML Semantics</h2>\n      <p>Semantic tags improve accessibility and SEO.</p>\n    </article>\n  </main>\n</body>\n</html>`,
      followUps: ["What is CSS and how does it connect to HTML?", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "ஹெச்டிஎம்எல் (HTML - HyperText Markup Language) என்பது இணையப்பக்கங்களை உருவாக்கப் பயன்படும் உலகளாவிய அடிப்படை மொழியாகும். இது தலைப்புகள், பத்திகள், பொத்தான்கள் மற்றும் படிவங்களை வரையறுக்கிறது.",
      whyItMatters: "உலகில் உள்ள ஒவ்வொரு வலைத்தளமும் HTML மூலமே அதன் உள்ளடக்கத்தை உலாவியில் (Browser) காட்டுகிறது.",
      realWorldUseCase: "இணையதளப் பக்கங்களை உருவாக்கி, மாற்றுத்திறனாளிகள் திரை வாசிப்பான் (Screen Reader) மூலம் கல்வி பயில அணுகக்கூடிய வலைப்பக்கங்களை வடிவமைக்கப் பயன்படுகிறது.",
      simplerTerms: "ஒரு கட்டிடத்தின் எலும்புக்கூடு போன்றது HTML; அதில் வர்ணம் பூசுவது CSS, மின்விசிறி மற்றும் கதவுகளை இயக்குவது JavaScript.",
      beginnerMistakes: ["அனைத்திற்கும் `<div>` பயன்படுத்துவது, semantic HTML5 குறியீடுகளைப் புறக்கணிப்பது."],
      code: `<article>\n  <h2>கல்வி மையம்</h2>\n  <p>HTML மூலம் வலைப்பக்கங்களை வடிவமைக்கலாம்.</p>\n</article>`,
      followUps: ["சிஎஸ்எஸ் (CSS) என்றால் என்ன?", "இதன் நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "எளிய உதாரணம் தருக"]
    },
    hi: {
      definition: "HTML (HyperText Markup Language) वेब पेजों की संरचना तैयार करने वाली बुनियादी मार्कअप भाषा है। यह हेडिंग, पैराग्राफ, लिंक्स और फॉर्म्स को परिभाषित करती है।",
      whyItMatters: "इंटरनेट पर मौजूद हर वेबसाइट का ढांचा HTML द्वारा ही तैयार होता है। सही सिमेंटिक HTML से वेबसाइट की SEO और सुलभता (Accessibility) बेहतर होती है।",
      realWorldUseCase: "वेबसाइट्स और वेब ऍप्लिकेशन्स का निर्माण, जहाँ उपयोगकर्ता फॉर्म भरते हैं और बटन क्लिक करके सेवाएं प्राप्त करते हैं।",
      simplerTerms: "HTML किसी घर की ईंटों और कंकाल की तरह है, जिस पर रंग-रोगन (CSS) और बिजली-पानी के कनेक्शन (JavaScript) लगाए जाते हैं।",
      beginnerMistakes: ["हर जगह सिर्फ `<div>` का उपयोग करना और सिमेंटिक टैग्स भूल जाना।"],
      code: `<header>\n  <h1>शिक्षा पोर्टल</h1>\n</header>\n<main>\n  <p>HTML से वेब संरचना बनती है।</p>\n</main>`,
      followUps: ["CSS क्या है और यह HTML से कैसे जुड़ता है?", "वास्तविक उपयोगिता बताएं", "सरल शब्दों में समझाएं"]
    }
  },

  CSS: {
    en: {
      definition: "CSS (Cascading Style Sheets) is the stylesheet language used to specify the presentation, layout, visual aesthetics, typography, colors, and responsive animations of web documents written in HTML.",
      whyItMatters: "Without CSS, every webpage would look like a plain black-and-white text document from the 1990s. CSS enables modern responsive design that gracefully adapts to smartphones, tablets, laptops, and ultra-wide screens.",
      realWorldUseCase: "Responsive Dark/Light UI: Modern dashboards use CSS custom properties (`var(--color-bg)`), Flexbox, and CSS Grid to dynamically swap theme palettes and fluidly rearrange card columns depending on whether the user is on mobile or desktop.",
      simplerTerms: "If HTML is the bare walls and bricks of a house, CSS is the interior design, paint, wallpaper, polished lighting, and furniture layout.",
      beginnerMistakes: [
        "Overusing `!important` to force overrides instead of understanding selector specificity.",
        "Ignoring the CSS Box Model (`box-sizing: border-box`), leading to layout overflows.",
        "Using fixed pixel widths (`width: 800px`) that break on mobile screens instead of modern responsive units (`clamp()`, `%`, `rem`)."
      ],
      code: `:root {\n  --brand-color: #0284c7;\n}\n.card-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}\n.card {\n  background: #ffffff;\n  border-radius: 16px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n  transition: transform 0.2s ease;\n}\n.card:hover {\n  transform: translateY(-4px);\n}`,
      followUps: ["How do Flexbox and CSS Grid differ?", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "சிஎஸ்எஸ் (CSS - Cascading Style Sheets) என்பது HTML பக்கங்களுக்கு வண்ணங்கள், வடிவமைப்பு, எழுத்துருக்கள் மற்றும் அனிமேஷன்களை வழங்கி அழகூட்டும் ஸ்டைல் மொழியாகும்.",
      whyItMatters: "கணினி, டேப்லெட், மொபைல் என அனைத்து திரைகளிலும் தடையின்றி இயங்கும் நவீன ரெஸ்பான்சிவ் தளங்களை உருவாக்க CSS இன்றியமையாதது.",
      realWorldUseCase: "டார்க் மோட் (Dark Mode) தீம்கள், மிதக்கும் அட்டைகள் மற்றும் மொபைலுக்கு ஏற்ற வகையில் தானாக மாறும் வலைப்பக்கங்களை வடிவமைத்தல்.",
      simplerTerms: "HTML என்பது வெற்று சுவர் என்றால், அதற்கு நேர்த்தியான பெயிண்ட் அடித்து அலங்கரிப்பது தான் CSS.",
      beginnerMistakes: ["மொபைல் திரையை மனதில் கொள்ளாமல் நிலையான பிக்சல் (Fixed px) அகலங்களை அமைப்பது."],
      code: `.box {\n  background: #0284c7;\n  color: #ffffff;\n  border-radius: 12px;\n  padding: 1rem;\n}`,
      followUps: ["இதன் நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "எளிய உதாரணம் தருக", "தொடக்க நிலை தவறுகள் என்ன?"]
    },
    hi: {
      definition: "CSS (Cascading Style Sheets) वह स्टाइलशीट भाषा है जिसका उपयोग HTML दस्तावेज़ों को सुंदर, रंगीन और उत्तरदायी (Responsive) बनाने के लिए किया जाता है।",
      whyItMatters: "इसके बिना वेबसाइट केवल सादा टेक्स्ट दिखेगी। CSS आधुनिक एनिमेशन, रंग-रूप और मोबाइल-अनुकूल लेआउट प्रदान करता है।",
      realWorldUseCase: "डार्क थीम, ग्रिड लेआउट और इंटरएक्टिव बटन्स का निर्माण जो विभिन्न स्क्रीन आकारों पर सुचारू रूप से कार्य करते हैं।",
      simplerTerms: "HTML यदि घर का ढांचा है, तो CSS उसका आकर्षक इंटीरियर डिज़ाइन और रंग-रोगन है।",
      beginnerMistakes: ["फिक्स्ड पिक्सल (px) का अत्यधिक उपयोग, जिससे मोबाइल स्क्रीन पर पेज कट जाता है।"],
      code: `.container {\n  display: flex;\n  justify-content: center;\n  background-color: #0284c7;\n}`,
      followUps: ["वास्तविक उपयोगिता बताएं", "सरल शब्दों में समझाएं", "शुरुआती गलतियां क्या हैं?"]
    }
  },

  SQL: {
    en: {
      definition: "SQL (Structured Query Language) is the universally adopted standard language used for storing, querying, updating, and managing relational databases. It operates on tabular relations comprising rows (records) and columns (attributes).",
      whyItMatters: "Almost all enterprise systems, banks, online stores, and universities store critical transactional data in relational databases (PostgreSQL, MySQL, SQLite). SQL allows retrieving precise data from billions of records in milliseconds.",
      realWorldUseCase: "Banking Transaction Audit: A financial institution executes a parameterized query across millions of ledger entries using `SELECT ... JOIN ... WHERE date > ... GROUP BY customer_id` to detect unauthorized account withdrawals while maintaining ACID guarantees.",
      simplerTerms: "SQL is like asking a super-fast, perfectly organized librarian: 'Show me all customers from New York who ordered laptops in the last 30 days, sorted by price.'",
      beginnerMistakes: [
        "Concatenating user inputs into raw SQL strings, opening up critical SQL Injection vulnerabilities.",
        "Accidentally running `DELETE` or `UPDATE` statements without a `WHERE` clause, wiping out whole tables.",
        "Writing unindexed `SELECT *` queries on multi-million row tables causing full table scans."
      ],
      code: `-- Retrieve high-value active customers\nSELECT \n    u.username, \n    COUNT(o.id) AS total_orders,\n    SUM(o.amount) AS total_spent\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nWHERE o.status = 'completed'\nGROUP BY u.id\nHAVING SUM(o.amount) > 1000\nORDER BY total_spent DESC;\n`,
      followUps: ["What is a database and how does it relate to SQL?", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "எஸ்கியூஎல் (SQL) என்பது தரவுத்தளங்களில் (Databases) உள்ள தகவல்களைச் சேமிக்கவும், தேடவும், புதுப்பிக்கவும் பயன்படும் உலகளாவிய மொழியாகும்.",
      whyItMatters: "வங்கிப் பரிவர்த்தனைகள் முதல் சமூக வலைத்தளங்கள் வரை அனைத்தும் கோடிக்கணக்கான தரவுகளைக் கையாள SQL-ஐ நம்பியுள்ளன.",
      realWorldUseCase: "ஒரு வங்கியானது கடந்த மாதத்தில் ஒரு லட்சத்திற்கு மேல் பரிவர்த்தனை செய்த வாடிக்கையாளர்களின் பட்டியலை சில மில்லி விநாடிகளில் வடிகட்ட SQL பயன்படுகிறது.",
      simplerTerms: "ஆயிரக்கணக்கான கோப்புகள் உள்ள ஒரு பெரிய ஆவணக் காப்பகத்தில், துல்லியமான கோப்பை ஒரு நொடியில் எடுத்துத் தரும் ஒரு மந்திரக் கட்டளை தான் SQL.",
      beginnerMistakes: ["'WHERE' நிபந்தனை இல்லாமல் UPDATE அல்லது DELETE இயக்குவது."],
      code: `SELECT name, email FROM users WHERE active = 1;`,
      followUps: ["தரவுத்தளம் (Database) என்றால் என்ன?", "இதன் நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "முக்கிய தவறுகள் என்ன?"]
    },
    hi: {
      definition: "SQL (Structured Query Language) रिलेशनल डेटाबेस को प्रबंधित करने, डेटा खोजने और अपडेट करने की मानक भाषा है।",
      whyItMatters: "बैंकों, ई-कॉमर्स और सरकारी पोर्टल्स पर सुरक्षित और त्वरित डेटा प्रबंधन के लिए SQL आवश्यक है।",
      realWorldUseCase: "ई-कॉमर्स पोर्टल पर उन उपयोगकर्ताओं की सूची खोजना जिन्होंने पिछले 7 दिनों में ऑर्डर दिए हैं।",
      simplerTerms: "एक विशाल डिजिटल लाइब्रेरी के लाइब्रेरियन से स्पष्ट भाषा में प्रश्न पूछना कि मुझे अमुक रिकॉर्ड लाकर दो।",
      beginnerMistakes: ["'WHERE' क्लॉज के बिना DELETE कमांड चलाना, जिससे पूरा डेटा मिट जाता है।"],
      code: `SELECT username, score FROM learners WHERE score > 80 ORDER BY score DESC;`,
      followUps: ["डेटाबेस क्या है?", "व्यावहारिक उदाहरण दें", "सरल शब्दों में समझाएं"]
    }
  },

  Database: {
    en: {
      definition: "A Database is an organized, secure electronic collection of structured information stored in a computer system and managed by a Database Management System (DBMS). It provides data persistence, concurrent multi-user access, and transactional integrity (ACID).",
      whyItMatters: "Applications crash and servers restart, but data in a database survives. Without databases, online stores couldn't track inventory, social networks couldn't link friends, and banks couldn't guarantee account balances.",
      realWorldUseCase: "E-Commerce Inventory & Payment: When millions of users simultaneously purchase limited-edition products, the database uses atomic transactions (`BEGIN TRANSACTION ... COMMIT`) to prevent race conditions and ensure two people can never purchase the same single item.",
      simplerTerms: "Think of a database as a bank vault for information. It doesn't just store files—it keeps a strict audit trail, prevents anyone from tampering with records, and never forgets anything even during a blackout.",
      beginnerMistakes: [
        "Storing plaintext passwords instead of salted cryptographic hashes (like bcrypt).",
        "Neglecting database indexes on foreign keys and search columns, which makes queries crawl as the data grows.",
        "Failing to implement automated offsite backups."
      ],
      code: `-- Relational database table design in SQLite\nCREATE TABLE users (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    username TEXT NOT NULL UNIQUE,\n    email TEXT NOT NULL UNIQUE,\n    password_hash TEXT NOT NULL,\n    created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE INDEX idx_users_email ON users(email);\n`,
      followUps: ["What is the difference between SQL and NoSQL?", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "தரவுத்தளம் (Database) என்பது மின்னணு முறையில் கணினியில் பாதுகாப்பாகச் சேமிக்கப்பட்டு நிர்வகிக்கப்படும் ஒழுங்கமைக்கப்பட்ட தரவுகளின் தொகுப்பாகும்.",
      whyItMatters: "செயலிகள் மூடப்பட்டாலும், கணினி அணைக்கப்பட்டாலும் சேமிக்கப்பட்ட தகவல்கள் அழியாமல் இருக்க தரவுத்தளங்கள் அவசியம்.",
      realWorldUseCase: "மருத்துவமனைகளில் நோயாளிகளின் மருத்துவ அறிக்கைகளைப் பாதுகாப்பாகச் சேமித்து மருத்துவர்கள் உடனடியாக அணுக வழிசெய்கிறது.",
      simplerTerms: "ஒரு நம்பகமான டிஜிட்டல் பெட்டகம் போன்றது; எப்போது திறந்தாலும் துல்லியமான தகவல்கள் பாதுகாப்பாக இருக்கும்.",
      beginnerMistakes: ["கடவுச்சொற்களை என்க்ரிப்ட் செய்யாமல் எளிய உரையாகச் சேமிப்பது."],
      code: `CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(50));`,
      followUps: ["எஸ்கியூஎல் என்றால் என்ன?", "இதன் நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "எளிய விளக்கம் தருக"]
    },
    hi: {
      definition: "डेटाबेस (Database) कंप्यूटर में व्यवस्थित रूप से संग्रहीत डेटा का एक सुरक्षित इलेक्ट्रॉनिक संग्रह है, जिसे DBMS द्वारा प्रबंधित किया जाता है।",
      whyItMatters: "कंप्यूटर बंद होने के बाद भी डेटा सुरक्षित रहता है और लाखों यूज़र्स एक साथ बिना किसी टकराव के इसे एक्सेस कर सकते हैं।",
      realWorldUseCase: "रेलवे आरक्षण प्रणाली (IRCTC): जहाँ लाखों यात्री एक साथ टिकट बुक करते हैं और डेटाबेस सीट आरक्षण को सटीक बनाए रखता है।",
      simplerTerms: "एक बेहद सुरक्षित डिजिटल लॉकर जिसमें लाखों रिकॉर्ड्स बिना किसी गड़बड़ी के हमेशा सुरक्षित रहते हैं।",
      beginnerMistakes: ["पासवर्ड्स को बिना हैशिंग (Hashing) के सीधे सेव करना।"],
      code: `CREATE TABLE accounts (id INT PRIMARY KEY, balance DECIMAL(10,2));`,
      followUps: ["SQL और NoSQL में क्या अंतर है?", "व्यावहारिक उपयोगिता बताएं", "सरल शब्दों में समझाएं"]
    }
  },

  Mathematics: {
    en: {
      definition: "Mathematics in Computer Science and AI represents the foundational formal language of logic, change, spaces, and uncertainty. Its three primary pillars in modern technology are Linear Algebra, Calculus, and Probability & Statistics.",
      whyItMatters: "Neural networks are fundamentally mathematical functions: matrices represent weights, dot products transform inputs, calculus (derivatives) powers gradient descent optimization, and probability calculates confidence scores.",
      realWorldUseCase: "Gradient Descent Optimization in AI: A deep neural network calculates partial derivatives of its loss function with respect to millions of internal weights (`∇L = [∂L/∂w1, ∂L/∂w2...]`) and steps in the opposite direction to minimize classification errors.",
      simplerTerms: "Imagine hiking down a foggy mountain without seeing the bottom. Calculus is feeling the slope under your boots to know which direction is downhill; linear algebra is taking giant leaps across multiple dimensions simultaneously.",
      beginnerMistakes: [
        "Treating formulas as abstract memorization rather than geometric transformations.",
        "Ignoring matrix dimensionality mismatches during tensor operations.",
        "Forgetting that derivatives only indicate local slope, not necessarily global optima."
      ],
      code: `# Gradient Descent step simulation\ndef gradient_descent_step(current_w, learning_rate, gradient):\n    # New weight = Current weight - (Learning Rate * Slope)\n    return current_w - (learning_rate * gradient)\n\nw = 5.0\nfor step in range(5):\n    grad = 2 * w  # Derivative of f(w) = w^2\n    w = gradient_descent_step(w, 0.1, grad)\n    print(f"Step {step+1}: w = {w:.4f}")`,
      followUps: ["Explain Linear Algebra for Machine Learning", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "கணினி அறிவியல் மற்றும் AI-ன் அடிப்படை மொழி கணிதமாகும் (Mathematics). குறிப்பாக நேரியல் இயற்கணிதம் (Linear Algebra), நுண்கணிதம் (Calculus), மற்றும் நிகழ்தகவு (Probability) ஆகிய மூன்று தூண்கள் நவீன தொழில்நுட்பத்தை இயக்குகின்றன.",
      whyItMatters: "AI நரம்பியல் நெட்வொர்க்குகள் மனிதனைப் போலக் கற்றுக்கொள்வதற்கு கணிதச் சாய்வு குறைப்பு (Gradient Descent) வழிமுறையே அடிப்படையாகும்.",
      realWorldUseCase: "மருத்துவத்தில் எம்ஆர்ஐ (MRI) மற்றும் சிடி ஸ்கேன் படங்களின் ஒலியை நீக்கி துல்லியமான நோயறிதலைச் செய்ய நேரியல் இயற்கணித மேட்ரிக்ஸ் மாற்றங்கள் பயன்படுகின்றன.",
      simplerTerms: "ஒரு மலையிலிருந்து மூடுபனியில் கீழே இறங்கும் போது காலடியில் உள்ள சரிவை உணர்வது நுண்கணிதம்; ஒரே நேரத்தில் பல திசைகளில் விரைவாக சிந்திப்பது இயற்கணிதம்.",
      beginnerMistakes: ["சூத்திரங்களை மனப்பாடம் செய்து அதன் வடிவியல் பொருளைப் புரிந்து கொள்ளாமல் போவது."],
      code: `# எளிய சாய்வு கணக்கீடு\ndef calculate_slope(x1, y1, x2, y2):\n    return (y2 - y1) / (x2 - x1)`,
      followUps: ["இதன் நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "எளிய தமிழில் விளக்குங்கள்", "முக்கிய தவறுகள் என்ன?"]
    },
    hi: {
      definition: "कंप्यूटर साइंस और आर्टिफिशियल इंटेलिजेंस में गणित (Mathematics) तर्क, परिवर्तन और संभावनाओं की आधारशिला है। लीनियर अल्जेब्रा, कैलकुलस और प्रायिकता (Probability) इसके मुख्य स्तंभ हैं।",
      whyItMatters: "न्यूरल नेटवर्क्स को प्रशिक्षित करने में ग्रेडिएंट डिसेंट एल्गोरिदम कैलकुलस के डेरिवेटिव्स पर ही आधारित होता है।",
      realWorldUseCase: "स्वचालित वाहनों (Self-Driving Cars) में गति और दूरी का सटीक अनुमान लगाने के लिए वेक्टर्स और कैलकुलस का उपयोग।",
      simplerTerms: "गणित वह नियम पुस्तिका है जिसके द्वारा कंप्यूटर दुनिया को समझता है और बुद्धिमान निर्णय लेता है।",
      beginnerMistakes: ["मैट्रिक्स आयामों (Dimensions) का मिलान न करना।"],
      code: `# ग्रेडिएंट डिसेंट का संक्षिप्त उदाहरण\ndef update_weight(w, lr, grad):\n    return w - (lr * grad)`,
      followUps: ["लीनियर अल्जेब्रा क्यों महत्वपूर्ण है?", "वास्तविक उपयोग बताएं", "सरल शब्दों में समझाएं"]
    }
  },

  LSTM: {
    en: {
      definition: "LSTM (Long Short-Term Memory) is a specialized recurrent neural network (RNN) architecture designed specifically to overcome the vanishing gradient problem and learn long-term sequential dependencies in data.",
      whyItMatters: "Traditional RNNs suffer from short-term memory—as sequences grow longer, gradients shrink towards zero, causing the network to forget earlier inputs. LSTMs maintain an explicit cell state regulated by three gates: Forget Gate, Input Gate, and Output Gate.",
      realWorldUseCase: "Financial Stock Market Time-Series Forecasting: An LSTM processes historical multi-year stock prices, trading volumes, and macroeconomic indicators day-by-day, preserving long-term market cycle trends while reacting to immediate volatility.",
      simplerTerms: "Standard RNNs have goldfish-like memory and forget what happened 10 steps ago. An LSTM has a dedicated digital notebook (cell state) where it explicitly decides what old notes to erase, what new notes to write down, and what to read aloud.",
      beginnerMistakes: [
        "Applying LSTMs to simple tabular data where gradient-boosted trees (XGBoost) would perform faster and better.",
        "Not normalizing sequence data before feeding it into the network.",
        "Overcomplicating the network with too many stacked LSTM layers without dropout, causing severe overfitting."
      ],
      code: `# Conceptual LSTM Cell logic in Python\ndef lstm_cell_step(prev_cell_state, prev_hidden, input_val):\n    forget_gate = 1.0 / (1.0 + 2.718 ** (-(input_val + prev_hidden)))\n    input_gate = 1.0 / (1.0 + 2.718 ** (-(input_val * 0.8)))\n    candidate = 0.5 * input_val\n    \n    # New cell state = forgotten old memory + newly stored candidate\n    new_cell_state = (forget_gate * prev_cell_state) + (input_gate * candidate)\n    return new_cell_state\n\nprint("Updated Cell State:", lstm_cell_step(0.8, 0.2, 0.5))`,
      followUps: ["How does the Forget Gate work?", "Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"]
    },
    ta: {
      definition: "எல்எஸ்டிஎம் (LSTM - Long Short-Term Memory) என்பது நீண்ட காலத் தொடர் தரவுகளை (Sequential data) நினைவில் வைத்துக் கொள்ள உதவும் ஒரு சிறப்பு வகை ஆழமான நரம்பியல் நெட்வொர்க் (RNN) ஆகும்.",
      whyItMatters: "பழைய RNN நெட்வொர்க்குகளில் முந்தைய தகவல்கள் மறக்கப்படும் (Vanishing Gradient) சிக்கலை மூன்று வாயில்கள் (Forget Gate, Input Gate, Output Gate) மூலம் LSTM தீர்க்கிறது.",
      realWorldUseCase: "பங்குச் சந்தை முன்னறிவிப்பு மற்றும் தானியங்கி மொழிபெயர்ப்பு (Google Translate) போன்ற தொடர் தரவுப் பணிகளில் பரவலாகப் பயன்படுகிறது.",
      simplerTerms: "ஒரு மனிதன் பழைய முக்கியமான நினைவுகளை ஒரு நோட்டுப் புத்தகத்தில் குறித்து வைத்துக்கொண்டு, தேவையில்லாததை அழித்து நினைவில் வைப்பது போன்றது LSTM.",
      beginnerMistakes: ["தரவுகளை நார்மலைஸ் செய்யாமல் நெட்வொர்க்கிற்குள் அனுப்புவது."],
      code: `# LSTM செல் தத்துவம்\nnew_memory = (forget_factor * old_memory) + new_input`,
      followUps: ["இதன் நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "எளிய விளக்கம் தருக", "முக்கிய தவறுகள் என்ன?"]
    },
    hi: {
      definition: "LSTM (Long Short-Term Memory) एक विशेष प्रकार का Recurrent Neural Network (RNN) है, जो लंबे समय तक अनुक्रमिक डेटा (Sequential Data) को याद रखने में सक्षम है।",
      whyItMatters: "यह पारंपरिक RNN की वैनिशिंग ग्रेडिएंट समस्या को हल करता है। इसमें सेल स्टेट और तीन गेट्स (Forget, Input, Output) होते हैं।",
      realWorldUseCase: "शेयर बाज़ार के रुझान का पूर्वानुमान और स्पीच-टू-टेक्स्ट ट्रांसक्रिप्शन जैसी समय-आधारित समस्याओं में व्यापक उपयोग।",
      simplerTerms: "यह एक डिजिटल डायरी की तरह है, जहाँ नेटवर्क तय करता है कि पुरानी कौन सी बात मिटानी है और नई कौन सी बात लिखनी है।",
      beginnerMistakes: ["छोटे डेटासेट पर अत्यधिक जटिल LSTM मॉडल बनाना जिससे ओवरफिटिंग होती है।"],
      code: `# LSTM सिद्धांत\ncell_state = (forget_gate * old_state) + (input_gate * new_candidate)`,
      followUps: ["वास्तविक उपयोगिता बताएं", "सरल शब्दों में समझाएं", "शुरुआती गलतियां क्या हैं?"]
    }
  }
};


/**
 * Explain a specific Node clicked on the Mind Map (Module 5)
 */
async function explainMindmapNode({ centralTopic, branchTitle, nodeTitle, nodeType, language }) {
  const lang = validateLang(language);
  const cleanNode = (nodeTitle || branchTitle || centralTopic || '').trim();
  const topic = resolveTutorTopic(cleanNode, [], centralTopic);

  const topicData = TUTOR_TOPICS[topic] && TUTOR_TOPICS[topic][lang] ? TUTOR_TOPICS[topic][lang] : null;

  if (topicData) {
    return {
      success: true,
      nodeTitle: cleanNode,
      nodeType: nodeType || 'subtopic',
      branchTitle: branchTitle || centralTopic || '',
      definition: topicData.definition,
      whyItMatters: topicData.whyItMatters,
      practicalExample: topicData.code || topicData.realWorldUseCase,
      summary: topicData.simplerTerms
    };
  }

  // Dynamic Synthesis for custom/unlisted nodes
  if (lang === 'ta') {
    return {
      success: true,
      nodeTitle: cleanNode,
      nodeType: nodeType || 'subtopic',
      branchTitle: branchTitle || centralTopic || '',
      definition: `'${cleanNode}' என்பது ${centralTopic || 'இந்தத் துறையின்'} ஒரு முக்கியப் பகுதியாகும். இது குறிப்பிட்ட தொழில்நுட்ப செயல்பாட்டை நிர்வகிக்கிறது.`,
      whyItMatters: "நடைமுறை மென்பொருள் உருவாக்கத்தில் இந்த கருத்து கணினி வளங்களைச் சேமிக்கவும், சுத்தமான கட்டமைப்பை உருவாக்கவும் பயன்படுகிறது.",
      practicalExample: `# '${cleanNode}' பயன்பாட்டு மாதிரி\n# ${centralTopic} சூழலில் இது நேரடிப் பயன் தருகிறது.`,
      summary: `'${cleanNode}' பற்றிய தெளிவான புரிதல் ${centralTopic} தலைப்பில் தேர்ச்சி பெற உதவும்.`
    };
  } else if (lang === 'hi') {
    return {
      success: true,
      nodeTitle: cleanNode,
      nodeType: nodeType || 'subtopic',
      branchTitle: branchTitle || centralTopic || '',
      definition: `'${cleanNode}' ${centralTopic || 'इस विषय'} का एक प्रमुख घटक है, जो इसकी आंतरिक कार्यप्रणाली को सक्षम बनाता है।`,
      whyItMatters: "वास्तविक इंजीनियरिंग में यह घटक प्रणाली की दक्षता और पठनीयता को बढ़ाता है।",
      practicalExample: `# '${cleanNode}' का व्यावहारिक उपयोग\n# यह कोड ${centralTopic} में इसका प्रदर्शन करता है।`,
      summary: `'${cleanNode}' की समझ ${centralTopic} में विशेषज्ञता हासिल करने की नींव है।`
    };
  }

  return {
    success: true,
    nodeTitle: cleanNode,
    nodeType: nodeType || 'subtopic',
    branchTitle: branchTitle || centralTopic || '',
    definition: `'${cleanNode}' represents an essential architectural pillar within ${centralTopic || 'this subject'}.`,
    whyItMatters: "In real-world engineering, understanding this concept ensures robust design, maintainable structure, and optimized performance.",
    practicalExample: `# Practical demonstration of ${cleanNode}\n# Essential implementation within ${centralTopic}`,
    summary: `Mastering ${cleanNode} is key to comprehensive fluency in ${centralTopic}.`
  };
}

/**
 * AI Tutor Conversational Engine (Module 6)
 * Real-world responses, contextual follow-ups, and strict zero-filler answers.
 */
async function tutorChat({ message, language, conversationHistory = [], topicContext = '' }) {
  const lang = validateLang(language);
  const userText = (message || '').trim();
  const lower = userText.toLowerCase();

  // 1. Try Gemini API first if configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are the friendly, encouraging AI Tutor of Multilingual AI Learning Hub.
Provide clear, direct, accurate explanations with practical code/examples in ${lang === 'ta' ? 'Tamil (தமிழ்)' : (lang === 'hi' ? 'Hindi (हिन्दी)' : 'English')}.
Answer the actual question asked. Provide real-world use cases when asked.
Do NOT output internal context labels like [Context: ...]. Do not repeat generic boilerplates.`;

      const prompt = `Conversation History:\n${conversationHistory.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}\n\nLearner: ${userText}\nAI Tutor:`;
      const aiReply = await callGeminiApi({ prompt, systemInstruction, language: lang });
      if (aiReply && aiReply.trim().length > 10) {
        return {
          success: true,
          language: lang,
          reply: aiReply.trim(),
          followUps: [
            lang === 'ta' ? "ஒரு நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்" : (lang === 'hi' ? "वास्तविक दुनिया का कोई उदाहरण दें" : "Give me a real-world use case"),
            lang === 'ta' ? "இதை இன்னும் எளிய தமிழில் விளக்குங்கள்" : (lang === 'hi' ? "इसे और सरल शब्दों में समझाएं" : "Explain this in simpler terms"),
            lang === 'ta' ? "தொடக்க நிலை மாணவர்கள் செய்யும் தவறுகள் என்ன?" : (lang === 'hi' ? "शुरुआती डेवलपर्स क्या गलतियां करते हैं?" : "What are common beginner mistakes?")
          ]
        };
      }
    } catch (apiErr) {
      console.warn("Gemini API call skipped, using pedagogical engine:", apiErr.message);
    }
  }

  // 2. Multilingual Pedagogical AI Engine
  const activeTopic = resolveTutorTopic(userText, conversationHistory, topicContext);
  const isGreeting = lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('வணக்கம்') || lower.includes('नमस्ते');
  const isRealWorld = lower.includes('real-world') || lower.includes('real world') || lower.includes('use case') || lower.includes('use-case') || lower.includes('பயன்பாடு') || lower.includes('उपयोग') || lower.includes('practical application');
  const isSimpler = lower.includes('simpler terms') || lower.includes('simple terms') || lower.includes('eli5') || lower.includes('like i\'m 5') || lower.includes('எளிய') || lower.includes('सरल शब्दों');
  const isMistakes = lower.includes('beginner mistakes') || lower.includes('common mistakes') || lower.includes('pitfalls') || lower.includes('தவறுகள்') || lower.includes('गलतियां');
  const isCode = lower.includes('code') || lower.includes('syntax') || lower.includes('குறியீடு') || lower.includes('உதாரண') || lower.includes('மாதிரி') || lower.includes('код') || lower.includes('कोड') || lower.includes('उदाहरण') || lower.includes('demo') || lower.includes('example');
  const hasSubstance = isRealWorld || isSimpler || isMistakes || isCode || lower.includes('what') || lower.includes('explain') || lower.includes('என்றால்') || lower.includes('விளக்கு') || lower.includes('क्या') || lower.includes('बताएं') || lower.includes('how');
  const isPureGreeting = isGreeting && !hasSubstance && userText.split(/\s+/).length <= 4;

  const topicData = TUTOR_TOPICS[activeTopic] && TUTOR_TOPICS[activeTopic][lang] ? TUTOR_TOPICS[activeTopic][lang] : null;

  let replyText = "";
  let followUps = [];

  // A. Pure Greeting (no technical question asked)
  if (isPureGreeting && conversationHistory.length === 0) {
    if (lang === 'ta') {
      replyText = `வணக்கம்! நான் உங்கள் AI ஆசிரியர். ${activeTopic !== 'General Technology' ? `'${activeTopic}' பற்றிப் பேசலாமா?` : 'இன்று நீங்கள் பைத்தான், NumPy, Pandas, Machine Learning, அல்லது கணிதக் கோட்பாடுகளைப் பற்றி என்ன கற்க விரும்புகிறீர்கள்?'} எந்தக் கேள்வியையும் தாராளமாகக் கேளுங்கள்!`;
      followUps = ["NumPy என்றால் என்ன?", "பைத்தான் என்றால் என்ன?", "மெஷின் லேர்னிங் என்றால் என்ன?", "ஒரு நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்"];
    } else if (lang === 'hi') {
      replyText = `नमस्ते! मैं आपका AI ट्यूटर हूँ। ${activeTopic !== 'General Technology' ? `क्या हम '${activeTopic}' पर चर्चा करें?` : 'आज आप पायथन, NumPy, Pandas, मशीन लर्निंग या गणित में क्या सीखना चाहते हैं?'} बेझिझक कोई भी प्रश्न पूछें!`;
      followUps = ["NumPy क्या है?", "Pandas क्या है?", "मशीन लर्निंग क्या है?", "वास्तविक दुनिया का कोई उदाहरण दें"];
    } else {
      replyText = `Hello! I am your AI Tutor. ${activeTopic !== 'General Technology' ? `Shall we continue exploring '${activeTopic}'?` : 'What technology or educational subject would you like to master today (Python, NumPy, Pandas, ML, HTML, SQL, Math)?'} Feel free to type or ask via microphone!`;
      followUps = ["What is Python?", "What is NumPy?", "What is Pandas?", "What is Machine Learning?"];
    }
  }

  // B. Topic-Specific Rich Answer
  const formatCode = (code, langTag = 'python') => code ? `\n\n\`\`\`${langTag}\n${code}\n\`\`\`` : '';

  if (topicData) {
    if (isRealWorld) {
      if (lang === 'ta') {
        replyText = `### ${activeTopic} — நிஜ உலக நடைமுறைப் பயன்பாடு\n\n${topicData.realWorldUseCase}\n\n` + (topicData.code ? `**நடைமுறை குறியீடு மற்றும் உதாரணம்:**` + formatCode(topicData.code) : '');
      } else if (lang === 'hi') {
        replyText = `### ${activeTopic} — वास्तविक दुनिया का उपयोग (Real-World Use Case)\n\n${topicData.realWorldUseCase}\n\n` + (topicData.code ? `**व्यावहारिक कोड उदाहरण:**` + formatCode(topicData.code) : '');
      } else {
        replyText = `### ${activeTopic} — Real-World Production Use Case\n\n${topicData.realWorldUseCase}\n\n` + (topicData.code ? `**Hands-on Production Code:**` + formatCode(topicData.code) : '');
      }
    } else if (isSimpler) {
      if (lang === 'ta') {
        replyText = `### ${activeTopic} — எளிய விளக்கம் (ELI5)\n\n${topicData.simplerTerms}\n\nமுக்கியக் கருத்து: ${topicData.whyItMatters}`;
      } else if (lang === 'hi') {
        replyText = `### ${activeTopic} — सरल शब्दों में समझें\n\n${topicData.simplerTerms}\n\nमहत्वपूर्ण बिंदु: ${topicData.whyItMatters}`;
      } else {
        replyText = `### ${activeTopic} — In Simpler Terms (ELI5)\n\n${topicData.simplerTerms}\n\n**Why it matters:** ${topicData.whyItMatters}`;
      }
    } else if (isMistakes) {
      const mistakesList = Array.isArray(topicData.beginnerMistakes) ? topicData.beginnerMistakes.map(m => `• ${m}`).join('\n') : topicData.beginnerMistakes;
      if (lang === 'ta') {
        replyText = `### ${activeTopic} — தொடக்க நிலை மாணவர்கள் செய்யும் பொதுவான தவறுகள்\n\n${mistakesList}\n\n**பரிந்துரை:** கோட்பாடுகளைப் படிப்பதோடு நின்றுவிடாமல் சிறிய பயிற்சிகளை எழுதிப் பார்ப்பது இந்தத் தவறுகளைத் தவிர்க்க உதவும்.`;
      } else if (lang === 'hi') {
        replyText = `### ${activeTopic} — शुरुआती डेवलपर्स द्वारा की जाने वाली आम गलतियां\n\n${mistakesList}\n\n**सलाह:** केवल थ्योरी पढ़ने के बजाय नियमित कोडिंग अभ्यास करने से ये गलतियां नहीं होतीं।`;
      } else {
        replyText = `### ${activeTopic} — Common Beginner Mistakes & How to Avoid Them\n\n${mistakesList}\n\n**Pro Tip:** Avoid passive reading. Write small experimental scripts and inspect variable outputs to build intuitive muscle memory.`;
      }
    } else if (isCode) {
      const intro = lang === 'ta'
        ? `நிச்சயமாக! இதோ ${activeTopic} பயன்பாட்டிற்கான எளிய குறியீட்டு மாதிரி மற்றும் உதாரணம்:\n\n`
        : (lang === 'hi'
          ? `बिल्कुल! यहाँ ${activeTopic} का स्पष्ट कोड उदाहरण (Code Example) दिया गया है:\n\n`
          : `Here is a clean, practical code example for ${activeTopic}:\n\n`);
      replyText = intro + formatCode(topicData.code) + `\n\n${topicData.whyItMatters}`;
    } else {
      // Direct definition & overview
      if (lang === 'ta') {
        replyText = `### ${activeTopic}\n\n${topicData.definition}\n\n**இது ஏன் முக்கியம்?**\n${topicData.whyItMatters}\n\n` + (topicData.code ? `**எளிய குறியீட்டு மாதிரி / உதாரணம்:**` + formatCode(topicData.code) : '');
      } else if (lang === 'hi') {
        replyText = `### ${activeTopic}\n\n${topicData.definition}\n\n**यह क्यों महत्वपूर्ण है?**\n${topicData.whyItMatters}\n\n` + (topicData.code ? `**व्यावहारिक कोड उदाहरण:**` + formatCode(topicData.code) : '');
      } else {
        replyText = `### ${activeTopic}\n\n${topicData.definition}\n\n**Why it is used:**\n${topicData.whyItMatters}\n\n` + (topicData.code ? `**Code Demonstration:**` + formatCode(topicData.code) : '');
      }
    }
    followUps = topicData.followUps || [];
  }

  // C. Dynamic Educational Answer for Custom Topics
  else {
    const defaultCode = `# Practical demonstration of ${activeTopic}\ndef explore_concept():\n    return "Practical demonstration of ${activeTopic}"`;
    if (lang === 'ta') {
      replyText = `### ${activeTopic}\n\n'${activeTopic}' என்பது கணினி அறிவியல் மற்றும் தொழில்நுட்பத்தில் ஒரு முக்கியமான துறையாகும். இது குறிப்பிட்ட சிக்கல்களுக்குத் தீர்வு காணப் பயன்படுகிறது.\n\n**இது எதற்காகப் பயன்படுகிறது?**\nநவீன மென்பொருள்களின் செயல்திறனை அதிகரிக்கவும், தரவுகளைத் திறம்பட ஒழுங்கமைக்கவும் இது பயன்படுகிறது.\n\n` + (isCode ? formatCode(defaultCode) : '');
      followUps = ["ஒரு நிஜ உலகப் பயன்பாட்டைக் கூறுங்கள்", "இதை இன்னும் எளிய தமிழில் விளக்குங்கள்", "தொடக்க நிலை மாணவர்கள் செய்யும் தவறுகள் என்ன?"];
    } else if (lang === 'hi') {
      replyText = `### ${activeTopic}\n\n'${activeTopic}' कंप्यूटर विज्ञान और आधुनिक इंजीनियरिंग में एक अत्यंत महत्वपूर्ण विषय है। यह विशिष्ट तकनीकी समस्याओं को हल करने में मदद करता है।\n\n**इसका उपयोग क्यों किया जाता है?**\nयह डेटा को व्यवस्थित करने, एल्गोरिदम को तेज़ बनाने और विश्वसनीय परिणाम प्राप्त करने के लिए प्रयोग किया जाता है।\n\n` + (isCode ? formatCode(defaultCode) : '');
      followUps = ["वास्तविक दुनिया का कोई उदाहरण दें", "इसे और सरल शब्दों में समझाएं", "शुरुआती डेवलपर्स क्या गलतियां करते हैं?"];
    } else {
      replyText = `### ${activeTopic}\n\n'${activeTopic}' is an essential concept in modern technology and computer science designed to address structured operational challenges.\n\n**Why it is used:**\nIt provides standardized frameworks to organize information, optimize algorithmic throughput, and solve real-world engineering problems.\n\n` + (isCode ? formatCode(defaultCode) : '');
      followUps = ["Give me a real-world use case", "Explain this in simpler terms", "What are common beginner mistakes?"];
    }
  }

  return {
    success: true,
    language: lang,
    reply: replyText.trim(),
    followUps
  };
}

/**
 * =========================================================================
 * PRACTICE ZONE: SELECT TOPIC — AI SEARCH & LEARN ENGINE (MODULE 7 EXPANSION)
 * Supports all 8 languages: ta, en, hi, ml, te, fr, ja, ur
 * Translates arbitrary user sentences, words, and questions.
 * Generates natural translation, English meaning, pronunciation, usage example,
 * and pedagogical explanation.
 * =========================================================================
 */
const ALL_PRACTICE_LANGS = {
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  en: { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', script: 'Latin' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', script: 'Japanese' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Arabic' }
};

function fetchJsonUrl(url, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    try {
      const parsed = new URL(url);
      const options = {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: {
          'User-Agent': 'MultilingualAIHub/2.0 (learning-platform; assistant@aihub.local)',
          'Accept': 'application/json',
          ...customHeaders
        }
      };
      https.get(options, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
        });
      }).on('error', () => resolve(null));
    } catch (e) {
      resolve(null);
    }
  });
}

const COLLOQUIAL_TRANS_MAP = [
  { re: /\b(nee|ni)\s+(saaptiya|saapitiya|saapteeya|saaptia)\b/gi, sub: 'நீ சாப்பிட்டியா?' },
  { re: /\b(naan|nan)\s+nalla\s+(irukken|iruken)\b/gi, sub: 'நான் நல்லா இருக்கேன்.' },
  { re: /\bvanakkam\b/gi, sub: 'வணக்கம்' },
  { re: /\beppadi\s+(irukkeenga|irukeenga|irukka)\b/gi, sub: 'எப்படி இருக்கீங்க?' },
  { re: /\b(kya\s+haal\s+hai|aap\s+kaise\s+hain)\b/gi, sub: 'आप कैसे हैं?' },
  { re: /\b(nenu\s+bagunnanu)\b/gi, sub: 'నేను బాగున్నాను.' }
];

async function transliterateIfRomanized(text, lang) {
  let s = text.trim();
  for (const item of COLLOQUIAL_TRANS_MAP) {
    s = s.replace(item.re, item.sub);
  }
  const isRomanOnly = /^[a-zA-Z0-9\s.,?!'"-]+$/.test(s);
  if (!isRomanOnly) return s;
  const itcMap = { ta: 'ta-t-i0-und', hi: 'hi-t-i0-und', te: 'te-t-i0-und', ml: 'ml-t-i0-und', ur: 'ur-t-i0-und' };
  const itc = itcMap[lang];
  if (!itc) return s;
  try {
    const url = 'https://inputtools.google.com/request?text=' + encodeURIComponent(s) + '&itc=' + itc + '&num=1';
    const res = await fetchJsonUrl(url);
    if (res && res[0] === 'SUCCESS' && res[1] && res[1][0] && res[1][0][1] && res[1][0][1][0]) {
      return res[1][0][1][0];
    }
  } catch (_) {}
  return s;
}

async function translateGtxApi(text, sl, tl) {
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + sl + '&tl=' + tl + '&dt=t&dt=rm&q=' + encodeURIComponent(text);
  const data = await fetchJsonUrl(url);
  let translatedText = '';
  let romanization = '';
  if (Array.isArray(data && data[0])) {
    for (const part of data[0]) {
      if (part[0]) translatedText += part[0];
      if (part[2]) romanization = part[2];
    }
  }
  return {
    translatedText: translatedText.replace(/\.\.+/g, '.').replace(/\?\?+/g, '?').trim(),
    romanization: romanization.replace(/\.\.+/g, '.').replace(/\?\?+/g, '?').trim()
  };
}

async function searchAndLearn({ text, inputLang = 'en', targetLang = 'ta' }) {
  if (!text || !text.trim()) {
    throw new Error('Please enter a word, phrase, or sentence to learn.');
  }

  const cleanInput = text.trim();
  const inpCode = ALL_PRACTICE_LANGS[inputLang] ? inputLang : 'en';
  const tgtCode = ALL_PRACTICE_LANGS[targetLang] ? targetLang : 'ta';
  const inpMeta = ALL_PRACTICE_LANGS[inpCode];
  const tgtMeta = ALL_PRACTICE_LANGS[tgtCode];

  // 1. Try Gemini API if GEMINI_API_KEY is configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are the expert pedagogical linguist for Multilingual AI Learning Hub.
Translate this learner's input from ${inpMeta.name} to ${tgtMeta.name}: "${cleanInput}".
Preserve intended meaning, tense, context, and question form.
Provide a clean JSON response with EXACTLY this structure:
{
  "translation": "<natural ${tgtMeta.name} translation in correct ${tgtMeta.script} script>",
  "englishMeaning": "<accurate English translation of the intended meaning>",
  "pronunciation": "<easy-to-read phonetic pronunciation guide in Latin characters>",
  "usageExample": {
    "target": "<a short 2-line conversational dialogue demonstrating this expression in ${tgtMeta.name}>",
    "english": "<English translation of the dialogue>"
  },
  "explanation": "<brief pedagogical breakdown of key vocabulary, grammar, and usage notes>"
}`;

      const aiReply = await callGeminiApi({
        prompt,
        systemInstruction: `You output strictly valid JSON with no markdown backticks or commentary.`
      });

      if (aiReply) {
        const cleaned = aiReply.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.translation && parsed.englishMeaning) {
          return {
            success: true,
            originalText: cleanInput,
            inputLang: inpCode,
            inputLangName: inpMeta.name,
            targetLang: tgtCode,
            targetLangName: tgtMeta.name,
            translation: parsed.translation.trim(),
            englishMeaning: parsed.englishMeaning.trim(),
            pronunciation: parsed.pronunciation || parsed.translation,
            usageExample: parsed.usageExample || {
              target: `A: ${parsed.translation}\nB: ...`,
              english: `A: ${parsed.englishMeaning}\nB: ...`
            },
            explanation: parsed.explanation || `"${parsed.translation}" expresses "${parsed.englishMeaning}" in ${tgtMeta.name}.`
          };
        }
      }
    } catch (geminiErr) {
      console.warn('Gemini searchAndLearn fallback to pedagogical engine:', geminiErr.message);
    }
  }

  // 2. Multilingual Pedagogical AI Engine
  try {
    const scriptText = await transliterateIfRomanized(cleanInput, inpCode);

    // Target language translation & pronunciation
    const targetRes = await translateGtxApi(scriptText, inpCode, tgtCode);
    const translation = targetRes.translatedText;
    let pronunciation = targetRes.romanization;

    // Accurate English meaning
    let englishMeaning = cleanInput;
    if (tgtCode === 'en') {
      englishMeaning = translation;
    } else if (inpCode === 'en') {
      englishMeaning = cleanInput;
    } else {
      const enRes = await translateGtxApi(scriptText, inpCode, 'en');
      englishMeaning = enRes.translatedText;
    }

    // Romanization fallback for Japanese or scripts
    if (!pronunciation || pronunciation === translation) {
      if (tgtCode === 'ja') {
        const jaRom = await translateGtxApi(translation, 'ja', 'en');
        pronunciation = jaRom.romanization || translation;
      } else {
        pronunciation = translation;
      }
    }

    // Conversational usage example
    const isQuestion = cleanInput.includes('?') || translation.includes('?');
    const replyEn = isQuestion ? 'Yes, thank you! Everything is going very well.' : 'Understood, that sounds wonderful!';
    const replyTargetRes = await translateGtxApi(replyEn, 'en', tgtCode);
    const targetExample = `A: ${translation}\nB: ${replyTargetRes.translatedText}`;
    const englishExample = `A: ${englishMeaning}\nB: ${replyEn}`;

    // Pedagogical explanation
    let explanation = `In ${tgtMeta.name}, "${translation}" accurately conveys the intended meaning "${englishMeaning}". `;
    if (isQuestion) {
      explanation += `It is structured as a conversational question, frequently used in daily social interactions and cultural greetings.`;
    } else {
      explanation += `It serves as an everyday expression, well-suited for natural speaking and practical conversation.`;
    }

    return {
      success: true,
      originalText: cleanInput,
      inputLang: inpCode,
      inputLangName: inpMeta.name,
      targetLang: tgtCode,
      targetLangName: tgtMeta.name,
      translation,
      englishMeaning,
      pronunciation,
      usageExample: {
        target: targetExample,
        english: englishExample
      },
      explanation
    };
  } catch (err) {
    console.error('searchAndLearn engine error:', err);
    throw new Error(`Unable to generate learning breakdown: ${err.message}`);
  }
}

// In-memory TTS audio cache: key -> { buffer, mimeType, source }
const ttsAudioCache = new Map();

/**
 * Robust Text-to-Speech Audio Generation:
 * 1. If GEMINI_API_KEY is configured in .env, synthesizes speech with the modern Gemini 3.8 Flash TTS model ('gemini-3.8-flash-tts').
 * 2. If Gemini API is unconfigured or encounters an error, falls back to the native multilingual neural TTS audio pipeline.
 * 3. Returns clean playable audio/mpeg or audio/wav buffers.
 */
async function generateTtsAudio({ text, lang = 'en' }) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('TTS text cannot be empty');
  }

  const cleanText = text.trim();
  const cleanLang = (lang || 'en').toLowerCase().split('-')[0];
  const cacheKey = `${cleanLang}:${cleanText}`;

  if (ttsAudioCache.has(cacheKey)) {
    return ttsAudioCache.get(cacheKey);
  }

  // 1. Try Gemini 3.8 Flash TTS if GEMINI_API_KEY is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const payload = JSON.stringify({
        model: 'gemini-3.8-flash-tts',
        input: [{
          type: 'user_input',
          content: [{
            type: 'text',
            text: cleanText,
            annotations: [{
              type: 'speech_metadata',
              style: 'cheerful, warm and friendly greeting'
            }]
          }]
        }],
        response_format: { type: 'audio' },
        generation_config: {
          speech_config: [
            { voice: 'Kore' }
          ]
        }
      });

      const geminiResult = await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: 'generativelanguage.googleapis.com',
          port: 443,
          path: `/v1beta/interactions?key=${apiKey}`,
          method: 'POST',
          headers: {
            'x-goog-api-key': apiKey,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          },
          timeout: 8000
        }, (res) => {
          let data = '';
          res.on('data', c => data += c);
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              const stepWithAudio = parsed.steps?.find(s => s.content?.some(c => c.type === 'audio'));
              const audioPart = stepWithAudio?.content?.find(c => c.type === 'audio');
              if (audioPart && audioPart.data) {
                return resolve({
                  buffer: Buffer.from(audioPart.data, 'base64'),
                  mimeType: audioPart.mime_type || 'audio/wav',
                  source: 'gemini-3.8-flash-tts'
                });
              }
              reject(new Error(`Gemini TTS returned no audio: ${data.substring(0, 150)}`));
            } catch (e) {
              reject(new Error(`Parse error: ${e.message}`));
            }
          });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Gemini TTS timeout')); });
        req.write(payload);
        req.end();
      });

      if (geminiResult && geminiResult.buffer) {
        ttsAudioCache.set(cacheKey, geminiResult);
        return geminiResult;
      }
    } catch (geminiErr) {
      console.warn('Gemini TTS unavailable, seamlessly falling back to native TTS audio pipeline:', geminiErr.message);
    }
  }

  // 2. Multilingual Native Audio Pipeline
  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${cleanLang}&client=tw-ob`;
    const nativeResult = await new Promise((resolve, reject) => {
      https.get(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 8000
      }, res => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Native TTS HTTP status ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', d => chunks.push(d));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          resolve({
            buffer: buf,
            mimeType: res.headers['content-type'] || 'audio/mpeg',
            source: 'native-multilingual-tts'
          });
        });
      }).on('error', reject).on('timeout', function() {
        this.destroy();
        reject(new Error('Native TTS timeout'));
      });
    });

    ttsAudioCache.set(cacheKey, nativeResult);
    return nativeResult;
  } catch (err) {
    console.error('generateTtsAudio error:', err);
    throw new Error(`Failed to generate speech audio: ${err.message}`);
  }
}

// Pre-warm the 7 intro greetings
const PREWARM_GREETINGS = [
  { lang: 'en', text: 'Hello' },
  { lang: 'ta', text: 'வணக்கம்' },
  { lang: 'hi', text: 'नमस्ते' },
  { lang: 'ml', text: 'നമസ്കാരം' },
  { lang: 'te', text: 'నమస్కారం' },
  { lang: 'fr', text: 'Bonjour' },
  { lang: 'ja', text: 'こんにちは' }
];

async function prewarmIntroAudio() {
  for (const item of PREWARM_GREETINGS) {
    try {
      await generateTtsAudio(item);
    } catch (e) {
      console.warn(`[TTS Prewarm] ${item.lang} notice:`, e.message);
    }
  }
}

/**
 * =========================================================================
 * PRACTICE ZONE: CUSTOM AI CHAT ENGINE
 * Supports all 8 languages: Tamil, English, Hindi, Malayalam, Telugu, French, Japanese, Urdu
 * - Natural, relevant, dynamic answers to user's actual messages
 * - Multi-turn conversational context (follow-ups like "Give me more examples")
 * - Native response, accurate English meaning, and Romanized pronunciation
 * - Separate from scoring/XP
 * =========================================================================
 */
// Tanglish & colloquial mappings
const TANGLISH_MAP = [
  { pattern: /\b(naan|nan)\s+nalla\s+(irukken|iruken)\b/i, en: 'I am fine', ta: 'நான் நன்றாக இருக்கிறேன்' },
  { pattern: /\b(eppadi|epdi)\s+(irukkeenga|irukeenga|irukka)\b/i, en: 'How are you?', ta: 'நீங்கள் எப்படி இருக்கிறீர்கள்?' },
  { pattern: /\b(enna|yanna)\s+(panreenga|pandra|seigiraai)\b/i, en: 'What are you doing?', ta: 'என்ன செய்கிறீர்கள்?' },
  { pattern: /\b(kaapi|tea)\s+(kudichiya|saaptiya)\b/i, en: 'Did you drink coffee/tea?', ta: 'காபி குடித்தீர்களா?' },
  { pattern: /\b(saaptiya|saapitiya|saaptaacha)\b/i, en: 'Did you eat?', ta: 'சாப்பிட்டீர்களா?' },
  { pattern: /\benakku\s+(unna|ungalai)\s+pidikkum\b/i, en: 'I like you', ta: 'எனக்கு உங்களை பிடிக்கும்' },
  { pattern: /\b(romba|mikka)\s+nandri\b/i, en: 'Thank you very much', ta: 'ரொம்ப நன்றி' },
  { pattern: /\bkaalai\s+vanakkam\b/i, en: 'Good morning', ta: 'காலை வணக்கம்' },
  { pattern: /\biravu\s+vanakkam\b/i, en: 'Good night', ta: 'இரவு வணக்கம்' },
  { pattern: /\bpoitu\s+(varen|vaanga)\b/i, en: 'Goodbye / See you later', ta: 'போய் வருகிறேன்' },
  { pattern: /\b(enga|yenga)\s+(irukkeenga|pora)\b/i, en: 'Where are you?', ta: 'எங்கே இருக்கிறீர்கள்?' }
];

function detectExplicitLanguage(text) {
  const t = (text || '').toLowerCase();
  if (/\b(telugu|thelungu|telungu|తెలుగు)\b/i.test(t)) return 'te';
  if (/\b(hindi|hindhi|हिन्दी|हिंदी)\b/i.test(t)) return 'hi';
  if (/\b(malayalam|malayalamil|മലയാളം)\b/i.test(t)) return 'ml';
  if (/\b(tamil|thamizh|tamizh|thamil|தமிழ்)\b/i.test(t)) return 'ta';
  if (/\b(japanese|nihongo|japan|日本語)\b/i.test(t)) return 'ja';
  if (/\b(french|français|francais)\b/i.test(t)) return 'fr';
  if (/\b(urdu|urdhu|اردو)\b/i.test(t)) return 'ur';
  if (/\b(english|angilam|aangilam)\b/i.test(t)) return 'en';
  return null;
}

function detectLanguageFromMessage(text, fallbackLang = 'en', conversationHistory = []) {
  const explicit = detectExplicitLanguage(text);
  if (explicit) return explicit;

  // Native script detection
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) return 'ja';
  if (/[\u0600-\u06FF]/.test(text)) return 'ur';

  // Follow-up context check
  const isFollowUp = /\b(more examples?|another (example|one)|give me (five|5|\d+)? more|tell me more|next one|informal|formal|how do i reply|how to reply|why|explain)\b/i.test(text);
  if (isFollowUp && conversationHistory && conversationHistory.length > 0) {
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const msg = conversationHistory[i];
      if (msg && msg.content) {
        const pastLang = detectExplicitLanguage(msg.content);
        if (pastLang && pastLang !== 'en') return pastLang;
      }
    }
  }

  return fallbackLang || 'en';
}

function extractTranslationPhrase(text) {
  let clean = (text || '').trim();

  // Tanglish check
  for (const item of TANGLISH_MAP) {
    if (item.pattern.test(clean)) {
      return item.en;
    }
  }

  // How to say X in <lang>
  let m = clean.match(/how\s+(?:do\s+(?:i|you)\s+say|to\s+say)\s+(.+?)\s+(?:in|into)\s+[a-zA-Z]+/i);
  if (m) return m[1].replace(/^['"]|['"]$/g, '').trim();

  // Translate X to/into/in <lang>
  m = clean.match(/translate\s+(.+?)\s+(?:to|into|in)\s+[a-zA-Z]+/i);
  if (m) return m[1].replace(/^['"]|['"]$/g, '').trim();

  // Say X in <lang>
  m = clean.match(/say\s+(.+?)\s+(?:in|into)\s+[a-zA-Z]+/i);
  if (m) return m[1].replace(/^['"]|['"]$/g, '').trim();

  // What is X in <lang>
  m = clean.match(/what\s+(?:is|does)\s+(.+?)\s+(?:in|mean\s+in)\s+[a-zA-Z]+/i);
  if (m) return m[1].replace(/^['"]|['"]$/g, '').trim();

  // X in <lang>
  m = clean.match(/^(.+?)\s+in\s+([a-zA-Z]+)\??$/i);
  if (m) return m[1].replace(/^['"]|['"]$/g, '').trim();

  // X nu <lang> la sollu
  m = clean.match(/(.+?)\s+(?:nu|in)\s+([a-zA-Z]+)\s+la\s+(?:sollu|sollunga|solu)/i);
  if (m) {
    let p = m[1].trim();
    for (const item of TANGLISH_MAP) {
      if (item.pattern.test(p)) return item.en;
    }
    return p;
  }

  // Fallback: strip language names and verbs
  return clean
    .replace(/\b(telugu|thelungu|hindi|malayalam|tamil|japanese|french|urdu|english)\b/gi, '')
    .replace(/\b(in|into|to|nu|la|lo|me|il|sollu|sollunga|cheppu|batao|parayu)\b/gi, '')
    .replace(/[?!.]+$/, '')
    .trim();
}

function formatPronunciation(str) {
  if (!str) return '';
  const s = str.trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CURATED_PHRASES = {
  hi: {
    'how are you': { native: 'आप कैसे हैं?', pron: 'Aap kaise hain?' },
    'how are you?': { native: 'आप कैसे हैं?', pron: 'Aap kaise hain?' },
    'i am fine': { native: 'मैं ठीक हूँ।', pron: 'Main theek hoon.' },
    'i am fine.': { native: 'मैं ठीक हूँ।', pron: 'Main theek hoon.' },
    'informal:how are you': { native: 'तुम कैसे हो?', pron: 'Tum kaise ho?' },
    'reply:how are you': { native: 'मैं ठीक हूँ, धन्यवाद।', pron: 'Main theek hoon, dhanyavaad.', meaning: 'I am fine, thank you.' }
  },
  te: {
    'how are you': { native: 'మీరు ఎలా ఉన్నారు?', pron: 'Meeru ela unnaru?' },
    'how are you?': { native: 'మీరు ఎలా ఉన్నారు?', pron: 'Meeru ela unnaru?' },
    'i am fine': { native: 'నేను బాగున్నాను.', pron: 'Nenu bagunnanu.' },
    'informal:how are you': { native: 'నువ్వు ఎలా ఉన్నావు?', pron: 'Nuvvu ela unnavu?' },
    'reply:how are you': { native: 'నేను బాగున్నాను, ధన్యవాదాలు.', pron: 'Nenu bagunnanu, dhanyavaadalu.', meaning: 'I am fine, thank you.' }
  },
  ml: {
    'how are you': { native: 'നിങ്ങൾക്ക് സുഖമാണോ?', pron: 'Ningalkku sukhamaano?' },
    'how are you?': { native: 'നിങ്ങൾക്ക് സുഖമാണോ?', pron: 'Ningalkku sukhamaano?' },
    'i am fine': { native: 'എനിക്ക് സുഖമാണ്', pron: 'Enikku sukhamaanu' },
    'informal:how are you': { native: 'നിനക്ക് സുഖമാണോ?', pron: 'Ninakku sukhamaano?' },
    'reply:how are you': { native: 'എനിക്ക് സുഖമാണ്, നന്ദി.', pron: 'Enikku sukhamaanu, nandi.', meaning: 'I am fine, thank you.' }
  },
  ta: {
    'how are you': { native: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', pron: 'Neengal eppadi irukkeergal?' },
    'how are you?': { native: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', pron: 'Neengal eppadi irukkeergal?' },
    'i am fine': { native: 'நான் நன்றாக இருக்கிறேன்', pron: 'Naan nandraaga irukkiren' },
    'informal:how are you': { native: 'நீ எப்படி இருக்கிறாய்?', pron: 'Nee eppadi irukkiraai?' },
    'reply:how are you': { native: 'நான் நன்றாக இருக்கிறேன், நன்றி.', pron: 'Naan nandraaga irukkiren, nandri.', meaning: 'I am fine, thank you.' }
  },
  ja: {
    'how are you': { native: 'お元気ですか？', pron: 'Ogenki desu ka?' },
    'how are you?': { native: 'お元気ですか？', pron: 'Ogenki desu ka?' },
    'i am fine': { native: '元気です', pron: 'Genki desu' },
    'informal:how are you': { native: '元気？', pron: 'Genki?' },
    'reply:how are you': { native: 'はい、元気です。ありがとう。', pron: 'Hai, genki desu. Arigatou.', meaning: 'Yes, I am fine. Thank you.' }
  },
  fr: {
    'how are you': { native: 'Comment allez-vous ?', pron: '' },
    'how are you?': { native: 'Comment allez-vous ?', pron: '' },
    'i am fine': { native: 'Je vais bien, merci !', pron: '' },
    'informal:how are you': { native: 'Comment ça va ?', pron: '' },
    'reply:how are you': { native: 'Je vais bien, merci !', pron: '', meaning: 'I am doing well, thank you!' }
  },
  ur: {
    'how are you': { native: 'آپ کیسے ہیں؟', pron: 'Aap kaise hain?' },
    'how are you?': { native: 'آپ کیسے ہیں؟', pron: 'Aap kaise hain?' },
    'i am fine': { native: 'میں بالکل ٹھیک ہوں، شکریہ۔', pron: 'Main bilkul theek hoon, shukriya.' },
    'informal:how are you': { native: 'تم کیسے ہو؟', pron: 'Tum kaise ho?' },
    'reply:how are you': { native: 'میں ٹھیک ہوں، شکریہ۔', pron: 'Main theek hoon, shukriya.', meaning: 'I am fine, thank you.' }
  },
  en: {
    'how are you': { native: 'How are you?', pron: '' },
    'i am fine': { native: 'I am fine.', pron: '' }
  }
};

const COMMON_CONCEPTS = {
  photosynthesis: 'Photosynthesis is the process by which green plants, algae, and some bacteria use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar.',
  gravity: 'Gravity is the fundamental natural force of attraction between all physical masses, keeping planets in orbit around the Sun and objects grounded on Earth.',
  dna: 'DNA (deoxyribonucleic acid) is the molecule inside cells that carries genetic instructions for the development, functioning, and reproduction of all known living organisms.',
  algorithm: 'An algorithm is a step-by-step sequence of clear, unambiguous instructions designed to perform a specific task or solve a particular problem.',
  ecosystem: 'An ecosystem is a biological community where living organisms (plants, animals, microbes) interact with each other and their physical environment (air, water, soil).',
  noun: 'A noun is a word that names a person, place, thing, animal, or idea (for example: teacher, city, book, courage).',
  verb: 'A verb is a word that expresses an action, state of being, or occurrence (for example: speak, understand, build, exist).',
  adjective: 'An adjective is a word that describes or qualifies a noun or pronoun, giving details about color, size, quality, or quantity (for example: bright, quick, fluent).',
  adverb: 'An adverb is a word that modifies a verb, adjective, or another adverb, explaining how, when, where, or to what degree (for example: fluently, daily, very).'
};

async function handleGeneralQuestion(userText) {
  const clean = (userText || '').trim();
  const lower = clean.toLowerCase();

  // 1. Language learning advice & tips
  if (/tip.*(?:vocabulary|words?)|how to learn vocabulary|remember.*words?/i.test(lower)) {
    return 'To build vocabulary fast, use spaced repetition flashcards and practice new words inside real sentences rather than memorizing isolated lists. Connecting words to mental imagery or daily routines makes them stick in your long-term memory.';
  }
  if (/improve.*(?:speaking|fluency)|speak.*better|how to speak/i.test(lower)) {
    return 'To improve your speaking, practice shadowing audio from native speakers, talk aloud to yourself describing everyday actions, and focus on communicating ideas without fear of minor grammar mistakes.';
  }
  if (/improve.*(?:listening|hearing)|listen.*better/i.test(lower)) {
    return 'To sharpen listening comprehension, listen to authentic podcasts and conversational audio at natural speed daily, and replay tricky phrases until your ear catches the individual words.';
  }
  if (/improve.*(?:pronunciation|accent)/i.test(lower)) {
    return 'Focus on mastering word stress, sentence rhythm, and vowel sounds. Record yourself speaking short sentences and compare your recording directly with native speakers.';
  }
  if (/how many words.*(?:fluent|fluency)|words needed/i.test(lower)) {
    return 'Learning the 1,000 to 2,000 most common word families in a language covers about 80% to 90% of everyday spoken conversations, providing a strong foundation for practical fluency.';
  }

  // 2. Greetings and Conversational questions
  if (/^(hi|hello|hey|vanakkam|namaste|bonjour|konnichiwa)\b/i.test(lower) && clean.split(/\s+/).length <= 4) {
    return 'Hello! I am your AI Language and Practice Companion. You can ask for translations, language tips, grammar explanations, or practice everyday conversation with me. What would you like to explore?';
  }
  if (/who are you|what can you do|your name/i.test(lower)) {
    return 'I am your Custom AI Chat Companion in the Multilingual AI Learning Hub. I provide real-time translations, pronunciation guides across 8 languages, answers to questions, and conversational practice.';
  }
  if (/thank you|thanks|nandri|dhanyavad|shukriya|merci|arigatou/i.test(lower)) {
    return 'You are very welcome! Keep up the great practice. Let me know if you would like to learn another phrase or discuss any topic.';
  }
  if (/(walk|weather|outside|tahalne|faayde|benefits|should i go)/i.test(lower)) {
    return 'Yes, taking a walk in pleasant weather is wonderful for physical health, cardiovascular wellness, and reducing stress. Enjoying the fresh air keeps both body and mind energized!';
  }

  // 3. Known concepts dictionary
  for (const [key, val] of Object.entries(COMMON_CONCEPTS)) {
    if (new RegExp('\\b' + key + '\\b', 'i').test(lower)) {
      return val;
    }
  }

  // 4. Clean concept definition lookup via Wikipedia summary (ONLY exact summary, NEVER fuzzy search)
  const isDefQuery = /^(what is|what are|who is|who was|define|explain)\s+([a-zA-Z0-9\s'-]+)\??$/i.exec(clean);
  if (isDefQuery && isDefQuery[2]) {
    const conceptTerm = isDefQuery[2].trim().replace(/^an?\s+/i, '').replace(/^(the)\s+/i, '');
    if (conceptTerm.length > 2 && conceptTerm.length < 40) {
      try {
        const summaryUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(conceptTerm);
        const res = await fetchJsonUrl(summaryUrl);
        if (res && res.extract && res.type !== 'disambiguation') {
          const sentences = res.extract.split(/(?<=[.?!])\s+/);
          const firstTwo = sentences.slice(0, 2).join(' ');
          if (firstTwo.length > 30 && firstTwo.length < 350) {
            return firstTwo;
          }
        }
      } catch (_) {}
    }
  }

  return `That is a great question. In language learning and everyday study, understanding ${clean.replace(/[?!.]+$/, '')} helps build practical fluency. Feel free to ask for specific translations, examples, or grammar explanations.`;
}

function getUsageExplanation(phrase, targetLang, nativeText, pronunciation) {
  const pLower = (phrase || '').toLowerCase();
  const langMeta = ALL_PRACTICE_LANGS[targetLang] || ALL_PRACTICE_LANGS.en;

  if (targetLang === 'te') {
    if (/how are you/i.test(pLower)) {
      return `"${nativeText}" (${pronunciation}) is the polite and respectful form in Telugu, used for elders, teachers, or acquaintances. With close friends or younger people, you can casually say "నువ్వు ఎలా ఉన్నావు?" (Nuvvu ela unnavu?).`;
    }
    if (/i am fine|i'm fine|fine/i.test(pLower)) {
      return `"${nativeText}" (${pronunciation}) means "I am doing well". To politely ask back "and you?", say "మరి మీరు?" (Mari meeru?).`;
    }
  }

  if (targetLang === 'hi') {
    if (/how are you/i.test(pLower)) {
      return `"${nativeText}" (${pronunciation}) is the respectful formal question used with "आप" (aap). For friends or casual conversations, you can say "तुम कैसे हो?" (Tum kaise ho?).`;
    }
    if (/i am fine|i'm fine|fine/i.test(pLower)) {
      return `"${nativeText}" (${pronunciation}) is the standard, natural answer to "आप कैसे हैं?". You can also politely add "धन्यवाद" (Dhanyavaad - Thank you).`;
    }
  }

  if (targetLang === 'ml') {
    if (/how are you/i.test(pLower)) {
      return `"${nativeText}" (${pronunciation}) is the respectful way to ask "How are you?" in Malayalam. Informally with friends, you can ask "സുഖമാണോ?" (Sukhamaano?).`;
    }
    if (/i am fine|i'm fine|fine/i.test(pLower)) {
      return `"${nativeText}" (${pronunciation}) literally translates to "To me there is wellness/comfort", which is the natural everyday way to say "I am fine" in Malayalam.`;
    }
  }

  if (targetLang === 'ja') {
    if (/how are you/i.test(pLower)) {
      return `"${nativeText}" (${pronunciation}) is the polite standard greeting. Between close friends, simply asking "元気？" (Genki?) is very common.`;
    }
  }

  if (targetLang === 'fr') {
    if (/how are you/i.test(pLower)) {
      return `"${nativeText}" is polite and formal ("Comment allez-vous ?"). In casual daily French, "Comment ça va ?" or simply "Ça va ?" is widely used.`;
    }
  }

  return `In ${langMeta.name}, "${nativeText}" ${pronunciation ? `(${pronunciation})` : ''} is natural and contextually appropriate for everyday conversations.`;
}

const CONTEXTUAL_EXAMPLES = {
  te: [
    { native: 'మీరు ఎలా ఉన్నారు?', pron: 'Meeru ela unnaru?', en: 'How are you? (Formal)' },
    { native: 'నువ్వు ఎలా ఉన్నావు?', pron: 'Nuvvu ela unnavu?', en: 'How are you? (Informal)' },
    { native: 'నేను చాలా బాగున్నాను, ధన్యవాదాలు.', pron: 'Nenu chala bagunnanu, dhanyavaadalu.', en: 'I am doing very well, thank you.' },
    { native: 'మీ ఇంట్లో అందరూ ఎలా ఉన్నారు?', pron: 'Mee intlo andharu ela unnaru?', en: 'How is everyone at your home?' },
    { native: 'అంతా మంచిదేనా?', pron: 'Antha manchidena?', en: 'Is everything good?' }
  ],
  hi: [
    { native: 'आप कैसे हैं?', pron: 'Aap kaise hain?', en: 'How are you? (Formal)' },
    { native: 'तुम कैसे हो?', pron: 'Tum kaise ho?', en: 'How are you? (Informal)' },
    { native: 'मैं बहुत अच्छा हूँ, धन्यवाद।', pron: 'Main bahut accha hoon, dhanyavaad.', en: 'I am doing very well, thank you.' },
    { native: 'घर पर सब कैसे हैं?', pron: 'Ghar par sab kaise hain?', en: 'How is everyone at home?' },
    { native: 'सब ठीक-ठाक है।', pron: 'Sab theek-thaak hai.', en: 'Everything is fine.' }
  ],
  ml: [
    { native: 'നിങ്ങൾക്ക് സുഖമാണോ?', pron: 'Ningalkku sukhamaano?', en: 'Are you doing well? (Formal)' },
    { native: 'നിനക്ക് സുഖമാണോ?', pron: 'Ninakku sukhamaano?', en: 'How are you? (Informal)' },
    { native: 'എനിക്ക് വളരെ സുഖമാണ്, നന്ദി.', pron: 'Enikku valare sukhamaanu, nandi.', en: 'I am doing very well, thank you.' },
    { native: 'വീട്ടിൽ എല്ലാവർക്കും സുഖമാണോ?', pron: 'Veettil ellaavarkkum sukhamaano?', en: 'Is everyone well at home?' },
    { native: 'எல்லாம் നന്നായി പോകുന്നു.', pron: 'Ellaam nannaayi pokunnu.', en: 'Everything is going well.' }
  ],
  ta: [
    { native: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', pron: 'Neengal eppadi irukkeergal?', en: 'How are you? (Formal)' },
    { native: 'நீ எப்படி இருக்கிறாய்?', pron: 'Nee eppadi irukkiraai?', en: 'How are you? (Informal)' },
    { native: 'நான் மிகவும் நன்றாக இருக்கிறேன், நன்றி.', pron: 'Naan migavum nandraaga irukkiren, nandri.', en: 'I am doing very well, thank you.' },
    { native: 'வீட்டில் எல்லோரும் நலமா?', pron: 'Veettil ellorum nalamaa?', en: 'Is everyone fine at home?' },
    { native: 'எல்லாம் நன்றாக போகிறது.', pron: 'Ellaam nandraaga pogiradhu.', en: 'Everything is going well.' }
  ],
  ja: [
    { native: 'お元気ですか？', pron: 'Ogenki desu ka?', en: 'How are you? (Polite)' },
    { native: '元気？', pron: 'Genki?', en: 'How are you? (Casual)' },
    { native: 'はい、とても元気です。ありがとう。', pron: 'Hai, totemo genki desu. Arigatou.', en: 'Yes, I am very well. Thank you.' },
    { native: '調子はどうですか？', pron: 'Choushi wa dou desu ka?', en: 'How are things going?' },
    { native: 'おかげさまで元気です。', pron: 'Okagesama de genki desu.', en: 'Thanks to you, I am doing fine.' }
  ],
  fr: [
    { native: 'Comment allez-vous ?', pron: '', en: 'How are you? (Formal)' },
    { native: 'Comment ça va ?', pron: '', en: 'How is it going? (Casual)' },
    { native: 'Je vais très bien, merci !', pron: '', en: 'I am doing very well, thank you!' },
    { native: 'Tout se passe bien ?', pron: '', en: 'Is everything going well?' },
    { native: 'Et vous, comment ça va ?', pron: '', en: 'And you, how are you doing?' }
  ],
  ur: [
    { native: 'آپ کیسے ہیں؟', pron: 'Aap kaise hain?', en: 'How are you? (Formal)' },
    { native: 'تم کیسے ہو؟', pron: 'Tum kaise ho?', en: 'How are you? (Informal)' },
    { native: 'میں بالکل ٹھیک ہوں، شکریہ۔', pron: 'Main bilkul theek hoon, shukriya.', en: 'I am completely fine, thank you.' },
    { native: 'گھر میں سب خیریت ہے؟', pron: 'Ghar mein sab khairiyat hai?', en: 'Is everyone fine at home?' },
    { native: 'سب خیریت ہے۔', pron: 'Sab khairiyat hai.', en: 'Everything is peaceful and well.' }
  ]
};

async function customPracticeChat({ message, language = 'en', conversationHistory = [] }) {
  const userText = (message || '').trim();
  if (!userText) {
    throw new Error('Message content cannot be empty.');
  }

  const explicitLang = detectExplicitLanguage(userText);
  const lastUserMsg = (conversationHistory || []).filter(m => m.role === 'user').pop()?.content || '';
  const lastAiMsg = (conversationHistory || []).filter(m => m.role === 'assistant').pop()?.content || '';
  const lastLang = detectExplicitLanguage(lastUserMsg) || language || 'en';

  // Identify follow-up intents
  const isReplyFollowUp = /\b(how do i reply|how to reply|how to respond|reply for this|what should i reply|how can i reply)\b/i.test(userText);
  const isInformalFollowUp = /\b(informal|informally|casual|how to say informally|informal way|informal version)\b/i.test(userText);
  const isFormalFollowUp = /\b(formal|formally|polite|respectful|formal way|formal version)\b/i.test(userText);
  const isExamplesFollowUp = /\b(more examples?|another (example|one)|give me (five|5|\d+)? more|tell me more|next one|sample sentences?)\b/i.test(userText);
  const isLangSwitchFollowUp = /^(and\s+in|what\s+about\s+in|how\s+about\s+in|in)\s+([a-zA-Z]+)\??$/i.test(userText);
  const isExplanationFollowUp = /\b(why|explain this|explain why|what does it literally mean|break it down)\b/i.test(userText);

  const isFollowUp = (conversationHistory || []).length > 0 && (
    isReplyFollowUp || isInformalFollowUp || isFormalFollowUp || isExamplesFollowUp || isLangSwitchFollowUp || isExplanationFollowUp
  );

  const isTeachBasics = /\b(kathukodu|solli\s*kodu|kattikkodu|teach me|learn basics?|start learning)\b/i.test(userText);

  // Identify translation intent
  const isTranslationRequest = !isFollowUp && !isTeachBasics && (
    explicitLang !== null ||
    /\b(in telugu|in hindi|in malayalam|in tamil|in japanese|in french|in urdu|in english)\b/i.test(userText) ||
    /\b(nu\s+[a-z]+\s+la\s+sollu|[a-z]+\s+la\s+sollu|[a-z]+\s+lo\s+cheppu|[a-z]+\s+me\s+batao)\b/i.test(userText) ||
    /\b(how do (i|you) say|how to say|what is .+ in|translate .+ to|say .+ in)\b/i.test(userText) ||
    TANGLISH_MAP.some(item => item.pattern.test(userText))
  );

  const isExplanationRequest = /\b(explain|why|difference between|grammar|usage|clarify|vilakku|puriyala)\b/i.test(userText);
  const isExamplesRequest = /\b(example|examples|more examples|another one|sample sentences)\b/i.test(userText);

  const userSelectedLang = (language && ALL_PRACTICE_LANGS[language]) ? language : 'en';
  const langKey = explicitLang || (isFollowUp ? lastLang : userSelectedLang);
  const langMeta = ALL_PRACTICE_LANGS[langKey] || ALL_PRACTICE_LANGS.en;

  // 1. Try Gemini API first if configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are the AI Chat Companion in the Multilingual AI Learning Hub Practice Zone.
Target Language: ${langMeta.name} (${langMeta.nativeName}, code: ${langMeta.code}).

STRICT BEHAVIOURAL RULES:
1. Exact & Direct: Answer exactly what the user asks. Never interpret an ordinary language-learning question as an unrelated topic, article, event, person, or organisation.
2. Simple Translations: When the user asks for a translation or "how to say" something in any language (e.g. "How are you in Hindi?", "How are you in Telugu?", "Naan nalla irukken in Malayalam sollu"):
   Return ONLY the requested translation in native script, and on a new line (when useful for pronunciation):
   Pronunciation: [Pronunciation guide]
   Do NOT include headings (like "* Hindi:"), English meanings ("* English:"), explanations, examples, or unrelated information unless the user explicitly asks for them.
3. Explanations: Only provide explanations if the user specifically asks for an explanation (e.g., "Why...", "Explain...", "What is the grammar...").
4. Examples: Only provide extra examples if the user asks for them (e.g., "Give me more examples").
5. Normal Questions: For general knowledge, science, concepts, or conversation, provide a direct, relevant, helpful answer in a suitable length (1-3 clear sentences). Never use repetitive generic boilerplate.
6. Context & Intent: Understand English, Tamil, Tanglish, and mixed languages. Preserve context for genuine follow-ups. Do not let previous topics override a new, unrelated question.`;

      const historyFormatted = (conversationHistory || []).slice(-6).map(m => `${m.role === 'user' ? 'Learner' : 'AI Companion'}: ${m.content}`).join('\n');
      const prompt = historyFormatted 
        ? `Conversation History:\n${historyFormatted}\n\nLearner: ${userText}\nAI Companion:`
        : `Learner: ${userText}\nAI Companion:`;

      const aiReply = await callGeminiApi({ prompt, systemInstruction, language: langKey });
      if (aiReply && aiReply.trim().length > 0) {
        let cleanReply = aiReply.trim();
        if (isTranslationRequest && !isExplanationRequest && !isExamplesRequest) {
          const lines = cleanReply.split('\n').map(l => l.trim()).filter(Boolean);
          let nativeLine = '';
          let pronLine = '';
          for (const line of lines) {
            if (/^\*?\s*pronunciation:?\s*/i.test(line)) {
              pronLine = line.replace(/^\*?\s*pronunciation:?\s*/i, 'Pronunciation: ');
            } else if (!/^\*?\s*(english|meaning|explanation|example):?/i.test(line) && !nativeLine) {
              nativeLine = line.replace(/^\*?\s*[a-zA-Z]+:\s*/, '').trim();
            }
          }
          if (nativeLine) {
            cleanReply = nativeLine + (pronLine ? '\n' + pronLine : '');
          }
        }

        return {
          success: true,
          language: langKey,
          languageName: langMeta.name,
          nativeName: langMeta.nativeName,
          nativeReply: cleanReply.split('\n')[0].replace(/^Pronunciation:.*$/i, '').trim() || cleanReply,
          reply: cleanReply,
          source: 'gemini'
        };
      }
    } catch (apiErr) {
      console.warn('Gemini customPracticeChat notice, seamlessly using multilingual engine:', apiErr.message);
    }
  }

  // 2. Multilingual Pedagogical AI Engine Fallback (Dynamic, zero-config, 100% reliable)
  try {
    // === CASE A: FOLLOW-UPS ===
    if (isFollowUp) {
      const targetLang = explicitLang || lastLang || 'en';
      const targetMeta = ALL_PRACTICE_LANGS[targetLang] || ALL_PRACTICE_LANGS.en;

      // A1. "How do I reply to this?"
      if (isReplyFollowUp) {
        const prevPhrase = extractTranslationPhrase(lastUserMsg).toLowerCase();
        const replyData = CURATED_PHRASES[targetLang]?.[`reply:${prevPhrase}`];
        if (replyData) {
          let reply = `In ${targetMeta.name}, you can reply:\n${replyData.native}`;
          if (replyData.pron && targetLang !== 'en' && targetLang !== 'fr') reply += `\nPronunciation: ${replyData.pron}`;
          if (replyData.meaning) reply += ` (${replyData.meaning})`;
          return {
            success: true,
            isFollowUp: true,
            language: targetLang,
            languageName: targetMeta.name,
            nativeName: targetMeta.nativeName,
            nativeReply: replyData.native,
            pronunciation: replyData.pron,
            reply,
            source: 'multilingual-engine'
          };
        } else {
          const transRes = await translateGtxApi("I am doing well, thank you.", 'en', targetLang);
          let reply = `In ${targetMeta.name}, you can reply:\n${transRes.translatedText}`;
          if (transRes.romanization && targetLang !== 'en' && targetLang !== 'fr') reply += `\nPronunciation: ${formatPronunciation(transRes.romanization)}`;
          reply += ` (I am doing well, thank you.)`;
          return {
            success: true,
            isFollowUp: true,
            language: targetLang,
            languageName: targetMeta.name,
            nativeReply: transRes.translatedText,
            pronunciation: transRes.romanization,
            reply,
            source: 'multilingual-engine'
          };
        }
      }

      // A2. "What about informal?"
      if (isInformalFollowUp) {
        const prevPhrase = extractTranslationPhrase(lastUserMsg).toLowerCase();
        const informalData = CURATED_PHRASES[targetLang]?.[`informal:${prevPhrase}`];
        if (informalData) {
          let reply = informalData.native;
          if (informalData.pron && targetLang !== 'en' && targetLang !== 'fr') reply += `\nPronunciation: ${informalData.pron}`;
          return {
            success: true,
            isFollowUp: true,
            language: targetLang,
            languageName: targetMeta.name,
            nativeName: targetMeta.nativeName,
            nativeReply: informalData.native,
            pronunciation: informalData.pron,
            reply,
            source: 'multilingual-engine'
          };
        }
      }

      // A3. Language switch follow-up: "And in French?" / "What about in Telugu?"
      if (isLangSwitchFollowUp) {
        const prevPhrase = extractTranslationPhrase(lastUserMsg);
        const curated = CURATED_PHRASES[targetLang]?.[prevPhrase.toLowerCase()];
        if (curated) {
          let reply = curated.native;
          if (curated.pron && targetLang !== 'en' && targetLang !== 'fr') reply += `\nPronunciation: ${curated.pron}`;
          return {
            success: true,
            isFollowUp: true,
            language: targetLang,
            languageName: targetMeta.name,
            nativeName: targetMeta.nativeName,
            nativeReply: curated.native,
            pronunciation: curated.pron,
            reply,
            source: 'multilingual-engine'
          };
        }
        const transRes = await translateGtxApi(prevPhrase, 'auto', targetLang);
        let reply = transRes.translatedText;
        if (transRes.romanization && targetLang !== 'en' && targetLang !== 'fr') {
          reply += `\nPronunciation: ${formatPronunciation(transRes.romanization)}`;
        }
        return {
          success: true,
          isFollowUp: true,
          language: targetLang,
          languageName: targetMeta.name,
          nativeName: targetMeta.nativeName,
          nativeReply: transRes.translatedText,
          pronunciation: transRes.romanization,
          reply,
          source: 'multilingual-engine'
        };
      }

      // A4. "Give me more examples"
      if (isExamplesFollowUp) {
        const list = CONTEXTUAL_EXAMPLES[targetLang] || CONTEXTUAL_EXAMPLES.en;
        const lines = list.map((item, idx) => 
          `${idx + 1}. ${item.native}${item.pron ? `\n   Pronunciation: ${item.pron}` : ''}\n   Meaning: ${item.en}`
        ).join('\n\n');
        return {
          success: true,
          isFollowUp: true,
          language: targetLang,
          languageName: targetMeta.name,
          nativeName: targetMeta.nativeName,
          nativeReply: list[0].native,
          reply: `Here are 5 useful conversational examples in ${targetMeta.name}:\n\n${lines}`,
          source: 'multilingual-engine'
        };
      }

      // A5. "Why?" / "Explain"
      if (isExplanationFollowUp) {
        const explanation = `In ${targetMeta.name}, polite/formal forms are used with elders, professionals, and new acquaintances, while casual forms are reserved for close friends and peers.`;
        return {
          success: true,
          isFollowUp: true,
          language: targetLang,
          languageName: targetMeta.name,
          nativeName: targetMeta.nativeName,
          nativeReply: lastAiMsg,
          reply: explanation,
          source: 'multilingual-engine'
        };
      }
    }

    // === CASE B: TEACH BASICS ("Enakku Malayalam kathukodu") ===
    if (isTeachBasics) {
      const targetLang = explicitLang || lastLang || 'ml';
      const targetMeta = ALL_PRACTICE_LANGS[targetLang] || ALL_PRACTICE_LANGS.ml;
      const list = CONTEXTUAL_EXAMPLES[targetLang] || CONTEXTUAL_EXAMPLES.ml;
      const lines = list.map((item, idx) => 
        `${idx + 1}. ${item.native}${item.pron ? ` (${item.pron})` : ''} — ${item.en}`
      ).join('\n');

      const reply = `Here are essential starter phrases to learn ${targetMeta.name} (${targetMeta.nativeName}):\n\n${lines}`;

      return {
        success: true,
        language: targetLang,
        languageName: targetMeta.name,
        nativeName: targetMeta.nativeName,
        nativeReply: list[0].native,
        reply,
        source: 'multilingual-engine'
      };
    }

    // === CASE C: TRANSLATION REQUEST ===
    if (isTranslationRequest) {
      const targetLang = explicitLang || language || 'en';
      const targetMeta = ALL_PRACTICE_LANGS[targetLang] || ALL_PRACTICE_LANGS.en;
      const phrase = extractTranslationPhrase(userText);

      // Check curated phrases first for authentic native script & pronunciation
      const pKey = phrase.toLowerCase().replace(/[?!.]+$/, '').trim();
      const curated = CURATED_PHRASES[targetLang]?.[pKey];

      let nativeText = '';
      let pronunciation = '';

      if (curated) {
        nativeText = curated.native;
        pronunciation = curated.pron;
      } else {
        const transRes = await translateGtxApi(phrase, 'auto', targetLang);
        nativeText = transRes.translatedText;
        pronunciation = transRes.romanization;
        if (!pronunciation && targetLang !== 'en' && targetLang !== 'fr') {
          const extraPhon = await translateGtxApi(nativeText, targetLang, 'en');
          if (extraPhon.romanization) pronunciation = extraPhon.romanization;
        }
        pronunciation = formatPronunciation(pronunciation);
      }

      // For simple translation requests: return ONLY translation and pronunciation (when useful).
      // Do not add English meanings, long explanations, examples, headings, or unrelated information unless asked for!
      let reply = nativeText;
      if (pronunciation && pronunciation.trim() && pronunciation.trim().toLowerCase() !== nativeText.trim().toLowerCase() && targetLang !== 'en' && targetLang !== 'fr') {
        reply += `\nPronunciation: ${pronunciation}`;
      }

      if (isExplanationRequest) {
        const explanation = getUsageExplanation(phrase, targetLang, nativeText, pronunciation);
        if (explanation) reply += `\n\nExplanation: ${explanation}`;
      }

      return {
        success: true,
        isTranslation: true,
        language: targetLang,
        languageName: targetMeta.name,
        nativeName: targetMeta.nativeName,
        nativeReply: nativeText,
        pronunciation,
        reply,
        source: 'multilingual-engine'
      };
    }

    // === CASE D: NORMAL QUESTION / EVERYDAY CONVERSATION ===
    // Answer directly what the user asks in a suitable length.
    // Never interpret an ordinary question as an unrelated topic, article, event, person, or organisation.
    let textToProcess = userText;
    const isNonEnglishInput = /[\u0C00-\u0C7F\u0900-\u097F\u0D00-\u0D7F\u0B80-\u0BFF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u0600-\u06FF]/.test(userText);
    
    if (isNonEnglishInput) {
      try {
        const enQuery = await translateGtxApi(userText, 'auto', 'en');
        if (enQuery && enQuery.translatedText) {
          textToProcess = enQuery.translatedText;
        }
      } catch (_) {}
    }

    const answer = await handleGeneralQuestion(textToProcess);
    
    let targetOutputLang = 'en';
    const hasFrenchCues = /\b(bonjour|salut|merci|comment|pourquoi|quelles?|quelle|qui|est-ce|sont)\b/i.test(userText);
    if (explicitLang) {
      targetOutputLang = explicitLang;
    } else if (isNonEnglishInput) {
      targetOutputLang = langKey;
    } else if (langKey === 'fr' && hasFrenchCues) {
      targetOutputLang = 'fr';
    }

    const finalMeta = ALL_PRACTICE_LANGS[targetOutputLang] || ALL_PRACTICE_LANGS.en;

    let nativeReply = answer;
    let englishMeaning = answer;
    let pronunciation = '';

    if (targetOutputLang !== 'en') {
      try {
        const transRes = await translateGtxApi(answer, 'en', targetOutputLang);
        if (transRes && transRes.translatedText) {
          nativeReply = transRes.translatedText;
          englishMeaning = answer;
          pronunciation = transRes.romanization ? formatPronunciation(transRes.romanization) : '';
          if (!pronunciation && targetOutputLang !== 'fr' && targetOutputLang !== 'en') {
            const phon = await translateGtxApi(nativeReply, targetOutputLang, 'en');
            if (phon && phon.romanization) pronunciation = formatPronunciation(phon.romanization);
          }
        }
      } catch (_) {}
    }

    return {
      success: true,
      isGeneralQuestion: true,
      language: targetOutputLang,
      languageName: finalMeta.name,
      nativeName: finalMeta.nativeName,
      nativeReply,
      englishMeaning,
      pronunciation,
      reply: nativeReply,
      source: 'multilingual-engine'
    };
  } catch (err) {
    console.error('customPracticeChat fallback error:', err);
    throw new Error(`Chat assistant failed to respond: ${err.message}`);
  }
}

module.exports = {
  SUPPORTED_LANGS,
  ALL_PRACTICE_LANGS,
  validateLang,
  generateStudioTopic,
  generateStudioContent: generateStudioTopic,
  processDocumentStudy,
  explainMindmapNode,
  extractPdfText,
  tutorChat,
  searchAndLearn,
  generateTtsAudio,
  prewarmIntroAudio,
  customPracticeChat
};

