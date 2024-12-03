// API configuration
const API_KEY = "AIzaSyB1dAXR2qMvVUPTqWWVkPNoub56XQcwYS4"; // Your API key here
// const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`
////////////////
const typingForm = document.querySelector(".typing-form");
const input = document.querySelector(".typing-form input");
const userMessage = document.querySelector(".user-message")
const chatList = document.querySelector(".chat-list")

function showTypingEffect(res, responseAi) {
    let loadingContainer = responseAi.querySelector(".loading-container")

    let PElement = document.createElement("p");
    PElement.classList.add("displayP");
    responseAi.querySelector(".inner-responseAi").appendChild(PElement);
    PElement.style.display = "none";
    loadingContainer.style.display = "none"
    setTimeout(() => {
        PElement.style.display = "block";
        let result = res.split(" ")
        let currentIndex = 0;
        console.log(res, responseAi);
        let loopData = setInterval(() => {

            PElement.innerHTML += (currentIndex === 0 ? "" : " ") + result[currentIndex++];
            if (currentIndex === result.length) {
                clearInterval(loopData);
            }
            window.scrollTo(0, chatList.scrollHeight);

        }, 75)
    }, 500)

}

async function apiResponse(inputValue) {
    try {
        let fetchApi = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{
                            text: inputValue
                        }]
                    }
                ]
            })
        })
        let res = await fetchApi.json()
        lastRes = res.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        console.log(lastRes);
        return lastRes;

    } catch (error) {
        console.error(error);

    }

}
function displayUserMessage() {
    console.log(input.value);
    let inputValue = input.value;
    let getUsrMessage = `
     <div class=" message">
                    <img src="images/WhatsApp Image 2024-11-06 at 17.49.59_01d8839e.jpg" alt="user image">
                    <p>${inputValue}</p>
                </div>`;

    let createDiv = document.createElement("div");
    createDiv.classList.add("user-message")
    createDiv.innerHTML = getUsrMessage;

    chatList.appendChild(createDiv)
    typingForm.reset()
    window.scrollTo(0, chatList.scrollHeight);

}
function copyBtn(Btn) {
    let PValue = Btn.parentElement.querySelector(".displayP").innerText


    navigator.clipboard.writeText(PValue);
    Btn.innerText = "done";
    Btn.style.color = "green"
    setTimeout(() => {
        Btn.style.color = "black"
        Btn.innerText = "content_copy";

    }, 1000)
}
async function displayAiMessage(inputValue) {
    let HTMLContainer;
    let res = await apiResponse(inputValue);
    // let final = showTypingEffect(res,)
    HTMLContainer = ` 
                <div class=" responseAi">
                    <div class="message inner-responseAi">
                        <img src="images/gemini.svg" alt="user image">

                        <div class="loading-container">
                            <div class="loadinglayer"></div>
                            <div class="loadinglayer"></div>
                            <div class="loadinglayer"></div>
                        </div>
                    </div>
                </div>
                <span onClick="copyBtn(this)" class="material-symbols-outlined">
                    content_copy
                </span>
`;
    let createDiv = document.createElement("div");
    createDiv.classList.add("inner-chat", "loading")
    chatList.appendChild(createDiv)
    createDiv.innerHTML = HTMLContainer;
    let responseAi = createDiv.querySelector(".inner-responseAi");
    showTypingEffect(res, responseAi);

}


async function displayAiMessage(inputValue) {
    let HTMLContainer = `
        <div class="responseAi">
            <div class="message inner-responseAi">
                <img src="images/gemini.svg" alt="user image">
                <div class="loading-container">
                    <div class="loadinglayer"></div>
                    <div class="loadinglayer"></div>
                    <div class="loadinglayer"></div>
                </div>
            </div>
        </div>
        <span onClick="copyBtn(this)" class="material-symbols-outlined">
            content_copy
        </span>
    `;

    // Create a new div for the AI message
    let createDiv = document.createElement("div");
    createDiv.classList.add("inner-chat", "loading");
    chatList.appendChild(createDiv); // Append to the chat list
    createDiv.innerHTML = HTMLContainer;

    // Target the specific response container within this message
    let responseAi = createDiv.querySelector(".responseAi");

    // Call the API and process the response
    let res = await apiResponse(inputValue);

    // Display typing effect for the specific response container
    showTypingEffect(res, responseAi);

    // Scroll to the bottom of the chat
    window.scrollTo(0, chatList.scrollHeight);
}


typingForm.addEventListener("submit", (e) => {
    let inputValue = input.value;

    e.preventDefault();
    displayUserMessage();
    displayAiMessage(inputValue)

})