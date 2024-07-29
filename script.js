// --- Initialize the Chessboard JS --------------------------------------------------------
var board = Chessboard('myBoard', {
draggable: true,
dropOffBoard: 'trash',
sparePieces: true
});

$('#startBtn').on('click', board.start);
$('#clearBtn').on('click', board.clear);


// --- Uploading the PGN file ----
/* When button with ID loadPgnBtn is clicked, it triggers a click event 
on the hidden file input (pgnUpload). */
document.getElementById('loadPgnBtn').addEventListener('click', function() {
document.getElementById('pgnUpload').click();
});

document.getElementById('pgnUpload').addEventListener('change', function() {
var fileInput = document.getElementById('pgnUpload');
if (fileInput.files.length === 0) {
    alert('Please select a PGN file to upload.');
    return;
}

var file = fileInput.files[0];
var reader = new FileReader();

reader.onload = function(e) {
    var pgn = e.target.result;
    var chess = new Chess();
    if (chess.load_pgn(pgn)) {
    var moves = chess.history({ verbose: true });
    board.position(chess.fen());

    // Optionally, you can use a loop to animate the moves if needed
    console.log('PGN loaded successfully');
    } else {
    alert('Invalid PGN file.');
    }
};

reader.readAsText(file);
});


// --- PGN Viewer, functions from pgn-parser.js -------------------------------------------
// Your existing dummy data here
pgnData = [
];

// Write the game to the DOM
function writeGameText(g) {
  // Extract Header Information
  var h = g.header();
  var gameHeaderText = '<h4>' + h.White + ' (' + h.WhiteElo + ') - ' + h.Black + ' (' + h.BlackElo + ')</h4>';
  gameHeaderText += '<h5>' + h.Event + ', ' + h.Site + ' ' + h.EventDate + '</h5>';
  
  // Extract and Format Moves
  var pgn = g.pgn();
  var gameMoves = pgn.replace(/\[(.*?)\]/gm, '').replace(h.Result, '').trim();

  // Format Moves Individually
  moveArray = gameMoves.split(/([0-9]+\.\s)/).filter(function(n) {return n;});
  for (var i = 0, l = moveArray.length; i < l; ++i) {
    var s = $.trim(moveArray[i]);
    if (!/^[0-9]+\.$/.test(s)) { //move numbers
      m = s.split(/\s+/);
      for (var j = 0, ll = m.length; j < ll; ++j) {
        m[j] = '<span class="gameMove' + (i + j - 1) + '"><a id="myLink" href="#" onclick="goToMove(' + (i + j - 1) + ');return false;">' + m[j] + '</a></span>';
      }
      s = m.join(' ');
    }
    moveArray[i] = s;
  }
  $("#game-data").html(gameHeaderText + '<div class="gameMoves">' + moveArray.join(' ') + ' <span class="gameResult">' + h.Result + '</span></div>');
}

// Buttons
$('#btnStart').on('click', function() {
game.reset();
currentPly = -1;
board.position(game.fen());
});
$('#btnPrevious').on('click', function() {
if (currentPly >= 0) {
    game.undo();
    currentPly--;
    board.position(game.fen());
}
});
$('#btnNext').on('click', function() {
if (currentPly < gameHistory.length - 1) {
    currentPly++;
    game.move(gameHistory[currentPly].san);
    board.position(game.fen());
}
});
$('#btnEnd').on('click', function() {
while (currentPly < gameHistory.length - 1) {
    currentPly++;
    game.move(gameHistory[currentPly].san);
}
board.position(game.fen());
});

// Key bindings
$(document).ready(function(){
$(document).keydown(function(e){
    if (e.keyCode == 39) { //right arrow
    if (e.ctrlKey) {
        $('#btnEnd').click();
    } else {
        $('#btnNext').click();
    }
    return false;
    }
});

$(document).keydown(function(e){
    if (e.keyCode == 37) { //left arrow
    if (e.ctrlKey) {
        $('#btnStart').click();
    } else {
        $('#btnPrevious').click();
    }
    }
    return false;
});

$(document).keydown(function(e){
    if (e.keyCode == 38) { //up arrow
    if (currentGame > 0) {
        if (e.ctrlKey) {
        loadGame(0);
        } else {
        loadGame(currentGame - 1);
        }
    }
    $('#gameSelect').val(currentGame);
    }
    return false;
});

$(document).keydown(function(e){
    if (e.keyCode == 40) { //down arrow
    if (currentGame < pgnData.length - 1) {
        if (e.ctrlKey) {
        loadGame(pgnData.length - 1);
        } else {
        loadGame(currentGame + 1);
        }
    }
    $('#gameSelect').val(currentGame);
    }
    return false;
});
});

// Used for clickable moves in game text
function goToMove(ply) {
if (ply > gameHistory.length - 1) ply = gameHistory.length - 1;
game.reset();
for (var i = 0; i <= ply; i++) {
    game.move(gameHistory[i].san);
}
currentPly = i - 1;
board.position(game.fen());
}

var onChange = function onChange() { // Fires when the board position changes
// Highlight the current move
$("[class^='gameMove']").removeClass('highlight');
$('.gameMove' + currentPly).addClass('highlight');
}

function loadGame(i) {
game = new Chess();
game.load_pgn(pgnData[i].join('\n'), {newline_char:'\n'});
writeGameText(game);
gameHistory = game.history({verbose: true});
goToMove(-1);
currentGame = i;
}

// Start doing stuff
var board, // The chessboard
    game, // The current game
    games, // Array of all loaded games
    gameHistory,
    currentPly,
    currentGame;

// Only need the headers here, issue raised on GitHub
// Read all the games to populate the select
for (var i = 0; i < pgnData.length; i++) {
var g = new Chess();
g.load_pgn(pgnData[i].join('\n'), {newline_char:'\n'});
var h = g.header();
$('#gameSelect')
    .append($('<option></option>')
    .attr('value', i)
    .text(h.White + ' - ' + h.Black + ', ' + h.Event + ' ' + h.Site + ' ' + h.Date));
}

// Set up the board
var cfg = {
pieceTheme: '/chessboardjs/img/chesspieces/wikipedia/{piece}.png',
position: 'start',
showNotation: false,
onChange: onChange
};
board = new ChessBoard('board', cfg);
$(window).resize(board.resize);

// Load the first game
loadGame(0);