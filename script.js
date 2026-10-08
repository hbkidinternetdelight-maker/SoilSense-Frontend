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
        monitorDry: "⚠ कोरड्या भागांवर लक्ष ठेवा",
        rainExpected: "🌧 2 दिवसांत पावसाची शक्यता",

        fieldOverview: "तुमच्या शेताची स्थिती",
        smartMonitoring: "स्मार्ट मॉनिटरिंग",
        chooseFeature:
            "तुमचे शेत पाहण्यासाठी सुविधा निवडा.",

        aiInsight: "AI पीक माहिती",
        smartAdvisor: "स्मार्ट पीक सल्लागार",
        advisorDescription:
            "माती, हवामान आणि पिकाच्या अवस्थेनुसार सिंचन मार्गदर्शन.",
        weatherAdvice: "✓ हवामानावर आधारित सल्ला",
        cropInsights: "✓ पिकाच्या अवस्थेची माहिती",
        farmerRecommendations:
            "✓ शेतकऱ्यांसाठी सोपा सल्ला",
        exploreAdvisor: "सल्ला पहा →",

        realtime: "रीयल-टाइम मॉनिटरिंग",
        liveMoisture: "थेट मातीतील ओलावा",

        fieldAnalysis: "क्षेत्र विश्लेषण",
        multipleArea: "अनेक क्षेत्रांचे विश्लेषण",
        multipleAreaDescription:
            "तुमच्या शेतातील वेगवेगळ्या भागांतील ओलाव्याची तुलना करा.",
        fieldAverage: "शेतातील सरासरी ओलावा",
        noAnalysis: "अजून विश्लेषण नाही",
        viewAnalysis: "क्षेत्र विश्लेषण पहा →",

        smartCropAdvisor: "स्मार्ट पीक सल्लागार",
        todaysRecommendation: "आजचा सल्ला",
        checking: "🟢 सल्ला तपासला जात आहे...",
        conditions:
            "हवामान आणि मातीची स्थिती विचारात घेतली जात आहे.",

        temperature: "🌡 तापमान",
        moisture: "💧 ओलावा",
        humidity: "💨 आर्द्रता",
        rainChance: "🌧 पावसाची शक्यता",

        realTimeSensor: "रीयल-टाइम सेन्सर",
        currentCondition: "सध्याची स्थिती",
        optimal: "🟢 मातीतील ओलावा योग्य आहे.",

        areaAnalysis: "क्षेत्र विश्लेषण",
        multipleAreaMoisture: "अनेक क्षेत्रांतील मातीचा ओलावा",
        areaDescription:
            "क्षेत्र निवडा, ओलावा तपासा, सेव्ह करा आणि पुढील क्षेत्रावर जा.",
        monitoringAreas:
            "🌾 तुम्ही किती क्षेत्रांचे निरीक्षण करत आहात?",
        currentArea: "सध्याचे क्षेत्र",
        detectMoisture: "💧 ओलावा तपासा",
        saveNext: "सेव्ह करा आणि पुढील क्षेत्र →",
        analyzeField: "संपूर्ण शेताचे विश्लेषण करा →",
        fieldReady: "शेत विश्लेषण तयार आहे",
        detectArea:
            "प्रत्येक क्षेत्रातील ओलावा तपासा.",
        detectSensor:
            "क्षेत्र {area} मध्ये सेन्सर ठेवा आणि ओलावा तपासा.",

        dry: "कोरडे",
        normal: "सामान्य",
        wet: "ओले",

        irrigationRecommended:
            "सिंचन करण्याची शिफारस आहे.",
        irrigationNotRequired:
            "सिंचनाची गरज नाही.",
        avoidIrrigation:
            "सिंचन टाळा.",
        monitorSoil:
            "मातीतील ओलाव्यावर लक्ष ठेवा.",

        footer:
            "शाश्वत भारतासाठी स्मार्ट शेती",
        footerQuote:
            "निरोगी माती. आनंदी शेतकरी. मजबूत भारत.",
        footerCopyright:
            "© 2026 मातीतील ओलावा निरीक्षण प्रणाली • भारतीय शेतकऱ्यांसाठी 🇮🇳"
    }
};


