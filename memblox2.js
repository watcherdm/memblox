

(function(window, document, undefined) {
  if(!window.console || !console.log){
    console = {};
    console.log = alert;
  }
  /* randomInt
   *  @param low : the low number in the return set
   *  @param high : the high number in the return set
   */
  function randomInt(low, high){
    return Math.floor(Math.random() * (high - (low - 1))) + low;
  }
  // EventTarget class acts as base for custom events
  var memblox = {
    pause : false,
    init : function(Effect){
      var splane = new SpritePlane( 'Blocks' );
      splane.setZIndex( 2 );
      var music = Effect.Audio.getTrack("/audio/music/mario/bg-music.mp3");
      Effect.Port.setBackground({
        url: '/images/background/mario/bg1.jpg',
        xMode : 'infinite',
        xSpeed : 2
      });
      Effect.Port.attach( splane );
      Effect.Port.addEventListener( 'onMouseDown', function(pt, buttonIdx){
        // there needs to be useful
        alert( "You clicked " + pt.x + " by " + pt.y );
      });
    },
    objects : {
      block : function(theme){
        var block = {};
        var number = randomInt(0, 16);
        Block.add({
          setup: function(){
            // this needs to establish the tile
          },
          logic: function(clock){
            if(this.active){
              this.y ++;
            }
            if(this.left){
              this.x = this.x - 40;
            }
            else if (this.right){
              this.x = this.x + 40;
            }
            if (this.flip) {
              this.doFlip();
              this.flip = false;
            }
          }
        });
        Effect.Game.addEventListener( 'onKeyDown', function(id){
          switch(id) {
            case 'left':
              block.left = true;
              break;
            case 'right':
              block.right = true;
              break;
            case 'flip':
              block.flip = true;
              break;
          }
        });
        Effect.Game.addEventListener( 'onKeyUp', function(id){
          switch (id) {
            case 'left':
              block.left = false;
              break;
            case 'right':
              block.right = false;
          }
        });
        return block;
      }
    },
    play : function(){
      (function game(){
        function renderCanvas(buffer, output){
          var board = {size:{height:440, width:320}}
          buffcontext = buffer.getContext('2d');
          boardback = buffcontext.createLinearContext(0, 0, board.size.height, board.size.width);
          boardback.addColorStop(0, 'rgba(100, 100, 100, 1)');
          boardback.addColorStop(1, 'rgba(180, 180, 180, 1)');
          buffcontext.fillStyle = boardback;
          buffcontext.fillRect(0, 0, board.size.height, board.size.width);
        };
        renderCanvas();
        // play the game cycle yo
        // check for halt or pause
        setTimeout("game()", 50);
      })()
    },
    options : {
      soundEnabled: true,
      bufferMin: 3,
      bufferMax: 10,
      pSize:40,
      boardHeight: 0,
      boardWidth: 0,
      numberOfMatches: 16,
    },
    io : {
      boardDisplay: {},
      scoreDisplay: {},
      levelDisplay: {}
    },
    actions: {
      flipBlock : function(block){/**/return;},
      moveBlock : function(block, direction){/**/return;},
    },
    events: {
      blockCleared : function(block){/**/return;},
      blockMoved : function(block, direction){/**/return;},
      blockFell : function(block, spaces){/**/return;},
      blockFlipped : function(block){/**/return;},
      levelCleared : function(level){/**/return;}
    },
    environment: {
      board : [],
      player : "",
      score : 0,
      level : 0,
      flipped : {
        count : 0,
        blocks : []
      },
      topScores : [],
      players : [],
      theme : 1,
      themes : ["default","mario"]
    },
    data: {
      db: {},
      text : {}
    },
    assets: {
      sprite : ["Block"],
      images : [],
      sounds : []
    }
  }
  window.memblox = memblox;
})(window, window.document)
Effect.Game.addEventListener( 'onLoadGame',function(){memblox.init(Effect);})