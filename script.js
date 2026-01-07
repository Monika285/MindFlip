const gameBoard = document.getElementById("gameBoard");
const movesCounter = document.getElementById("moves");
const timeCounter = document.getElementById("time");
const restartBtn = document.getElementById("restart");

const emojis = ["🍎", "🍌", "🍇", "🍓", "🍒", "🥝", "🍍", "🍉"];
let cards = [];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matchedPairs = 0;

let timer = null;
let seconds = 0;
let timerStarted = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

function startTimer() {
  if (timerStarted) return;

  timerStarted = true;
  timer = setInterval(() => {
    seconds++;
    timeCounter.textContent = seconds;
  }, 1000);
}

// ==============================
// SETUP GAME
// ==============================
function setupGame() {
  // Reset everything
  gameBoard.innerHTML = "";
  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  timerStarted = false;
  clearInterval(timer);

  movesCounter.textContent = moves;
  timeCounter.textContent = seconds;

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  // Prepare cards
  cards = shuffle([...emojis, ...emojis]);

  // Create cards dynamically
  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.textContent = "❓";

    card.addEventListener("click", () => flipCard(card));

    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard) return;
  if (card === firstCard) return;
  if (card.classList.contains("matched")) return;

  startTimer();

  card.textContent = card.dataset.emoji;
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesCounter.textContent = moves;

  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;
    resetCards();

    if (matchedPairs === emojis.length) {
      clearInterval(timer);
      setTimeout(() => {
        alert(`🎉 Congratulations! You won in ${moves} moves and ${seconds} seconds!`);
      }, 300);
    }
  } else {
    lockBoard = true;

    setTimeout(() => {
      firstCard.textContent = "❓";
      secondCard.textContent = "❓";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetCards();
    }, 1000);
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

restartBtn.addEventListener("click", setupGame);

setupGame();
