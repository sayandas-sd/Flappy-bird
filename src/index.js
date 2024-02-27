//bg
let ctx;
let ctxHeight = 640;
let ctxWidth = 360;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdXaxis = ctxWidth/8;
let birdYaxis = ctxHeight/2;
let birdImage;

let Flappybird = {
    x: birdXaxis,
    y: birdYaxis,
    width: birdWidth,
    height: birdHeight
}

//pipe 

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = ctxWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game logic

let velocityX = -2
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function(){
    ctx = document.getElementById("index");
    ctx.height = ctxHeight;
    ctx.width = ctxWidth;
    context = ctx.getContext("2d");

    //flappy bird position 
    birdImage = new Image();
    birdImage.src = "./assets/flappybird.png";

    birdImage.onload = function () {
        context.drawImage(birdImage, Flappybird.x, Flappybird.y, Flappybird.width, Flappybird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./assets/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./assets/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(positionPipe,1000);

    document.addEventListener("keydown",birdMovement);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    context.clearRect(0, 0, ctx.width, ctx.height);
    
    velocityY += gravity;
    Flappybird.y = Math.max(Flappybird.y + velocityY, 0);
    context.drawImage(birdImage, Flappybird.x, Flappybird.y, Flappybird.width, Flappybird.height);

        //pipes
    for(let i=0; i<pipeArray.length; i++) {
        let allPipe = pipeArray[i];
        allPipe.x += velocityX;

        context.drawImage(allPipe.image, allPipe.x, allPipe.y, allPipe.width, allPipe.height);

        if (!allPipe.passed && Flappybird.x > allPipe.x + Flappybird.width){
                score += 0.5;
                allPipe.passed = true;
        }        
        if(detectCollision(Flappybird, allPipe)) {
            gameOver = true;
        }
    }

    while (pipeArray. length > 0 && pipeArray[0].x < -pipeWidth) { 
        pipeArray.shift(); 
    }
    context.fillStyle = "white";
    context.font = "45px sans-sarif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 5, 90);
    }

}

function positionPipe() {
    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let gapSpace = ctx.height/4;

    let topPipeObject = {
        image : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipeObject);

    let bottompipeObject = {
        image : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + gapSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottompipeObject);
    
}

function birdMovement(e) {
    if(e.code === "Space" || e.code === "ArrowUp" || e.code === "keyX"){
        velocityY = -6;

        if (gameOver){
            Flappybird.y = birdYaxis;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b. height && 
            a.y + a.height > b.y;
}