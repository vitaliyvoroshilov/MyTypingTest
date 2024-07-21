const quoteApiUrl = 'https://api.quotable.io/random?minLength=150&maxLength=200';
const quoteSection = document.getElementById('quote');
const userInput = document.getElementById('quote-input');

let quote = '';
let time = 60;
let timer = '';
let mistakes = 0;
let flagStarted = false;

window.onload = () => {
    document.querySelector('.result').style.display = 'none';
    userInput.value = '';
    userInput.disabled = true;
    renderNewQuote();
}

const renderNewQuote = async () => {
    const responseQuote = await fetch(quoteApiUrl);
    let dataQuote = await responseQuote.json();
    quote = dataQuote.content;
    let translateApiUrl = 'https://api.mymemory.translated.net/get?q=' + quote + '&langpair=en|ru';
    const responseTranlate = await fetch(translateApiUrl);
    let dataTranslate = await responseTranlate.json();
    quote = dataTranslate.responseData.translatedText;
    let arr = quote.split('').map((value) => {
        return '<span class="quote-chars">' + value + '</span>';
    });
    quoteSection.innerHTML += arr.join('');
    userInput.disabled = false;
}

const startTest = () => {
    mistakes = 0;
    timer = '';
    userInput.disabled = false;
    startTimer();
}

const startTimer = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

const updateTimer = () => {
    if (time == 0) {
        displayResult();
    }
    else {
        document.getElementById('timer').innerText = --time + ' сек';
    }
}

userInput.addEventListener('input', () => {
    if (!flagStarted) {
        flagStarted = true;
        startTest();
    }
    let quoteChars = document.getElementsByClassName('quote-chars');
    quoteChars = Array.from(quoteChars);
    let userInputChars = userInput.value.split('');
    quoteChars.forEach((char, index) => {
        if (char.innerText == userInputChars[index]) {
            char.classList.add('success');
        }
        else if (userInputChars[index] == null) {
            if (char.classList.contains('success')) {
                char.classList.remove('success');
            }
            else {
                char.classList.remove('fail');
            }
        }
        else {
            if (!char.classList.contains('fail')) {
                mistakes += 1;
                char.classList.add('fail');
            }
            document.getElementById('mistakes').innerText = mistakes;
        }
        
        let check = quoteChars.every((char123) => {
            return char123.classList.contains('success');
        });
        if (check) {
            displayResult();
        }
    });
});

const displayResult = () => {
    document.querySelector('.result').style.display = 'flex';
    
    clearInterval(timer);
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 60;
    }
    let wordsArr = userInput.value.split(' ');
    let words = wordsArr.length;
    let symbols = userInput.value.length;
    let accuracy = (symbols - mistakes) / symbols;
    let accuracyPercent = (accuracy * 100).toFixed(0);
    document.getElementById('wpm').innerText = (words / timeTaken * accuracy).toFixed(0);
    document.getElementById('spm').innerText = (symbols / timeTaken * accuracy).toFixed(0);
    document.getElementById('accuracy').innerText = accuracyPercent + '%';
}