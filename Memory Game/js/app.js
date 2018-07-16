let openCards = [];
let currentCard;
let pairsMatched = 0;
let time = 0;
let clockId;

const deck = document.querySelector('.deck');
function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  console.log(shuffledCards);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}

shuffleDeck();
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const cards = document.querySelectorAll('.card');
// Main card listener logic
for(let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function(event) {
    const clickTarget = event.target;
    console.log(clickTarget.firstElementChild);

    // Opens the cards
    if(clickTarget.className == 'card' && openCards.length != 2) {
      if(clickTarget.className != 'card open show' && openCards.length < 2) {
        console.log('opening card!');

        // Toggles card and adds it to the array
        toggleCard(clickTarget);
        addToggleCard(clickTarget);

        // Advances move and checks if need to deduct the star rating

        checkScore();
      }

      // Compares & matches the cards
      if((openCards.length == 2) && openCards[0].firstElementChild.className == openCards[1].firstElementChild.className) {
        match(openCards[0], openCards[1])
        pairsMatched++;
        isGameWon();
        advanceMove();
      } else if (openCards.length == 2) {
        setTimeout(() => {
          advanceMove();
          toggleCard(openCards[0]);
          toggleCard(openCards[1]);
          openCards = [];
        }, 1000);

      }

    }
  });
}

function toggleCard(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
}

function addToggleCard(clickTarget) {
  openCards.push(clickTarget);
}

function match(cardOne, cardTwo) {
  cardOne.classList.toggle('match')
  cardTwo.classList.toggle('match')
  openCards = [];
}

const moveElement = document.querySelector('.moves');
let moveCounter = 0;
moveElement.innerText = moveCounter;
function advanceMove() {
  moveCounter++;
  moveElement.innerText = moveCounter;
}

let hiddenStars = 0;
function hideStar() {
  const starList = document.querySelectorAll('.stars li');
  for(star of starList) {
    if(star.style.display != 'none') {
      star.style.display = 'none';
      hiddenStars++;
      break;
    }
  }
}

function checkScore() {
  if(moveCounter > 26 && hiddenStars == 0) {
    hideStar();
  } else if (moveCounter > 36 && hiddenStars == 1) {
    hideStar();
  }
}

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click',function() {
  restartGame();
});

function isGameWon() {
  if(pairsMatched == 8) {
    console.log("GAME WON!");
    writeEndStats();
    toggleEndScreen();
    stopClock();
  }
}

function startClock(){
      clockId = setInterval(() => {
      time++;
      updateClock();
    }, 1000);
}
startClock();

const clockClass = document.querySelector('.clock');
function updateClock() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if(seconds < 10) {
    clockClass.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clockClass.innerHTML = `${minutes}:${seconds}`;
  }
}

function stopClock() {
  clearInterval(clockId);
}

// End screen logic
const endScreenContainer = document.querySelector('.end_container');
function toggleEndScreen() {
  if(endScreenContainer.style.visibility != 'hidden') {
    endScreenContainer.style.visibility = 'hidden';
  } else {
    endScreenContainer.style.visibility = 'initial';
  }
  writeEndStats();
}

toggleEndScreen();

// End screen stats calculations and outputs
function writeEndStats() {
  const timeStat = document.querySelector('#time');
  const starStat = document.querySelector('#stars');
  const moveStat = document.querySelector('#moves');

  timeStat.innerHTML = `Time: ${clockClass.innerHTML}`;
  if(hiddenStars == 0) {
    starStat.innerHTML = `Stars: 3 - Excellent job!`;
  } else if (hiddenStars == 1) {
    starStat.innerHTML = `Stars: 2 - Not bad!`;
  } else {
    starStat.innerHTML = `Stars: 1 - Better luck next time!`;
  }
  moveStat.innerHTML = `Total Moves: ${moveCounter}`;
}

// End screen close buttons logic
const endCloseX = document.querySelector('.end_close');
endCloseX.addEventListener("click", function() {
  toggleEndScreen();
  console.log("END CLOSE!");
});
const endCancel = document.querySelector('.end_cancel');
endCancel.addEventListener("click", function() {
  toggleEndScreen();
});
const endReplay = document.querySelector('.end_replay');
endReplay.addEventListener("click", function() {
  restartGame();
  toggleEndScreen();
  console.log("Restarting game!");
});

function restartGame() {

    // Resets time
    time = 0;
    clockClass.innerHTML = `0:00`;

    // Resets moves
    moveCounter = -1;
    advanceMove();

    // Resets stars
    hiddenStars = 0;
    const starList = document.querySelectorAll('.stars li');
    for(star of starList) {
      if(star.style.display == 'none') {
        star.style.display = 'initial';
      }
    }

    // Resets cards
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
      card.className = 'card';
    }

    shuffleDeck();
    openCards = [];
    stopClock();
    startClock();
}
