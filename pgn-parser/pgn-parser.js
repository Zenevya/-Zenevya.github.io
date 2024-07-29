//dummy data
pgnData = [
    [
      '[Event "Euro Club Cup"]',
      '[Site "Kallithea GRE"]',
      '[Date "2008.10.18"]',
      '[EventDate "2008.10.17"]',
      '[Round "2"]',
      '[Result "1-0"]',
      '[White "Simon Ansell"]',
      '[Black "J Garcia-Ortega Mendez"]',
      '[ECO "B27"]',
      '[WhiteElo "2410"]',
      '[BlackElo "2223"]',
      '[PlyCount "29"]',
      '',
      '1. e4 c5 2. Nf3 g6 3. d4 cxd4 4. Qxd4 Nf6 5. e5 Nc6 6. Qa4 Nd5 7. Qe4 Ndb4 8. Bb5 Qa5 9. Nc3 d5 10. exd6 Bf5 11. d7+ Kd8 12. Qc4 Nxc2+ 13. Ke2 Nxa1 14. Rd1 Be6 15. Qxe6 1-0'
    ],
    [
      '[Event "GM"]',
      '[Site "Biel SUI"]',
      '[Date "2002.07.30"]',
      '[Round "8"]',
      '[White "Smirin,I"]',
      '[Black "Korchnoi,V"]',
      '[Result "1/2-1/2"]',
      '[WhiteElo "2676"]',
      '[BlackElo "2626"]',
      '[EventDate "2002.07.22"]',
      '[ECO "C09"]',
      '',
      '1. e4 e6 2. d4 d5 3. Nd2 c5 4. Ngf3 Nc6 5. exd5 exd5 6. Bb5 Qe7+ 7. Qe2',
      'cxd4 8. Nxd4 Qxe2+ 9. Kxe2 Bd7 10. N2b3 Nxd4+ 11. Nxd4 Bc5 12. Be3 Bxb5+',
      '13. Nxb5 Bxe3 14. Kxe3 Kd7 15. Rhd1 Nf6 16. f3 Rhe8+ 17. Kf2 a6 18. Nd4 Re5',
      '19. Rd3 Rae8 20. Rad1 Kc7 21. Rc3+ Kb8 22. Rb3 Rc8 23. g4 Nd7 24. Re3 f6',
      '25. f4 Rxe3 26. Kxe3 Nb6 27. b3 g6 28. Kf3 Kc7 29. Re1 Kd7 30. Re3 Na8 31.',
      'Kf2 Nc7 32. a4 Re8 33. Rh3 Re7 34. f5 Kd6 35. c3 b5 36. a5 b4 37. Re3 bxc3',
      '38. Rxe7 Kxe7 39. Ke3 gxf5 40. gxf5 Kd6 41. Kd3 Ke5 1/2-1/2'
    ]
  ];
  
  //Write the game to the DOM
  function writeGameText(g) {
  
    //remove the header to get the moves
    var h = g.header();
    var gameHeaderText = '<h4>' + h.White + ' (' + h.WhiteElo + ') - ' + h.Black + ' (' + h.BlackElo + ')</h4>';
    gameHeaderText += '<h5>' + h.Event + ', ' + h.Site + ' ' + h.EventDate + '</h5>';
    var pgn = g.pgn();
    var gameMoves = pgn.replace(/\[(.*?)\]/gm, '').replace(h.Result, '').trim();
  
    //format the moves so each one is individually identified, so it can be highlighted
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
  
  //buttons
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
  
  //key bindings
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
  
  //used for clickable moves in gametext
  //not used for buttons for efficiency
  function goToMove(ply) {
    if (ply > gameHistory.length - 1) ply = gameHistory.length - 1;
    game.reset();
    for (var i = 0; i <= ply; i++) {
      game.move(gameHistory[i].san);
    }
    currentPly = i - 1;
    board.position(game.fen());
  }
  
  var onChange = function onChange() { //fires when the board position changes
    //highlight the current move
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
  
  //start doing stuff
  var board, //the chessboard
      game, //the current  game
      games, //array of all loaded games
      gameHistory,
      currentPly,
      currentGame;
  
  //only need the headers here, issue raised on github
  //read all the games to populate the select
  for (var i = 0; i < pgnData.length; i++) {
    var g = new Chess();
    g.load_pgn(pgnData[i].join('\n'), {newline_char:'\n'});
    var h = g.header();
    $('#gameSelect')
       .append($('<option></option>')
       .attr('value', i)
       .text(h.White + ' - ' + h.Black + ', ' + h.Event + ' ' + h.Site + ' ' + h.Date));
  }
  
  //set up the board
  var cfg = {
    pieceTheme: '/chessboardjs/img/chesspieces/wikipedia/{piece}.png',
    position: 'start',
    showNotation: false,
    onChange: onChange
  };
  board = new ChessBoard('board', cfg);
  $(window).resize(board.resize);
  
  //load the first game
  loadGame(0);