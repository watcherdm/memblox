Effect.Game.addEventListener( 'onLoadGame', function() {
//  HUD plane for info display
//  Use hud.setString( 0, 0, "Hello World!" );  Pass the starting horiztontal and vertical character postiions (0,0 is top-left)
   var hud = new HUD( 'myhud' );
   hud.setFont( 'Optimer18Test' );
   hud.setTableSize( 10, 2 );  // This sets the total number of characters allowed horizontally and vertically
   hud.setTracking( 1.0, 1.0 );  // Spacing between letters horiz and vert, where 1.0 means normal, 0.5 means more squeezed together, and 1.5 means more spaced apart
   hud.setPosition( 60, 60 );
   hud.setZIndex( 3 );
   Effect.Port.attach( hud );

//  TextSprite for info display
//  Use tsprite.setString( 0, 0, "Hello World!" );  Pass the starting horiztontal and vertical character postiions (0,0 is top-left)
/*   var infoPlane = new SpritePlane( 'sprites' );
   Effect.Port.attach( plane );
   var tsprite = new TextSprite( 'mytext' );
   tsprite.setFont( 'Optimer18Test' );
   tsprite.setTableSize( 10, 2 );
   tsprite.setTracking( 1.0, 1.0 );
   tsprite.x = 60;
   tsprite.y = 60;
   infoPlane.attach( tsprite );
*/
});

Sprite.extend('Block',{
  url: "/images/sprites/color_01.png",
  setup: function(){
    this.active = true;
    this.y = 0;
  },
  logic : function(){
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
    init : function(){
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
      Effect.Game.loadLevel( 'Default', function(){
        music.playSound();
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
Effect.Game.addEventListener( 'onLoadGame',memblox.init)