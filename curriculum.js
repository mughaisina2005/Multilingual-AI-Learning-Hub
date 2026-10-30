/**
 * MULTILINGUAL AI LEARNING HUB — ADVANCED CURRICULUM ENGINE (MODULE 4)
 * Supports all 7 languages in any pair (Explanation Lang <-> Target Lang)
 * Languages: Tamil, English, Hindi, Malayalam, Telugu, French, Japanese
 * Levels: Beginner (52 lessons), Intermediate (52 lessons), Advanced (52 lessons) = 156 Distinct Lessons!
 */

const LANGUAGES = {
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', bcp47: 'ta-IN', script: 'Tamil' },
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', bcp47: 'en-US', script: 'Latin' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', bcp47: 'hi-IN', script: 'Devanagari' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', bcp47: 'ml-IN', script: 'Malayalam' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', bcp47: 'te-IN', script: 'Telugu' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', bcp47: 'fr-FR', script: 'Latin' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', bcp47: 'ja-JP', script: 'Japanese' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', bcp47: 'ur-PK', script: 'Arabic' }
};

// =========================================================================
// MULTILINGUAL LEXICON BANK & CONVERSATIONS
// =========================================================================
const { LEXICON, UNIT_CONVERSATIONS } = require('./curriculum_lexicon');

// =========================================================================
// 30 UNITS DEFINITION (10 Beginner + 10 Intermediate + 10 Advanced)
// Each level provides 52 distinct lessons (Total = 156 lessons)
// =========================================================================

function generateUnitsForLevel(levelName, startUnitIdx, unitThemes) {
  return unitThemes.map((theme, uRelIdx) => {
    const unitNumber = uRelIdx + 1;
    const unitId = `unit_${startUnitIdx + uRelIdx}`;
    // Generate 5 or 6 progressive lessons per unit
    const lessonCount = (uRelIdx === 8 || uRelIdx === 9) ? 6 : 5;
    const lessons = [];

    for (let l = 1; l <= lessonCount; l++) {
      const lessonSeq = (uRelIdx * 5) + l; // 1 to 52
      const lessonId = `l_${levelName[0]}_u${unitNumber}_${l}`;
      lessons.push({
        id: lessonId,
        seq: lessonSeq,
        unitId: unitId,
        level: levelName,
        title: `${theme.lessonPrefixes[l - 1] || 'Stage ' + l}: ${theme.titles.en}`,
        xp: 15 + (l * 2)
      });
    }

    return {
      id: unitId,
      unitNumber,
      level: levelName,
      title: theme.titles,
      description: theme.descriptions,
      icon: theme.icon,
      lessons
    };
  });
}

