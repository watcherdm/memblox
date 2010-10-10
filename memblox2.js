var memblox = (function(window, document, undefined) {
  if(!window.console || !console.log){
    console = {};
    console.log = alert;
  }
  // makeHud method for creating new Heads up display
  function makeHud(id, cols, rows, font, x, y, prefix, suffix){
   var thishud = (function(Port, id, cols, rows, font, x, y, prefix, suffix){
      var hud = new HUD(id);
      var lastmsg = "";
      var prefix = prefix;
      var suffix = suffix;
      
      hud.setFont(font);
      hud.setPosition(x, y);
      hud.setTableSize(cols, rows);
      hud.setTracking(.7, 1.2);
      
      Port.attach(hud);
      
      return {
        hud: hud,
        write: function(msg){
          var clearString = "";
          var i = cols;
          while(i--){
            clearString += " ";
          };
          hud.setString(0,0,clearString)
          lastmessage = msg;
          msg = (prefix) ? prefix + msg : msg;
          msg = (suffix) ? msg + suffix : msg;
          hud.setString(0,0,msg);
        },
        read: function(){
          return lastmsg;
        }
      };
    })(Effect.Port,id, cols, rows, font, x, y, prefix, suffix)
    return thishud;
  }

  /* randomInt
   *  @param low : the low number in the return set
   *  @param high : the high number in the return set
   */

  // EventTarget class acts as base for custom events
  var memblox = {
    objects : {
      blocks : [],
      makeHud : makeHud
    },
    options : {
      pSize:40,
      boardHeight: 480,
      boardWidth: 320,
    },
    io : {
      messageDisplay: {},
      scoreDisplay: {},
      levelDisplay: {}
    },
    events: {
      levelCleared : function(obj, level){
        if((level + 1) >= 8){
          obj.environment.currentLevel = 1;
        };
        obj.environment.currentLevel = level + 1;
        obj.environment.matchSetSize = (level + 1) * 2;
        obj.environment.matchCount = 0;
      },
      gameOver : function(obj){
        obj.active = false;
      }
    },
    actions : {
      changeTheme : function(obj, theme_number){
        if(theme_number < obj.environment.themes.length){
          obj.environment.theme = theme_number;
          //var bpanel = Effect.Game.g
        }
      }
    },
    environment: {
      player : "",
      score : 0,
      currentLevel :1,
      level : [1,2,3,4,5,6,7,8],
      flipped : {
        count : 0,
        blocks : []
      },
      matchSetSize : 3, // in level change algorithm should be currentLevel * 2
      matchCount : 0,
      topScores : [],
      players : [],
      theme : 1,
      themes : ["default","mario"],
      activeblock : null
    },
    start_new_game: function() {
		// start new game (from title screen)
		var port = Effect.Port;
		
		//memblox.spriteGroups = {};
		
		Effect.Audio.quiet();
		Effect.Game.clearSchedule();
		Effect.Game.removeAllTweens();
		Effect.Port.removeAll();
		Effect.Port.setBackgroundColor('black');
        memblox.io.messageDisplay = memblox.objects.makeHud("message", 20, 5,
            memblox.environment.themes[memblox.environment.theme] + "Font", 20, 100, null, null);
        memblox.io.scoreDisplay =  memblox.objects.makeHud("score", 13, 1, memblox.environment.themes
            [memblox.environment.theme] + "Font", 3, 3, "Score:", null);
        memblox.io.levelDisplay =  memblox.objects.makeHud("level", 5, 1, memblox.environment.themes
            [memblox.environment.theme] + "Font", 176, 3, "Lvl:", null);
        var music = Effect.Audio.getTrack("/audio/music/" + memblox.environment.themes
            [memblox.environment.theme] + "/bg-music.mp3");
        Effect.Port.addEventListener( 'onMouseDown', function(pt, buttonIdx){
            var splane = Effect.Port.getPlane("Blocks");
            var sprite = splane.lookupSpriteFromGlobal(pt);
            if(sprite){
                sprite.flip(splane);
            }
        });	
        Effect.Game.loadLevel( 'Default', function(){
            var bplane = Effect.Port.getPlane("Background");
            var backsprite = bplane.createSprite("Background");
            splane = Effect.Port.getPlane("Blocks");
            splane.createSprite("Block",{x:120, y:-40});
            splane.draw();
            music.playSound();
        });
        Effect.Game.addEventListener( 'onLogic', function(clock){
            if(memblox.environment.matchCount > memblox.environment.currentLevel * 10){
                memblox.events.levelCleared(memblox, memblox.environment.currentLevel);
            }
            memblox.io.levelDisplay.write(memblox.environment.currentLevel);
            memblox.io.scoreDisplay.write(memblox.environment.score);
        });
	}, // start_new_game
    data : (function(){
      if(openDatabase){
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
      }else{
        return {};
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
Sprite.extend("TitleButton",{ url: '/images/sprites/title/startGameBtn.png'});
Sprite.extend('Background',{ url: '/images/backgrounds/' + memblox.environment.themes[memblox.environment.theme] + '/bg1.jpg',
  width: memblox.options.boardWidth,
  height: memblox.options.boardHeight,
  setup : function(clock){
    console.log('/images/backgrounds/' + memblox.environment.themes[memblox.environment.theme] + '/bg1.jpg');
    this.setImage('/images/backgrounds/' + memblox.environment.themes[memblox.environment.theme] + '/bg1.jpg');
  }
});
Sprite.extend('Block',{	url: '/images/sprites/' + memblox.environment.themes[memblox.environment.theme] + '/' + randomInt(1, 16) + '.png',
        width: memblox.options.pSize,
	height: memblox.options.pSize,
	hitRect: new Rect(1, 1, memblox.options.pSize, memblox.options.pSize),
	collisions: true,
	state: 'falling',
	bumpedSide: false,
        setup: function(clock){
          this.matchNumber = randomInt(1, memblox.environment.matchSetSize);
          this.setImage("/images/sprites/" + memblox.environment.themes[memblox.environment.theme] + "/" + this.matchNumber + ".png");
        },
	logic: function(clock) {
          this.bumpedSide = false;
          this.prevX = this.x;
          this.prevY = this.y;
          if(this.flipping){
            if (this.frameX < 9){
              this.setFrameX(this.frameX + 1);
            }else{
              this.flipping = false;
            }
          }else if(this.unflipping && !this.flipping){
            if( this.frameX > 0){
              this.setFrameX(this.frameX - 1);
            }else{
              this.unflipping = false;
            }
          }
          this[ this.state ](clock);
	}
});
Block.add({
	falling: function(clock) {
		// now move the sprite, horizontal only first
		//
        var hit;
        var dir;
        if (clock % 3 == 0) { // only update key presses every so many tics
            if (Effect.Game.isKeyDown("right")) {
                hit = this.move( this.width, 0 );
                dir = -1;
            }else if(Effect.Game.isKeyDown("left")){
                hit = this.move( -this.width, 0 );
                dir = 1;
            }//else if(Effect.Game.isKeyDown("down")){
             //   this.y += 10;
            //}
        }
        if(Effect.Game.isKeyDown("down")){
            this.y += 10;
        }
		if (this.didCollideX(hit)) {
		    	this.bumpedSide = true;
			this.x = this.x + (this.width * dir) ;
		}
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
                        if (this.y > GAME_LOWER_BOUNDARY - this.height)
                            this.y = GAME_LOWER_BOUNDARY - this.height;
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

Block.add({
  flip : function(splane){
    this.flipping = true;
    if(memblox.environment.flipped.blocks.length == 1){
        if (this.matchNumber == memblox.environment.flipped.blocks[0].matchNumber && this !== memblox.environment.flipped.blocks[0]){
          if(this == memblox.environment.activeblock || memblox.environment.flipped.blocks[0] == memblox.environment.activeblock){
            memblox.environment.activeblock = splane.createSprite("Block", {x: 120, y: -40});
          }// otherwise just use the active block that is already there, the match was done on the ground
          splane.deleteSprite(this.id);
          splane.deleteSprite(memblox.environment.flipped.blocks[0].id);
          memblox.environment.matchCount += 1;
          memblox.environment.score += 20 * memblox.environment.currentLevel;
          console.log(memblox.environment.matchCount);
        }
        memblox.environment.flipped.blocks[0].unflipping = true;
        this.unflipping = true;
        memblox.environment.flipped.blocks = [];
      }else{
        memblox.environment.flipped.blocks.push(this);
      }

      console.log(this.matchNumber);
    }
});
Effect.Game.addEventListener( 'onLoadGame',function(){
  Effect.Game.loadLevel( 'TitleScreen', function(){
  		// title screen is now loaded
		Effect.Game.clearSchedule();
		Effect.Game.setState( 'title' );
		Effect.Port.setScroll( 0, 0 );
		var splane = Effect.Port.getPlane('TitleSprites');
		splane.createSprite( StaticImageSprite, { url: '/images/sprites/title/scubed.png', x: 0, y: -150, zIndex: 3 } ).tween({
			delay: 0,
			duration: 180,
			mode: 'EaseOut',
			algorithm: 'Quintic',
			properties: {
				y: { start: -150, end: 40 }
			}
		});
        // hook mouse events for the buttons
		splane.createSprite( 'TitleButton', {
			url: '/images/sprites/title/startGameBtn.png',
			x: 340,
			y: 600,
			zIndex: 4,
			onMouseUp: function() { memblox.start_new_game(); }
		} ).tween({
			delay: 0,
			duration: 180,
			mode: 'EaseOut',
			algorithm: 'Quintic',
			properties: {
				x: { start: 340, end: 70 },
				y: { start: 600, end: 350 }
			}
		}).captureMouse();

  });

});