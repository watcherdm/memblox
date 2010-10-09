describe("MemBlox", function(){
  if("can make a board", function(){
    var board = new memblox.board();
    expect(board).toEqual(null);
  });
});