// Beginner Themes (Units 1 - 10)
const BEGINNER_THEMES = [
  {
    titles: { en: 'Greetings & Introductions', ta: 'வாழ்த்துக்கள் மற்றும் அறிமுகங்கள்', hi: 'अभिवादन और परिचय', ml: 'അഭിവാദനങ്ങളും ആമുഖങ്ങളും', te: 'శుభాకాంక్షలు మరియు పరిచయాలు', fr: 'Salutations et Présentations', ja: '挨拶と自己紹介' },
    descriptions: { en: 'Essential greetings, politeness, and introductions to connect across cultures.', ta: 'பண்பாட்டு ரீதியாக இணைய அடிப்படை வாழ்த்துக்கள் மற்றும் அறிமுகங்கள்.', hi: 'संस्कृतियों से जुड़ने के लिए आवश्यक अभिवादन और शिष्टाचार।', ml: 'സംസ്കാരങ്ങളുമായി ബന്ധപ്പെടാൻ അടിസ്ഥാന ആശംസകൾ.', te: 'సంస్కృతులతో అనుసంధానం కావడానికి ప్రాథమిక శుభాకాంక్షలు.', fr: 'Salutations fondamentales et politesse pour créer du lien.', ja: '文化をつなぐための基本的な挨拶や丁寧な表現。' },
    icon: '👋',
    lessonPrefixes: ['Hello & Welcomes', 'Morning & Evening', 'How Are You & Wellbeing', 'Self Introduction & Name', 'Politeness & Saying Goodbye']
  },
  {
    titles: { en: 'Everyday Objects & Words', ta: 'அன்றாட பொருட்கள் மற்றும் சொற்கள்', hi: 'दैनिक वस्तुएं और शब्द', ml: 'നിത്യോപയോഗ സാധനങ്ങളും വാക്കുകളും', te: 'రోజువారీ వస్తువులు మరియు పదాలు', fr: 'Objets du Quotidien', ja: '日常の身の回りの物' },
    descriptions: { en: 'Master words for books, home, tables, and everyday items.', ta: 'புத்தகம், வீடு மற்றும் அன்றாட பயன்பாட்டு பொருட்களைக் கற்றுக்கொள்ளுங்கள்.', hi: 'किताब, घर और उपयोगी दैनिक वस्तुओं के शब्द सीखें।', ml: 'പുസ്തകം, വീട്, നിത്യോപയോഗ സാധനങ്ങൾ എന്നിവ പഠിക്കുക.', te: 'పుస్తకాలు, ఇల్లు మరియు నిత్య జీవిత వస్తువుల పదజాలం.', fr: 'Maîtrisez les objets courants de la maison et de la vie courante.', ja: '本や家など日々の生活に欠かせない基本単語。' },
    icon: '📚',
    lessonPrefixes: ['Home & Rooms', 'Reading & Books', 'Everyday Items', 'Common Furnishings', 'Describing Objects']
  },
  {
    titles: { en: 'Numbers & Counting Basics', ta: 'எண்களும் அடிப்படை எண்ணிக்கையும்', hi: 'संख्याएँ और बुनियादी गिनती', ml: 'സംഖ്യകളും എണ്ണലും', te: 'సంఖ్యలు మరియు లెక్కింపు', fr: 'Nombres et Comptage', ja: '数字と基本的な数え方' },
    descriptions: { en: 'Count with confidence from 1 to 10 and learn affirmative responses.', ta: '1 முதல் 10 வரை தெளிவாக எண்ணுங்கள்.', hi: '1 से 10 तक आत्मविश्वास से गिनें और हाँ/ना कहें।', ml: '1 മുതൽ 10 വരെയുള്ള സംഖ്യകൾ പരിശീലിക്കുക.', te: '1 నుండి 10 వరకు సంఖ్యలను సులభంగా నేర్చుకోండి.', fr: 'Comptez de 1 à 10 et formulez des affirmations claires.', ja: '1から10までの数字を自信を持って数えましょう。' },
    icon: '🔢',
    lessonPrefixes: ['Counting 1 to 5', 'Counting 6 to 10', 'Quantities & How Many', 'Yes & No Answers', 'Counting Daily Things']
  },
  {
    titles: { en: 'Family & Friends', ta: 'குடும்பம் மற்றும் நண்பர்கள்', hi: 'परिवार और मित्र', ml: 'കുടുംബവും സുഹൃത്തുക്കളും', te: 'కుటుంబం మరియు స్నేహితులు', fr: 'Famille et Amis', ja: '家族と友人' },
    descriptions: { en: 'Describe relationships, parents, siblings, and close companions.', ta: 'பெற்றோர், உடன்பிறப்புகள் மற்றும் நண்பர்களை விவரிக்கவும்.', hi: 'माता-पिता, भाई-बहन और मित्रों का परिचय दें।', ml: 'മാതാപിതാക്കൾ, സഹോദരങ്ങൾ എന്നിവരെക്കുറിച്ച് സംസാരിക്കുക.', te: 'తల్లిదండ్రులు మరియు స్నేహితులను పరిచయం చేయండి.', fr: 'Parlez de vos proches, parents, frères, sœurs et amis.', ja: '両親や友人、身近な人々について話しましょう。' },
    icon: '👨‍👩‍👧',
    lessonPrefixes: ['Mother & Father', 'Brothers & Sisters', 'Extended Family', 'Close Companions', 'Introducing Your Circle']
  },
  {
    titles: { en: 'Food, Drinks & Dining', ta: 'உணவு, பானங்கள் மற்றும் உணவுமுறை', hi: 'भोजन और पेय', ml: 'ഭക്ഷണവും പാനീയങ്ങളും', te: 'ఆహారం మరియు పానీయాలు', fr: 'Nourriture et Boissons', ja: '食べ物と飲み物' },
    descriptions: { en: 'Learn words for water, tea, meals, and expressing appetite.', ta: 'தண்ணீர், தேநீர் மற்றும் உணவு சார்ந்த சொற்களை அறிந்துகொள்ளுங்கள்.', hi: 'पानी, चाय और दैनिक भोजन के नाम सीखें।', ml: 'വെള്ളം, ചായ, നിത്യഭക്ഷണം എന്നിവയെക്കുറിച്ച് പഠിക്കുക.', te: 'నీరు, టీ మరియు ఆహార పదార్థాల పేర్లు.', fr: 'Commandez de l’eau, du thé et vos repas préférés.', ja: '水やお茶、食事に関する表現を身につけます。' },
    icon: '🍵',
    lessonPrefixes: ['Water & Beverages', 'Morning Breakfast', 'Fruits & Vegetables', 'Saying Delicious', 'Table Manners']
  },
  {
    titles: { en: 'Colors, Clothes & Descriptions', ta: 'வண்ணங்கள் மற்றும் ஆடைகள்', hi: 'रंग और वस्त्र', ml: 'നിറങ്ങളും വസ്ത്രങ്ങളും', te: 'రంగులు మరియు వస్త్రాలు', fr: 'Couleurs et Vêtements', ja: '色と服装' },
    descriptions: { en: 'Identify colors, clothes, and descriptive adjectives.', ta: 'நிறங்கள் மற்றும் ஆடை அலங்காரங்களை விவரிக்கவும்.', hi: 'प्राथमिक रंग और परिधानों की पहचान करें।', ml: 'നിറങ്ങളും വസ്ത്രങ്ങളും കൃത്യമായി തിരിച്ചറിയുക.', te: 'రంగులు మరియు దుస్తుల వివరాలు.', fr: 'Décrivez les couleurs et les vêtements avec précision.', ja: '基本的な色や衣服の表現を学びましょう。' },
    icon: '🎨',
    lessonPrefixes: ['Primary Colors', 'Neutral Shades', 'Everyday Clothes', 'Opposites & Sizes', 'Color Combinations']
  },
  {
    titles: { en: 'Time, Days & Calendar', ta: 'நேரம், நாட்கள் மற்றும் நாள்காட்டி', hi: 'समय और दिन', ml: 'സമയവും ദിവസങ്ങളും', te: 'సమయం మరియు రోజులు', fr: 'Le Temps et les Jours', ja: '時間と曜日' },
    descriptions: { en: 'Days of the week, morning, afternoon, and telling the hour.', ta: 'வார நாட்கள், காலை, மாலை மற்றும் நேரத்தைக் கூறவும்.', hi: 'सप्ताह के दिन, सुबह, शाम और समय बताना सीखें।', ml: 'ആഴ്ചയിലെ ദിവസങ്ങളും സമയവും വ്യക്തമാക്കുക.', te: 'వారంలోని రోజులు మరియు సమయం చెప్పడం.', fr: 'Dites l’heure et nommez les jours de la semaine.', ja: '曜日や時間、朝と夜の区別をマスター。' },
    icon: '⏰',
    lessonPrefixes: ['Days of the Week', 'Morning to Night', 'Today & Tomorrow', 'Telling Time Basics', 'Weekly Routines']
  },
  {
    titles: { en: 'City Places & Navigation', ta: 'நகர இடங்கள் மற்றும் வழிகள்', hi: 'शहर के स्थान और दिशाएँ', ml: 'നഗരവും വഴികളും', te: 'నగర ప్రదేశాలు మరియు దిశలు', fr: 'Lieux de la Ville et Directions', ja: '街の場所と道案内' },
    descriptions: { en: 'Schools, markets, hospitals, and asking simple directions.', ta: 'பள்ளி, சந்தை, மருத்துவமனை மற்றும் வழி கேட்கும் முறைகள்.', hi: 'स्कूल, बाजार और रास्ते पूछना सीखें।', ml: 'വിദ്യാലയം, ചന്ത എന്നിവയും ദിശകളും പഠിക്കുക.', te: 'పాఠశాల, మార్కెట్ మరియు దారి అడగడం.', fr: 'Repérez les lieux urbains et demandez votre chemin.', ja: '駅や市場の場所、簡単な道順の尋ね方。' },
    icon: '🗺️',
    lessonPrefixes: ['Important Places', 'Asking Where Is', 'Left, Right, Straight', 'Transit & Vehicles', 'Finding Your Way']
  },
  {
    titles: { en: 'Simple Daily Sentences', ta: 'எளிய தினசரி வாக்கியங்கள்', hi: 'सरल दैनिक वाक्य', ml: 'ലളിതമായ വാക്യങ്ങൾ', te: 'సరళ నిత్య వాక్యాలు', fr: 'Phrases Simples du Quotidien', ja: '簡単な日常の文' },
    descriptions: { en: 'Form your first real sentences combining subject, verb, and adjectives.', ta: 'எழுவாய் மற்றும் வினையை இணைத்து வாக்கியங்களை உருவாக்குங்கள்.', hi: 'कर्ता और क्रिया को जोड़कर पहले वाक्य बनाएँ।', ml: 'പദങ്ങൾ ചേർത്ത് വാക്യങ്ങൾ നിർമ്മിക്കുക.', te: 'కర్త మరియు క్రియతో వాక్యాలు రూపొందించండి.', fr: 'Construisez vos premières phrases complètes avec sujet et verbe.', ja: '主語と動詞を組み合わせて自然な文を作成。' },
    icon: '💬',
    lessonPrefixes: ['Action Verbs', 'Daily Activities', 'I Learn & Speak', 'Likes & Dislikes', 'Present Sentences', 'Connecting Words']
  },
  {
    titles: { en: 'Everyday Conversations & Review', ta: 'அன்றாட உரையாடல்கள் மற்றும் மீள்பார்வை', hi: 'दैनिक बातचीत और समीक्षा', ml: 'ദൈനംദിന സംഭാഷണം', te: 'రోజువారీ సంభాషణలు', fr: 'Conversations et Synthèse Débutant', ja: '日常会話と初級のまとめ' },
    descriptions: { en: 'Engage in simple dialogues and solidify your beginner language mastery.', ta: 'எளிய உரையாடல்களில் ஈடுபட்டு தொடக்க நிலையை உறுதிப்படுத்துங்கள்.', hi: 'सरल संवादों में भाग लेकर अपनी शुरुआती दक्षता मजबूत करें।', ml: 'ലളിതമായ സംഭാഷണങ്ങളിലൂടെ തുടക്ക നില പൂർത്തിയാക്കുക.', te: 'సరళ సంభాషణలతో ప్రాథమిక స్థాయిని పూర్తి చేయండి.', fr: 'Pratiquez des échanges réels et consolidez vos bases.', ja: '実際の簡単な対話で初級の総合力を確認。' },
    icon: '🌟',
    lessonPrefixes: ['Meeting a New Friend', 'Asking About the Day', 'Simple Market Chat', 'Asking to Repeat', 'Polite Daily Thanks', 'Beginner Capstone']
  }
];

