/*
 * Create a list that holds all of your cards
 */
let listCards = Array.from(document.querySelectorAll('.card'));

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const deck = document.querySelector('.deck');
let openCards = [];
let matchedCards = [];
let myTimer;
let initial;
let timer = document.querySelector('.timer');
deck.addEventListener('click', function(evt) {
    if (evt.target.nodeName === 'LI') {
        // add timer
        if (myTimer === undefined) {
            initial = new Date().getTime();
            myTimer = setInterval(getNewTime, 1000);
        }
        if (!openCards.includes(evt.target) && !matchedCards.includes(evt.target)) {
            updateMoves();
            evt.target.classList.add('open', 'show');
            openCards.push(evt.target);
            if (openCards.length == 2) {
                let card0 = openCards[0];
                let card1 = openCards[1];
                if (card0.querySelector('i').classList.item(1) == card1.querySelector('i').classList.item(1)) {
                    card0.classList.add('match');
                    card1.classList.add('match');
                    card0.classList.remove('open', 'show');
                    card1.classList.remove('open', 'show');
                    matchedCards.push(card0);
                    matchedCards.push(card1);
                    checkAll(matchedCards);
                } else {
                    setTimeout(function close() {
                        card0.classList.remove('open', 'show');
                        card1.classList.remove('open', 'show');
                    }, 400);
                }
                openCards = [];
            }
        }
    }
});

function closeOpenCards(openCards) {
    for (card of openCards) {
        card.classList.remove('open', 'show');
    }
}

function closeMatchedCards(matchedCards) {
    for (card of matchedCards) {
        card.classList.remove('match');
    }
}

const moves = document.querySelector('.moves');
let numMoves = 0;

function updateMoves(num) {
    if (num === 0) {
        moves.textContent = num;
    } else {
        numMoves += 1;
        moves.textContent = numMoves;
    }

}

function checkAll(matchedCards) {
    if (matchedCards.length === 16) {
        setTimeout(function on() {
            show();
        }, 10)
        clearInterval(myTimer);
    }
}

function startNewGame() {
    close();

    clearInterval(myTimer);
    myTimer = undefined;
    timer.innerText = `00:00`;

    recoverStars();

    closeOpenCards(openCards);
    openCards = [];

    closeMatchedCards(matchedCards);
    matchedCards = [];

    updateMoves(0);

    let shuffledCards = shuffle(listCards);
    const newDeck = document.createDocumentFragment()

    for (card of shuffledCards) {
        newDeck.appendChild(card);
    }

    let deck = document.querySelector('.deck');

    while (deck.hasChildNodes()) {
        deck.removeChild(deck.firstChild);
    }

    deck.appendChild(newDeck);
}

const restart = document.querySelector('.restart');
restart.addEventListener('click', startNewGame);

let stars = document.querySelectorAll('.fa-star');
let numStar = stars.length;
let time;

function getNewTime() {
    let now = new Date().getTime();
    let dis = now - initial;
    let minutes = Math.floor((dis % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((dis % (1000 * 60)) / 1000);

    // star
    if (seconds % 20 === 0 && numStar > 1) {
        numStar -= 1;
        stars[numStar].classList.replace('fa-star', 'fa-star-o');
    }
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    time = `${minutes}:${seconds}`
    timer.innerText = time;
}

function recoverStars() {
    numStar = stars.length;
    for (star of stars) {
        star.classList.replace('fa-star-o', 'fa-star');
    }
}

//winning page
function show() {
    document.querySelector('.winning-page').style.display = 'block';
    addStars();
    getStats();
}

function close() {
    document.querySelector('.winning-page').style.display = 'none';
}

let finalStars = document.querySelector('.final-stars');

function addStars() {
    let offStars = stars.length - numStar;

    for (let i = 0; i < numStar; i++) {
        const newElement = document.createElement('i');
        newElement.classList.add('fa', 'fa-star');

        finalStars.appendChild(newElement);
    }

    for (let i = 0; i < offStars; i++) {
        const newElement = document.createElement('i');
        newElement.classList.add('fa', 'fa-star-o');

        finalStars.appendChild(newElement);
    }
}

let stats = document.querySelector('.stats');

function getStats() {
    stats.textContent = `You finished the game in ${time} with ${numMoves} moves`;
}