/* ================================
   TRANSLATION HELPER
================================ */

function t(key) {

    if (
        translations[currentLanguage] &&
        translations[currentLanguage][key]
    ) {
        return translations[currentLanguage][key];
    }

    return translations.en[key] || key;
}


/* ================================
   LANGUAGE
================================ */

function selectLanguage(language) {

    if (!translations[language]) {
        return;
    }

    currentLanguage = language;

    localStorage.setItem(
        "soilSenseLanguage",
        language
    );

    applyLanguage();

    const languagePage =
        document.getElementById("languagePage");

    const setupPage =
        document.getElementById("setupPage");

    if (languagePage) {
        languagePage.classList.add("hidden");
    }

    if (setupPage) {
        setupPage.classList.remove("hidden");
    }
}


function applyLanguage() {

    const languageTitle =
        document.getElementById("languageTitle");

    if (languageTitle) {
        languageTitle.textContent =
            t("languageTitle");
    }

    const elements =
        document.querySelectorAll("[data-i18n]");

    elements.forEach(function(element) {

        const key =
            element.getAttribute("data-i18n");

        if (key) {
            element.textContent = t(key);
        }
    });


    const locationInput =
        document.getElementById("location");

    if (locationInput) {
        locationInput.placeholder =
            t("locationPlaceholder");
    }
}


/* ================================
   LOCATION SEARCH
================================ */

function setupLocationAutocomplete() {

    const input =
        document.getElementById("location");

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        function() {

            clearTimeout(
                locationSearchTimer
            );

            const query =
                this.value.trim();

            if (query.length < 2) {
                hideLocationSuggestions();
                return;
            }

            locationSearchTimer =
                setTimeout(
                    function() {
                        searchLocations(query);
                    },
                    350
                );
        }
    );


    input.addEventListener(
        "focus",
        function() {

            const query =
                this.value.trim();

            if (query.length >= 2) {
                searchLocations(query);
            }
        }
    );


    document.addEventListener(
        "click",
        function(event) {

            const wrapper =
                document.querySelector(
                    ".location-wrapper"
                );

            if (
                wrapper &&
                !wrapper.contains(event.target)
            ) {
                hideLocationSuggestions();
            }
        }
    );
}


async function searchLocations(query) {

    try {

        const url =
            "https://nominatim.openstreetmap.org/search?" +
            new URLSearchParams({
                q: query + ", Maharashtra, India",
                format: "json",
                addressdetails: "1",
                limit: "6",
                countrycodes: "in"
            });


        const response =
            await fetch(url, {
                headers: {
                    "Accept":
                        "application/json"
                }
            });


        if (!response.ok) {
            return;
        }


        const results =
            await response.json();


        showLocationSuggestions(results);

    } catch (error) {

        console.error(
            "Location search error:",
            error
        );
    }
}


function showLocationSuggestions(results) {

    let dropdown =
        document.getElementById(
            "locationSuggestions"
        );


    if (!dropdown) {

        dropdown =
            document.createElement("div");

        dropdown.id =
            "locationSuggestions";

        dropdown.className =
            "location-suggestions";


        const input =
            document.getElementById("location");

        if (
            input &&
            input.parentElement
        ) {
            input.parentElement.appendChild(
                dropdown
            );
        }
    }


    dropdown.innerHTML = "";


    if (!results.length) {

        dropdown.innerHTML =
            `<div class="location-empty">
                No locations found
             </div>`;

        dropdown.classList.add("show");

        return;
    }


    results.forEach(function(place) {

        const item =
            document.createElement("button");

        item.type = "button";

        item.className =
            "location-suggestion";


        const address =
            place.address || {};


        const primary =
            address.village ||
            address.town ||
            address.city ||
            address.municipality ||
            address.suburb ||
            address.county ||
            place.name ||
            "Location";


        const district =
            address.state_district ||
            address.district ||
            address.city_district ||
            "";


        const state =
            address.state ||
            "Maharashtra";


        const secondary =
            [district, state]
                .filter(Boolean)
                .join(", ");


        item.innerHTML = `
            <span class="location-pin">📍</span>
            <span class="location-text">
                <strong>${escapeHtml(primary)}</strong>
                <small>${escapeHtml(secondary)}</small>
            </span>
        `;


        item.addEventListener(
            "click",
            function() {

                const input =
                    document.getElementById(
                        "location"
                    );

                if (input) {
                    input.value =
                        primary +
                        (
                            secondary
                                ? ", " + secondary
                                : ""
                        );
                }


                selectedLocationData = {
                    displayName:
                        primary +
                        (
                            secondary
                                ? ", " + secondary
                                : ""
                        ),

                    latitude:
                        Number(place.lat),

                    longitude:
                        Number(place.lon),

                    address:
                        address
                };


                hideLocationSuggestions();
            }
        );


        dropdown.appendChild(item);
    });


    dropdown.classList.add("show");
}