// Intermediate Themes (Units 11 - 20)
const INTERMEDIATE_THEMES = [
  {
    titles: { en: 'Daily Routines & Habits', ta: 'தினசரி பழக்கவழக்கங்கள்', hi: 'दैनिक दिनचर्या और आदतें', ml: 'ദിനചര്യകളും ശീലങ്ങളും', te: 'దినచర్యలు మరియు అలవాట్లు', fr: 'Routines Quotidiennes et Habitudes', ja: '日々の習慣とルーティン' },
    descriptions: { en: 'Describe complex daily schedules, morning commutes, and relaxation.', ta: 'விரிவான தினசரி அட்டவணைகள் மற்றும் வேலை பழக்கங்களை விவரிக்கவும்.', hi: 'अपनी विस्तृत दिनचर्या और आदतों का वर्णन करें।', ml: 'നിങ്ങളുടെ ദിനചര്യകളെയും ശീലങ്ങളെയും കുറിച്ച് പറയുക.', te: 'మీ రోజువారీ కార్యకలాపాలను స్పష్టంగా వివరించండి.', fr: 'Décrivez vos horaires, vos trajets et vos moments de détente.', ja: '毎日のスケジュールや通勤、休息の習慣を説明。' },
    icon: '🌅',
    lessonPrefixes: ['Early Morning Commute', 'Work & Study Routine', 'Evening Unwinding', 'Frequency Adverbs', 'Comparing Lifestyles']
  },
  {
    titles: { en: 'Past Experiences & Storytelling', ta: 'கடந்த கால அனுபவங்கள் மற்றும் கதைகள்', hi: 'अतीत के अनुभव और कहानियाँ', ml: 'കഴിഞ്ഞകാല അനുഭവങ്ങൾ', te: 'గత అనుభవాలు మరియు కథలు', fr: 'Expériences Passées et Récits', ja: '過去の経験とストーリー' },
    descriptions: { en: 'Narrate what you did yesterday, past vacations, and memories.', ta: 'நேற்று என்ன செய்தீர்கள் என்பதையும் கடந்த கால நினைவுகளையும் பகிருங்கள்.', hi: 'कल आपने क्या किया और अतीत की यात्राओं का वर्णन करें।', ml: 'കഴിഞ്ഞ അവധിക്കാല യാത്രകളെക്കുറിച്ച് സംസാരിക്കുക.', te: 'నిన్న చేసిన పనులు మరియు పాత జ్ఞాపకాలు.', fr: 'Racontez votre journée d’hier et vos souvenirs marquants.', ja: '過去の出来事や旅の思い出を流暢に語りましょう。' },
    icon: '📖',
    lessonPrefixes: ['What Happened Yesterday', 'Memorable Vacations', 'Childhood Memories', 'Past Irregular Verbs', 'Story Connectors']
  },
  {
    titles: { en: 'Future Plans & Aspirations', ta: 'எதிர்கால திட்டங்களும் விருப்பங்களும்', hi: 'भविष्य की योजनाएं और लक्ष्य', ml: 'ഭാവി പദ്ധതികളും ലക്ഷ്യങ്ങളും', te: 'భవిష్యత్ ప్రణాళికలు', fr: 'Projets Futurs et Aspirations', ja: '将来の計画と目標' },
    descriptions: { en: 'Discuss future goals, upcoming travel, and conditional wishes.', ta: 'எதிர்கால இலக்குகள் மற்றும் பயண திட்டங்களை விவாதிக்கவும்.', hi: 'अपने भविष्य के लक्ष्यों और यात्रा की योजनाओं पर चर्चा करें।', ml: 'ഭാവി സ്വപ്നങ്ങളും യാത്രകളും ആസൂത്രണം ചെയ്യുക.', te: 'భవిష్యత్ ఆశయాలు మరియు ప్రయాణ ప్రణాళికలు.', fr: 'Formulez vos projets d’avenir et vos souhaits conditionnels.', ja: '将来の目標や週末の計画を表現する練習。' },
    icon: '🚀',
    lessonPrefixes: ['Career & Study Goals', 'Upcoming Trips', 'Hopes & Wishes', 'If I Have Time...', 'Confirming Dates']
  },
  {
    titles: { en: 'Shopping, Bargaining & Payments', ta: 'ஷாப்பிங், பேரம் பேசுதல் மற்றும் பணம் செலுத்துதல்', hi: 'खरीदारी और मोलभाव', ml: 'ഷോപ്പിംഗും ഇടപാടുകളും', te: 'షాపింగ్ మరియు చెల్లింపులు', fr: 'Achats, Négociations et Paiements', ja: '買い物と交渉' },
    descriptions: { en: 'Inquire about sizing, prices, polite discounts, and digital payments.', ta: 'விலை, தள்ளுபடி மற்றும் மின்னணு கட்டண முறைகளை கையாளவும்.', hi: 'मूल्य, छूट और डिजिटल भुगतान के बारे में बात करें।', ml: 'വിലപേശലും ഓൺലൈൻ പണമിടപാടുകളും മനസ്സിലാക്കുക.', te: 'ధరలు అడగడం మరియు తగ్గింపుల గురించి మాట్లాడటం.', fr: 'Négociez poliment, demandez la taille et réglez vos achats.', ja: '値段の確認や丁寧な値引き交渉、決済の表現。' },
    icon: '🛍️',
    lessonPrefixes: ['Asking Sizes & Colors', 'Polite Price Discounts', 'Exchanging Products', 'Comparing Qualities', 'Digital Payments']
  },
  {
    titles: { en: 'Travel, Bookings & Navigation', ta: 'பயணம், முன்பதிவு மற்றும் போக்குவரத்து', hi: 'यात्रा और आरक्षण', ml: 'യാത്രയും ബുക്കിംഗും', te: 'ప్రయాణాలు మరియు బుకింగ్స్', fr: 'Voyage, Réservations et Transit', ja: '旅行と予約' },
    descriptions: { en: 'Hotel check-ins, metro navigation, and local recommendations.', ta: 'ஹோட்டல் முன்பதிவு மற்றும் மெட்ரோ பயண வழிகாட்டுதல்கள்.', hi: 'होटल चेक-इन और मेट्रो मार्गों की जानकारी लें।', ml: 'ഹോട്ടൽ റിസർവേഷനും യാത്രാ നിർദ്ദേശങ്ങളും.', te: 'హోటల్ బుకింగ్ మరియు మెట్రో ప్రయాణం.', fr: 'Gérez vos séjours à l’hôtel, vos correspondances et trajets.', ja: 'ホテルのチェックインや乗り換え案内の実践。' },
    icon: '✈️',
    lessonPrefixes: ['Train & Flight Tickets', 'Hotel Requests', 'Metro Transfers', 'Local Suggestions', 'Handling Travel Delays']
  },
  {
    titles: { en: 'Health, Wellness & Symptoms', ta: 'உடல்நலம் மற்றும் மருத்துவ ஆலோசனை', hi: 'स्वास्थ्य और चिकित्सा', ml: 'ആരോഗ്യവും പരിചരണവും', te: 'ఆరోగ్యం మరియు వైద్య సలహాలు', fr: 'Santé, Bien-être et Médecine', ja: '健康と医療相談' },
    descriptions: { en: 'Describe symptoms to a doctor, visit a pharmacy, and healthy habits.', ta: 'மருத்துவரிடம் அறிகுறிகளை விவரித்து ஆலோசனை பெறவும்.', hi: 'डॉक्टर को लक्षण बताएं और दवाइयों की जानकारी लें।', ml: 'രോഗലക്ഷണങ്ങൾ വിശദീകരിക്കുകയും മരുന്ന് ചോദിക്കുകയും ചെയ്യുക.', te: 'వైద్యుడికి లక్షణాలు చెప్పడం మరియు మందులు.', fr: 'Expliquez vos maux à un médecin et demandez des conseils.', ja: '症状の説明や薬局での受け答えを練習。' },
    icon: '🩺',
    lessonPrefixes: ['Describing Pain', 'At the Pharmacy', 'Doctor Consultation', 'Healthy Habits', 'Wishing Quick Recovery']
  },
  {
    titles: { en: 'Workplace & Professional Collab', ta: 'பணியிடமும் தொழில்முறை ஒத்துழைப்பும்', hi: 'कार्यस्थल और व्यावसायिक सहयोग', ml: 'തൊഴിലിടവും സഹകരണവും', te: 'కార్యాలయం మరియు సహకారం', fr: 'Milieu Professionnel et Collaboration', ja: '職場とビジネスコラボレーション' },
    descriptions: { en: 'Office etiquette, polite emails, meeting agendas, and milestones.', ta: 'தொழில்முறை மின்னஞ்சல்கள் மற்றும் குழு விவாதங்கள்.', hi: 'व्यावसायिक ईमेल और बैठकों में सहयोग के नियम।', ml: 'ഔദ്യോഗിക ഇമെയിലുകളും യോഗങ്ങളും.', te: 'ఆఫీస్ ఇమెయిల్‌లు మరియు సమావేశాలు.', fr: 'Participez à des réunions d’équipe et rédigez des courriels clairs.', ja: 'ビジネスメールやミーティングでの発言。' },
    icon: '💼',
    lessonPrefixes: ['Email Etiquette', 'Meeting Agendas', 'Asking Assistance', 'Project Milestones', 'Progress Reports']
  },
  {
    titles: { en: 'Hobbies, Arts & Entertainment', ta: 'பொழுதுபோக்குகள் மற்றும் கலைகள்', hi: 'शौक, कला और मनोरंजन', ml: 'വിനോദങ്ങളും കലകളും', te: 'వ్యాపకాలు మరియు కళలు', fr: 'Loisirs, Arts et Divertissement', ja: '趣味とカルチャー' },
    descriptions: { en: 'Discuss favorite music, cinema, culinary recipes, and sports.', ta: 'இசை, திரைப்படம், உணவு சமையல் குறிப்புகள் மற்றும் விளையாட்டுகள்.', hi: 'संगीत, फिल्में, भोजन और खेलों पर रुचि साझा करें।', ml: 'സംഗീതം, സിനിമ, പാചകം എന്നിവ ചർച്ച ചെയ്യുക.', te: 'సంగీతం, సినిమాలు మరియు వంటకాలు.', fr: 'Partagez vos goûts musicaux, culinaires et cinématographiques.', ja: '音楽や映画、料理のレシピについて語り合う。' },
    icon: '🎭',
    lessonPrefixes: ['Music & Instruments', 'Recommending Films', 'Culinary Recipes', 'Outdoor Sports', 'Cultural Festivals']
  },
  {
    titles: { en: 'Expressing Feelings & Preferences', ta: 'உணர்ச்சிகள் மற்றும் விருப்பங்களை வெளிப்படுத்துதல்', hi: 'भावनाएं और प्राथमिकताएं', ml: 'വികാരങ്ങളും മുൻഗണനകളും', te: 'భావోద్వేగాలు మరియు ప్రాధాన్యతలు', fr: 'Émotions, Préférences et Nuances', ja: '感情と好みの表現' },
    descriptions: { en: 'Nuanced opinions, expressing empathy, preferences, and polite critiques.', ta: 'விருப்பங்கள், அனுதாபம் மற்றும் ஆக்கப்பூர்வமான கருத்துக்கள்.', hi: 'अपनी प्राथमिकताएं और रचनात्मक प्रतिक्रिया व्यक्त करें।', ml: 'സ്വന്തം അഭിപ്രായങ്ങളും വികാരങ്ങളും പ്രകടിപ്പിക്കുക.', te: 'అభిప్రాయాలు మరియు ప్రాధాన్యతలను వ్యక్తపరచడం.', fr: 'Exprimez vos sentiments, vos doutes et vos choix personnels.', ja: '細やかな感情や比較の表現を深める。' },
    icon: '💭',
    lessonPrefixes: ['Excitement & Relief', 'Gentle Disappointment', 'Comparing Options', 'In My View...', 'Constructive Feedback', 'Polite Disagreement']
  },
  {
    titles: { en: 'Practical Problem Solving', ta: 'நடைமுறை சிக்கல் தீர்வு மற்றும் மீள்பார்வை', hi: 'व्यावहारिक समस्या समाधान', ml: 'പ്രശ്നപരിഹാരവും അവലോകനവും', te: 'సమస్య పరిష్కారం', fr: 'Résolution de Problèmes et Bilan', ja: '問題解決と中級のまとめ' },
    descriptions: { en: 'Resolve service issues, organize community events, and roleplay.', ta: 'புகார்களைத் தீர்த்து சமூக நிகழ்வுகளை ஒருங்கிணைக்கவும்.', hi: 'शिकायतों का निवारण और सामुदायिक कार्यक्रमों की योजना बनाएँ।', ml: 'പ്രശ്നങ്ങൾ പരിഹരിക്കാനും പരിപാടികൾ സംഘടിപ്പിക്കാനും പഠിക്കുക.', te: 'సమస్యలను పరిష్కరించడం మరియు బృంద చర్చలు.', fr: 'Traitez les réclamations et menez des échanges complexes.', ja: 'トラブル対応やディスカッションを実践。' },
    icon: '🧩',
    lessonPrefixes: ['Service Complaints', 'Neighborly Courtesy', 'Schedule Adjustments', 'Community Meetup', 'Extended AI Dialogue', 'Intermediate Mastery']
  }
];

