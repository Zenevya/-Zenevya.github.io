// --- Initialize the Chessboard JS --------------------------------------------------------
var board = Chessboard('myBoard', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: false
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
  
    var pgnFile = fileInput.files[0];
    var reader = new FileReader();
  
    // PGN Loading and Navigation
    reader.onload = function(e) {
      var pgn = e.target.result;
      var game = new Chess();
      game.load_pgn(pgn);
  
      // Get the full move history
      var history = game.history();
      game.reset();
      var i = 0;
  
      // Process and display the PGN moves
      var result = processPgn(pgn);
      $('#pgn5').html(result.cleanText);
  
      // Event listeners for navigation buttons
      $('#nextBtn5').on('click', function() {
        if (i < history.length) {
          game.move(history[i]);
          board.position(game.fen());
          i += 1;
        }
      });
  
      $('#prevBtn5').on('click', function() {
        if (i > 0) {
          game.undo();
          board.position(game.fen());
          i -= 1;
        }
      });
  
      $('#startPositionBtn5').on('click', function() {
        game.reset();
        board.start();
        i = 0;
      });
  
      $('#endPositionBtn5').on('click', function() {
        game.load_pgn(pgn);
        board.position(game.fen());
        i = history.length;
      });
  
      // Load the PGN into the game and update the board
      game.load_pgn(pgn);
      board.position(game.fen());
    };
  
    reader.readAsText(pgnFile);
  });
  
  // Combined function to process PGN: extract header info and clean text
  function processPgn(pgn) {
      console.log("Original PGN:", pgn);
  
      // Extract player names, colors, and Elo ratings from the header
      let event = pgn.match(/\[Event "(.*?)"\]/);
      let white = pgn.match(/\[White "(.*?)"\]/);
      let black = pgn.match(/\[Black "(.*?)"\]/);
      let whiteElo = pgn.match(/\[WhiteElo "(.*?)"\]/);
      let blackElo = pgn.match(/\[BlackElo "(.*?)"\]/);
  
      let headerInfo = {
          event: event ? event[1] : "",
          white: white ? white[1] : "",
          black: black ? black[1] : "",
          whiteElo: whiteElo ? whiteElo[1] : "",
          blackElo: blackElo ? blackElo[1] : ""
      };
      console.log("Header Info:", headerInfo);
  
      // Remove header information
      var cleanText = pgn.replace(/\[.*?\]/g, '');
      console.log("After removing headers:", cleanText);
  
        // Remove comments and annotations (handle multiline)
        cleanText = cleanText.replace(/\{[\s\S]*?\}/g, '');
        console.log("After removing comments:", cleanText);
  
      // Remove move annotations (e.g., $6, $2, $1, etc.)
      cleanText = cleanText.replace(/\$\d+/g, '');
      console.log("After removing move annotations:", cleanText);
  
      // Remove unnecessary whitespace and line breaks
      cleanText = cleanText.replace(/\s+/g, ' ').trim();
      console.log("Final cleaned text:", cleanText);
  
      return { cleanText, headerInfo };
}