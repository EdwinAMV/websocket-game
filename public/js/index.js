const socket = io();

// DOM Elements
const openCreateRoomBox = document.getElementById("open-create-room-box");
const openJoinRoomBox = document.getElementById("open-join-room-box");
const createRoomBox = document.getElementById("create-room-box");
const roomIdInput = document.getElementById("room-id");
const cancelCreateActionBtn = document.getElementById("cancel-create-action");
const gameplayChoices = document.getElementById("gameplay-choices");
const createRoomBtn = document.getElementById("create-room-btn");
const gameplayScreen = document.querySelector(".gameplay-screen");
const startScreen = document.querySelector(".start-screen");
const cancelJoinActionBtn = document.getElementById("cancel-join-action");
const joinBoxRoom = document.getElementById("join-room-box");
const joinRoomBtn = document.getElementById("join-room-btn");
const joinRoomInput = document.getElementById("join-room-input");
const joinRandomBtn = document.getElementById("join-random");
const errorMessage = document.getElementById("error-message");
const playerOne = document.getElementById("player-1");
const playerTwo = document.getElementById("player-2");
const waitMessage = document.getElementById("wait-message");
const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissor = document.getElementById("scissor");
const lizard = document.getElementById("lizard");
const spock = document.getElementById("spock");
const myScore = document.getElementById('my-score');
const enemyScore = document.getElementById('enemy-score');
const playerOneTag = document.getElementById("player-1-tag");
const playerTwoTag = document.getElementById("player-2-tag");
const winMessage = document.getElementById("win-message");
const exitGameBtn = document.getElementById("exit-game");

// Game variables
let canChoose = false;
let playerOneConnected = false;
let playerTwoIsConnected = false;
let playerId = 0;
let myChoice = "";
let enemyChoice = "";
let roomId = "";
let myScorePoints = 0;
let enemyScorePoints = 0;

// Función para recargar la página
function reloadPage() {
    location.reload();
}

// Agregar event listener al botón de salida
exitGameBtn.addEventListener("click", reloadPage);

openCreateRoomBox.addEventListener("click", function() {
    gameplayChoices.style.display = "none";
    createRoomBox.style.display = "block";
});

cancelCreateActionBtn.addEventListener("click", function() {
    gameplayChoices.style.display = "block";
    createRoomBox.style.display = "none";
});

createRoomBtn.addEventListener("click", function() {
    let id = roomIdInput.value;

    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";

    socket.emit("create-room", id);
});

openJoinRoomBox.addEventListener("click", function() {
    gameplayChoices.style.display = "none";
    joinBoxRoom.style.display = "block";
});

cancelJoinActionBtn.addEventListener("click", function() {
    gameplayChoices.style.display = "block";
    joinBoxRoom.style.display = "none";
});

joinRoomBtn.addEventListener("click", function() {
    let id = joinRoomInput.value;

    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";

    socket.emit("join-room", id);
});

joinRandomBtn.addEventListener("click", function() {
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
    socket.emit("join-random");
});

rock.addEventListener("click", function() {
    if (canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected) {
        removeMyChoiceClass();
        myChoice = "rock";
        choose(myChoice);
        socket.emit("make-move", { playerId, myChoice, roomId });
    }
});

paper.addEventListener("click", function() {
    if (canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected) {
        removeMyChoiceClass();
        myChoice = "paper";
        choose(myChoice);
        socket.emit("make-move", { playerId, myChoice, roomId });
    }
});

scissor.addEventListener("click", function() {
    if (canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected) {
        removeMyChoiceClass();
        myChoice = "scissor";
        choose(myChoice);
        socket.emit("make-move", { playerId, myChoice, roomId });
    }
});

lizard.addEventListener("click", function() {
    if (canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected) {
        removeMyChoiceClass();
        myChoice = "lizard";
        choose(myChoice);
        socket.emit("make-move", { playerId, myChoice, roomId });
    }
});

spock.addEventListener("click", function() {
    if (canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected) {
        removeMyChoiceClass();
        myChoice = "spock";
        choose(myChoice);
        socket.emit("make-move", { playerId, myChoice, roomId });
    }
});

// Función para eliminar la clase my-choice de todos los botones
function removeMyChoiceClass() {
    rock.classList.remove("my-choice");
    paper.classList.remove("my-choice");
    scissor.classList.remove("my-choice");
    lizard.classList.remove("my-choice");
    spock.classList.remove("my-choice");
}

// Socket
socket.on("display-error", error => {
    errorMessage.style.display = "block";
    let p = document.createElement("p");
    p.innerHTML = error;
    errorMessage.appendChild(p);
});

socket.on("room-created", id => {
    playerId = 1;
    roomId = id;

    setPlayerTag(1);
    updateRoomName(id);

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
});

socket.on("room-joined", id => {
    playerId = 2;
    roomId = id;

    playerOneConnected = true;
    playerJoinTheGame(1);
    setPlayerTag(2);
    updateRoomName(id);
    setWaitMessage(false);

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
});

socket.on("player-1-connected", () => {
    playerJoinTheGame(1);
    playerOneConnected = true;
});

