const game = (() => {
  const winnerMessage = document.querySelector(".winner-message");
  const restartBtn = document.querySelector(".restart-button");
  const winnerScreen = document.querySelector(".winner-screen");
  const cells = document.querySelectorAll(".cell");
  const aiCheck = document.querySelector(".checkbox");
  const X_CLASS = "x";
  const CIRCLE_CLASS = "circle";
  let againstComp;
  let Gameboard = {
    gameBoard: ["", "", "", "", "", "", "", "", ""],
  };

  const winingCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let circleTurn;
  let i = 0;
  aiCheck.checked = false;
  startGame();
  // Selecting every cell and rendering the game
  function startGame() {
    i = 0;
    circleTurn = false;
    Gameboard.gameBoard = ["", "", "", "", "", "", "", "", ""];
    winnerScreen.classList.remove("show");
    cells.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.removeEventListener("click", playGame);
      cell.addEventListener("click", playGame, { once: true });
      // Giving a uniqe attribute for deciding the winner
      cell.setAttribute("id", i);
      i++;
    });
  }

  function playGame(e) {
    let cell = e.target;
    let playerTurn = circleTurn ? CIRCLE_CLASS : X_CLASS;
    markCell(cell, playerTurn);
    if (againstComp && playerTurn === X_CLASS) {
      aiPlay();
    }
    if (checkWinner(playerTurn)) {
      winnerScreen.classList.add("show");
      if (againstComp) {
        winnerMessage.textContent = `${circleTurn ? "X's" : "O's"} Wins!`;
      } else {
        winnerMessage.textContent = `${circleTurn ? "O's" : "X's"} Wins!`;
      }
    } else if (draw()) {
      winnerScreen.classList.add("show");
      winnerMessage.textContent = "It is a Draw!";
    }
    switchTurn();
  }

  //To place X or O to the cell
  function markCell(cell, playerTurn) {
    cell.classList.add(playerTurn);
    Gameboard.gameBoard.splice(cell.id, 1, playerTurn);
  }

  function switchTurn() {
    circleTurn = !circleTurn;
  }

  function draw() {
    return [...cells].every((cell) => {
      return (
        cell.classList.contains(CIRCLE_CLASS) ||
        cell.classList.contains(X_CLASS)
      );
    });
  }

  function checkWinner(playerTurn) {
    return winingCombinations.some((combination) => {
      return combination.every((key) => {
        return Gameboard.gameBoard[key] === playerTurn;
      });
    });
  }

  restartBtn.addEventListener("click", startGame);
  aiCheck.addEventListener("change", (e) => {
    if (e.target.checked) {
      againstComp = true;
    } else {
      againstComp = false;
    }
  });

  function aiPlay() {
    let random = randomNumber(0, 9);
    let cell = cells[random];
    if (draw()) {
      winnerScreen.classList.add("show");
      winnerMessage.textContent = "It is a Draw!";
    } else if (
      cell.classList.contains(CIRCLE_CLASS) ||
      cell.classList.contains(X_CLASS)
    ) {
      aiPlay();
    } else {
      cell.classList.add(CIRCLE_CLASS);
      Gameboard.gameBoard.splice(cell.id, 1, CIRCLE_CLASS);
      cell.removeEventListener("click", playGame);
      if (checkWinner(CIRCLE_CLASS)) {
        winnerScreen.classList.add("show");
        winnerMessage.textContent = `${circleTurn ? "X's" : "O's"} Wins!`;
      }
      switchTurn();
    }
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
})();
