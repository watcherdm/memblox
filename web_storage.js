var mcLevel=0;
var mcScore=0; 
function initStorage() {
  if(localStorage.mcLevel!=null){
    mcLevel=localStorage.mcLevel
  } else {
    mcLevel=0
  } 
  if(localStorage.mcScore!=null){
    mcScore=localStorage.mcScore
  } else {
    mcScore=0
  } 
}
function showMcStorage() { alert("Level="+mcLevel+"\n"+"Score="+mcScore); }
function updateMcStorage(level,score) { 
  localStorage.mcLevel=level;
  localStorage.mcScore=score;
}
initStorage();
showMcStorage();
updateMcStorage(mcLevel=2,mcScore=3);
showMcStorage();