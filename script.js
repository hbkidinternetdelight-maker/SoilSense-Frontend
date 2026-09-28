const API_BASE = "https://soil-sense.onrender.com/";

let currentLanguage = "en";
let currentSensorData = {
    moisture: 42,
    temperature: 28,
    humidity: 65,
    timestamp: null
};

let sensorConnected = false;
let lastSensorTimestamp = null;
let advisorRefreshTimer = null;
let advisorRequestInProgress = false;

let selectedLocationData = null;
let locationSearchTimer = null;

let selectedCrop = "tomato";
let selectedStage = "vegetative";

let totalAreas = 6;
let currentArea = 1;
let areaReadings = [];
let detectedCurrentMoisture = false;


/* ================================
   TRANSLATIONS
================================ */

const translations = {

    en: {
        languageTitle: "Select Your Language",
        smartAgriculture: "SMART AGRICULTURE",
        healthySoil: "Healthy soil. Happier farmers.",
        smarter: "Smarter decisions.",
        setup: "FARM SETUP",
        setupTitle: "Tell us about your farm",
        setupDescription:
            "A few simple details help us provide useful crop insights.",
        location: "📍 Farm Location",
        locationPlaceholder: "Village / City, Maharashtra",
        autoLocation: "◎ Auto-detect my location",
        crop: "🌾 Select Crop",
        stage: "🌱 Crop Stage",
        continue: "Continue →",

        dashboard: "Dashboard",
        live: "Live Monitor",
        advisor: "Crop Advisor",
        field: "Field Analysis",
        weather: "Weather",
        tips: "Tips",
        farmer: "Farmer",

        smartTechnology: "🌿 SMART FARMING TECHNOLOGY",
        greeting: "Namaste, Farmer!",
        slogan:
            "Healthy soil. Happier farmers. Stronger India.",

        weatherToday: "Today's Weather",
        partlyCloudy: "☀️ Partly Cloudy",

        quickTips: "Quick Tips for Today",
        irrigationGood: "✓ Irrigation not required today",
        goodMoisture: "💧 Good moisture level",
        monitorDry: "⚠ Monitor dry areas",
        rainExpected: "🌧 Rain expected in 2 days",

        fieldOverview: "YOUR FIELD AT A GLANCE",
        smartMonitoring: "Smart Monitoring",
        chooseFeature:
            "Choose a feature to explore your field.",

        aiInsight: "AI CROP INSIGHT",
        smartAdvisor: "Smart Crop Advisor",
        advisorDescription:
            "Personalized irrigation guidance using soil, weather and crop stage.",
        weatherAdvice: "✓ Weather-based advice",
        cropInsights: "✓ Crop-stage insights",
        farmerRecommendations:
            "✓ Farmer-friendly recommendations",
        exploreAdvisor: "Explore Advisor →",

        realtime: "REAL-TIME MONITORING",
        liveMoisture: "Live Soil Moisture",
        live: "Live",

        fieldAnalysis: "FIELD ANALYSIS",
        multipleArea: "Multiple Area Analysis",
        multipleAreaDescription:
            "Compare moisture across different parts of your field.",
        fieldAverage: "Field Average",
        noAnalysis: "No analysis yet",
        viewAnalysis: "View Field Analysis →",

        smartCropAdvisor: "SMART CROP ADVISOR",
        todaysRecommendation: "Today's Recommendation",
        checking: "🟢 Checking recommendation...",
        conditions:
            "Weather and soil conditions are being considered.",

        temperature: "🌡 Temperature",
        moisture: "💧 Moisture",
        humidity: "💨 Humidity",
        rainChance: "🌧 Rain chance",

        realTimeSensor: "REAL-TIME SENSOR",
        currentCondition: "Current condition",
        optimal: "🟢 Moisture level is optimal.",

        areaAnalysis: "FIELD ANALYSIS",
        multipleAreaMoisture: "Multiple Area Moisture",
        areaDescription:
            "Select an area, detect its current soil moisture, save it, and move to the next area.",
        monitoringAreas:
            "🌾 How many areas are you monitoring?",
        currentArea: "CURRENT AREA",
        detectMoisture: "💧 Detect Moisture",
        saveNext: "Save & Next Area →",
        analyzeField: "Analyze Complete Field →",
        fieldReady: "Field analysis ready",
        detectArea:
            "Detect moisture area by area.",
        detectSensor:
            "Place the sensor in Area {area} and detect the moisture.",

        dry: "Dry",
        normal: "Normal",
        wet: "Wet",

        irrigationRecommended:
            "Irrigation is recommended.",
        irrigationNotRequired:
            "Irrigation is not required.",
        avoidIrrigation:
            "Avoid irrigation.",
        monitorSoil:
            "Monitor the soil moisture.",

        footer:
            "Smart Farming for a Sustainable India",
        footerQuote:
            "Healthy soil. Happier farmers. Stronger India.",
        footerCopyright:
            "© 2026 Soil Moisture Monitoring System • Made for Indian Farmers 🇮🇳"
    },

    hi: {
        languageTitle: "अपनी भाषा चुनें",
        smartAgriculture: "स्मार्ट कृषि",
        healthySoil: "स्वस्थ मिट्टी। खुश किसान।",
        smarter: "बेहतर निर्णय।",
        setup: "खेत की जानकारी",
        setupTitle: "अपने खेत के बारे में बताएं",
        setupDescription:
            "कुछ आसान जानकारी हमें उपयोगी फसल सलाह देने में मदद करती है।",
        location: "📍 खेत का स्थान",
        locationPlaceholder: "गांव / शहर, महाराष्ट्र",
        autoLocation: "◎ मेरा स्थान अपने आप पता करें",
        crop: "🌾 फसल चुनें",
        stage: "🌱 फसल की अवस्था",
        continue: "जारी रखें →",

        dashboard: "डैशबोर्ड",
        live: "लाइव मॉनिटर",
        advisor: "फसल सलाहकार",
        field: "क्षेत्र विश्लेषण",
        weather: "मौसम",
        tips: "सुझाव",
        farmer: "किसान",

        smartTechnology: "🌿 स्मार्ट कृषि तकनीक",
        greeting: "नमस्ते, किसान!",
        slogan:
            "स्वस्थ मिट्टी। खुश किसान। मजबूत भारत।",

        weatherToday: "आज का मौसम",
        partlyCloudy: "☀️ आंशिक बादल",

        quickTips: "आज के त्वरित सुझाव",
        irrigationGood: "✓ आज सिंचाई की आवश्यकता नहीं",
        goodMoisture: "💧 मिट्टी में नमी अच्छी है",
        monitorDry: "⚠ सूखे क्षेत्रों की निगरानी करें",
        rainExpected: "🌧 2 दिनों में बारिश की संभावना",

        fieldOverview: "आपके खेत की स्थिति",
        smartMonitoring: "स्मार्ट मॉनिटरिंग",
        chooseFeature:
            "अपने खेत को देखने के लिए कोई सुविधा चुनें।",

        aiInsight: "AI फसल जानकारी",
        smartAdvisor: "स्मार्ट फसल सलाहकार",
        advisorDescription:
            "मिट्टी, मौसम और फसल अवस्था के आधार पर सिंचाई सलाह।",
        weatherAdvice: "✓ मौसम आधारित सलाह",
        cropInsights: "✓ फसल अवस्था की जानकारी",
        farmerRecommendations:
            "✓ किसान के लिए आसान सलाह",
        exploreAdvisor: "सलाह देखें →",

        realtime: "रीयल-टाइम मॉनिटरिंग",
        liveMoisture: "लाइव मिट्टी की नमी",

        fieldAnalysis: "क्षेत्र विश्लेषण",
        multipleArea: "कई क्षेत्रों का विश्लेषण",
        multipleAreaDescription:
            "अपने खेत के अलग-अलग हिस्सों की नमी की तुलना करें।",
        fieldAverage: "खेत की औसत नमी",
        noAnalysis: "अभी कोई विश्लेषण नहीं",
        viewAnalysis: "क्षेत्र विश्लेषण देखें →",

        smartCropAdvisor: "स्मार्ट फसल सलाहकार",
        todaysRecommendation: "आज की सलाह",
        checking: "🟢 सलाह जांची जा रही है...",
        conditions:
            "मौसम और मिट्टी की स्थिति को ध्यान में रखा जा रहा है।",

        temperature: "🌡 तापमान",
        moisture: "💧 नमी",
        humidity: "💨 आर्द्रता",
        rainChance: "🌧 बारिश की संभावना",

        realTimeSensor: "रीयल-टाइम सेंसर",
        currentCondition: "वर्तमान स्थिति",
        optimal: "🟢 मिट्टी की नमी उचित है।",

        areaAnalysis: "क्षेत्र विश्लेषण",
        multipleAreaMoisture: "कई क्षेत्रों की मिट्टी की नमी",
        areaDescription:
            "क्षेत्र चुनें, नमी जांचें, उसे सेव करें और अगले क्षेत्र पर जाएं।",
        monitoringAreas:
            "🌾 आप कितने क्षेत्रों की निगरानी कर रहे हैं?",
        currentArea: "वर्तमान क्षेत्र",
        detectMoisture: "💧 नमी जांचें",
        saveNext: "सेव करें और अगला क्षेत्र →",
        analyzeField: "पूरा खेत विश्लेषण करें →",
        fieldReady: "खेत विश्लेषण तैयार है",
        detectArea:
            "हर क्षेत्र की नमी जांचें।",
        detectSensor:
            "क्षेत्र {area} में सेंसर रखें और नमी जांचें।",

        dry: "सूखा",
        normal: "सामान्य",
        wet: "गीला",

        irrigationRecommended:
            "सिंचाई की सलाह दी जाती है।",
        irrigationNotRequired:
            "सिंचाई की आवश्यकता नहीं है।",
        avoidIrrigation:
            "सिंचाई से बचें।",
        monitorSoil:
            "मिट्टी की नमी की निगरानी करें।",

        footer:
            "सतत भारत के लिए स्मार्ट खेती",
        footerQuote:
            "स्वस्थ मिट्टी। खुश किसान। मजबूत भारत।",
        footerCopyright:
            "© 2026 मृदा नमी निगरानी प्रणाली • भारतीय किसानों के लिए 🇮🇳"
    },

    mr: {
        languageTitle: "तुमची भाषा निवडा",
        smartAgriculture: "स्मार्ट शेती",
        healthySoil: "निरोगी माती. आनंदी शेतकरी.",
        smarter: "स्मार्ट निर्णय.",
        setup: "शेताची माहिती",
        setupTitle: "तुमच्या शेताबद्दल माहिती द्या",
        setupDescription:
            "काही सोपी माहिती आम्हाला उपयुक्त पीक सल्ला देण्यास मदत करते.",
        location: "📍 शेताचे स्थान",
        locationPlaceholder: "गाव / शहर, महाराष्ट्र",
        autoLocation: "◎ माझे स्थान आपोआप शोधा",
        crop: "🌾 पीक निवडा",
        stage: "🌱 पिकाची अवस्था",
        continue: "पुढे जा →",

        dashboard: "डॅशबोर्ड",
        live: "थेट मॉनिटर",
        advisor: "पीक सल्लागार",
        field: "क्षेत्र विश्लेषण",
        weather: "हवामान",
        tips: "टिप्स",
        farmer: "शेतकरी",

        smartTechnology: "🌿 स्मार्ट शेती तंत्रज्ञान",
        greeting: "नमस्कार, शेतकरी!",
        slogan:
            "निरोगी माती. आनंदी शेतकरी. मजबूत भारत.",

        weatherToday: "आजचे हवामान",
        partlyCloudy: "☀️ अंशतः ढगाळ",

        quickTips: "आजच्या जलद टिप्स",
        irrigationGood: "✓ आज सिंचनाची गरज नाही",
        goodMoisture: "💧 मातीतील ओलावा चांगला आहे",
        monitorDry: "⚠ कोरड्या भागांचे निरीक्षण करा",
        rainExpected: "🌧 2 दिवसांत पावसाची शक्यता",

        fieldOverview: "तुमच्या शेताची स्थिती",
        smartMonitoring: "स्मार्ट मॉनिटरिंग",
        chooseFeature:
            "तुमच्या शेताचे निरीक्षण करण्यासाठी सुविधा निवडा.",

        aiInsight: "AI पीक माहिती",
        smartAdvisor: "स्मार्ट पीक सल्लागार",
        advisorDescription:
            "माती, हवामान आणि पिकाच्या अवस्थेनुसार सिंचन सल्ला.",
        weatherAdvice: "✓ हवामानावर आधारित सल्ला",
        cropInsights: "✓ पिकाच्या अवस्थेची माहिती",
        farmerRecommendations:
            "✓ शेतकऱ्यांसाठी सोपा सल्ला",
        exploreAdvisor: "सल्ला पहा →",

        realtime: "रिअल-टाइम मॉनिटरिंग",
        liveMoisture: "थेट मातीतील ओलावा",

        fieldAnalysis: "क्षेत्र विश्लेषण",
        multipleArea: "अनेक क्षेत्रांचे विश्लेषण",
        multipleAreaDescription:
            "शेतातील वेगवेगळ्या भागांतील ओलाव्याची तुलना करा.",
        fieldAverage: "शेतातील सरासरी ओलावा",
        noAnalysis: "अजून विश्लेषण नाही",
        viewAnalysis: "क्षेत्र विश्लेषण पहा →",

        smartCropAdvisor: "स्मार्ट पीक सल्लागार",
        todaysRecommendation: "आजची शिफारस",
        checking: "🟢 शिफारस तपासत आहे...",
        conditions:
            "हवामान आणि मातीची स्थिती विचारात घेतली जात आहे.",

        temperature: "🌡 तापमान",
        moisture: "💧 ओलावा",
        humidity: "💨 आर्द्रता",
        rainChance: "🌧 पावसाची शक्यता",

        realTimeSensor: "रिअल-टाइम सेन्सर",
        currentCondition: "सध्याची स्थिती",
        optimal: "🟢 मातीतील ओलावा योग्य आहे.",

        areaAnalysis: "क्षेत्र विश्लेषण",
        multipleAreaMoisture: "अनेक क्षेत्रांतील मातीचा ओलावा",
        areaDescription:
            "क्षेत्र निवडा, ओलावा तपासा, जतन करा आणि पुढील क्षेत्रावर जा.",
        monitoringAreas:
            "🌾 तुम्ही किती क्षेत्रांचे निरीक्षण करत आहात?",
        currentArea: "सध्याचे क्षेत्र",
        detectMoisture: "💧 ओलावा तपासा",
        saveNext: "जतन करा आणि पुढील क्षेत्र →",
        analyzeField: "संपूर्ण शेताचे विश्लेषण करा →",
        fieldReady: "शेताचे विश्लेषण तयार आहे",
        detectArea:
            "प्रत्येक क्षेत्रातील ओलावा तपासा.",
        detectSensor:
            "क्षेत्र {area} मध्ये सेन्सर ठेवा आणि ओलावा तपासा.",

        dry: "कोरडे",
        normal: "सामान्य",
        wet: "ओले",

        irrigationRecommended:
            "सिंचनाची शिफारस केली जाते.",
        irrigationNotRequired:
            "सिंचनाची गरज नाही.",
        avoidIrrigation:
            "सिंचन टाळा.",
        monitorSoil:
            "मातीतील ओलाव्याचे निरीक्षण करा.",

        footer:
            "शाश्वत भारतासाठी स्मार्ट शेती",
        footerQuote:
            "निरोगी माती. आनंदी शेतकरी. मजबूत भारत.",
        footerCopyright:
            "© 2026 मातीतील ओलावा निरीक्षण प्रणाली • भारतीय शेतकऱ्यांसाठी 🇮🇳"
    }
};