// Advanced Themes (Units 21 - 30)
const ADVANCED_THEMES = [
  {
    titles: { en: 'Complex Opinions & Philosophical Debate', ta: 'தத்துவார்த்த விவாதங்கள் மற்றும் ஆழமான கருத்துக்கள்', hi: 'दार्शनिक वाद-विवाद और जटिल विचार', ml: 'തത്ത്വചിന്താപരമായ സംവാദങ്ങൾ', te: 'తాత్విక చర్చలు మరియు దృక్కోణాలు', fr: 'Débats Philosophiques et Opinions Complexes', ja: '哲学的議論と高度な意見表明' },
    descriptions: { en: 'Construct cohesive arguments, defend theses, and analyze abstract ideas.', ta: 'வலுவான வாதங்களை முன்வைத்து சுருக்கமான கருத்துக்களை ஆராயுங்கள்.', hi: 'ठोस तर्कों के साथ अपने दृष्टिकोण का समर्थन करें।', ml: 'സങ്കീർണ്ണമായ വിഷയങ്ങളിൽ യുക്തിസഹമായി സംസാരിക്കുക.', te: 'లోతైన విశ్లేషణలతో మీ వాదనలను సమర్థించండి.', fr: 'Structurez une argumentation rigoureuse avec nuances.', ja: '論理的な根拠をもって自らの主張を展開する技術。' },
    icon: '⚖️',
    lessonPrefixes: ['Cohesive Arguments', 'Defending Perspectives', 'Probability & Deduction', 'Abstract Justice & Ethics', 'Academic Discourse']
  },
  {
    titles: { en: 'Cultural Heritage & Multilingual Identity', ta: 'பண்பாட்டு மரபும் பன்மொழி அடையாளமும்', hi: 'सांस्कृतिक विरासत और बहुभाषी पहचान', ml: 'സാംസ്കാരിക പൈതൃകവും ഭാഷാ ഐഡന്റിറ്റിയും', te: 'సాంస్కృతిక వారసత్వం మరియు బహుభాషా గుర్తింపు', fr: 'Patrimoine Culturel et Identité Plurilingue', ja: '文化遺産と多言語アイデンティティ' },
    descriptions: { en: 'Explore language preservation, global migration, and cultural proverbs.', ta: 'மொழிப் பாதுகாப்பு, உலகளாவிய இடம்பெயர்வு மற்றும் பண்பாட்டு பழமொழிகள்.', hi: 'भाषा संरक्षण और वैश्विक बहुसांस्कृतिक समाज का विश्लेषण।', ml: 'ഭാഷാ സംരക്ഷണവും സാംസ്കാരിക വൈവിധ്യവും.', te: 'భాషా పరిరక్షణ మరియు గ్లోబల్ సంస్కృతి.', fr: 'Analysez la préservation linguistique et la diversité humaine.', ja: '言語の継承や多文化共生社会についての思索。' },
    icon: '🏛️',
    lessonPrefixes: ['Preservation vs Modernity', 'Linguistic Identity', 'Cross-Cultural Etiquette', 'Multicultural Societies', 'Analyzing Cultural Proverbs']
  },
  {
    titles: { en: 'Artificial Intelligence & Future Tech', ta: 'செயற்கை நுண்ணறிவு மற்றும் எதிர்கால தொழில்நுட்பம்', hi: 'कृत्रिम बुद्धिमत्ता और भविष्य की तकनीक', ml: 'നിർമ്മിതബുദ്ധിയും ഭാവി സാങ്കേതികവിദ്യയും', te: 'కృత్రిమ మేధస్సు మరియు భవిష్యత్ సాంకేతికత', fr: 'Intelligence Artificielle et Société Future', ja: 'AIと未来社会の展望' },
    descriptions: { en: 'Debate machine learning ethics, automated translation, and future work.', ta: 'மெஷின் லேர்னிங் நெறிமுறைகள் மற்றும் தானியங்கி மொழிபெயர்ப்பு விவாதங்கள்.', hi: 'एआई की नैतिकता और कार्यस्थल पर स्वचालन के प्रभाव पर चर्चा करें।', ml: 'റോബോട്ടിക്സ്, എഐ എന്നിവയുടെ ധാർമ്മിക വശങ്ങൾ.', te: 'కృత్రిమ మేధస్సు మరియు భవిష్యత్ విద్య.', fr: 'Débattez de l’éthique des algorithmes et de la traduction neuronale.', ja: '機械学習の倫理的課題と自動翻訳の可能性を議論。' },
    icon: '🤖',
    lessonPrefixes: ['AI Bridging Cultures', 'Ethical Algorithms', 'Data Rights & Privacy', 'Adaptive Education', 'Technological Sustainability']
  },
  {
    titles: { en: 'High-Stakes Negotiations & Business Strategy', ta: 'உயர்மட்ட பேச்சுவார்த்தைகளும் வணிக உத்திகளும்', hi: 'उच्चस्तरीय बातचीत और व्यापार रणनीति', ml: 'ബിസിനസ് തന്ത്രങ്ങളും നയതന്ത്രവും', te: 'వ్యాపార వ్యూహాలు మరియు చర్చలు', fr: 'Négociations Stratégiques et Affaires', ja: '戦略的交渉と国際ビジネス' },
    descriptions: { en: 'Corporate diplomacy, contract clauses, concessions, and leadership.', ta: 'ஒப்பந்த விதிமுறைகள், இராஜதந்திரம் மற்றும் தலைமைத்துவ பேச்சுவார்த்தை.', hi: 'व्यावसायिक सौदों और रणनीतिक साझेदारियों के उच्च स्तर के नियम।', ml: 'കരാറുകൾ, നേതൃത്വം, ബിസിനസ് ആശയവിനിമയം.', te: 'అంతర్జాతీయ వ్యాపార చర్చలు మరియు ఒప్పందాలు.', fr: 'Conduisez des négociations internationales à fort enjeu.', ja: '国際契約や高度なビジネス折衝をこなす表現力。' },
    icon: '📊',
    lessonPrefixes: ['Contractual Clauses', 'Strategic Concessions', 'Global Supply Diplomacy', 'Crisis Communication', 'Executive Pitching']
  },
  {
    titles: { en: 'Literature, Poetry & Film Analysis', ta: 'இலக்கியம், கவிதை மற்றும் திரைப்பட விமர்சனம்', hi: 'साहित्य, कविता और फिल्म विश्लेषण', ml: 'സാഹിത്യവും ചലച്ചിത്ര വിശകലനവും', te: 'సాహిత్యం, కవిత్వం మరియు విమర్శ', fr: 'Littérature, Poésie et Critique Cinématographique', ja: '文学・詩・映画の批評的読解' },
    descriptions: { en: 'Literary metaphors, allegories, thematic direction, and poetic beauty.', ta: 'இலக்கிய உவமைகள், கவிதை நயங்கள் மற்றும் கலை விமர்சனங்கள்.', hi: 'रूपक, साहित्यिक प्रतीक और शास्त्रीय समीक्षा का अध्ययन।', ml: 'കാവ്യാത്മക ശൈലികളും സാഹിത്യ ചിന്തകളും.', te: 'కవితా శైలులు మరియు సాహిత్య విశేషాలు.', fr: 'Analysez les figures de style, le sous-texte et la poésie.', ja: '比喩表現や映画のテーマ、芸術作品の深層読解。' },
    icon: '🖋️',
    lessonPrefixes: ['Literary Metaphors', 'Poetic Forms Across Tongues', 'Directorial Themes', 'Architectural Eras', 'Philosophical Essays']
  },
  {
    titles: { en: 'Ecological Policy & Sustainable Future', ta: 'சுற்றுச்சூழல் கொள்கை மற்றும் நிலையான எதிர்காலம்', hi: 'पारिस्थितिक नीति और सतत विकास', ml: 'പരിസ്ഥിതി നയങ്ങളും സുസ്ഥിരതയും', te: 'పర్యావరణ విధానాలు మరియు సుస్థిరత', fr: 'Politique Écologique et Climat Global', ja: '地球環境政策と持続可能性' },
    descriptions: { en: 'Climate mitigation treaties, circular economy, and ecological justice.', ta: 'பருவநிலை மாற்ற உடன்படிக்கைகள் மற்றும் நிலையான பொருளாதார மாதிரிகள்.', hi: 'जलवायु संकट, चक्रीय अर्थव्यवस्था और वैश्विक संधियों पर विमर्श।', ml: 'കാലാവസ്ഥാ വ്യതിയാനവും പരിഹാരങ്ങളും.', te: 'వాతావరణ మార్పుల ఒప్పందాలు.', fr: 'Discutez des traités climatiques et de l’économie circulaire.', ja: '気候変動対策と循環型経済の国際的課題を分析。' },
    icon: '🌱',
    lessonPrefixes: ['Climate Accords', 'Biodiversity Restoration', 'Circular Economic Models', 'Global Summits', 'Systemic Reform']
  },
  {
    titles: { en: 'Media Literacy & Critical Discourse', ta: 'ஊடக விழிப்புணர்வும் விமர்சன சிந்தனையும்', hi: 'मीडिया साक्षरता और आलोचनात्मक सोच', ml: 'മാധ്യമ സാക്ഷരതയും വിമർശനാത്മക ചിന്തയും', te: 'మీడియా అక్షరాస్యత మరియు విశ్లేషణ', fr: 'Éducation aux Médias et Esprit Critique', ja: 'メディアリテラシーと情報分析' },
    descriptions: { en: 'Deconstruct bias, investigative journalism, and algorithmic echo chambers.', ta: 'ஊடக ஒருதலைப்பட்சம் மற்றும் உண்மைச் சரிபார்ப்பு முறைகளை அறிந்துகொள்ளுங்கள்.', hi: 'पत्रकारिता की स्वतंत्रता और सूचना के सत्यापन की विधियाँ।', ml: 'വാർത്തകളുടെ നിഷ്പക്ഷതയും വിശകലനവും.', te: 'సమాచార విశ్లేషణ మరియు వాస్తవాల పరిశీలన.', fr: 'Décelez les biais informationnels et analysez la rhétorique.', ja: '情報の真偽を見極め、世論形成のメカニズムを考察。' },
    icon: '📰',
    lessonPrefixes: ['Identifying Media Bias', 'Investigative Integrity', 'Algorithmic Echo Chambers', 'Rhetorical Framing', 'Ethical Dissemination']
  },
  {
    titles: { en: 'Idioms, Proverbs & Rhetoric', ta: 'பழமொழிகள் மற்றும் நயமான சொல்லாட்சி', hi: 'मुहावरे, लोकोक्तियाँ और वक्तृत्व', ml: 'പഴഞ്ചൊല്ലുകളും പ്രയോഗങ്ങളും', te: 'సామెతలు మరియు జాతీయాలు', fr: 'Idiomes, Proverbes et Rhétorique', ja: '慣用句・ことわざ・修辞技法' },
    descriptions: { en: 'Regional metaphors, irony, sarcasm, and untranslatable expressions.', ta: 'மொழிசார்ந்த பழமொழிகள் மற்றும் மொழிபெயர்க்க முடியாத பண்பாட்டு சொற்கள்.', hi: 'क्षेत्रीय मुहावरे, व्यंग्य और अद्वितीय सांस्कृतिक अभिव्यक्तियाँ।', ml: 'നാടൻ പ്രയോഗങ്ങളും സവിശേഷ ശൈലികളും.', te: 'ప్రాంతీయ జాతీయాలు మరియు వ్యంగ్యం.', fr: 'Maîtrisez l’ironie, les expressions imagées et tournures fines.', ja: '直訳できない奥深い慣用句やアイロニーの使い分け。' },
    icon: '🗝️',
    lessonPrefixes: ['Classical Roots', 'Irony & Nuance', 'Regional Metaphors', 'Tone Shifts', 'Untranslatable Concepts']
  },
  {
    titles: { en: 'Hypothetical Scenarios & Dilemmas', ta: 'கருதுகோள் சூழல்களும் நெறிமுறை முடிவுகளும்', hi: 'काल्पनिक परिदृश्य और नैतिक दुविधाएं', ml: 'സങ്കൽപ്പിക സാഹചര്യങ്ങളും തീരുമാനങ്ങളും', te: 'ఊహాజనిత పరిస్థితులు మరియు నిర్ణయాలు', fr: 'Scénarios Hypothétiques et Dilemmes', ja: '仮定法と倫理的ジレンマの考察' },
    descriptions: { en: 'Third conditionals, ethical dilemmas, and high-pressure mediation.', ta: 'நெறிமுறை இக்கட்டுகள் மற்றும் சவாலான சூழல்களில் சமரசம் செய்தல்.', hi: 'काल्पनिक अतीत के पछतावे और संकट प्रबंधन की रणनीतियाँ।', ml: 'സങ്കീർണ്ണമായ വെല്ലുവിളികളും ചർച്ചകളും.', te: 'సంక్షోభ నిర్వహణ మరియు పరిష్కారాలు.', fr: 'Exprimez des regrets conditionnels et résolvez des dilemmes.', ja: '過去の反実仮想や緊急時の意思決定を論理的に語る。' },
    icon: '🧭',
    lessonPrefixes: ['Third Conditionals', 'Crisis Decision Trees', 'Biomedical Dilemmas', 'Factional Mediation', 'Strategic Contingencies', 'High-Pressure Articulation']
  },
  {
    titles: { en: 'Master Polyglot Capstone & Roleplay', ta: 'பன்மொழி ஆளுமை உச்சக்கட்ட நிறைவு', hi: 'महा-बहुभाषी कैपस्टोन और भूमिका निर्वहन', ml: 'മാസ്റ്റർ പോളിഗ്ലോട്ട് ക്യാപ്സ്റ്റോൺ', te: 'మాస్టర్ బహుభాషా ప్రావీణ్యం', fr: 'Grand Capstone Polyglotte et Jeu de Rôle', ja: '多言語マスター総合演習' },
    descriptions: { en: 'Diplomatic simulations, live interpretation, and deep AI mentor dialogues.', ta: 'நேரலை மொழிபெயர்ப்பு மற்றும் மெய்நிகர் தூதரக உருவகப்படுத்துதல்கள்.', hi: 'लाइव अनुवाद, राजनयिक प्रेस कॉन्फ्रेंस और एआई संवाद।', ml: 'തത്സമയ വിവർത്തനവും ആഴത്തിലുള്ള സംവാദങ്ങളും.', te: 'లైవ్ అనువాదం మరియు సమగ్ర నైపుణ్య పరీక్ష.', fr: 'Participez à des simulations diplomatiques et des échanges libres.', ja: '同時通訳シミュレーションとAIメンターとの自由対話。' },
    icon: '👑',
    lessonPrefixes: ['Diplomatic Press Simulation', 'Cultural Convergence Panel', 'Spontaneous Rhetoric', 'Cross-Lingual Interpretation', 'Deep AI Mentor Dialogue', 'Polyglot Grand Mastery']
  }
];

