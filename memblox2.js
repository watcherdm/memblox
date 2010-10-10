var memblox = (function(window, document, undefined) {
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
    objects : {
      blocks : []
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
      messageDisplay: {write: function(msg){console.log(msg);}},
      scoreDisplay: {
        write: function(msg){
          var hud = new HUD("scoreDisplay");
        }
        
      },
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
      currentLevel :1,
      level : [1,2,3,4,5,6,7,8],
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
    data : (function(){
      var db = openDatabase("scubed", "1.0", "Scubed High Scores", "1024");
      var msg = [];
      var addScore = function(player, score){
        db.transaction(function(tx){
          tx.executeSql("INSERT INTO scubed (player, score) VALUES (?,?)", 
          [player, score],
          function(tx, data){msg.push(data);},
          function(tx, e){msg.push(e);})
        })
      };
      var highScores = function(){
        db.transaction(function(tx){
          tx.executeSql("SELECT * FROM scubed ORDER BY score"),
          function(tx, data){msg.push(data);},
          function(tx, e){msg.push(e);}
        })
      };
      return {
        addScore : addScore,
        highScores: highScores,
        msg: msg
      }
    })(),
  }
  return memblox;
})(window, window.document)

var speed = 4;
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
Sprite.extend('Block',{	url: '/images/sprites/' + memblox.environment.themes[memblox.environment.theme] + '/' + randomInt(1, 8) + '.png',
        width: BLOCK_HEIGHT,
	height: BLOCK_WIDTH,
	hitRect: new Rect(1, 1, BLOCK_HEIGHT, BLOCK_WIDTH),
	collisions: true,
	state: 'falling',
	bumpedSide: false,
        setup: function(clock){
          this.matchNumber = randomInt(1, 8);
          this.setImage("/images/sprites/" + memblox.environment.themes[memblox.environment.theme] + "/" + this.matchNumber + ".png");
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
		if (this.didCollideX(hit)) {
		    	this.bumpedSide = true;
			this.x = this.x + (this.width * dir) ;
		}
		this.xd = 0;
                var hit = this.move( 0, 1 * memblox.environment.currentLevel );
                if (this.didCollideY(hit)) {
                        // if we hit something solid, stop our vert movement
                        this.y = this.y - (1 * memblox.environment.currentLevel);             
                        var splane = Effect.Port.getPlane("Blocks");
                        if(this.y >= 0){
                          memblox.environment.activeblock = splane.createSprite("Block",{x: 120, y:-40});
                        }else{
                          memblox.io.messageDisplay.write("GAME OVER SUCKA!");
                        }
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
		var hit = this.move( 0, 1 * memblox.environment.currentLevel );
                if (this.didCollideY(hit)) {
                        // if we hit something solid, stop our vert movement
                        this.y = this.y - (1 * memblox.environment.currentLevel);             
                        var splane = Effect.Port.getPlane("Blocks");
                        this.state = 'stuck';
                }
	}
});

Effect.Game.addEventListener( 'onLoadGame',function(){
  block = memblox.environment.activeblock;
  var music = Effect.Audio.getTrack("/audio/music/" + memblox.environment.themes[memblox.environment.theme] + "/bg-music.mp3");
  Effect.Port.setBackground({
    url: '/images/background/' + memblox.environment.themes[memblox.environment.theme] + '/bg1.jpg',
    xMode : 'infinite',
    xSpeed : 2
  });
  Effect.Port.addEventListener( 'onMouseDown', function(pt, buttonIdx){
    var splane = Effect.Port.getPlane("Blocks");
    var sprite = splane.lookupSpriteFromGlobal(pt);
    if(sprite){
      if(memblox.environment.flipped.blocks.length == 1){
        if (sprite.matchNumber == memblox.environment.flipped.blocks[0].matchNumber && sprite !== memblox.environment.flipped.blocks[0]){
          if(sprite == memblox.environment.activeblock || memblox.environment.flipped.blocks[0] == memblox.environment.activeblock){
            memblox.environment.activeblock = splane.createSprite("Block", {x: 120, y: -40});
          }// otherwise just use the active block that is already there, the match was done on the ground
          splane.deleteSprite(sprite.id);
          splane.deleteSprite(memblox.environment.flipped.blocks[0].id);
          memblox.environment.score += 20 * memblox.environment.currentLevel;
        }
        memblox.environment.flipped.blocks = [];
      }else{
         memblox.environment.flipped.blocks.push(sprite);
      }
      console.log(sprite.matchNumber);
    }
  });
  Effect.Game.loadLevel( 'Default', function(){
    splane = Effect.Port.getPlane("Blocks");
    splane.createSprite("Block",{x:120, y:-40});
    splane.draw();
    music.playSound();
  });
  Effect.Game.addEventListener( 'onLogic', function(clock){
    memblox.io.scoreDisplay.write(memblox.environment.score);
  })
});