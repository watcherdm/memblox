function randomInt(low, high){
  return Math.floor(Math.random() * (high - (low - 1))) + low;
}
Sprite.extend('Block',{
  url: "images/sprites/mario/1.png",
  setup: function(){
    this.active = true;
    this.y = 0;
  },
  logic : function(){
      if(this.active){
        this.y = this.y + 1 * memblox.environment.level.multiplier ;
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

  // EventTarget class acts as base for custom events
  var memblox = {
    pause : false,
    init : function(){
      
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
      currentLevel : 0,
      level : [1.1,1.2,1.3,1.4],
      flipped : {
        count : 0,
        blocks : []
      },
      topScores : [],
      players : [],
      theme : 1,
      themes : ["default","mario"],
      activeblock : null
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

Effect.Game.addEventListener( 'onLoadGame',function(){
  memblox.init();
  var number = randomInt(1, 16);
  
  block = memblox.environment.activeblock;
  Effect.Game.addEventListener( 'onKeyDown', function(id){
    switch(id) {
      case 'left':
        block.left = true;
        break;
      case 'right':
        block.right = true;
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
    splane = Effect.Port.getPlane("Blocks");
    splane.createSprite("Block",{
      x: 40,
      y: 0
    });
    music.playSound();
  });
     var hud = new HUD( 'myhud' );
   hud.setFont( 'Optimer18Test' );
   hud.setTableSize( 15, 4 );  // This sets the total number of characters allowed horizontally and vertically
   hud.setTracking( .8, 1.0 );  // Spacing between letters horiz and vert, where 1.0 means normal, 0.5 means more squeezed together, and 1.5 means more spaced apart
   hud.setPosition( 40, 50 );
   hud.setZIndex( 3 );
   Effect.Port.attach( hud );

  hud.setString( 0, 0, "Game HUD" );
  hud.setString( 0, 1, "Second Line" );
  hud.setString( 0, 2, "Third Line" );
  hud.setString( 0, 3, "1234567890123456" );

});