// Generate all 30 units (156 lessons total)
const UNITS = [
  ...generateUnitsForLevel('beginner', 1, BEGINNER_THEMES),
  ...generateUnitsForLevel('intermediate', 11, INTERMEDIATE_THEMES),
  ...generateUnitsForLevel('advanced', 21, ADVANCED_THEMES)
];

// =========================================================================
// DYNAMIC EXERCISE GENERATOR
// Produces level-authentic, high-quality interactive exercises
// =========================================================================
function generateLessonExercises(expCode, tgtCode, level = 'beginner', unitId = 'unit_1', lessonId = 'l_b_u1_1') {
  const exp = LANGUAGES[expCode] || LANGUAGES.en;
  const tgt = LANGUAGES[tgtCode] || LANGUAGES.ta;

  // Find target unit and lesson
  const targetUnit = UNITS.find(u => u.id === unitId) || UNITS[0];
  const targetLesson = targetUnit.lessons.find(l => l.id === lessonId) || targetUnit.lessons[0];

  // 1. Filter lexicon specifically for this unit
  let unitLexicon = LEXICON.filter(l => l.unitId === unitId);
  if (!unitLexicon || unitLexicon.length < 4) {
    unitLexicon = LEXICON.filter(l => l.level === targetUnit.level);
  }
  if (!unitLexicon || unitLexicon.length < 4) {
    unitLexicon = LEXICON;
  }

  // 2. Identify lesson sequence index within this unit (0, 1, 2, 3, 4, 5)
  const lessonIdx = Math.max(0, targetUnit.lessons.findIndex(l => l.id === lessonId));
  const total = unitLexicon.length;

  // 3. Rotate pool deterministically by (lessonIdx * 2) so consecutive lessons
  // teach distinct primary and secondary words without stale repetition!
  const startOffset = (lessonIdx * 2) % total;

  const pool = [];
  for (let i = 0; i < Math.min(8, total); i++) {
    pool.push(unitLexicon[(startOffset + i) % total]);
  }

  const exercises = [];

  // Helper to resolve accurate English meaning from lexicon item or fallback
  const getEnglishMeaning = (item) => {
    if (item && item.en && item.en.text) return item.en.text;
    if (item && item[exp.code] && item[exp.code].text) return item[exp.code].text;
    return '';
  };

  // 1. VOCABULARY FLASHCARD (Interactive 3D Flashcard)
  const item1 = pool[0];
  exercises.push({
    type: 'vocabulary_flashcard',
    id: `ex_${lessonId}_1`,
    instruction: `Tap the flashcard to flip and learn the native pronunciation and meaning in ${exp.name}.`,
    targetWord: item1[tgt.code].text,
    phonetic: item1[tgt.code].phonetic,
    meaning: item1[exp.code].text,
    englishMeaning: getEnglishMeaning(item1),
    notes: item1[tgt.code].notes || 'Core vocabulary entry',
    audioText: item1[tgt.code].text,
    langCode: tgt.bcp47,
    level: level
  });

  // 2. MULTIPLE CHOICE
  const item2 = pool[1 % pool.length];
  const distractors = unitLexicon.filter(p => p.id !== item2.id).slice(0, 3);
  const mcOptions = [
    { text: item2[exp.code].text, isCorrect: true, englishMeaning: getEnglishMeaning(item2) },
    ...distractors.map(d => ({ text: d[exp.code].text, isCorrect: false, englishMeaning: getEnglishMeaning(d) }))
  ].sort(() => 0.5 - Math.random());

  exercises.push({
    type: 'multiple_choice',
    id: `ex_${lessonId}_2`,
    instruction: `Select the correct translation in ${exp.name} for:`,
    promptText: item2[tgt.code].text,
    phonetic: item2[tgt.code].phonetic,
    englishMeaning: getEnglishMeaning(item2),
    audioText: item2[tgt.code].text,
    langCode: tgt.bcp47,
    options: mcOptions,
    correctAnswer: item2[exp.code].text,
    explanation: `"${item2[tgt.code].text}" (${item2[tgt.code].phonetic}) translates to "${item2[exp.code].text}" in ${exp.name}.`
  });

  // 3. WORD MATCHING (4 pairs)
  const matchItems = pool.slice(0, 4);
  const leftCol = matchItems.map(m => ({
    id: m.id,
    text: m[tgt.code].text,
    phonetic: m[tgt.code].phonetic,
    englishMeaning: getEnglishMeaning(m)
  })).sort(() => 0.5 - Math.random());
  const rightCol = matchItems.map(m => ({ id: m.id, text: m[exp.code].text })).sort(() => 0.5 - Math.random());

  exercises.push({
    type: 'word_matching',
    id: `ex_${lessonId}_3`,
    instruction: `Match each phrase in ${tgt.name} with its corresponding meaning in ${exp.name}:`,
    pairs: matchItems.map(m => ({
      target: m[tgt.code].text,
      explanation: m[exp.code].text,
      englishMeaning: getEnglishMeaning(m),
      id: m.id
    })),
    leftCol,
    rightCol,
    explanation: 'Correctly pair all target vocabulary terms with their explanations.'
  });

  // 4. FILL IN THE BLANKS
  const item3 = pool[2 % pool.length];
  const fillDistractor = unitLexicon.find(p => p.id !== item3.id) || pool[0];
  const fillDistractor2 = unitLexicon.find(p => p.id !== item3.id && p.id !== fillDistractor.id) || pool[1];
  exercises.push({
    type: 'fill_in_the_blanks',
    id: `ex_${lessonId}_4`,
    instruction: `Complete the phrase by selecting the correct ${tgt.name} term:`,
    sentenceBefore: `${exp.name}: "${item3[exp.code].text}" →`,
    blankTarget: item3[tgt.code].text,
    englishMeaning: getEnglishMeaning(item3),
    options: [
      { text: item3[tgt.code].text, isCorrect: true, englishMeaning: getEnglishMeaning(item3) },
      { text: fillDistractor[tgt.code].text, isCorrect: false, englishMeaning: getEnglishMeaning(fillDistractor) },
      { text: fillDistractor2[tgt.code].text, isCorrect: false, englishMeaning: getEnglishMeaning(fillDistractor2) }
    ].sort(() => 0.5 - Math.random()),
    correctAnswer: item3[tgt.code].text,
    explanation: `The accurate ${tgt.name} expression is "${item3[tgt.code].text}" (${item3[tgt.code].phonetic}).`
  });

  // 5. SENTENCE BUILDING / WORD ORDERING OR TRANSLATION PRACTICE
  const sentenceItem = pool[3 % pool.length];
  const targetWords = sentenceItem[tgt.code].text.split(' ').filter(w => w.length > 0);
  if (targetWords.length > 1) {
    const jumbled = [...targetWords].sort(() => 0.5 - Math.random());
    exercises.push({
      type: 'sentence_building',
      id: `ex_${lessonId}_5`,
      instruction: `Arrange the words in correct grammatical order to say: "${sentenceItem[exp.code].text}"`,
      targetSentence: sentenceItem[tgt.code].text,
      englishMeaning: getEnglishMeaning(sentenceItem),
      wordBank: jumbled,
      correctOrder: targetWords,
      explanation: `Proper syntax in ${tgt.name}: "${sentenceItem[tgt.code].text}".`
    });
  } else {
    // Single word: translation exercise
    exercises.push({
      type: 'translation_practice',
      id: `ex_${lessonId}_5`,
      instruction: `Translate this phrase into ${tgt.name}:`,
      sourceText: sentenceItem[exp.code].text,
      englishMeaning: getEnglishMeaning(sentenceItem),
      targetOptions: [
        { text: sentenceItem[tgt.code].text, isCorrect: true, englishMeaning: getEnglishMeaning(sentenceItem) },
        { text: pool[0][tgt.code].text, isCorrect: false, englishMeaning: getEnglishMeaning(pool[0]) },
        { text: pool[1][tgt.code].text, isCorrect: false, englishMeaning: getEnglishMeaning(pool[1]) }
      ].sort(() => 0.5 - Math.random()),
      correctAnswer: sentenceItem[tgt.code].text,
      explanation: `"${sentenceItem[exp.code].text}" corresponds to "${sentenceItem[tgt.code].text}" in ${tgt.name}.`
    });
  }

  // 6. LISTEN AND REPEAT (Interactive Microphone & Audio Practice)
  const listenItem = pool[4 % pool.length];
  exercises.push({
    type: 'listen_and_repeat',
    id: `ex_${lessonId}_6`,
    instruction: `Listen carefully to the native phrase, then click the microphone to speak or type what you hear:`,
    targetPhrase: listenItem[tgt.code].text,
    phonetic: listenItem[tgt.code].phonetic,
    meaning: listenItem[exp.code].text,
    englishMeaning: getEnglishMeaning(listenItem),
    audioText: listenItem[tgt.code].text,
    langCode: tgt.bcp47,
    correctAnswer: listenItem[tgt.code].text,
    explanation: `The phrase was "${listenItem[tgt.code].text}" (${listenItem[tgt.code].phonetic}), meaning "${listenItem[exp.code].text}".`
  });

  // 7. PRONUNCIATION PRACTICE
  const speakItem = pool[5 % pool.length];
  exercises.push({
    type: 'pronunciation_practice',
    id: `ex_${lessonId}_7`,
    instruction: `Practice pronouncing this ${tgt.name} expression with native rhythm and intonation:`,
    targetWord: speakItem[tgt.code].text,
    phonetic: speakItem[tgt.code].phonetic,
    meaning: speakItem[exp.code].text,
    englishMeaning: getEnglishMeaning(speakItem),
    audioText: speakItem[tgt.code].text,
    langCode: tgt.bcp47,
    explanation: `Focus on native pronunciation: "${speakItem[tgt.code].phonetic}".`
  });

  // 8. ROBOT CONVERSATION PRACTICE (Interactive Dialogue with AI Tutor)
  const unitConvo = UNIT_CONVERSATIONS[unitId] || UNIT_CONVERSATIONS[targetUnit.id];
  let convoPrompt = unitConvo;
  if (!convoPrompt) {
    if (level === 'beginner') {
      convoPrompt = UNIT_CONVERSATIONS['unit_1'];
    } else if (level === 'intermediate') {
      convoPrompt = UNIT_CONVERSATIONS['unit_11'];
    } else {
      convoPrompt = UNIT_CONVERSATIONS['unit_21'];
    }
  }

  const robotQuestion = (convoPrompt[tgt.code] || convoPrompt.en || convoPrompt.ta).question;
  const robotHint = (convoPrompt[exp.code] || convoPrompt.en || convoPrompt.ta).hint;
  const robotEnglishQuestion = (convoPrompt.en || convoPrompt.ta || {}).question || robotQuestion;

  exercises.push({
    type: 'robot_conversation',
    id: `ex_${lessonId}_8`,
    instruction: `Engage in conversation practice with your AI Robot Tutor:`,
    robotQuestion,
    hintText: robotHint,
    englishMeaning: robotEnglishQuestion,
    audioText: robotQuestion,
    langCode: tgt.bcp47,
    level: level,
    explanation: `Your response has been analyzed by the Multilingual AI Hub Linguistic Engine for level ${level}.`
  });

  return exercises;
}

