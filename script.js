var config = {
    position: 'start',
    draggable: true
  }
  
  
var board1 = ChessBoard('board1', config);

setTimeout(function() {
    var board1 = new ChessBoard('board1', 'start');
}, 0);