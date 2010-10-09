Effect.Game.addEventListener( 'onLoadGame', function() {
  var splane = new SpritePlane( 'Blocks' );
  splane.setZIndex( 2 );
  Effect.Port.setBackground({
    url: 'mario-bg-1.jpg'    
  });
  Effect.Port.attach( splane );
  Effect.Port.addEventListener( 'onMouseDown', function(pt, buttonIdx){
    alert( "You clicked " + pt.x + " by " + pt.y );
  });
  block = (function(){
    var block = {};
    Sprite.extend( "Block", {
      url: '/images/' + theme + '/tile' + number + '.png',
      width: 40,
      height: 40,
      collisions: true,
      solid: true,
      dieOffScreen: true,
      logic: function(clock){
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
  })()
  
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
  function EventTarget(){
    this._listeners = {};
  };
  EventTarget.prototype = {
    constructor: EventTarget,
    addListener: function(type, listener){
      if (typeof this._listeners[type] == "undefined"){
        this._listeners[type] = [];
      }
      this._listeners[type].push(listener);
    },
    fire: function(event){
      if(typeof event == "string"){
        event = {type: event};
      }
      if(!event.target){
        event.target = this;
      }
      if(!event.type){
        throw new Error("Event object missing 'type' property.");
      }
      if(this._listeners[event.type] instanceof Array){
        var listeners = this._listeners[event.type];
        for(var i = 0, lis; lis = listeners[i++];){
          lis.call(this, event);
        }
      }
    },
    removeListener: function(type, listener){
      if(this._listeners[type] instanceof Array){
        var listeners = this._listeners[type];
        for (var i = 0, lis; lis = listeners[i++];){
          if (lis === listener){
            listeners.splice(i, 1);
            break;
          }
        }
      }
    }
  };
  // block object inherits from EventTarget class
  function block(){
    EventTarget.call(this);
    var active = false;
    var control = $("<div class='blox'/>");
    this.control = control;
    this.control.click = this.flip;
    this.top = control.offset().top;
    this.left = control.offset().left;
    return this;
  }
  block.prototype = new EventTarget();
  block.prototype.constructor = block;
  block.prototype.flip = function(){
    this.fire('flip');
  };
  block.prototype.move = function(){
    this.fire('move');
  };
  block.prototype.fall = function(){
    this.fire('fall');
  };
  block.prototype.activate = function(){
    this.fire('activate');
  }
  block.prototype.deactivate = function(){
    this.fire('deactivate');
  }
  function flipBlock(ev){
    //animate the flipping of the block
    console.log("flipping block");
    //check for any other flipped blocks and check for match
    console.log("checking for match");
    //animate the flip back
    console.log("flipping back");
  }
  /**
   * moveBlock
   *  @param x : -1 == left, 1 == right, 0 == nochange;
   *  @param y : -1 == up, 1 == down, 0 == nochange;
   */
  function moveBlock(x, y){
    var x, y, nx, ny;

    // check that space in new location is empty
    console.log("checking destination");
    // move if you can
    console.log("moving or not");
  }
  function clearBlock(ev){

  }
  // end block object definition
  // board object inherits from EventTarget class
  function board(){
    EventTarget.call(this);
  }
  function control(control, size, position){
    function F(control, size, position){this.size = size, this.position = position, this.control = control};
    F.prototype.read = function(){return control.innerText;}
    F.prototype.write = function(msg, clear){control.innerText = (clear == false)? msg : control.innerText + '\n' + msg;}
    var newcontrol = new F(control, size, position);
    return newcontrol;
  }
  var memblox = {
    pause : false,
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
      theme : 0,
      themes : [{name:"default",sprite: "memblox.png"},{name:"mario",sprite: "mario.png"}]
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
  return memblox;
})(window, window.document)