/* ================================
   CROP TRANSLATIONS
================================ */

const crops = {

    en: {
        tomato: "Tomato",
        wheat: "Wheat",
        rice: "Rice",
        maize: "Maize",
        sugarcane: "Sugarcane",
        onion: "Onion",
        potato: "Potato",
        cotton: "Cotton",
        soybean: "Soybean",
        chickpea: "Chickpea",
        groundnut: "Groundnut",
        mustard: "Mustard",
        chilli: "Chilli",
        banana: "Banana",
        pigeon_pea: "Pigeon Pea / Tur",
        other: "Other / My crop is not listed"
    },

    hi: {
        tomato: "टमाटर",
        wheat: "गेहूं",
        rice: "चावल",
        maize: "मक्का",
        sugarcane: "गन्ना",
        onion: "प्याज",
        potato: "आलू",
        cotton: "कपास",
        soybean: "सोयाबीन",
        chickpea: "चना",
        groundnut: "मूंगफली",
        mustard: "सरसों",
        chilli: "मिर्च",
        banana: "केला",
        pigeon_pea: "अरहर / तूर",
        other: "अन्य / मेरी फसल सूची में नहीं है"
    },

    mr: {
        tomato: "टोमॅटो",
        wheat: "गहू",
        rice: "तांदूळ",
        maize: "मका",
        sugarcane: "ऊस",
        onion: "कांदा",
        potato: "बटाटा",
        cotton: "कापूस",
        soybean: "सोयाबीन",
        chickpea: "हरभरा",
        groundnut: "भुईमूग",
        mustard: "मोहरी",
        chilli: "मिरची",
        banana: "केळी",
        pigeon_pea: "तूर",
        other: "इतर / माझे पीक यादीत नाही"
    }
};


