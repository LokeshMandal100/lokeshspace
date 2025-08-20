(function () {
  const roundEl = document.getElementById("round");
  const playerEl = document.getElementById("player");
  const restartBtn = document.getElementById("restart-btn");

  if (!roundEl || !playerEl) return;

  let timeLeft = 10;
  let timerId = null;

  function parseCurrentPlayer() {
    const text = playerEl.textContent || "";
    const match = text.match(/Current\s*Player:\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 1;
  }

  function setCurrentPlayer(num) {
    playerEl.textContent = `Current Player: ${num}`;
    const evt = new CustomEvent("turnSwitched", { detail: { currentPlayer: num } });
    window.dispatchEvent(evt);
  }

  function otherPlayer(num) {
    return num === 1 ? 2 : 1;
  }

  function getRoundLabelBase() {
    const text = roundEl.getAttribute("data-base-round-text") || roundEl.textContent || "";
    if (!roundEl.getAttribute("data-base-round-text")) {
      roundEl.setAttribute("data-base-round-text", text.replace(/\|\s*Time Left:.*$/, "").trim());
      return roundEl.getAttribute("data-base-round-text");
    }
    return roundEl.getAttribute("data-base-round-text");
  }

  function updateRoundTime() {
    const base = getRoundLabelBase();
    roundEl.textContent = `${base} | Time Left: ${timeLeft}s`;
  }

  function clearExistingTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function isGameOver() {
    if (restartBtn && getComputedStyle(restartBtn).display !== "none") return true;
    const result = document.getElementById("result-area");
    if (result && /winner|won|draw|tie/i.test(result.textContent || "")) return true;
    return false;
  }

  function skipTurn() {
    const current = parseCurrentPlayer();

    // Trigger artificial "2 clicks done with 0 score"
    const evt = new CustomEvent("autoSkip", { detail: { player: current } });
    window.dispatchEvent(evt);

    // Next player ka turn set karo
    const next = otherPlayer(current);
    setCurrentPlayer(next);

    // Fir timer restart
    startTurnTimer();
  }

  function startTurnTimer() {
    clearExistingTimer();
    timeLeft = 10;
    updateRoundTime();
    timerId = setInterval(() => {
      if (isGameOver()) {
        clearExistingTimer();
        roundEl.textContent = getRoundLabelBase();
        return;
      }

      timeLeft -= 1;
      updateRoundTime();

      if (timeLeft <= 0) {
        clearExistingTimer();
        skipTurn();
      }
    }, 1000);
  }

  window.RoundTimer = {
    reset: startTurnTimer,
    stop: clearExistingTimer
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startTurnTimer);
  } else {
    startTurnTimer();
  }
})();