socket.on("player-2-connected", () => {
    playerJoinTheGame(2);
    playerTwoIsConnected = true;
    canChoose = true;
    setWaitMessage(false);
});

socket.on("player-1-disconnected", () => {
    reset();
});

socket.on("player-2-disconnected", () => {
    canChoose = false;
    playerTwoLeftTheGame();
    setWaitMessage(true);
    enemyScorePoints = 0;
    myScorePoints = 0;
    displayScore();
});

socket.on("draw", message => {
    setWinningMessage(message);
    addEnemyChoiceClass(enemyChoice);
});

socket.on("player-1-wins", ({ myChoice, enemyChoice }) => {
    if (playerId === 1) {
        let message = "So you win!";
        setWinningMessage(message);
        myScorePoints++;
    } else {
        let message = "So you lose!";
        setWinningMessage(message);
        enemyScorePoints++;
        addEnemyChoiceClass(enemyChoice);
    }

    displayScore();
});

socket.on("player-2-wins", ({ myChoice, enemyChoice }) => {
    if (playerId === 2) {
        let message = "So you win!";
        setWinningMessage(message);
        myScorePoints++;
    } else {
        let message = "So you lose!";
        setWinningMessage(message);
        enemyScorePoints++;
        addEnemyChoiceClass(enemyChoice);
    }

    displayScore();
});

// Función para agregar la clase al botón del movimiento del oponente
function addEnemyChoiceClass(choice) {
    switch (choice) {
        case "rock":
            rock.classList.add("enemy-choice");
            break;
        case "paper":
            paper.classList.add("enemy-choice");
            break;
        case "scissor":
            scissor.classList.add("enemy-choice");
            break;
        case "lizard":
            lizard.classList.add("enemy-choice");
            break;
        case "spock":
            spock.classList.add("enemy-choice");
            break;
        default:
            break;
    }
}

// Función para eliminar la clase enemy-choice
function removeEnemyChoiceClass() {
    rock.classList.remove("enemy-choice");
    paper.classList.remove("enemy-choice");
    scissor.classList.remove("enemy-choice");
    lizard.classList.remove("enemy-choice");
    spock.classList.remove("enemy-choice");
}

// Functions
function setPlayerTag(playerId) {
    if (playerId === 1) {
        playerOneTag.innerText = "You (Player 1)";
        playerTwoTag.innerText = "Enemy (Player 2)";
    } else {
        playerOneTag.innerText = "Enemy (Player 1)";
        playerTwoTag.innerText = "You (Player 2)";
    }
}

function playerJoinTheGame(playerId) {
    if (playerId === 1) {
        playerOne.classList.add("connected");
    } else {
        playerTwo.classList.add("connected");
    }
}

function setWaitMessage(display) {
    if (display) {
        let p = document.createElement("p");
        p.innerText = "Waiting for another player to join...";
        waitMessage.appendChild(p);
    } else {
        waitMessage.innerHTML = "";
    }
}

function reset() {
    canChoose = false;
    playerOneConnected = false;
    playerTwoIsConnected = false;
    startScreen.style.display = "block";
    gameplayChoices.style.display = "block";
    gameplayScreen.style.display = "none";
    joinBoxRoom.style.display = "none";
    createRoomBox.style.display = "none";
    playerTwo.classList.remove("connected");
    playerOne.classList.remove("connected");
    myScorePoints = 0;
    enemyScorePoints = 0;
    displayScore();
    setWaitMessage(true);
}

function playerTwoLeftTheGame() {
    playerTwoIsConnected = false;
    playerTwo.classList.remove("connected");
}

function displayScore() {
    myScore.innerText = myScorePoints;
    enemyScore.innerText = enemyScorePoints;
}

function choose(choice) {
    if (choice === "rock") {
        rock.classList.add("my-choice");
    } else if (choice === "paper") {
        paper.classList.add("my-choice");
    } else if (choice === "scissor") {
        scissor.classList.add("my-choice");
    } else if (choice === "lizard") {
        lizard.classList.add("my-choice");
    } else {
        spock.classList.add("my-choice");
    }

    canChoose = false;
}

function removeChoice(choice) {
    if (choice === "rock") {
        rock.classList.remove("my-choice");
    } else if (choice === "paper") {
        paper.classList.remove("my-choice");
    } else if (choice === "scissor") {
        scissor.classList.remove("my-choice");
    } else if (choice === "lizard") {
        lizard.classList.remove("my-choice");
    } else {
        spock.classList.remove("my-choice");
    }

    canChoose = true;
    myChoice = "";
}

function setWinningMessage(message) {
    let p = document.createElement("p");
    p.innerText = message;

    winMessage.appendChild(p);

    setTimeout(() => {
        removeChoice(myChoice);
        winMessage.innerHTML = "";
        removeEnemyChoiceClass(); // Elimina la clase enemy-choice después del tiempo especificado
    }, 2500);
}

function updateRoomName(id) {
    const roomNameElement = document.getElementById("room-name");
    roomNameElement.textContent = `Room ID: ${id}`;
}