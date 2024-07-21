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
    if (time == 0)
        displayResult();
    else
        document.getElementById('timer').innerText = --time + ' сек';
}

userInput.addEventListener('input', () => {
    if (!flagStarted) {
        flagStarted = true;
        startTest();
    }
    let quoteChars = Array.from(document.getElementsByClassName('quote-chars'));
    let inputChars = userInput.value.split('');
    quoteChars.forEach((char, index) => {
        if (char.innerText == inputChars[index])
            char.classList.add('success');
        else if (inputChars[index] == null)
            if (char.classList.contains('success'))
                char.classList.remove('success');
            else
                char.classList.remove('fail');
        else {
            if (!char.classList.contains('fail')) {
                mistakes += 1;
                char.classList.add('fail');
            }
            document.getElementById('mistakes').innerText = mistakes;
        }
        
        let check = quoteChars.every((char) => {
            return char.classList.contains('success');
        });
        if (check) 
            displayResult();
    });
});

const displayResult = () => {
    document.querySelector('.result').style.display = 'flex';
    clearInterval(timer);
    userInput.disabled = true;

    let timeTaken = 1;
    if (time != 0)
        timeTaken = (60 - time) / 60;

    let symbolsCorrect = 0;
    let quoteChars = Array.from(document.getElementsByClassName('quote-chars'));
    let inputChars = userInput.value.split('');
    quoteChars.forEach((char, index) => {
        if (char.innerText == inputChars[index])
            symbolsCorrect += 1;
    })

    
    let quoteText = '';
    quoteChars.forEach((char) => {
        quoteText += char.innerText;
    })
    let wordsCorrect = 0;
    let quoteWords = quote.split(' ');
    let inputWords = userInput.value.split(' ');
    quoteWords.forEach((word, index) => {
        if ((word !== ' ') && (word !== '-'))
            if (word == inputWords[index])
                wordsCorrect += 1;
    })
    
    let accuracy = 0;
    if (symbolsCorrect > mistakes)
         accuracy = (symbolsCorrect - mistakes) / symbolsCorrect;
    let accuracyPercent = (accuracy * 100).toFixed(0);
    
    document.getElementById('wpm').innerText = (wordsCorrect / timeTaken * accuracy).toFixed(0);
    document.getElementById('spm').innerText = (symbolsCorrect / timeTaken * accuracy).toFixed(0);
    document.getElementById('accuracy').innerText = accuracyPercent + '%';
}