/* ================================
   STAGE TRANSLATIONS
================================ */

const stages = {

    en: {
        seedling: "Seedling",
        vegetative: "Vegetative",
        flowering: "Flowering",
        fruiting: "Fruiting"
    },

    hi: {
        seedling: "पौध अवस्था",
        vegetative: "वानस्पतिक अवस्था",
        flowering: "फूल आने की अवस्था",
        fruiting: "फल आने की अवस्था"
    },

    mr: {
        seedling: "रोप अवस्था",
        vegetative: "वाढीची अवस्था",
        flowering: "फुलोऱ्याची अवस्था",
        fruiting: "फळधारणेची अवस्था"
    }
};


/* ================================
   HELPER
================================ */

function t(key) {
    return translations[currentLanguage][key] || key;
}


/* ================================
   LANGUAGE SELECTION
================================ */

function selectLanguage(language) {
    if (!translations[language]) language = "en";
    currentLanguage = language;
    localStorage.setItem("soilSenseLanguage", language);
    const languagePage = document.getElementById("languagePage");
    const setupPage = document.getElementById("setupPage");
    if (languagePage) languagePage.classList.add("hidden");
    if (setupPage) setupPage.classList.remove("hidden");
    try { applyLanguage(); } catch (error) { console.error("Language setup error:", error); }
}


/* ================================
   APPLY LANGUAGE
================================ */

function applyLanguage() {

    const lang = translations[currentLanguage];

    document.documentElement.lang =
        currentLanguage;

    const languageTitle =
        document.getElementById("languageTitle");

    if (languageTitle) {
        languageTitle.textContent =
            lang.languageTitle;
    }

    const setupTitle =
        document.getElementById("setupTitle");

    if (setupTitle) {
        setupTitle.textContent =
            lang.setupTitle;
    }

    const setupDescription =
        document.getElementById("setupDescription");

    if (setupDescription) {
        setupDescription.textContent =
            lang.setupDescription;
    }

    const locationLabel =
        document.getElementById("locationLabel");

    if (locationLabel) {
        locationLabel.textContent =
            lang.location;
    }

    const location =
        document.getElementById("location");

    if (location) {
        location.placeholder =
            lang.locationPlaceholder;
    }

    const cropLabel =
        document.getElementById("cropLabel");

    if (cropLabel) {
        cropLabel.textContent =
            lang.crop;
    }

    const stageLabel =
        document.getElementById("stageLabel");

    if (stageLabel) {
        stageLabel.textContent =
            lang.stage;
    }

    const continueBtn =
        document.getElementById("continueBtn");

    if (continueBtn) {
        continueBtn.textContent =
            lang.continue;
    }

    updateCropOptions();
    updateStageOptions();
    updateDashboardText();
}


/* ================================
   CROP OPTIONS
================================ */

function updateCropOptions() {

    const cropSelect =
        document.getElementById("crop");

    if (!cropSelect) {
        return;
    }

    Array.from(
        cropSelect.options
    ).forEach(option => {

        if (
            crops[currentLanguage][option.value]
        ) {
            option.textContent =
                crops[currentLanguage][option.value];
        }
    });
}


/* ================================
   STAGE OPTIONS
================================ */

function updateStageOptions() {

    const stageSelect =
        document.getElementById("stage");

    if (!stageSelect) {
        return;
    }

    Array.from(
        stageSelect.options
    ).forEach(option => {

        if (
            stages[currentLanguage][option.value]
        ) {
            option.textContent =
                stages[currentLanguage][option.value];
        }
    });
}


/* ================================
   DASHBOARD TEXT
================================ */

function updateDashboardText() {

    const buttons =
        document.querySelectorAll(
            ".topbar nav button"
        );

    if (buttons.length >= 6) {

        buttons[0].textContent =
            t("dashboard");

        buttons[1].textContent =
            t("live");

        buttons[2].textContent =
            t("advisor");

        buttons[3].textContent =
            t("field");

        buttons[4].textContent =
            t("weather");

        buttons[5].textContent =
            t("tips");
    }

    const heroTag =
        document.querySelector(".hero-tag");

    if (heroTag) {
        heroTag.textContent =
            t("smartTechnology");
    }

    const heroTitle =
        document.querySelector(".hero-content h1");

    if (heroTitle) {
        heroTitle.textContent =
            t("greeting");
    }

    const heroSlogan =
        document.getElementById("heroSlogan");

    if (heroSlogan) {
        heroSlogan.textContent =
            t("slogan");
    }

    const weatherSmall =
        document.querySelector(".weather-box small");

    if (weatherSmall) {
        weatherSmall.textContent =
            t("weatherToday");
    }

    const weatherCondition =
        document.getElementById("weatherCondition");

    if (weatherCondition) {
        weatherCondition.textContent =
            t("partlyCloudy");
    }

    const quickTitle =
        document.querySelector(
            ".quick-bar b"
        );

    if (quickTitle) {
        quickTitle.textContent =
            t("quickTips");
    }

    const tips =
        document.querySelectorAll(
            ".quick-bar .tip"
        );

    if (tips.length >= 4) {

        tips[0].textContent =
            t("irrigationGood");

        tips[1].textContent =
            t("goodMoisture");

        tips[2].textContent =
            t("monitorDry");

        tips[3].textContent =
            t("rainExpected");
    }

    const mainEyebrow =
        document.querySelector(
            ".dashboard-main .section-head .eyebrow"
        );

    if (mainEyebrow) {
        mainEyebrow.textContent =
            t("fieldOverview");
    }

    const mainHeading =
        document.querySelector(
            ".dashboard-main .section-head h2"
        );

    if (mainHeading) {
        mainHeading.textContent =
            t("smartMonitoring");
    }

    const mainDescription =
        document.querySelector(
            ".dashboard-main .section-head p"
        );

    if (mainDescription) {
        mainDescription.textContent =
            t("chooseFeature");
    }

    updateFeatureCards();
    updateFooter();
}


