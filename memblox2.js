var BLOCK_HEIGHT = 40;
var BLOCK_WIDTH  = 40;
var GAME_LEFT_BOUNDARY = 0;
var GAME_RIGHT_BOUNDARY = GAME_LEFT_BOUNDARY + (BLOCK_WIDTH*8);
var GAME_UPPER_BOUNDARY = 0;
var GAME_LOWER_BOUNDARY = GAME_UPPER_BOUNDARY + (BLOCK_HEIGHT*12);

// These are the delays in secs. between block movements for each level
// index 0 is the delay for level 1, etc.
//
var FALL_DELAY = new Array(0.5, 0.45, 0.4, 0.35, 0.25, 0.2, 0.15, 0.1, 0.05); 

var FAST_FALL_DELAY = 0.05;
function randomInt(low, high){
  return Math.floor(Math.random() * (high - (low - 1))) + low;
}
Sprite.extend('Block',{	url: '/images/sprites/mario/' + randomInt(1, 8) + '.png',
        width: BLOCK_HEIGHT,
	height: BLOCK_WIDTH,
	hitRect: new Rect(1, 1, BLOCK_HEIGHT, BLOCK_WIDTH),
	collisions: true,
	state: 'falling',
	bumpedSide: false,
        setup: function(clock){
          this.setImage("/images/sprites/mario/" + randomInt(1, 8) + ".png");
        },
	logic: function(clock) {
		this.bumpedSide = false;
		this.prevX = this.x;
		this.prevY = this.y;
		this[ this.state ](clock);
	}
});
Block.add({
	falling: function(clock) {
		// now move the sprite, horizontal only first
		//
                var hit;
                var dir;
                if (Effect.Game.isKeyDown("right")) {
                  hit = this.move( this.width, 0 );
                  dir = -1;
                }else if(Effect.Game.isKeyDown("left")){
                  hit = this.move( -this.width, 0 );
                  dir = 1;
                }
 // and detenct collision
		if (this.didCollideX(hit)) {
		    	this.bumpedSide = true;
			// if we hit something solid, stop our horiz movement
			this.x = this.x + (this.width * dir) ;
		}
		this.xd = 0;
		
		// now move the sprite vertically
		//
                var hit = this.move( 0, 1 );
                if (this.didCollideY(hit)) {
                        // if we hit something solid, stop our vert movement
                        this.y--;                
                        var splane = Effect.Port.getPlane("Blocks");
                        splane.createSprite("Block",{	url: '/images/sprites/mario/' + randomInt(1, 8) + '.png',x: 160, y:0});
                        this.state = 'stuck';
                }
	}
});
Block.add({
	didCollideX: function(hit) {
		return (hit && (hit.target.solid ||
		       (hit.target.type == 'Block' && hit.target.state == 'stuck'))) ||
		       this.x < GAME_LEFT_BOUNDARY ||
		       this.x > GAME_RIGHT_BOUNDARY - this.width;
	},
	
	didCollideY: function(hit) {
		return (hit && (hit.target.solid ||
		       (hit.target.type == 'Block' && hit.target.state == 'stuck'))) ||
		       this.y > GAME_LOWER_BOUNDARY - this.height;
	}
});

Block.add({
	stuck: function(clock) {
		this.xd = this.yd = 0;
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
      boardHeight: 480,
      boardWidth: 320,
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
  
  block = memblox.environment.activeblock;
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
    splane.draw();
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