// --- Initialize the Chessboard JS --------------------------------------------------------
var board = Chessboard('myBoard', {
  draggable: true,
  dropOffBoard: 'trash',
  sparePieces: false,
  onDrop: onDrop
});

$('#startBtn').on('click', board.start);
$('#clearBtn').on('click', board.clear);

const pieceImageMap = {
  'P': 'wP.png',
  'R': 'wR.png',
  'N': 'wN.png',
  'B': 'wB.png',
  'Q': 'wQ.png',
  'K': 'wK.png',
  'p': 'bP.png',
  'r': 'bR.png',
  'n': 'bN.png',
  'b': 'bB.png',
  'q': 'bQ.png',
  'k': 'bK.png'
};

// Function to update the image and show dialogue box when a move is made
function updatePieceImage(pieceData) {
  const piece = pieceData.piece;
  const color = pieceData.color;

  // Determine correct piece key based on color
  const pieceKey = color === 'w' ? piece.toUpperCase() : piece.toLowerCase();
  console.log("Piece Data:", piece); // Log the piece data to debug

  if (pieceImageMap[pieceKey]) {
    const imagePath = `./chessboardjs-1.0.0/img/chesspieces/wikipedia/${pieceImageMap[pieceKey]}`;
    document.getElementById('pieceImage').src = imagePath;
    document.getElementById('pieceImage').style.display = 'block';
  } else {
    document.getElementById('pieceImage').style.display = 'none';
  }
}

// Function for handling piece drop (this will no longer update the piece image)
function onDrop(source, target, piece) {
  // Handle piece drop on the board without updating the piece image
  // You can add other functionality here if needed
}

// --- Uploading the PGN file ----
document.getElementById('loadPgnBtn').addEventListener('click', function() {
  document.getElementById('pgnUpload').click();
});

document.getElementById('pgnUpload').addEventListener('change', function() {
  var fileInput = document.getElementById('pgnUpload');
  if (fileInput.files.length === 0) {
    alert('Please select a PGN file to upload.');
    return;
  }

  var pgnFile = fileInput.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
    var pgn = e.target.result;
    var game = new Chess();
    game.load_pgn(pgn);

    // Extract and display header information
    var headerInfo = extractHeader(pgn);
    displayHeaderInfo(headerInfo);

    // Get the full move history with detailed info (including piece type)
    var history = game.history({ verbose: true });
    game.reset();
    var i = 0;

    // Function to format the history into a readable text format
    function formatHistory(history) {
      var formattedText = '';
      for (var j = 0; j < history.length; j += 2) {
        var moveNumber = (j / 2) + 1;
        var whiteMove = history[j];
        var blackMove = history[j + 1] || '';
        formattedText += `${moveNumber}. ${whiteMove.san} ${blackMove.san || ''} `;
      }
      return formattedText.trim();
    }

    // Display the formatted history
    var formattedHistory = formatHistory(history);
    document.getElementById('formattedHistory').innerHTML = formattedHistory;

    // Function to highlight the current move and update the piece image
    function highlightMove(index) {
      $('#pgn5 span').removeClass('highlight');
      $('#move-' + index).addClass('highlight');
      if (history[index]) {
        updatePieceImage(history[index]);
      }
    }

    // Event listeners for navigation buttons
    $('#nextBtn5').on('click', function() {
      if (i < history.length) {
        game.move(history[i].san);
        board.position(game.fen());
        highlightMove(i);
        i += 1;
      }
    });

    $('#prevBtn5').on('click', function() {
      if (i > 0) {
        i -= 1;
        game.undo();
        board.position(game.fen());
        highlightMove(i);
      }
    });

    $('#startPositionBtn5').on('click', function() {
      game.reset();
      board.start();
      i = 0;
      highlightMove(i);
    });

    $('#endPositionBtn5').on('click', function() {
      game.load_pgn(pgn);
      board.position(game.fen());
      i = history.length;
      highlightMove(i - 1);
    });

    // Load the PGN into the game and update the board
    game.load_pgn(pgn);
    board.position(game.fen());

    // Display the starting position
    $('#startPositionBtn5').click();
  };

  reader.readAsText(pgnFile);
});

// Function to extract header information from PGN
function extractHeader(pgn) {
  // Extract player names, event, and Elo ratings from the header
  let event = pgn.match(/\[Event "(.*?)"\]/);
  let white = pgn.match(/\[White "(.*?)"\]/);
  let black = pgn.match(/\[Black "(.*?)"\]/);
  let whiteElo = pgn.match(/\[WhiteElo "(.*?)"\]/);
  let blackElo = pgn.match(/\[BlackElo "(.*?)"\]/);
  let date = pgn.match(/\[Date "(.*?)"\]/);

  // Create an object to store the extracted header information
  let headerInfo = {
    event: event ? event[1] : "",
    white: white ? white[1] : "",
    black: black ? black[1] : "",
    whiteElo: whiteElo ? whiteElo[1] : "",
    blackElo: blackElo ? blackElo[1] : "",
    date: date ? date[1] : ""
  };

  console.log("Header Info:", headerInfo);
  return headerInfo; // Return only the header information
}

// Function to display header information in the UI
function displayHeaderInfo(headerInfo) {
  $('#whiteInfo').text(`${headerInfo.white} (Elo: ${headerInfo.whiteElo})`);
  $('#blackInfo').text(`${headerInfo.black} (Elo: ${headerInfo.blackElo})`);
  $('#dateInfo').text(headerInfo.date);
}