function hideLocationSuggestions() {

    const dropdown =
        document.getElementById(
            "locationSuggestions"
        );

    if (dropdown) {
        dropdown.classList.remove("show");
    }
}


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ================================
   AUTO LOCATION
================================ */

async function autoDetectLocation() {

    if (!navigator.geolocation) {

        alert(
            "Location detection is not supported on this device."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(
        async function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const response =
                    await fetch(
                        "https://nominatim.openstreetmap.org/reverse?" +
                        new URLSearchParams({
                            lat: latitude,
                            lon: longitude,
                            format: "json",
                            addressdetails: "1"
                        }),
                        {
                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response.json();


                const address =
                    data.address || {};


                const primary =
                    address.village ||
                    address.town ||
                    address.city ||
                    address.municipality ||
                    address.suburb ||
                    "Current Location";


                const district =
                    address.state_district ||
                    address.district ||
                    "";


                const state =
                    address.state ||
                    "Maharashtra";


                const displayName =
                    [
                        primary,
                        district,
                        state
                    ]
                        .filter(Boolean)
                        .join(", ");


                const input =
                    document.getElementById(
                        "location"
                    );


                if (input) {
                    input.value =
                        displayName;
                }


                selectedLocationData = {
                    displayName:
                        displayName,

                    latitude:
                        latitude,

                    longitude:
                        longitude,

                    address:
                        address
                };


            } catch (error) {

                console.error(
                    "Reverse geocoding error:",
                    error
                );
            }
        },

        function(error) {

            console.error(
                "Location permission error:",
                error
            );

            alert(
                "Unable to detect your location. Please select it manually."
            );
        }
    );
}


/* ================================
   CONTINUE FROM FARM SETUP
================================ */

function continueToDashboard() {

    const setupPage =
        document.getElementById("setupPage");

    const dashboardPage =
        document.getElementById("dashboardPage");


    if (setupPage) {
        setupPage.classList.add("hidden");
    }

    if (dashboardPage) {
        dashboardPage.classList.remove("hidden");
    }


    if (
        selectedLocationData
    ) {

        getWeatherForLocation(
            selectedLocationData.latitude,
            selectedLocationData.longitude
        );
    }
}


/* ================================
   WEATHER
================================ */

async function getWeatherForLocation(
    latitude,
    longitude
) {

    try {

        const url =
            "https://api.open-meteo.com/v1/forecast?" +
            new URLSearchParams({
                latitude: latitude,
                longitude: longitude,
                current:
                    "temperature_2m,relative_humidity_2m,apparent_temperature,rain,precipitation,wind_speed_10m,weather_code",
                hourly:
                    "precipitation_probability",
                forecast_days: "2",
                timezone: "auto"
            });


        const response =
            await fetch(url);


        if (!response.ok) {
            throw new Error(
                "Weather API failed"
            );
        }


        const data =
            await response.json();


        const next24 =
            data.hourly?.precipitation_probability
                ?.slice(
                    0,
                    24
                ) || [];


        const weather = {

            temperature:
                data.current?.temperature_2m,

            humidity:
                data.current?.relative_humidity_2m,

            apparent_temperature:
                data.current?.apparent_temperature,

            rain:
                data.current?.rain,

            precipitation:
                data.current?.precipitation,

            wind_speed:
                data.current?.wind_speed_10m,

            weather_code:
                data.current?.weather_code,

            rain_probability:
                next24.length
                    ? Math.max(...next24)
                    : 0
        };


        window.soilSenseWeather =
            weather;


        updateWeatherUI(
            weather
        );


        return weather;

    } catch (error) {

        console.error(
            "Weather connection error:",
            error
        );

        return null;
    }
}


function updateWeatherUI(w) {

    if (!w) {
        return;
    }


    const temperature =
        document.getElementById(
            "temperature"
        );

    if (
        temperature &&
        w.temperature !== undefined
    ) {

        temperature.textContent =
            `${Number(
                w.temperature
            ).toFixed(1)}°C`;
    }


    const advisorTemperature =
        document.getElementById(
            "advisorTemperature"
        );

    if (
        advisorTemperature &&
        w.temperature !== undefined
    ) {

        advisorTemperature.textContent =
            `${Number(
                w.temperature
            ).toFixed(1)}°C`;
    }


    const advisorHumidity =
        document.getElementById(
            "advisorHumidity"
        );

    if (
        advisorHumidity &&
        w.humidity !== undefined
    ) {

        advisorHumidity.textContent =
            `${Math.round(
                w.humidity
            )}%`;
    }


    const humidity =
        document.getElementById(
            "humidity"
        );

    if (
        humidity &&
        w.humidity !== undefined
    ) {

        humidity.textContent =
            `💧 ${Math.round(
                w.humidity
            )}%`;
    }


    const rain =
        document.getElementById(
            "rainChance"
        );

    if (rain) {

        rain.textContent =
            `🌧️ ${Math.round(
                w.rain_probability || 0
            )}%`;
    }


    const advisorRain =
        document.getElementById(
            "advisorRain"
        );

    if (advisorRain) {

        advisorRain.textContent =
            `${Math.round(
                w.rain_probability || 0
            )}%`;
    }


    const condition =
        document.getElementById(
            "weatherCondition"
        );

    if (condition) {

        condition.textContent =
            `${weatherIcon(
                w.weather_code
            )} ${weatherDescription(
                w.weather_code
            )}`;
    }


    const name =
        selectedLocationData?.displayName ||
        "Confirmed location";


    const hero =
        document.getElementById(
            "heroLocation"
        );

    const nav =
        document.getElementById(
            "navLocation"
        );


    if (hero) {
        hero.textContent =
            `📍 ${name}`;
    }


    if (nav) {
        nav.textContent =
            `📍 ${name}`;
    }
}


function weatherIcon(code) {

    if ([0, 1].includes(code)) {
        return "☀️";
    }

    if ([2, 3].includes(code)) {
        return "⛅";
    }

    if ([45, 48].includes(code)) {
        return "🌫️";
    }

    if (
        [51, 53, 55, 56, 57]
            .includes(code)
    ) {
        return "🌦️";
    }

    if (
        [
            61,
            63,
            65,
            66,
            67,
            80,
            81,
            82
        ].includes(code)
    ) {
        return "🌧️";
    }

    if (
        [95, 96, 99]
            .includes(code)
    ) {
        return "⛈️";
    }

    return "🌤️";
}


function weatherDescription(code) {

    if ([0, 1].includes(code)) {
        return "Clear / Mostly Clear";
    }

    if ([2, 3].includes(code)) {
        return "Partly Cloudy";
    }

    if ([45, 48].includes(code)) {
        return "Foggy";
    }

    if (
        [51, 53, 55, 56, 57]
            .includes(code)
    ) {
        return "Drizzle";
    }

    if (
        [
            61,
            63,
            65,
            66,
            67,
            80,
            81,
            82
        ].includes(code)
    ) {
        return "Rain";
    }

    if (
        [95, 96, 99]
            .includes(code)
    ) {
        return "Thunderstorm";
    }

    return "Current Conditions";
}