/**
 * Advanced Dynamic Practice Generator for Module 7 (Practice Zone)
 * Supports all 5 Question Types:
 * - 'multiple_choice'
 * - 'fill_in_the_blanks'
 * - 'match_the_meaning'
 * - 'sentence_completion'
 * - 'mixed'
 * 
 * Supports user-defined question counts (5, 8, 10, 15, 20, custom)
 * Supports Practise This Phrase for AI-searched expressions
 */
function generatePracticeSessionExercises({
  exp = LANGUAGES.en,
  tgt = LANGUAGES.ta,
  level = 'beginner',
  unitId = null,
  questionType = 'mixed',
  count = 5,
  phraseData = null,
  excludeQuestions = []
}) {
  const needed = Math.max(1, Math.min(50, parseInt(count, 10) || 5));
  const exercises = [];
  const excludedSet = new Set(excludeQuestions.map(q => (q || '').trim().toLowerCase()));

  // A. IF PRACTISING A SPECIFIC SEARCHED EXPRESSION
  if (phraseData && phraseData.translation) {
    const orig = phraseData.originalText || '';
    const trans = phraseData.translation || '';
    const en = phraseData.englishMeaning || orig;
    const phonetic = phraseData.pronunciation || '';
    const expl = phraseData.explanation || `The phrase "${trans}" translates to "${en}".`;

    // 1. Multiple Choice: Target to Explanation
    const distractorsExp = LEXICON.filter(l => l[exp.code]?.text && l[exp.code].text !== en).slice(0, 3);
    const mcOpts1 = [
      { text: en, isCorrect: true, englishMeaning: en },
      ...distractorsExp.map(d => ({ text: d[exp.code].text, isCorrect: false, englishMeaning: d.en?.text || d[exp.code].text }))
    ].sort(() => 0.5 - Math.random());

    exercises.push({
      id: `phrase_q_mc_1`,
      type: 'multiple_choice',
      topic: 'Searched Phrase Practice',
      unitId: 'phrase_custom',
      instruction: `Select the accurate meaning of this expression:`,
      promptText: trans,
      phonetic: phonetic,
      englishMeaning: en,
      correctAnswer: en,
      options: mcOpts1,
      explanation: expl,
      audioText: trans,
      langCode: tgt.bcp47
    });

    // 2. Multiple Choice: Explanation to Target
    const distractorsTgt = LEXICON.filter(l => l[tgt.code]?.text && l[tgt.code].text !== trans).slice(0, 3);
    const mcOpts2 = [
      { text: trans, isCorrect: true, englishMeaning: en },
      ...distractorsTgt.map(d => ({ text: d[tgt.code].text, isCorrect: false, englishMeaning: d.en?.text || d[tgt.code].text }))
    ].sort(() => 0.5 - Math.random());

    exercises.push({
      id: `phrase_q_mc_2`,
      type: 'multiple_choice',
      topic: 'Searched Phrase Practice',
      unitId: 'phrase_custom',
      instruction: `How do you say "${en}" in ${tgt.name}?`,
      promptText: en,
      phonetic: '',
      englishMeaning: en,
      correctAnswer: trans,
      options: mcOpts2,
      explanation: expl,
      audioText: trans,
      langCode: tgt.bcp47
    });

    // 3. Fill in the Blank / Missing Word
    const words = trans.split(' ').filter(w => w.trim().length > 0);
    if (words.length > 1) {
      const blankWord = words[Math.floor(words.length / 2)] || words[0];
      const sentenceWithBlank = trans.replace(blankWord, '[ ___ ]');
      const blankDistractors = LEXICON.filter(l => l[tgt.code]?.text && l[tgt.code].text !== blankWord).slice(0, 3);
      const fillOpts = [
        { text: blankWord, isCorrect: true },
        ...blankDistractors.map(d => ({ text: d[tgt.code].text.split(' ')[0], isCorrect: false }))
      ].sort(() => 0.5 - Math.random());

      exercises.push({
        id: `phrase_q_fill_3`,
        type: 'fill_in_the_blanks',
        topic: 'Searched Phrase Practice',
        unitId: 'phrase_custom',
        instruction: `Complete the phrase by providing the missing word in ${tgt.name}:`,
        sentenceBefore: sentenceWithBlank,
        blankTarget: blankWord,
        englishMeaning: en,
        correctAnswer: blankWord,
        options: fillOpts,
        explanation: `The missing word is "${blankWord}". Full phrase: "${trans}".`,
        audioText: trans,
        langCode: tgt.bcp47
      });
    }

    // 4. Sentence Completion / Building
    if (words.length > 1) {
      const jumbled = [...words].sort(() => 0.5 - Math.random());
      exercises.push({
        id: `phrase_q_build_4`,
        type: 'sentence_completion',
        topic: 'Searched Phrase Practice',
        unitId: 'phrase_custom',
        instruction: `Arrange the words to build: "${en}"`,
        targetSentence: trans,
        englishMeaning: en,
        wordBank: jumbled,
        correctOrder: words,
        correctAnswer: trans,
        explanation: `Proper phrase construction in ${tgt.name}: "${trans}".`,
        audioText: trans,
        langCode: tgt.bcp47
      });
    } else {
      exercises.push({
        id: `phrase_q_build_4`,
        type: 'sentence_completion',
        topic: 'Searched Phrase Practice',
        unitId: 'phrase_custom',
        instruction: `Complete this ${tgt.name} vocabulary term:`,
        sentenceBefore: `"${en}" →`,
        blankTarget: trans,
        englishMeaning: en,
        correctAnswer: trans,
        explanation: `"${en}" corresponds to "${trans}" in ${tgt.name}.`,
        audioText: trans,
        langCode: tgt.bcp47
      });
    }

    return exercises.slice(0, needed);
  }

  // B. FROM CURRICULUM LEXICON & UNITS
  // Find primary unit and pool units
  let primaryUnit = UNITS.find(u => u.id === unitId || u.title?.en === unitId || u.title === unitId);
  if (!primaryUnit) {
    const levelUnits = UNITS.filter(u => u.level === level);
    primaryUnit = levelUnits[0] || UNITS[0];
  }

  // Gather lexicon pool from primary unit, followed by other units in level
  let unitLexicon = LEXICON.filter(l => l.unitId === primaryUnit.id && l[tgt.code]?.text && l[exp.code]?.text);
  if (unitLexicon.length < needed * 2) {
    const otherLexicon = LEXICON.filter(l => l.unitId !== primaryUnit.id && l[tgt.code]?.text && l[exp.code]?.text);
    unitLexicon = [...unitLexicon, ...otherLexicon];
  }

  // Filter out questions learner has already mastered to prioritize unseen learning needs
  const unmasteredPool = unitLexicon.filter(item => {
    const qText1 = item[tgt.code].text.toLowerCase();
    const qText2 = item[exp.code].text.toLowerCase();
    return !excludedSet.has(qText1) && !excludedSet.has(qText2);
  });

  const activePool = unmasteredPool.length >= needed ? unmasteredPool : unitLexicon;
  const unitTitle = primaryUnit.title?.en || primaryUnit.title;

  let poolIdx = 0;
  function getNextItem() {
    const item = activePool[poolIdx % activePool.length];
    poolIdx++;
    return item;
  }

  // Cycle types if mixed
  const allowedTypes = ['multiple_choice', 'fill_in_the_blanks', 'match_the_meaning', 'sentence_completion'];
  let currentTypeIdx = 0;

  for (let i = 0; i < needed; i++) {
    let chosenType = questionType;
    if (questionType === 'mixed') {
      chosenType = allowedTypes[currentTypeIdx % allowedTypes.length];
      currentTypeIdx++;
    }

    const item = getNextItem();
    const tgtText = item[tgt.code].text;
    const expText = item[exp.code].text;
    const phonetic = item[tgt.code].phonetic || '';
    const enMeaning = item.en?.text || expText;

    if (chosenType === 'multiple_choice') {
      const distractors = activePool.filter(p => p.id !== item.id).slice(0, 3);
      const opts = [
        { text: expText, isCorrect: true, englishMeaning: enMeaning },
        ...distractors.map(d => ({ text: d[exp.code].text, isCorrect: false, englishMeaning: d.en?.text || d[exp.code].text }))
      ].sort(() => 0.5 - Math.random());

      exercises.push({
        id: `prac_mc_${i}_${item.id}`,
        type: 'multiple_choice',
        topic: unitTitle,
        unitId: primaryUnit.id,
        instruction: `Select the correct translation in ${exp.name} for:`,
        promptText: tgtText,
        phonetic,
        englishMeaning: enMeaning,
        audioText: tgtText,
        langCode: tgt.bcp47,
        options: opts,
        correctAnswer: expText,
        explanation: `"${tgtText}" (${phonetic}) translates to "${expText}" in ${exp.name}.`
      });
    } else if (chosenType === 'fill_in_the_blanks') {
      const words = tgtText.split(' ').filter(w => w.trim().length > 0);
      const blankWord = words.length > 1 ? words[words.length - 1] : tgtText;
      const sentenceBefore = words.length > 1 ? tgtText.replace(blankWord, '[ ___ ]') : `${exp.name}: "${expText}" →`;
      const distractors = activePool.filter(p => p.id !== item.id).slice(0, 3);
      const opts = [
        { text: blankWord, isCorrect: true, englishMeaning: enMeaning },
        ...distractors.map(d => ({ text: d[tgt.code].text.split(' ')[0], isCorrect: false, englishMeaning: d.en?.text || '' }))
      ].sort(() => 0.5 - Math.random());

      exercises.push({
        id: `prac_fill_${i}_${item.id}`,
        type: 'fill_in_the_blanks',
        topic: unitTitle,
        unitId: primaryUnit.id,
        instruction: `Complete the phrase with the missing ${tgt.name} word:`,
        sentenceBefore,
        blankTarget: blankWord,
        englishMeaning: enMeaning,
        options: opts,
        correctAnswer: blankWord,
        explanation: `The correct ${tgt.name} word is "${blankWord}". Meaning: "${expText}".`,
        audioText: tgtText,
        langCode: tgt.bcp47
      });
    } else if (chosenType === 'match_the_meaning') {
      const matchItems = activePool.slice(poolIdx % (activePool.length - 4), (poolIdx % (activePool.length - 4)) + 4);
      if (matchItems.length < 4) matchItems.push(...activePool.slice(0, 4 - matchItems.length));

      const leftCol = matchItems.map(m => ({
        id: m.id,
        text: m[tgt.code].text,
        phonetic: m[tgt.code].phonetic || '',
        englishMeaning: m.en?.text || m[exp.code].text
      })).sort(() => 0.5 - Math.random());

      const rightCol = matchItems.map(m => ({
        id: m.id,
        text: m[exp.code].text
      })).sort(() => 0.5 - Math.random());

      exercises.push({
        id: `prac_match_${i}_${item.id}`,
        type: 'match_the_meaning',
        topic: unitTitle,
        unitId: primaryUnit.id,
        instruction: `Match each phrase in ${tgt.name} with its correct meaning in ${exp.name}:`,
        pairs: matchItems.map(m => ({
          target: m[tgt.code].text,
          explanation: m[exp.code].text,
          englishMeaning: m.en?.text || m[exp.code].text,
          id: m.id
        })),
        leftCol,
        rightCol,
        correctAnswer: 'all_matched',
        explanation: `Properly paired all ${tgt.name} expressions with their meanings in ${exp.name}.`
      });
    } else if (chosenType === 'sentence_completion') {
      const words = tgtText.split(' ').filter(w => w.trim().length > 0);
      if (words.length > 1) {
        const jumbled = [...words].sort(() => 0.5 - Math.random());
        exercises.push({
          id: `prac_comp_${i}_${item.id}`,
          type: 'sentence_completion',
          topic: unitTitle,
          unitId: primaryUnit.id,
          instruction: `Complete the sentence in ${tgt.name} to express: "${expText}"`,
          targetSentence: tgtText,
          englishMeaning: enMeaning,
          wordBank: jumbled,
          correctOrder: words,
          correctAnswer: tgtText,
          explanation: `Proper sentence construction in ${tgt.name}: "${tgtText}".`,
          audioText: tgtText,
          langCode: tgt.bcp47
        });
      } else {
        const distractors = activePool.filter(p => p.id !== item.id).slice(0, 3);
        const opts = [
          { text: tgtText, isCorrect: true, englishMeaning: enMeaning },
          ...distractors.map(d => ({ text: d[tgt.code].text, isCorrect: false }))
        ].sort(() => 0.5 - Math.random());

        exercises.push({
          id: `prac_comp_${i}_${item.id}`,
          type: 'sentence_completion',
          topic: unitTitle,
          unitId: primaryUnit.id,
          instruction: `Complete the ${tgt.name} phrase for: "${expText}"`,
          sentenceBefore: `${exp.name}: "${expText}" →`,
          targetSentence: tgtText,
          englishMeaning: enMeaning,
          options: opts,
          correctAnswer: tgtText,
          explanation: `"${expText}" corresponds to "${tgtText}" in ${tgt.name}.`,
          audioText: tgtText,
          langCode: tgt.bcp47
        });
      }
    }
  }

  return exercises;
}

module.exports = {
  LANGUAGES,
  LEXICON,
  UNITS,
  generateLessonExercises,
  generatePracticeSessionExercises
};

