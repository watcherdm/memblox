// this is the main javascript file.
(function(window, document, undefined) {
  if(!window.console || !console.log){
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
      canvas : {},
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
      }
    },
    assets: {
      images : [],
      sounds : []
    }
  }
  // tetris definition below
  var tetris = {
    soundEnabled: true,
    streamCursor: 0,
    deck: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    streamSize: 200,
    bufferMin: 3,
    bufferMax: 10,
    levels: [0, 50, 100, 200, 400, 800], //5
    levelPoints: [10, 25, 50, 100, 200, 10], // length should be levels.length+1!
    board:[],
    boardDiv:null,
    canvas:null,
    canvasHeight:440,
    canvasWidth:320,
    pSize:40,
    boardHeight:0,
    boardWidth:0,
    spawnX: 4,
    spawnY:1,
    imageUrls: ['images/image001.png','images/image002.png','images/image003.png','images/image004.png','images/image005.png','images/image006.png','images/image007.png','images/image008.png','images/image009.png','images/image010.png','images/image011.png','images/image012.png','images/image013.png','images/image014.png','images/image015.png','images/image016.png'],
    shapes:[
      [
        [0,0] // square
      ],
      [
        [0,0] // square
      ],
      [
        [0,0] // square
      ],
      [
        [0,0] // square
      ],
      [
        [0,0] // square
      ],
      [
        [0,0] // square
      ]
    ],
    tempShapes:null,
    numberOfMatches: 16,
    curShape:null,
    curShapeIndex:null,
    curX:0,
    curY:0,
    curSqs:[],
    nextShape:null,
    //nextShapeDisplay:null,
    nextShapeIndex:null,
    sqs:[],
    score:0,
    scoreDisplay:null,
    level:1,
    levelDisplay:null,
    numLevels:10,
    time:0,
    maxTime:1000,
    timeDisplay:null,
    isActive:0,
    curComplete:false,
    timer:null,
    sTimer:null,
    speed:800,
    lines:0,
    stream: [],
    log: function(msg){
      if(window["console"] && console["log"]){
        //console.log(msg);
      }
    },
    init:function() {
      this.canvas = document.getElementById("canvas");
      this.stream = this.makeStream(this.deck, this.bufferMin, this.bufferMax, this.streamSize);
      $("#canvas .square").live("click", this.flipCard);
      this.initBoard();
      this.initInfo();
      this.initShapes();
      this.bindKeyEvents();
      this.bindControlEvents();
      this.initStorage();
      this.play();
	document.getElementById('mutebutton').onclick=this.toggleSound;
    },
    initBoard:function() {
      this.boardHeight = this.canvasHeight/this.pSize;
      this.boardWidth = this.canvasWidth/this.pSize;
      var s = this.boardHeight * this.boardWidth;
      for (var i=0;i<s;i++) {
        this.board.push(0);
      }
      //this.boardDiv = document.getElementById('board'); // for debugging
    },
    initInfo:function() {
      //this.nextShapeDisplay = document.getElementById("next_shape");
      this.levelDisplay = document.getElementById("level").getElementsByTagName("span")[0];
      this.timeDisplay = document.getElementById("time").getElementsByTagName("span")[0];
      this.scoreDisplay = document.getElementById("score").getElementsByTagName("span")[0];
      // this.linesDisplay = document.getElementById("lines").getElementsByTagName("span")[0];
      this.setInfo('time');
      this.setInfo('score');
      this.setInfo('level');
      // this.setInfo('lines');
    },
    initShapes:function() {
      this.curSqs = [];
      this.curComplete = false;
      this.shiftTempShapes();
      this.curShapeIndex = this.tempShapes[0];
      this.curShape = this.shapes[this.curShapeIndex];
      this.initNextShape();
      this.setCurCoords(this.spawnX,this.spawnY);
      this.drawShape(this.curX,this.curY,this.curShape);
    },
    initNextShape:function() {
      if (typeof this.tempShapes[1] === 'undefined') {this.initTempShapes();}
      try {
        this.nextShapeIndex = this.tempShapes[1];
        this.nextShape = this.shapes[this.nextShapeIndex];
        // this.drawNextShape();
      } catch(e) {
        throw new Error("Could not create next shape. " + e);
      }
    },
    initTempShapes:function() {
      this.tempShapes = [];
      for (var i = 0;i<this.shapes.length;i++) {
        this.tempShapes.push(i);
      }
      var k = this.tempShapes.length;
      while ( --k ) { //Fisher Yates Shuffle
        var j = Math.floor( Math.random() * ( k + 1 ) );
        var tempk = this.tempShapes[k];
        var tempj = this.tempShapes[j];
        this.tempShapes[k] = tempj;
        this.tempShapes[j] = tempk;
      }
    },
    shiftTempShapes:function() {
      try {
        if (typeof this.tempShapes === 'undefined' || this.tempShapes === null) {
          this.initTempShapes();
        } else {
          this.tempShapes.shift();
        }
      } catch(e) {
        throw new Error("Could not shift or init tempShapes:  " + e);
      }
    },
    initTimer:function() {
        var me = this;
        var tLoop = function() {
          me.incTime();
          me.timer = setTimeout(tLoop,2000);
        };
        this.timer = setTimeout(tLoop,2000);
    },
    setInfo:function(el) {
      this[el + 'Display'].innerHTML = this[el];
    },
    drawShape:function(x,y,p) {
	//	x = Math.floor(Math.random()*7);
	//alert(x);
      for (var i=0;i<p.length;i++) {
        var newX = p[i][0] + x;
        var newY = p[i][1] + y;

        this.curSqs[i] = this.createSquare(newX,newY,this.curShapeIndex);
      }
      for (var k=0;k<this.curSqs.length;k++) {
        this.canvas.appendChild(this.curSqs[k]);
      }
    },
    randNum: function() {
      return Math.floor((Math.random() * (tetris.numberOfMatches))+1);
    },
    createSquare:function(x,y,type) {

      var el = document.createElement('div');
      el.className = 'square unflip panel moving type'+type;
      el.setAttribute("data-value", this.stream[this.streamCursor]);
      el.style.left = x * this.pSize + 'px';
      el.style.top = '0px';
      el.innerHTML = '<div class="front"></div>';
      el.innerHTML += '<div class="back"></div>';
      this.streamCursor++;
      this.streamCursor %= this.streamSize;
    return el;
    },
    removeCur:function() {
      var me = this;
      this.curSqs.eachdo(function() {
        me.canvas.removeChild(this);
      });
      this.curSqs = [];
    },
    setCurCoords:function(x,y) {
      this.curX = x;
      this.curY = y;
    },
    bindKeyEvents:function() {
      var me = this;
      var event = "keypress";
      if (this.isSafari()) {event = "keydown";}
      var cb = function(e) {
        me.handleKey(e);
      };
      if (window.addEventListener) {
        document.addEventListener(event, cb, false);
      } else {
        document.attachEvent('on' + event,cb);
      }
    },
    toggleControls: function(){
      var classes = this.controls.className.split(" "),
        cls_length = classes.length,
        hasClass = false,
        newClassList = [];
      this.log(classes);
      while(cls_length--){
        className = classes[cls_length];
        if(className == "show_controls"){
          hasClass = true;
        } else {
          newClassList.push(className);
        }
      }
      if(hasClass == false){
        newClassList.push("show_controls");
      }
      //this.log(newClassList.join(" "));
      this.controls.className = newClassList.join(" ");
    },
    bindControlEvents:function() {
      var me = this,
        event = "click",
        cb = function(e) {
          me.handleControl(e);
        },
        controls = document.getElementById("controls");
      this.controls = controls;
      if (window.addEventListener) {
        this.controls.addEventListener(event, cb, false);
      } else {
        this.controls.attachEvent('on' + event,cb);
      }
    },
    handleControl:function(e) {
      var classes = e.target.className.split(" "),
        cls_length = classes.length,
        dir = '';
      this.log(classes);
      while(cls_length--){
        class_name = classes[cls_length];
        switch (class_name) {
          case "move_left":
            this.move('L');
            break;
          case "move_right":
            this.move('R');
            break;
          case "move_down":
            this.move('D');
            break;
          case "move_show_controls": //esc:pause
            this.log("move_show_controls");
            this.toggleControls();
            break;
          default:
            break;
        }
      }
    },
    handleKey:function(e) {
      var c = this.whichKey(e);
      var dir = '';
      switch (c) {
        case 37:
          this.move('L');
          break;
        case 39:
          this.move('R');
          break;
        case 40:
          this.move('D');
          break;
        default:
          break;
      }
    },
    whichKey:function(e) {
      var c;
      if (window.event) {c = window.event.keyCode;}
      else if (e) {c = e.keyCode;}
      return c;
    },
    incTime:function() {
      this.time++;
      this.setInfo('time');
    },
    incLevel:function() {
      this.level++;
      this.speed = this.speed - 75;
      this.setInfo('level');
    },
    initStorage: function(){ // assumes global var: mcScore mcLevel
      if(localStorage.mcScore>0){
        mcScore=localStorage.mcScore;
      } else {
        mcScore=0;
      }
      if(localStorage.mcLevel>0){
        mcScore=localStorage.mcLevel;
      } else {
        mcLevel=0;
      }
    },
    incLines:function(num) {
      this.lines += num;
      //this.setInfo('lines');
    },
    checkScore:function() {
      if (this.score >= this['level' + this.level][0]) {
        this.incLevel();
      }
    },
    gameOver:function() {
      this.clearTimers();
      this.canvas.innerHTML = "<h1><a href='/' class='refresh-page' style='color: black; text-decoration: none'>GAME OVER</a></h1>";
      $(".refresh-page").live("click",function(){window.location.reload();return false;});
	if(tetris.soundEnabled == true) { document.getElementById('gameoversound').play(); tetris.soundEnabled = false; } // HACK
    },
    play:function() { //gameLoop
      var me = this;
      if (this.timer === null) {
        this.initTimer();
      }
      var gameLoop = function() {
        me.move('D');
        if(me.curComplete) {
          me.markBoardShape(me.curX,me.curY,me.curShape);
          me.curSqs.eachdo(function() {
            me.sqs.push(this);
          });
          me.checkRows();
          me.initShapes();
          me.play();
        } else {
          me.pTimer = setTimeout(gameLoop,me.speed);
        }
      };
      this.pTimer = setTimeout(gameLoop,me.speed);
      this.isActive = 1;
    },
    flipCard: function(){
      var el = $(this);
      var flipped = $('.flip');
      var flipCount = flipped.size();

      if ((el.hasClass('unflip')) && (flipCount < 2)) {
        el.removeClass('unflip');
        el.addClass('flip');
        if (flipCount == 1)
            setTimeout(tetris.checkMatches, 2500);
      }
    },
    clearTimers:function() {
      clearTimeout(this.timer);
      clearTimeout(this.pTimer);
      this.timer = null;
      this.pTimer = null;
    },
    move:function(dir) {
      var s = '';
      var me = this;
      var tempX = this.curX;
      var tempY = this.curY;
      switch(dir) {
        case 'L':
          s = 'left';
          tempX -= 1;
          break;
        case 'R':
          s = 'left';
          tempX += 1;
          break;
        case 'D':
          s = 'top';
          tempY += 1;
          break;
        default:
          throw new Error('wtf');
          break;
      }
      if (this.checkMove(tempX,tempY,this.curShape)) {
        this.curSqs.eachdo(function(i) {
          var l = parseInt(this.style[s],10);
          dir === 'L' ? l-=me.pSize:l+=me.pSize;
          this.style[s] = l + 'px';
          return true;
        });
        this.curX = tempX;
        this.curY = tempY;
      } else if (dir === 'D') { //if move is invalid and down, piece must be complete
        $(this.curSqs[0]).removeClass("moving").attr("data-position","["+[tempX,tempY]+"]");
        if (this.curY === 1 || this.time === this.maxTime) {this.gameOver(); return false;}
        this.curComplete = true;
      }
      return true;
    },
    rotate:function() {
      if (this.curShapeIndex !== 6) { // if not the square
        var temp = [];
        this.curShape.eachdo(function() {
          temp.push([this[1] * -1,this[0]]); // (-y,x)
        });
        if (this.checkMove(this.curX,this.curY,temp)) {
          this.curShape = temp;
          this.removeCur();
          this.drawShape(this.curX,this.curY,this.curShape);
        } else { throw new Error("Could not rotate!");}
      }
    },
    checkMove:function(x,y,p) {
      if (this.isOB(x,y,p) || this.isCollision(x,y,p)) {return false;}
      return true;
    },
    isCollision:function(x,y,p) {
      var me = this;
      var bool = false;
      p.eachdo(function() {
        var newX = this[0] + x;
        var newY = this[1] + y;
        if (me.boardPos(newX,newY) === 1) {bool = true;}
      });
      return bool;
    },
    isOB:function(x,y,p) {
      var w = this.boardWidth - 1;
      var h = this.boardHeight - 1;
      var bool = false;
      p.eachdo(function() {
        var newX = this[0] + x;
        var newY = this[1] + y;
        if(newX < 0 || newX > w || newY < 0 || newY > h) {bool = true;}
      });
      return bool;
    },
    getRowState:function(y) { //Empty, Full, or Used
      var c = 0;
      for (var x=0;x<this.boardWidth;x++) {
        if (this.boardPos(x,y) === 1) {c = c + 1;}
      }
      if (c === 0) {return 'E';}
      if (c === this.boardWidth) {return 'F';}
      return 'U';
    },
    // Checks the DOM for two matching flipped cards.
    //
    // matchedCallback function to be called with two DOM elements if two cards are showing and match.
    // nonmatchedCallback function to be called with two DOM elements if two cards are showing and do not match.
    //
    // returns true if two cards are flipped, false otherwise (no callbacks are called).  If two cards are flipped and they:
    // - match, matchedCallback will be called with both DOM elements as arguments.
    // - mismatch, nonmatchedCallback will be called with both DOM elements as arguments.
    checkMatches: function() {
      var flipped = $('.flip');
      var flipCount = flipped.size();
      if (flipCount == 2) {
        var e1 = flipped.first();
        var e2 = flipped.last();
        if (e1.attr('data-value') == e2.attr('data-value')) {
          tetris.destroyCards(e1, e2);
        } else {
          tetris.hideCards(e1, e2);
        }
        return true;
      }
      return false;
    },
    checkRows:function() { //does check for full lines, removes them, and shifts everything else down
      var me = this;
      var start = this.boardHeight;
      this.curShape.eachdo(function() {
        var n = this[1] + me.curY;
        //this.log(n);
        if (n < start) {start = n;}
      });
      this.log(start);
      var c = 0;
      var stopCheck = false;
      for (var y=this.boardHeight - 1;y>=0;y--) {
          switch(this.getRowState(y)) {
            case 'F':
              //this.removeRow(y);
              c++;
              break;
            case 'E':
              if (c === 0) {
                stopCheck = true;
              }
              break;
            case 'U':
              if (c > 0) {
                //this.shiftRow(y,c);
              }
              break;
            default:
              break;
          }
          if (stopCheck === true) {
            break;
          }
      }
    },
    emptyBoardRow:function(y) { // empties a row in the board array
      for (var x=0;x<this.boardWidth;x++) {
        this.markBoardAt(x,y,0);
      }
    },
    // Matching callback for checkMatches that destroys two cards that match.
    // e1 DOM element representing the card div.
    // e2 DOM element representing the card div.
    destroyCards: function(e1, e2) {
      e1.addClass('fade');
      e2.addClass('fade');
      this.increaseScore();
      setTimeout(this.killAndFill(e1,e2), 1050);
	if(tetris.soundEnabled == true) { document.getElementById('matchsound').play(); }
    },
    killAndFill: function(e1,e2){
      this.killOneBlock(e1[0]);
      this.killOneBlock(e2[0]);
    },
    killOneBlock: function(elem){
      var pos;
      if ($(elem).hasClass("moving")) {
        if (tetris.isActive === 1) {
          tetris.clearTimers();
          tetris.isActive = 0;
        }
        pos = this.getPos(elem);   //$(elem).attr("data-position",this.getPos(elem));
        this.removeBlock(pos[0],pos[1]);
        tetris.play();
        //$(elem).remove();
      } else {
        pos = this.getPos(elem);   //$(elem).attr("data-position",this.getPos(elem));
        this.removeBlock(pos[0],pos[1]);
        var minY = (this.boardHeight-1);
        for (var i=0; i < this.sqs.length; i++) {
          var pos2 = this.getPos(this.sqs[i]);
          if (pos2[0] == pos[0] && pos2[1] < pos[1]) {
            var newY = (pos2[1]+1);
            $(elem).attr("data-position", "["+[pos2[0],newY]+"]");
            this.setBlock(pos2[0],newY,this.sqs[i]);
            if(newY < minY){minY = newY;}
          }
        };
        this.markBoardAt(pos[0],minY,0);
        if (window.console) { console.log('clearing board pos: ' + pos[0] + ', ' + minY); }
      }
      this.fillColumn();
    },
    hideCards: function(e1, e2){
      $(e1).removeClass('flip');
      $(e2).removeClass('flip');
      $(e1).addClass('unflip');
      $(e2).addClass('unflip');

	if(tetris.soundEnabled == true) { document.getElementById('nonmatchsound').play(); }
    },
    removeBlock:function(x,y) {
      var me = this;
      this.markBoardAt(x,y,0);
      this.sqs.eachdo(function(i) {
        if (me.getPos(this)[0] === x && me.getPos(this)[1] === y) {
          me.canvas.removeChild(this);
          me.sqs.splice(i,1);
        }
      });
    },
    fillColumn: function(){
      //fillcol
    },
    setBlock:function(x,y,block) {
      this.markBoardAt(x,y,1);
      var newX = x * this.pSize;
      var newY = y * this.pSize;
      block.style.left = newX + 'px';
      block.style.top = newY + 'px';
    },
    isAt:function(x,y,block) { // is given block at x,y?
      if(this.getPos(block)[0] === x && this.getPos(block)[1] === y) {return true;}
      return false;
    },
    getPos:function(block) { // returns [x,y] block position
      var p = [];
      p.push(parseInt(block.style.left,10)/this.pSize);
      p.push(parseInt(block.style.top,10)/this.pSize);
      return p;
    },
    getBoardIdx:function(x,y) { // returns board array index for x,y coords
      return x + (y*this.boardWidth);
    },
    boardPos:function(x,y) { // returns value at this board position
      return this.board[x+(y*this.boardWidth)];
    },
    markBoardAt:function(x,y,val) {
      this.board[this.getBoardIdx(x,y)] = val;
    },
    markBoardShape:function(x,y,p) {
      var me = this;
      p.eachdo(function(i) {
        var newX = p[i][0] + x;
        var newY = p[i][1] + y;
        me.markBoardAt(newX,newY,1);
      });
    },
    isSafari:function() {
      return this.bTest(/Safari/);
    },
    bTest:function(rgx) {
      return rgx.test(navigator.userAgent);
    },
    // Builds a stream of values.
    //
    // deck array - an array of values to pick from.
    // minBuffer - the min number of places that separate pairs.
    // maxBuffer - the max number of places that separate pairs.
    // maxStream - the number of values to be in the returned stream (must be a multiple of 2!)
    //
    // return array - the stream of values with length maxStream.
    makeStream: function(deck, minBuffer, maxBuffer, maxStream) {
      // The array to be returned with stream.
      var values = [];
      var size = deck.length;
      // Values that are on the board that still await matches.
      var buffer = [];
      for (var i = 0; i < maxStream; i++) {
        var useBuffer = Math.round(Math.random());
        // If we have enough numbers, empty buffer and we're finished.
        if (buffer.length + values.length == maxStream) {
          while (buffer.length > 0) {
            var nextNumber = buffer.splice(Math.floor(Math.random() * buffer.length), 1);
            values.push(nextNumber);
          }
          return values;
        }
        if (buffer.length >= maxBuffer || (useBuffer == 1 && buffer.length >= minBuffer)) {
          // If we max the buffer or we randomly choose to, take a buffer value.
          var nextNumber = buffer.splice(Math.floor(Math.random() * buffer.length), 1);
          values.push(nextNumber);
        }
        else {
          // Pick a random value from the deck.  Add it to the buffer for its match.
          var nextNumber = deck[Math.floor(Math.random() * deck.length)];
          values.push(nextNumber);
          buffer.push(nextNumber);
        }
      }
      return values;
    },
	increaseScore: function()
	{
		this.score += this.levelPoints[this.level-1];
		this.setInfo('score');

		// Level up?
		if(this.level < this.levels.length && this.score >= this.levels[this.level])
		{
			this.level++;
			this.speed -= 75;
			this.setInfo('level');
		}

	},
	toggleSound: function()
	{
		tetris.soundEnabled = !tetris.soundEnabled;
		label = tetris.soundEnabled == true ? "Mute" : "Unmute";
		document.getElementById('mutebutton').setAttribute('class', label);

	},
};
tetris.init();
window.memblox = memblox;
})(window, window.document);

if (!Array.prototype.eachdo) {
  Array.prototype.eachdo = function(fn) {
    for (var i = 0;i<this.length;i++) {
      fn.call(this[i],i);
    }
  };
}

if (!Array.prototype.remDup) {
  Array.prototype.remDup = function() {
    var temp = [];
    for(var i=0; i<this.length; i++) {
      var bool = true;
      for(var j=i+1; j<this.length; j++) {
        if(this[i] === this[j]) {bool = false;}
      }
      if(bool === true) {temp.push(this[i]);}
    }
    return temp;
  };
};
