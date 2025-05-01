const apiKey = '617ccbb3a9a6c999ebf537795be64b34';
const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const advisoryMessage = document.querySelector(".advisory-message");
const chatbotQuestions = document.querySelector(".chatbot-questions");
const chatbotResponse = document.querySelector(".chatbot-response");
const languageSelector = document.querySelector(".language-selector");

// custom chatbot just to know the weather termology
const chatbotAnswers = {
    humidity: {
        english: "Humidity is the amount of water vapor present in the air. High humidity can make it feel warmer, while low humidity can feel cooler. It's measured as a percentage, with 100% meaning the air is fully saturated.",
        hindi: "नमी हवा में पानी की भाप की मात्रा है। अधिक नमी से गर्मी ज्यादा लगती है, कम नमी से ठंडक। इसे प्रतिशत में मापा जाता है, 100% का मतलब हवा पूरी तरह भरी है।"
    },
    heatstroke: {
        english: "Heat stroke is a severe heat-related illness caused by prolonged exposure to high temperatures, leading to a body temperature above 40°C (104°F). Symptoms include confusion, rapid heartbeat, and unconsciousness. Stay hydrated and seek shade to prevent it.",
        hindi: "लू लगना गर्मी से होने वाली गंभीर बीमारी है, जब शरीर का तापमान 40°C से ज्यादा हो जाता है। लक्षण: भ्रम, तेज धड़कन, बेहोशी। बचाव: पानी पीते रहें और छाया में रहें।"
    },
    windspeed: {
        english: "Wind speed affects weather by influencing temperature perception (wind chill) and spreading weather systems. High winds can cause storms or dust, while gentle breezes can make the day feel pleasant.",
        hindi: "हवा की गति मौसम को प्रभावित करती है, जैसे ठंडक का अहसास (विंड चिल) और मौसम का फैलाव। तेज हवाएँ तूफान या धूल लाती हैं, हल्की हवा दिन को सुहाना बनाती है।"
    },
    uvindex: {
        english: "The UV index measures the intensity of ultraviolet (UV) radiation from the sun. A higher UV index means stronger UV rays, increasing the risk of sunburn or skin damage. Use sunscreen and protective clothing on high UV days.",
        hindi: "यूवी इंडेक्स सूरज की पराबैंगनी (UV) किरणों की तीव्रता मापता है। ज्यादा यूवी इंडेक्स मतलब तेज किरणें, जो धूप से जलन या त्वचा को नुकसान पहुंचाती हैं। सनस्क्रीन और ढकने वाले कपड़े पहनें।"
    }
};


chatbotQuestions.addEventListener("change", () => {
    const selectedQuestion = chatbotQuestions.value;
    const selectedLanguage = languageSelector.value || "english";
    if (selectedQuestion && chatbotAnswers[selectedQuestion]) {
        chatbotResponse.innerText = chatbotAnswers[selectedQuestion][selectedLanguage];
    } else {
        chatbotResponse.innerText = "Please select a question.";
    }
});


languageSelector.addEventListener("change", () => {
    const selectedQuestion = chatbotQuestions.value;
    const selectedLanguage = languageSelector.value;
    if (selectedQuestion && chatbotAnswers[selectedQuestion]) {
        chatbotResponse.innerText = chatbotAnswers[selectedQuestion][selectedLanguage];
    }
});


searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim() !== "") {
        checkweather(searchBox.value);
    }
});


searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && searchBox.value.trim() !== "") {
        checkweather(searchBox.value);
    }
});

async function checkweather(city) {
    const response = await fetch(url + city + `&appid=${apiKey}`);
    
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        advisoryMessage.innerText = "";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerText = "Weather in " + data.name;
        document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerText = data.main.humidity + "%";
        document.querySelector(".wind").innerText = data.wind.speed + " km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "clouds.png";
        }
        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "clear.png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "rain.png";
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "mist.png";
        }
        else if (data.weather[0].main == "Snow") {
            weatherIcon.src = "snow.png";
        }
        else {
            weatherIcon.src = "unknown.png";
        }

    
        const temp = data.main.temp;
        const weatherCondition = data.weather[0].main;
        if (temp > 35) {
            advisoryMessage.innerText = "It's very hot! Stay hydrated and avoid direct sunlight.";
        } else if (temp < 10) {
            advisoryMessage.innerText = "It's cold! Wear warm clothes and stay cozy.";
        } else if (weatherCondition === "Rain") {
            advisoryMessage.innerText = "It's raining! Carry an umbrella or raincoat.";
        } else if (weatherCondition === "Snow") {
            advisoryMessage.innerText = "Snowfall alert! Drive carefully and keep warm.";
        } else if (weatherCondition === "Mist") {
            advisoryMessage.innerText = "Low visibility due to mist. Drive cautiously.";
        } else {
            advisoryMessage.innerText = "Enjoy the pleasant weather!";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}
