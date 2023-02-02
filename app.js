const refreshBtn = document.querySelector(".refreshBtn");
const backdrop = document.querySelector(".backdrop");
const cancelBtn = document.querySelector(".cancelBtn");
const confirmBtn = document.querySelector(".confirmBtn");
const nextRoundBtn = document.querySelector(".nextRoundBtn");
const refreshModal = document.querySelector(".refreshModal");
const outcomeModal = document.querySelector(".outcomeModal");
const winnerLogo = document.querySelector(".winnerLogo");
const winHeading = document.querySelector(".winHeading");
const tieHeading = document.querySelector(".tieHeading");
const squares = document.querySelectorAll(".square");
const oTurnIcon = document.querySelector(".oTurn");
const xTurnIcon = document.querySelector(".xTurn");
const quitBtn = document.querySelector(".quitBtn");
const oScore = document.querySelector(".oScoreNum");
const xScore = document.querySelector(".xScoreNum");
const tieScore = document.querySelector(".tieScoreNum");
let xTurn = true;
let xStartRound = true;
let isTie = false;
let isGameOver = false;
let previousVal;

let state = [
  ["-", "-", "-"],
  ["-", "-", "-"],
  ["-", "-", "-"],
];

const updateState = (ID, player) => {
  let sqrRow = parseInt(ID.slice(1, 2));
  let sqrCol = parseInt(ID.slice(4, ID.length));
  state[sqrRow - 1][sqrCol - 1] = player;
};

const checkWinner = () => {
  checkRowOrColWinner(state);

  let stateFlipped = [
    [state[2][0], state[1][0], state[0][0]],
    [state[2][1], state[1][1], state[0][1]],
    [state[2][2], state[1][2], state[0][2]],
  ];
  checkRowOrColWinner(stateFlipped);
  if (state[1][1] !== "-") {
    if (
      (state[0][0] === state[1][1] && state[1][1] === state[2][2]) ||
      (state[2][0] === state[1][1] && state[1][1] === state[0][2])
    ) {
      isGameOver = true;
      openOutcomeModal();
    }
  }
  let tieCounter = 0;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains("takenSlot") && !isGameOver) {
      tieCounter++;
    }
    if (tieCounter === 9) {
      isTie = true;
      isGameOver = true;
      openOutcomeModal();
    }
  }
};

const checkRowOrColWinner = (arr) => {
  for (let j = 0; j < arr.length; j++) {
    if (!isGameOver) {
      for (let i = 0; i < arr[j].length; i++) {
        if (arr[j][i] !== "-") {
          if (i === 0) {
            previousVal = arr[j][i];
          } else {
            previousVal = arr[j][i - 1];
          }

          if (arr[j][i] !== previousVal) {
            break;
          } else if (arr[j][i] === previousVal) {
            document
              .getElementById(`r${j + 1}-c${i + 1}`)
              .classList.add("winElem");

            if (i === arr[j].length - 1) {
              isGameOver = true;
              openOutcomeModal();
            }
          }
        }
      }
    }
  }
};

const openOutcomeModal = () => {
  if (!isTie) {
    if (!xTurn) {
      winHeading.classList.add("show");
      winnerLogo.children[0].classList.add("show");
      xScore.innerText = parseInt(xScore.innerText) + 1;
    } else {
      winHeading.classList.add("show");
      winnerLogo.children[1].classList.add("show");
      oScore.innerText = parseInt(oScore.innerText) + 1;
    }
  } else {
    tieHeading.classList.add("show");
    tieScore.innerText = parseInt(tieScore.innerText) + 1;
    isTie = false;
  }

  backdrop.classList.add("show");
  outcomeModal.classList.add("show");
};

const annuleScores = () => {
  xScore.innerText = "0";
  oScore.innerText = "0";
  tieScore.innerText = "0";
};

const clearSquares = () => {
  for (let sqr of squares) {
    sqr.classList.remove("takenSlot");
    sqr.classList.remove("xSlot");
    sqr.classList.remove("oSlot");
  }
  backdrop.classList.remove("show");
  outcomeModal.classList.remove("show");
  refreshModal.classList.remove("show");
  winHeading.classList.remove("show");
  tieHeading.classList.remove("show");
  winnerLogo.children[0].classList.remove("show");
  winnerLogo.children[1].classList.remove("show");
  state = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];
  isGameOver = false;
  if (xStartRound) {
    xTurnIcon.classList.remove("show");
    oTurnIcon.classList.add("show");
    xTurn = false;
  } else {
    xTurnIcon.classList.add("show");
    oTurnIcon.classList.remove("show");
    xTurn = true;
  }
  xStartRound = !xStartRound;
};

window.addEventListener("click", (e) => {
  if ((e.target === backdrop && !isGameOver) || e.target === cancelBtn) {
    backdrop.classList.remove("show");
    refreshModal.classList.remove("show");
  } else if (e.target === confirmBtn || e.target === quitBtn) {
    clearSquares();
    annuleScores();
  } else if (
    e.target === nextRoundBtn ||
    (e.target === backdrop && isGameOver)
  ) {
    clearSquares();
  }
});

refreshBtn.addEventListener('click', (e) => { 
    backdrop.classList.add("show");
    refreshModal.classList.add("show");
})

xTurnIcon.classList.add("show");

for (let sqr of squares) {
  sqr.addEventListener("click", (e) => {
    if (!sqr.classList.contains("takenSlot")) {
      if (xTurn) {
        sqr.classList.add("xSlot");
        sqr.classList.add("takenSlot");
        xTurnIcon.classList.remove("show");
        oTurnIcon.classList.add("show");
        updateState(sqr.id, "X");
        xTurn = false;
      } else {
        sqr.classList.add("oSlot");
        sqr.classList.add("takenSlot");
        oTurnIcon.classList.remove("show");
        xTurnIcon.classList.add("show");
        updateState(sqr.id, "O");
        xTurn = true;
      }
      checkWinner();
    }
  });
}