/* ================================
   FEATURE CARDS
================================ */

function updateFeatureCards() {

    const cards =
        document.querySelectorAll(
            ".feature-card"
        );

    if (cards.length < 3) {
        return;
    }

    const card1 = cards[0];

    const eyebrow1 =
        card1.querySelector(".eyebrow");

    if (eyebrow1) {
        eyebrow1.textContent =
            t("aiInsight");
    }

    const title1 =
        card1.querySelector("h3");

    if (title1) {
        title1.textContent =
            t("smartAdvisor");
    }

    const description1 =
        card1.querySelector("p");

    if (description1) {
        description1.textContent =
            t("advisorDescription");
    }

    const list1 =
        card1.querySelectorAll(
            ".mini-list span"
        );

    if (list1.length >= 3) {

        list1[0].textContent =
            t("weatherAdvice");

        list1[1].textContent =
            t("cropInsights");

        list1[2].textContent =
            t("farmerRecommendations");
    }

    const button1 =
        card1.querySelector("button");

    if (button1) {
        button1.textContent =
            t("exploreAdvisor");
    }


    const card2 = cards[1];

    const eyebrow2 =
        card2.querySelector(".eyebrow");

    if (eyebrow2) {
        eyebrow2.textContent =
            t("realtime");
    }

    const title2 =
        card2.querySelector("h3");

    if (title2) {
        title2.textContent =
            t("liveMoisture");
    }


    const card3 = cards[2];

    const eyebrow3 =
        card3.querySelector(".eyebrow");

    if (eyebrow3) {
        eyebrow3.textContent =
            t("fieldAnalysis");
    }

    const title3 =
        card3.querySelector("h3");

    if (title3) {
        title3.textContent =
            t("multipleArea");
    }

    const description3 =
        card3.querySelector("p");

    if (description3) {
        description3.textContent =
            t("multipleAreaDescription");
    }

    const averageLabel =
        card3.querySelector(
            ".area-summary span"
        );

    if (averageLabel) {
        averageLabel.textContent =
            t("fieldAverage");
    }

    const status =
        document.getElementById(
            "dashboardAreaStatus"
        );

    if (
        status &&
        areaReadings.length === 0
    ) {
        status.textContent =
            t("noAnalysis");
    }

    const button3 =
        card3.querySelector("button");

    if (button3) {
        button3.textContent =
            t("viewAnalysis");
    }
}


/* ================================
   FOOTER
================================ */

function updateFooter() {

    const footerSmall =
        document.querySelector(
            ".footer-brand small"
        );

    if (footerSmall) {
        footerSmall.textContent =
            t("footer");
    }

    const footerParagraph =
        document.querySelector(
            "footer > p"
        );

    if (footerParagraph) {
        footerParagraph.textContent =
            `"${t("footerQuote")}"`;
    }

    const footerCopyright =
        document.querySelector(
            "footer > small"
        );

    if (footerCopyright) {
        footerCopyright.textContent =
            t("footerCopyright");
    }
}


/* ================================
   OPEN DASHBOARD
   THIS FIXES YOUR CURRENT PROBLEM
================================ */

async function openDashboard() {

    const crop =
        document.getElementById("crop");

    const stage =
        document.getElementById("stage");

    if (crop) {
        selectedCrop =
            crop.value;
    }

    if (stage) {
        selectedStage =
            stage.value;
    }

    const locationOK = await ensureLocationConfirmed();
    if (!locationOK) {
        const input = document.getElementById("location");
        if (input) {
            input.focus();
            input.setCustomValidity("Please select a confirmed village, town or city.");
            input.reportValidity();
            input.setCustomValidity("");
        }
        return;
    }

    const languagePage =
        document.getElementById(
            "languagePage"
        );

    const setupPage =
        document.getElementById(
            "setupPage"
        );

    const dashboardPage =
        document.getElementById(
            "dashboardPage"
        );

    if (languagePage) {
        languagePage.classList.add("hidden");
    }

    if (setupPage) {
        setupPage.classList.add("hidden");
    }

    if (dashboardPage) {
        dashboardPage.classList.remove("hidden");
    }

    updateDashboardCrop();

    updateLiveSensor();

    loadWeather();

    console.log(
        "Dashboard opened successfully"
    );
}


/* ================================
   UPDATE DASHBOARD CROP
================================ */

function updateDashboardCrop() {

    const cropName =
        crops[currentLanguage][selectedCrop]
        || selectedCrop;

    const stageName =
        stages[currentLanguage][selectedStage]
        || selectedStage;

    const heroCrop =
        document.getElementById(
            "heroCrop"
        );

    if (heroCrop) {
        heroCrop.textContent =
            `🌾 ${cropName}`;
    }

    const heroStage =
        document.getElementById(
            "heroStage"
        );

    if (heroStage) {
        heroStage.textContent =
            `🌱 ${stageName}`;
    }
}


/* ================================
   LOCATION
================================ */

function detectLocation() {
    const input = document.getElementById("location");
    if (!input) return;
    if (!navigator.geolocation) return;
    input.value = "Detecting your location...";
    navigator.geolocation.getCurrentPosition(async position => {
        try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {headers:{"Accept-Language":"en"}});
            if (!response.ok) throw new Error("Location lookup failed");
            const data = await response.json();
            selectedLocationData={latitude,longitude,displayName:data.display_name||"Current location",confirmed:true};
            input.value=selectedLocationData.displayName;
            setConfirmedLocationUI(selectedLocationData);
        } catch(e) { console.error(e); input.value=""; }
    }, error => { console.error("GPS error:",error); input.value=""; }, {enableHighAccuracy:true,timeout:10000,maximumAge:60000});
}

function setupLocationAutocomplete() {
    const input=document.getElementById("location"); if(!input)return;
    input.addEventListener("input",()=>{
        selectedLocationData=null; clearConfirmedLocationUI(); clearTimeout(locationSearchTimer);
        const q=input.value.trim(); if(q.length<2){hideLocationSuggestions();return;}
        locationSearchTimer=setTimeout(()=>searchLocations(q),350);
    });
    input.addEventListener("keydown",e=>{if(e.key==="Escape")hideLocationSuggestions();});
}

