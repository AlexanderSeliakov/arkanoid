"use strict";
var Container = document.querySelector("#container");
var Ball = document.querySelector("#ball");
var Paddle = document.querySelector("#paddle");
var Start_btn =  document.querySelector(".start-btn");
var GameOver = true;
var GamePlay = false;
var Score = 0;
var Lives = 5;
var Level = 1;
var AnimationRepeat;
var BallDirrection = [0, 5]; //also ball speed
var ContainerDim = Container.getBoundingClientRect();//return the width of Container
var numsOfBricks  = 44;
var moreBricks = 0;

// ---------------------------------------------- 
// rules
// ---------------------------------------------- 
document.addEventListener("keydown", function (e) {
    var key = e.keyCode
    e.preventDefault();
    if(key === 37) Paddle.left = true;
    else if(key === 39) Paddle.right = true;
    else if(key === 38 && !GamePlay) GamePlay = true;
})

document.addEventListener("keyup", function(e){ 
    var key = e.keyCode
    e.preventDefault();
    if(key === 37) Paddle.left = false
    else if(key === 39) Paddle.right = false 
    else if(key === 40) GamePlay = false
})




// ---------------------------------------------- 
// Start button
// ---------------------------------------------- 
Start_btn.addEventListener("click", startGame)


function startGame(){
    if(GameOver){
        
        Score = 0;
        Lives = 5;
        Level = 1;
        document.querySelector(".lives").innerText = Lives;
        document.querySelector(".score").innerText = Score;
        document.querySelector(".level").innerText = Level;
        GameOver = false
        GamePlay = false;    
        
        document.querySelector("#gameover").style.display = "none";
        Ball.style.display = "block";
        Paddle.style.display = "block"
        waitingOnPaddle()
        AnimationRepeat = requestAnimationFrame(update)
        makeBricks(numsOfBricks)          /// amount of bricks!!!!!!!!!!!!!!!!!
    }
}

// ---------------------------------------------- 
//get the ball on the middle of Paddle
// ---------------------------------------------- 
function waitingOnPaddle(){
    Ball.style.top = (Paddle.offsetTop - 22)+ "px"
    Ball.style.left = (Paddle.offsetLeft + 70) + "px"
}

// ---------------------------------------------- 
//move the paddle
// ---------------------------------------------- 
function update(){
    
    //during the game
    if(GameOver == false){
        var currentPaddle = Paddle.offsetLeft
        if(Paddle.left && currentPaddle >0){  // move to the left
            currentPaddle -= 5
        }else if(Paddle.right && currentPaddle < (ContainerDim.width- Paddle.offsetWidth)){  // move to the right
            currentPaddle += 5
        }
        Paddle.style.left = currentPaddle + "px"
        
        // check if the game is playing
        if(!GamePlay){
            waitingOnPaddle()  //if not playing
        }else{
            ballMove()  // if playing
        }
        AnimationRepeat = requestAnimationFrame(update)
   }
}



function ballMove(){
    
    var x = Ball.offsetLeft;
    var y = Ball.offsetTop;
    
    //collision with paddle 
    if(x> ContainerDim.width - 20 || x< 0){
        BallDirrection[0] *= -1
    }
    if(y<0){
        BallDirrection[1] *= -1
    }else if(y > (ContainerDim.height -20)){
        loss()
        return; //??
    }
    
    if(isCollide(Ball, Paddle)){
        var rebound = ((x - Paddle.offsetLeft)-(Paddle.offsetWidth/2))/10
        BallDirrection[0] = rebound
        BallDirrection[1] *= -1
    }
    
    //collision of Bricks 
    var bricks = document.querySelectorAll(".brick")
    var sc = document.querySelector(".score")
    if(bricks.length == 0 && Lives >= 1){
        stopGame()
        numsOfBricks += 5
        makeBricks(numsOfBricks)
        Level++
        document.querySelector(".level").innerText = Level
    }
    
    for(var i = 0; i<bricks.length; i++){
        if(isCollide(Ball, bricks[i])){
            BallDirrection[1] *= -1
            bricks[i].parentNode.removeChild(bricks[i])
            Score++
            sc.innerText = Score
        }
    }
    
    x += BallDirrection[0]
    y += BallDirrection[1]
    Ball.style.top = y+ "px"
    Ball.style.left = x + "px"
}

function isCollide (a,b){
    var aRect = a.getBoundingClientRect()
    var bRect = b.getBoundingClientRect();
    return(!(aRect.bottom<bRect.top || aRect.left>bRect.right || aRect.top>bRect.bottom || aRect.right<bRect.left))    
}


function loss(){
    Lives--;
    if(Lives<=0){
        endGame()
        Lives = 0
    }
    document.querySelector(".lives").innerText = Lives
    stopGame()
}

// ---------------------------------------------- 
//if loose 1 live
// ---------------------------------------------- 
function stopGame(){
    GamePlay = false;
    waitingOnPaddle();
    BallDirrection = [0, 5]
    window.cancelAnimationFrame(AnimationRepeat )
}

// ---------------------------------------------- 
//if loose all lives
// ---------------------------------------------- 
function endGame(){
    GameOver = true;
    Ball.style.display = "none"
    Paddle.style.display = "none"
    document.querySelector('#gameover').style.display = 'block';
    document.querySelector('#gameover').innerHTML = 'GAME OVER<br>Your Score ' + Score;
    var bricks = document.querySelectorAll(".brick")
    for(var i = 0; i<bricks.length; i++){
            bricks[i].parentNode.removeChild(bricks[i])
    }
}

// ---------------------------------------------- 
//make a brick 
// ---------------------------------------------- 
function makeBricks(num){
    var brick = {
        x : (ContainerDim.width % 100)/2, 
        y : 50
    }
    for(var i = 0; i < num; i++){
        
        if(brick.x > (ContainerDim.width  - 50)){
            brick.y += 90;
            brick.x = ((ContainerDim.width  % 100)/2)
        }
           
        setupBriks(brick)
        brick.x += 100
    }
		console.log(window.innerWidth)
		console.log(Container)
	console.log(ContainerDim)
}
//make css of bricks 
function setupBriks(brick){
    var div = document.createElement("div")
    div.setAttribute("class", "brick")
    div.style.top = brick.y/2 + "px"
    div.style.left = brick.x + 10 +"px" 
     div.style.background = 'linear-gradient(' + randomColor() + ',' + randomColor() + ')'         
    Container.appendChild(div)
} 


function randomColor(){
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + x + ", " + y + ", " + z + ")";
    
    return bgColor;
}

