var origBoard;
var difficulty = "impossible";
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombinations = [
                   [0, 1, 2],
                   [3, 4, 5],
                   [6, 7, 8],
                   [0, 3, 6],
                   [1, 4, 7],
                   [2, 5, 8],
                   [0, 4, 8],
                   [6, 4, 2]
                   ]

const cells = document.querySelectorAll('.cell');

//these two functions are to set the difficulty level
function easyMode(){
    difficulty = "easy";
    console.log(difficulty);
}

function impossibleMode(){
    difficulty = "impossible";
    console.log(difficulty);
}

startGame();

//start game function
function startGame() {
    document.querySelector(".endgame").style.display = "none";
    document.querySelector('.table-hover').style.setProperty('background-color', '!important')
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

//calls turn function on square that has been clicked
function turnClick(square) {
    if(typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, humanPlayer)
        if(!checkTie()) turn(bestSpot(), aiPlayer);
    }
}

//sets the innertext of the square to the X or O depending on the player
function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

//checks to see if there is a winning combination present on board and returns if game is won
function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
                             (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

//sets color of winning combination and calls declare winner function
function gameOver(gameWon) {
    document.querySelector('.table-hover').style.setProperty('background-color', '')
    for (let index of winCombinations[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
        gameWon.player == humanPlayer ? "dodgerblue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You Lose!")
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

//checks the difficulty and will return square index
function bestSpot(){
    if(difficulty == "easy"){
        return randomSpot(origBoard, aiPlayer);
    }
    else{
        return miniMax(origBoard, aiPlayer).index;
    }
}

//checking to see if human player won game if not return a random empty square
function randomSpot(board, player){
    var squareArry = emptySquares();
    if(checkWin(board, humanPlayer)){
        return null;
    }
    else{
        return squareArry[Math.floor(Math.random() * squareArry.length)];
    }
}

//checks if game is tied
function checkTie(){
    if(emptySquares().length == 0){
        for(var i = 0; i < cells.length;i++){
            cells[i].style.backgroundColor = "lightgreen";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

//opens modal and shows winner
function declareWinner(who){
    $('#exampleModal').modal('show');
    $('#exampleModal').find('.modal-body').text(who);
}

//minimax algorithmn
function miniMax(newBoard, player) {
    var availSpots = emptySquares();
    
    if (checkWin(newBoard, humanPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;
        
        if (player == aiPlayer) {
            var result = miniMax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            var result = miniMax(newBoard, aiPlayer);
            move.score = result.score;
        }
        
        newBoard[availSpots[i]] = move.index;
        
        moves.push(move);
    }
    
    var bestMove;
    if(player === aiPlayer) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    
    return moves[bestMove];
}