async function searchLocations(query) {
    const box=document.getElementById("locationSuggestions"); if(!box)return;
    box.innerHTML='<div class="location-loading">Searching places...</div>'; box.classList.remove("hidden");
    try {
        const response=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=7&countrycodes=in&q=${encodeURIComponent(query)}`,{headers:{"Accept-Language":"en"}});
        if(!response.ok)throw new Error("Place search failed");
        const places=await response.json(); box.innerHTML="";
        if(!places.length){box.innerHTML='<div class="location-empty">No matching village, town or city found.</div>';return;}
        places.forEach(place=>{
            const item=document.createElement("button"); item.type="button"; item.className="location-suggestion";
            const title=getPlaceTitle(place), subtitle=getPlaceSubtitle(place);
            item.innerHTML=`<span class="location-pin">📍</span><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(subtitle)}</small></span>`;
            item.addEventListener("click",()=>confirmSearchedLocation(place)); box.appendChild(item);
        });
    }catch(e){console.error(e);box.innerHTML='<div class="location-empty">Location search is temporarily unavailable.</div>';}
}

function getPlaceTitle(place){const a=place.address||{};return a.village||a.town||a.city||a.municipality||a.suburb||a.county||place.name||"Selected location";}
function getPlaceSubtitle(place){const a=place.address||{};return [a.suburb,a.district||a.county,a.state].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(", ");}
function confirmSearchedLocation(place){
    const input=document.getElementById("location");
    selectedLocationData={latitude:Number(place.lat),longitude:Number(place.lon),displayName:place.display_name,confirmed:true};
    if(input)input.value=place.display_name; setConfirmedLocationUI(selectedLocationData); hideLocationSuggestions();
}
function setConfirmedLocationUI(location){const s=document.getElementById("locationConfirmed");if(s){s.textContent=`✓ Confirmed location: ${location.displayName}`;s.classList.remove("hidden");}}
function clearConfirmedLocationUI(){const s=document.getElementById("locationConfirmed");if(s)s.classList.add("hidden");}
function hideLocationSuggestions(){const b=document.getElementById("locationSuggestions");if(b)b.classList.add("hidden");}
function escapeHtml(v){return String(v||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
async function ensureLocationConfirmed(){
    const input=document.getElementById("location"),q=input?.value.trim();
    if(selectedLocationData?.confirmed&&q===selectedLocationData.displayName)return true;
    if(!q||q==="Detecting your location...")return false;
    try{
        const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`,{headers:{"Accept-Language":"en"}});
        if(!r.ok)return false; const places=await r.json(); if(!places.length)return false; confirmSearchedLocation(places[0]); return true;
    }catch(e){console.error(e);return false;}
}



/* ================================
   FEATURE NAVIGATION
================================ */

