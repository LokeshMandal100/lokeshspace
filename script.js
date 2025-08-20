const boxes = document.querySelectorAll('.box');
const resultArea = document.getElementById('result-area');
const scoreDisplay = document.getElementById('score');
const roundDisplay = document.getElementById('round');
const playerDisplay = document.getElementById('player');
const restartBtn = document.getElementById('restart-btn');

let currentPlayer = 1;
let round = 1;
let scores = [0, 0];
let selectedBoxes = [];
let gameOver = false;

function resetBoxes() {
  boxes.forEach(box => {
    box.classList.remove('clicked');
    box.textContent = '';
    box.dataset.number = Math.floor(Math.random() * 100) + 1; // random 1-100
    box.style.pointerEvents = 'auto';
  });
  selectedBoxes = [];
}

function updateDisplay() {
  scoreDisplay.textContent = `Player 1: ${scores[0]} | Player 2: ${scores[1]}`;
  roundDisplay.textContent = `Round: ${round} / 3`;
  playerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

function handleBoxClick(e) {
  if (gameOver) return;

  const box = e.target;
  if (box.classList.contains('clicked') || selectedBoxes.includes(box)) return;

  // ✅ Prevent more than 2 clicks per turn
  if (selectedBoxes.length >= 2) return;

  box.classList.add('clicked');
  box.textContent = box.dataset.number;
  selectedBoxes.push(box);

  if (selectedBoxes.length === 2) {
    // ✅ After 2 clicks, check score
    setTimeout(() => {
      checkScore(selectedBoxes[0], selectedBoxes[1]);
      endOrNextTurn();
    }, 500);
  }
}

function checkScore(b1, b2) {
  const n1 = parseInt(b1.dataset.number);
  const n2 = parseInt(b2.dataset.number);

  const boxResult = document.createElement('div');
  boxResult.className = 'result-box';

  const result1 = n1 % 2 === 0 ? "Even" : "Odd";
  const result2 = n2 % 2 === 0 ? "Even" : "Odd";

  if (result1 === result2) {
    scores[currentPlayer - 1] += 10;
    boxResult.textContent = `Both are ${result1}! +10 points to Player ${currentPlayer}`;
  } else {
    boxResult.textContent = `One is ${result1}, other is ${result2}. 0 points!`;
  }

  resultArea.appendChild(boxResult);
}

function endOrNextTurn() {
  if (round === 3 && currentPlayer === 2) {
    gameOver = true;
    setTimeout(showFinalResult, 500);
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    if (currentPlayer === 1) round++;
    updateDisplay();
    resetBoxes();
    if (window.RoundTimer) window.RoundTimer.reset();
  }
}

function showFinalResult() {
  const finalResult = document.createElement('div');
  finalResult.className = 'result-box final-result';

  if (scores[0] > scores[1]) {
    finalResult.textContent = '🏆 Player 1 Wins!';
    alert("Player 2 → Better Luck Next Time!");
  } else if (scores[1] > scores[0]) {
    finalResult.textContent = '🏆 Player 2 Wins!';
    alert("Player 1 → Better Luck Next Time!");
  } else {
    finalResult.textContent = '🤝 It\'s a Tie!';
  }

  resultArea.appendChild(finalResult);
  boxes.forEach(box => box.style.pointerEvents = 'none');
  restartBtn.style.display = 'inline-block';
}

function restartGame() {
  currentPlayer = 1;
  round = 1;
  scores = [0, 0];
  selectedBoxes = [];
  gameOver = false;
  resultArea.innerHTML = '';
  restartBtn.style.display = 'none';
  updateDisplay();
  resetBoxes();
  if (window.RoundTimer) window.RoundTimer.reset();
}

boxes.forEach(box => {
  box.addEventListener('click', handleBoxClick);
});

restartBtn.addEventListener('click', restartGame);

// ✅ Handle autoSkip event from timer.js
window.addEventListener('autoSkip', () => {
  if (gameOver) return;

  const boxResult = document.createElement('div');
  boxResult.className = 'result-box';
  boxResult.textContent = `⏰ Player ${currentPlayer} skipped! 0 points.`;
  resultArea.appendChild(boxResult);

  selectedBoxes = [];
  endOrNextTurn();
});

resetBoxes();
updateDisplay();
