let data; 
let texts;
let canvas; 

function preload(){
  data = loadJSON('../json/Spam Scrape.json')
  
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  texts = data.content.text
  //console.log (texts)
  angleMode(DEGREES)
}

function draw() {
  background(20);
  textSize(mouseX/1.2)
  fill(255)
 for (let i = 0; i< texts.length-1; i++){
   text(texts[i], mouseX, 12*i)
   
   
   //     useing modulo to have different rotation and alignments
    if (i % 3 == 0) {
      textAlign(LEFT);
      rotate(30)
    } else {
      textAlign(CENTER);
      
    }
  
 }
  
}