function showFeature(feature) {

    const panel =
        document.getElementById(
            "featurePanel"
        );

    if (!panel) {
        return;
    }

    panel.classList.remove("hidden");

    document.querySelectorAll(
        ".detail"
    ).forEach(detail => {
        detail.classList.add("hidden");
    });

    if (feature === "advisor") {

        const advisor =
            document.getElementById(
                "advisorPanel"
            );

        if (advisor) {
            advisor.classList.remove(
                "hidden"
            );
        }

        getAdvisorRecommendation();
    }

    if (feature === "live") {

        const live =
            document.getElementById(
                "livePanel"
            );

        if (live) {
            live.classList.remove(
                "hidden"
            );
        }

        updateLiveSensor();
    }

    if (feature === "areas") {

        const areas =
            document.getElementById(
                "areasPanel"
            );

        if (areas) {
            areas.classList.remove(
                "hidden"
            );
        }

        setupAreaMonitoring();
    }

    panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function closeFeature() {

    const panel =
        document.getElementById(
            "featurePanel"
        );

    if (panel) {
        panel.classList.add(
            "hidden"
        );
    }
}


/* ================================
   SENSOR API
================================ */

async function updateLiveSensor() {
    try {
        const response = await fetch(
            `${API_BASE}/api/sensor?_=${Date.now()}`,
            { cache: "no-store" }
        );

        if (!response.ok) throw new Error("Sensor API failed");

        const data = await response.json();

        if (data.moisture === undefined || data.moisture === null || !data.timestamp) {
            throw new Error("No valid sensor reading");
        }

        const previousTimestamp = lastSensorTimestamp;
        const newTimestamp = data.timestamp;

        currentSensorData.moisture = Number(data.moisture);
        currentSensorData.temperature = Number(data.temperature ?? 0);
        currentSensorData.humidity = Number(data.humidity ?? 0);
        currentSensorData.timestamp = newTimestamp;
        lastSensorTimestamp = newTimestamp;

        // ESP32 sends approximately every second. Older than 15 seconds = stale/offline.
        const sensorTimeMs = parseSensorTimestamp(newTimestamp);
        const ageMs = Date.now() - sensorTimeMs;
        sensorConnected = Number.isFinite(ageMs) && ageMs <= 15000;

        updateSensorConnectionUI();
        updateLastSensorTime();

        const liveMoisture = document.getElementById("liveMoisture");
        const largeMoisture = document.getElementById("largeMoisture");
        const liveTemperature = document.getElementById("liveTemperature");
        const advisorMoisture = document.getElementById("advisorMoisture");

        if (liveMoisture) liveMoisture.textContent = sensorConnected ? `${currentSensorData.moisture}%` : "--%";
        if (largeMoisture) largeMoisture.textContent = sensorConnected ? `${currentSensorData.moisture}%` : "--%";
        if (liveTemperature) liveTemperature.textContent = sensorConnected ? `🌡 ${currentSensorData.temperature}°C` : "🌡 --°C";
        if (advisorMoisture) advisorMoisture.textContent = sensorConnected ? `${currentSensorData.moisture}%` : "--%";

        updateMoistureUI();

        // Advisor stays synchronized automatically; no second click required.
        if (
            sensorConnected &&
            previousTimestamp &&
            newTimestamp !== previousTimestamp &&
            document.getElementById("advisorPanel") &&
            !document.getElementById("advisorPanel").classList.contains("hidden")
        ) {
            clearTimeout(advisorRefreshTimer);
            advisorRefreshTimer = setTimeout(() => {
                getAdvisorRecommendation();
            }, 2000);
        }

    } catch (error) {
        console.error("Sensor connection error:", error);

        sensorConnected = false;
        lastSensorTimestamp = null;
        currentSensorData.timestamp = null;

        updateSensorConnectionUI();
        updateLastSensorTime();

        const liveMoisture = document.getElementById("liveMoisture");
        const largeMoisture = document.getElementById("largeMoisture");
        const liveTemperature = document.getElementById("liveTemperature");
        const advisorMoisture = document.getElementById("advisorMoisture");

        if (liveMoisture) liveMoisture.textContent = "--%";
        if (largeMoisture) largeMoisture.textContent = "--%";
        if (liveTemperature) liveTemperature.textContent = "🌡 --°C";
        if (advisorMoisture) advisorMoisture.textContent = "--%";

        updateMoistureUI();
    }
}

function updateSensorConnectionUI() {
    const status = document.getElementById("advisorSensorStatus");
    const liveMessage = document.getElementById("liveMessage");

    if (status) {
        status.classList.remove("sensor-connected", "sensor-offline", "sensor-reading");

        if (sensorConnected) {
            status.classList.add("sensor-connected");
            status.textContent = "🟢 Sensor connected";
        } else {
            status.classList.add("sensor-offline");
            status.textContent = "🔴 Sensor not connected";
        }
    }

    if (liveMessage && !sensorConnected) {
        liveMessage.textContent = "🔴 Sensor not connected";
    }
}

function updateLastSensorTime() {
    const updated = document.getElementById("advisorUpdatedAt");
    const lastUpdate = document.getElementById("lastUpdate");

    if (!sensorConnected || !currentSensorData.timestamp) {
        if (updated) updated.textContent = "Waiting for sensor...";
        if (lastUpdate) lastUpdate.textContent = "Sensor not connected";
        return;
    }

    const ageSeconds = Math.max(
        0,
        Math.round((Date.now() - parseSensorTimestamp(currentSensorData.timestamp)) / 1000)
    );

    const text = ageSeconds <= 1 ? "Updated just now" : `Updated ${ageSeconds}s ago`;

    if (updated) updated.textContent = text;
    if (lastUpdate) lastUpdate.textContent = text;
}


/* ================================
   MOISTURE UI
================================ */

function updateMoistureUI() {
    const moistureBar = document.getElementById("moistureBar");
    const liveMessage = document.getElementById("liveMessage");

    if (!sensorConnected) {
        if (moistureBar) moistureBar.style.width = "0%";
        if (liveMessage) liveMessage.textContent = "🔴 Sensor not connected";
        return;
    }

    const moisture = currentSensorData.moisture;

    if (moistureBar) {
        moistureBar.style.width = `${Math.max(0, Math.min(100, moisture))}%`;
    }

    if (!liveMessage) return;

    if (moisture < 30) {
        liveMessage.textContent = `🔴 ${t("dry")}`;
    } else if (moisture <= 70) {
        liveMessage.textContent = t("optimal");
    } else {
        liveMessage.textContent = `🔵 ${t("wet")}`;
    }
}


/* ================================
   WEATHER API
================================ */

async function loadWeather(){
    try{
        if(!selectedLocationData?.confirmed){
            if(!(await ensureLocationConfirmed())){
                throw new Error("Please select a confirmed location");
            }
        }

        const {latitude, longitude} = selectedLocationData;

        // Weather is fetched directly for the farmer's confirmed coordinates.
        // Current temperature/humidity come from current conditions.
        // Rain chance is the probability for the current/relevant upcoming hour,
        // not the maximum probability somewhere in the next 24 hours.
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${encodeURIComponent(latitude)}` +
            `&longitude=${encodeURIComponent(longitude)}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,precipitation,wind_speed_10m,weather_code` +
            `&hourly=precipitation_probability,rain,precipitation` +
            `&forecast_days=2` +
            `&timezone=auto` +
            `&_=${Date.now()}`;

        const response = await fetch(url, {cache:"no-store"});
        if(!response.ok) throw new Error("Weather API failed");

        const data = await response.json();
        const current = data.current || {};
        const hourly = data.hourly || {};
        const times = hourly.time || [];
        const probabilities = hourly.precipitation_probability || [];

        // Open-Meteo returns local-time strings when timezone=auto.
        // Match its current local hour using the API's current.time.
        let rainProbability = 0;
        const currentApiTime = String(current.time || "");
        const currentHourKey = currentApiTime.slice(0, 13);

        let matchingIndex = times.findIndex(
            time => String(time).slice(0, 13) === currentHourKey
        );

        // If the current hour cannot be matched, use the first future hourly point.
        if (matchingIndex < 0) {
            const nowMs = Date.now();
            matchingIndex = times.findIndex(time => {
                const parsed = new Date(time).getTime();
                return Number.isFinite(parsed) && parsed >= nowMs;
            });
        }

        if (matchingIndex >= 0 && probabilities[matchingIndex] != null) {
            rainProbability = Number(probabilities[matchingIndex]);
        }

        const weather = {
            temperature: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            apparent_temperature: current.apparent_temperature,
            rain: current.rain,
            precipitation: current.precipitation,
            wind_speed: current.wind_speed_10m,
            weather_code: current.weather_code,
            rain_probability: Number.isFinite(rainProbability) ? rainProbability : 0,
            weather_time: current.time,
            timezone: data.timezone
        };

        window.soilSenseWeather = weather;
        updateWeatherUI(weather);
        return weather;

    }catch(e){
        console.error("Weather connection error:", e);
        return null;
    }
}
function updateWeatherUI(w){
    const t=w.temperature,h=w.humidity,r=w.rain_probability;
    const temp=document.getElementById("temperature");if(temp&&t!==undefined)temp.textContent=`${Number(t).toFixed(1)}°C`;
    const advisorTemp=document.getElementById("advisorTemperature");if(advisorTemp&&t!==undefined)advisorTemp.textContent=`${Number(t).toFixed(1)}°C`;
    const advisorHum=document.getElementById("advisorHumidity");if(advisorHum&&h!==undefined)advisorHum.textContent=`${Math.round(h)}%`;
    const hum=document.getElementById("humidity");if(hum&&h!==undefined)hum.textContent=`💧 ${Math.round(h)}%`;
    const rain=document.getElementById("rainChance");if(rain)rain.textContent=`🌧️ ${Math.round(r)}%`;
    const ar=document.getElementById("advisorRain");if(ar)ar.textContent=`${Math.round(r)}%`;
    const c=document.getElementById("weatherCondition");if(c)c.textContent=`${weatherIcon(w.weather_code)} ${weatherDescription(w.weather_code)}`;
    const name=selectedLocationData?.displayName||"Confirmed location";
    const hero=document.getElementById("heroLocation"),nav=document.getElementById("navLocation");if(hero)hero.textContent=`📍 ${name}`;if(nav)nav.textContent=`📍 ${name}`;
}
function weatherIcon(c){if([0,1].includes(c))return"☀️";if([2,3].includes(c))return"⛅";if([45,48].includes(c))return"🌫️";if([51,53,55,56,57].includes(c))return"🌦️";if([61,63,65,66,67,80,81,82].includes(c))return"🌧️";if([95,96,99].includes(c))return"⛈️";return"🌤️";}
function weatherDescription(c){if([0,1].includes(c))return"Clear / Mostly Clear";if([2,3].includes(c))return"Partly Cloudy";if([45,48].includes(c))return"Foggy";if([51,53,55,56,57].includes(c))return"Drizzle";if([61,63,65,66,67,80,81,82].includes(c))return"Rain";if([95,96,99].includes(c))return"Thunderstorm";return"Current Conditions";}



/* ================================
   ADVISOR
================================ */

async function getAdvisorRecommendation(){
    if (advisorRequestInProgress) return;

    advisorRequestInProgress = true;

    const recommendation = document.getElementById("advisorRecommendation");
    const description = document.getElementById("advisorDescription");

    try {
        if (recommendation) recommendation.textContent = "🟡 Updating recommendation...";

        const sr = await fetch(
            `${API_BASE}/api/sensor?_=${Date.now()}`,
            { cache: "no-store" }
        );

        if (!sr.ok) throw new Error("Sensor API failed");

        const sensor = await sr.json();

        if (!sensor.timestamp || sensor.moisture === undefined) {
            throw new Error("Sensor not connected");
        }

        const sensorTimeMs = parseSensorTimestamp(sensor.timestamp);
        const ageMs = Date.now() - sensorTimeMs;

        if (!Number.isFinite(ageMs) || ageMs > 15000) {
            sensorConnected = false;
            updateSensorConnectionUI();
            setAdvisorSensorOffline();
            return;
        }

        sensorConnected = true;
        currentSensorData.moisture = Number(sensor.moisture);
        currentSensorData.temperature = Number(sensor.temperature ?? 0);
        currentSensorData.humidity = Number(sensor.humidity ?? 0);
        currentSensorData.timestamp = sensor.timestamp;
        lastSensorTimestamp = sensor.timestamp;

        updateSensorConnectionUI();
        updateLastSensorTime();

        const weather = await loadWeather();
        if (!weather) throw new Error("Weather unavailable");

        const rr = await fetch(
            `${API_BASE}/api/recommendation?_=${Date.now()}`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    crop: selectedCrop,
                    stage: selectedStage,
                    moisture: currentSensorData.moisture,
                    temperature: weather.temperature,
                    humidity: weather.humidity,
                    rain_probability: weather.rain_probability
                })
            }
        );

        if (!rr.ok) throw new Error("Recommendation API failed");

        const data = await rr.json();

        displayAdvisorResult(data);
        updateAdvancedAdvisor(weather, data);

        const moistureEl = document.getElementById("advisorMoisture");
        if (moistureEl) moistureEl.textContent = `${currentSensorData.moisture}%`;

    } catch (e) {
        console.error("Advisor error:", e);

        if (e.message === "Sensor not connected" || e.message === "Sensor API failed") {
            sensorConnected = false;
            updateSensorConnectionUI();
            setAdvisorSensorOffline();
        } else {
            if (recommendation) recommendation.textContent = "🟡 Unable to update recommendation";
            if (description) description.textContent = "Weather or sensor data is temporarily unavailable.";
            updateIrrigationTime("Waiting for a fresh sensor reading...");
        }
    } finally {
        advisorRequestInProgress = false;
    }
}

function setAdvisorSensorOffline() {
    const recommendation = document.getElementById("advisorRecommendation");
    const description = document.getElementById("advisorDescription");
    const moisture = document.getElementById("advisorMoisture");
    const humidity = document.getElementById("advisorHumidity");
    const temp = document.getElementById("advisorTemperature");
    const rain = document.getElementById("advisorRain");

    if (recommendation) recommendation.textContent = "🔴 Sensor not connected";
    if (description) {
        description.textContent = "Connect the soil moisture sensor to ESP32 to get a live irrigation recommendation.";
    }

    if (moisture) moisture.textContent = "--%";
    if (humidity) humidity.textContent = "--%";
    if (temp) temp.textContent = "--°C";
    if (rain) rain.textContent = "--%";

    updateIrrigationTime("Connect sensor to calculate irrigation time.");
}

function updateAdvancedAdvisor(w, data = null) {
    const m = Number(currentSensorData.moisture);
    const r = Number(w.rain_probability || 0);
    const temp = Number(w.temperature || 0);
    const hum = Number(w.humidity || 0);
    const d = document.getElementById("advisorDescription");

    if (!sensorConnected) {
        setAdvisorSensorOffline();
        return;
    }

    let action;

    if (m < 30 && r >= 60) {
        action = `Soil moisture is low at ${Math.round(m)}%, but the next 24 hours show a ${Math.round(r)}% rain chance. Delay irrigation and monitor the field.`;
    } else if (m < 30) {
        action = `Soil moisture is low at ${Math.round(m)}%. Irrigation should be considered soon. Weather shows a ${Math.round(r)}% rain chance.`;
    } else if (m <= 70) {
        action = `Soil moisture is ${Math.round(m)}%. Keep monitoring; irrigation is not immediately necessary.`;
    } else {
        action = `Soil moisture is high at ${Math.round(m)}%. Avoid unnecessary irrigation and allow the soil to drain.`;
    }

    if (d) {
        d.textContent = `${action} Current weather: ${Math.round(temp)}°C, ${Math.round(hum)}% humidity.`;
    }

    const result = data?.result || data || {};
    updateIrrigationEstimate(m, r, result);
}

function updateIrrigationEstimate(moisture, rainProbability, result = {}) {
    const minimum = Number(result.minimum_moisture);
    const status = result.status;

    if (!Number.isFinite(minimum)) {
        updateIrrigationTime("Waiting for crop moisture target...");
        return;
    }

    // Dashboard estimate only. Actual irrigation time depends on soil, field size,
    // crop water demand and pump flow rate.
    let text;

    if (rainProbability >= 60 && moisture < minimum) {
        text = `Delay for now — rain chance is ${Math.round(rainProbability)}%`;
    } else if (status === "irrigate" || moisture < minimum) {
        const deficit = minimum - moisture;

        if (deficit >= 25) text = "Now / within ~1 hour";
        else if (deficit >= 15) text = "Within ~2–4 hours";
        else if (deficit >= 7) text = "Within ~4–8 hours";
        else text = "Within ~8–12 hours";
    } else if (status === "monitor") {
        text = "Not immediately — check again in ~6–12 hours";
    } else {
        text = "Not required right now";
    }

    updateIrrigationTime(text);
}

function updateIrrigationTime(text) {
    const el = document.getElementById("irrigationTime");
    if (el) el.textContent = text;
}


function displayAdvisorResult(data) {
    const recommendation = document.getElementById("advisorRecommendation");
    const description = document.getElementById("advisorDescription");
    const result = data?.result || data || {};
    const text = result.recommendation || data.recommendation || data.message || "Recommendation available";
    const status = result.status;

    if (recommendation) {
        recommendation.textContent = getRecommendationTitle(status, text);
    }

    // Detailed description is generated by updateAdvancedAdvisor().
}

function getRecommendationTitle(status, recommendation) {
    if (status === "irrigate") return "🔴 Irrigation is recommended";
    if (status === "wait") return "🟡 Rain is likely — monitor before irrigating";
    if (status === "good") return "🟢 Irrigation not required right now";
    if (status === "high") return "🔵 Soil moisture is high";
    if (status === "monitor") return "🟡 Monitor soil moisture";
    return translateRecommendation(recommendation);
}



function translateRecommendation(text) {

    const lower =
        String(text).toLowerCase();

    if (
        lower.includes("irrigation recommended")
    ) {
        return t(
            "irrigationRecommended"
        );
    }

    if (
        lower.includes("irrigation not required")
    ) {
        return t(
            "irrigationNotRequired"
        );
    }

    if (
        lower.includes("avoid irrigation")
    ) {
        return t(
            "avoidIrrigation"
        );
    }

    if (
        lower.includes("monitor")
    ) {
        return t(
            "monitorSoil"
        );
    }

    return text;
}


function getLocalRecommendation() {

    const moisture =
        currentSensorData.moisture;

    if (moisture < 30) {
        return t(
            "irrigationRecommended"
        );
    }

    if (moisture <= 70) {
        return t(
            "irrigationNotRequired"
        );
    }

    return t(
        "avoidIrrigation"
    );
}


/* ================================
   MULTIPLE AREA
================================ */

function setupAreaMonitoring() {

    const select =
        document.getElementById(
            "areaCount"
        );

    if (!select) {
        return;
    }

    totalAreas =
        Number(select.value);

    currentArea = 1;

    areaReadings = [];

    detectedCurrentMoisture =
        false;

    renderAreaState();
}


function renderAreaState() {

    const progressText =
        document.getElementById(
            "areaProgressText"
        );

    if (progressText) {

        progressText.textContent =
            `${currentArea} of ${totalAreas}`;
    }


    const progressPercent =
        document.getElementById(
            "areaProgressPercent"
        );

    const percentage =
        ((currentArea - 1) /
            totalAreas) * 100;

    if (progressPercent) {
        progressPercent.textContent =
            `${Math.round(
                percentage
            )}%`;
    }


    const progressBar =
        document.getElementById(
            "areaProgressBar"
        );

    if (progressBar) {
        progressBar.style.width =
            `${percentage}%`;
    }


    const currentAreaName =
        document.getElementById(
            "currentAreaName"
        );

    if (currentAreaName) {

        currentAreaName.textContent =
            `${t("currentArea")} ${currentArea}`;
    }


    const detected =
        document.getElementById(
            "detectedMoisture"
        );

    if (detected) {
        detected.textContent =
            "--%";
    }


    const status =
        document.getElementById(
            "detectStatus"
        );

    if (status) {

        status.textContent =
            t("detectSensor")
                .replace(
                    "{area}",
                    currentArea
                );
    }


    const nextButton =
        document.getElementById(
            "nextAreaBtn"
        );

    if (nextButton) {
        nextButton.classList.add(
            "hidden"
        );
    }
}


/* ================================
   DETECT AREA MOISTURE
================================ */

function detectAreaMoisture() {

    const moisture =
        Number(
            currentSensorData.moisture
        );


    const detected =
        document.getElementById(
            "detectedMoisture"
        );

    if (detected) {
        detected.textContent =
            `${moisture}%`;
    }


    const status =
        document.getElementById(
            "detectStatus"
        );

    if (status) {

        status.textContent =
            getMoistureStatus(
                moisture
            );
    }


    detectedCurrentMoisture =
        true;


    const nextButton =
        document.getElementById(
            "nextAreaBtn"
        );

    if (nextButton) {

        nextButton.classList.remove(
            "hidden"
        );

        if (
            currentArea >=
            totalAreas
        ) {

            nextButton.textContent =
                t("analyzeField");

        } else {

            nextButton.textContent =
                t("saveNext");
        }
    }
}


/* ================================
   AREA NEXT
================================ */

function goToNextArea() {

    if (!detectedCurrentMoisture) {

        detectAreaMoisture();

        return;
    }


    areaReadings.push({

        area: currentArea,

        moisture:
            currentSensorData.moisture
    });


    renderSavedAreas();


    if (
        currentArea >=
        totalAreas
    ) {

        finishFieldAnalysis();

        return;
    }


    currentArea++;

    detectedCurrentMoisture =
        false;

    renderAreaState();
}


/* ================================
   SAVED AREAS
================================ */

function renderSavedAreas() {

    const container =
        document.getElementById(
            "savedAreas"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    areaReadings.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "saved-area-item";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                `${t("currentArea")} ${item.area}`;


            const moisture =
                document.createElement(
                    "span"
                );

            moisture.textContent =
                `${item.moisture}%`;


            const status =
                document.createElement(
                    "small"
                );

            status.textContent =
                getMoistureStatus(
                    item.moisture
                );


            card.appendChild(title);
            card.appendChild(moisture);
            card.appendChild(status);

            container.appendChild(card);
        }
    );
}


/* ================================
   AREA STATUS
================================ */

function getMoistureStatus(
    moisture
) {

    if (moisture < 30) {
        return t("dry");
    }

    if (moisture <= 70) {
        return t("normal");
    }

    return t("wet");
}


/* ================================
   FINISH FIELD ANALYSIS
================================ */

async function finishFieldAnalysis() {

    if (
        detectedCurrentMoisture &&
        (
            areaReadings.length === 0 ||
            areaReadings[
                areaReadings.length - 1
            ].area !== currentArea
        )
    ) {

        areaReadings.push({

            area: currentArea,

            moisture:
                currentSensorData.moisture
        });
    }


    if (
        areaReadings.length === 0
    ) {
        return;
    }


    const average =
        areaReadings.reduce(
            (sum, item) =>
                sum +
                Number(item.moisture),
            0
        ) /
        areaReadings.length;


    const areaAverage =
        document.getElementById(
            "areaAverage"
        );

    if (areaAverage) {

        areaAverage.textContent =
            `${average.toFixed(1)}%`;
    }


    const areaStatus =
        document.getElementById(
            "areaStatus"
        );

    if (areaStatus) {

        areaStatus.textContent =
            getMoistureStatus(
                average
            );
    }


    const areaStats =
        document.getElementById(
            "areaStats"
        );

    if (areaStats) {

        const dry =
            areaReadings.filter(
                item =>
                    item.moisture < 30
            ).length;

        const normal =
            areaReadings.filter(
                item =>
                    item.moisture >= 30 &&
                    item.moisture <= 70
            ).length;

        const wet =
            areaReadings.filter(
                item =>
                    item.moisture > 70
            ).length;

        areaStats.innerHTML = `
            <div>
                ${t("dry")}: ${dry}
            </div>

            <div>
                ${t("normal")}: ${normal}
            </div>

            <div>
                ${t("wet")}: ${wet}
            </div>
        `;
    }


    const recommendation =
        document.getElementById(
            "areaRecommendation"
        );

    if (recommendation) {

        let message =
            t("monitorSoil");

        if (average < 30) {
            message =
                t(
                    "irrigationRecommended"
                );
        } else if (
            average > 70
        ) {
            message =
                t(
                    "avoidIrrigation"
                );
        } else {
            message =
                t(
                    "irrigationNotRequired"
                );
        }

        recommendation.innerHTML = `
            <span>🌱</span>

            <div>
                <b>
                    ${message}
                </b>

                <p>
                    ${t("fieldReady")}
                </p>
            </div>
        `;
    }


    const dashboardAverage =
        document.getElementById(
            "dashboardAreaAverage"
        );

    if (dashboardAverage) {
        dashboardAverage.textContent =
            `${average.toFixed(1)}%`;
    }


    const dashboardStatus =
        document.getElementById(
            "dashboardAreaStatus"
        );

    if (dashboardStatus) {
        dashboardStatus.textContent =
            getMoistureStatus(
                average
            );
    }


    const finishButton =
        document.getElementById(
            "finishFieldBtn"
        );

    if (finishButton) {
        finishButton.classList.add(
            "hidden"
        );
    }


    await saveAreasToBackend();
}


/* ================================
   SAVE AREAS TO FLASK
================================ */

async function saveAreasToBackend() {

    try {

        const response =
            await fetch(
                `${API_BASE}/api/areas`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        areas:
                            areaReadings
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Area API failed"
            );
        }


        const data =
            await response.json();

        console.log(
            "Areas saved:",
            data
        );

    } catch (error) {

        console.error(
            "Area save error:",
            error
        );
    }
}


/* ================================
   INITIALIZATION
================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const savedLanguage =
            localStorage.getItem(
                "soilSenseLanguage"
            );

        if (
            savedLanguage &&
            translations[savedLanguage]
        ) {
            currentLanguage =
                savedLanguage;
        }


        applyLanguage();
        setupLocationAutocomplete();


        const crop =
            document.getElementById(
                "crop"
            );

        if (crop) {

            selectedCrop =
                crop.value;

            crop.addEventListener(
                "change",
                function() {

                    selectedCrop =
                        this.value;
                    if (document.getElementById("advisorPanel") &&
                        !document.getElementById("advisorPanel").classList.contains("hidden")) {
                        clearTimeout(advisorRefreshTimer);
                        advisorRefreshTimer = setTimeout(getAdvisorRecommendation, 300);
                    }
                }
            );
        }


        const stage =
            document.getElementById(
                "stage"
            );

        if (stage) {

            selectedStage =
                stage.value;

            stage.addEventListener(
                "change",
                function() {

                    selectedStage =
                        this.value;
                    if (document.getElementById("advisorPanel") &&
                        !document.getElementById("advisorPanel").classList.contains("hidden")) {
                        clearTimeout(advisorRefreshTimer);
                        advisorRefreshTimer = setTimeout(getAdvisorRecommendation, 300);
                    }
                }
            );
        }


        updateLiveSensor();


        setInterval(
            updateLiveSensor,
            1000
        );


        console.log(
            "SoilSense ready"
        );
    }
);