// Getting elements
var pad = document.getElementById("pad");
var ball = document.getElementById("ball");
var svg = document.getElementById("svgRoot");
var message = document.getElementById("message");

// Ball
var ballRadius = ball.r.baseVal.value;
var ballX;
var ballY;
var previousBallPosition = { x: 0, y: 0 };
var ballDirectionX;
var ballDirectionY;
var ballSpeed = 7;

// Pad
var padWidth = pad.width.baseVal.value;
var padHeight = pad.height.baseVal.value;
var padX;
var padY;
var padSpeed = 0;
var inertia = 0.80;

// Bricks
var bricks = [];
var destroyedBricksCount;
var brickWidth = 50;
var brickHeight = 20;
var bricksRows = 3;//5
var bricksCols = 20;//20
var bricksMargin = 15;
var bricksTop = 20;

// Misc.
var minX = ballRadius;
var minY = ballRadius;
var maxX;
var maxY;
var startDate;

// BP
var hit = null;

// Brick function
function Brick(x, y) {
    var isDead = false;
	var isGold = false;//TODO: Refactor , add Color member and remove this variable
    var position = { x: x, y: y };
	//var color = "";
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svg.appendChild(rect);

    rect.setAttribute("width", brickWidth);
    rect.setAttribute("height", brickHeight);

    // Random green color
	//var colors = ["gold","gold","gold","gold", "red", "green", "blue", "red", "green", "blue"];
	var colors = ["blue","pink"];
	var rnd = Math.floor(colors.length * Math.random());
	rect.setAttribute("fill", colors[rnd]);
	this.color = colors[rnd];//Save current color
	isGold = (rnd == 0);

	this.setColor = function(color) {
		rect.setAttribute("fill", color);
	}
	
    this.drawAndCollide = function () {
        if (isDead)
            return;
        
		// Drawing
        rect.setAttribute("x", position.x);
        rect.setAttribute("y", position.y);

				
        if ( ballX + ballRadius >= position.x && ballX - ballRadius <= position.x + brickWidth &&
		     ballY + ballRadius >= position.y && ballY - ballRadius <= position.y + brickHeight
		) {
			
			hit = this;
			//Problem is here, debug
			/*
			bp.event("ballCollidesWithBrick");			
			*/
			if(this.color == "gold") {
				//console.log("Got here");
				bp.event("ballCollidesWithGoldBrick");
			}
			else if(this.color == "red") {
				bp.event("ballCollidesWithRedBrick");
			}
			else if(this.color == "green") {
				bp.event("ballCollidesWithGreenBrick");
			}
			else if(this.color == "blue") {
				bp.event("ballCollidesWithBlueBrick");
			}
			else if(this.color == "pink") {
				bp.event("ballCollidesWithPinkBrick");
			}
		
			//TODO: The way to fix this bug is static ordering
			bp.event("ballCollidesWithBrick");			
			

			if( approxEqual(ballX + ballRadius, position.x,10) && ballDirectionX>0 
			    || 
				approxEqual(ballX - ballRadius, position.x + brickWidth,10) && ballDirectionX<0 ) {
				bp.event("narrowEdgeCollisionOfBallAndBrick");
			}
			
			if( approxEqual(ballY + ballRadius, position.y,10) && ballDirectionY>0 
				|| 
			    approxEqual(ballY - ballRadius, position.y + brickHeight,10) && ballDirectionY<0 ) {
				bp.event("wideEdgeCollisionOfBallAndBrick");
			}
		}
    };

    // Killing a brick
    this.remove = function () {
        if (isDead)
            return;
        svg.removeChild(rect);
        isDead = true;	
    };
}

function approxEqual(x, y, delta) {
	return x-y > -delta && x-y < delta;
}

// Collisions
function collideWithWindow() {
    if (ballX < minX) {
        ballX = minX;
		bp.event("ballAtLeft");
    }
    else if (ballX > maxX) {
        ballX = maxX;
		bp.event("ballAtRight");
    }

    if (ballY < minY) {
        ballY = minY;
		bp.event("ballAtTop");
    }
    else if (ballY > maxY + ballRadius) {
        //ballY = maxY - ballRadius;
		ballY = maxY + ballRadius;
		bp.event("ballAtBottom");
		//lost();
    }
}

function collideWithPad() {
    if (ballX + ballRadius < padX || ballX - ballRadius > padX + padWidth)
        return;

    if (ballY + ballRadius < padY)
        return;

    ballX = previousBallPosition.x;
    ballY = previousBallPosition.y;
    
	bp.event("ballHitPad");
}

// Pad movement
function movePad() {
    padX += padSpeed;

    padSpeed *= inertia;

    if (padX < minX)
        padX = minX;

    if (padX + padWidth > maxX)
        padX = maxX - padWidth;
}

registerMouseMove(document.getElementById("gameZone"), function (posx, posy, previousX, previousY) {
    padSpeed += (posx - previousX) * 0.2;
});

window.addEventListener('keydown', function (evt) {
	bp.event("keydown-" + evt.keyCode);
}, true);

function checkWindow() {
    maxX = window.innerWidth - minX;
    maxY = window.innerHeight - 130 - 85 /*40*/ - minY;
    padY = maxY - 10;
	//padY = maxY - 75;
}

function gameLoop() {
    movePad();

    // Movements
    previousBallPosition.x = ballX;
    previousBallPosition.y = ballY;
    ballX += ballDirectionX * ballSpeed;
    ballY += ballDirectionY * ballSpeed;

    // Collisions
    collideWithWindow();
    collideWithPad();

    // Bricks
    for (var index = 0; index < bricks.length; index++) {
        bricks[index].drawAndCollide();
    }

    // Ball
    ball.setAttribute("cx", ballX);
    ball.setAttribute("cy", ballY);

    // Pad
    pad.setAttribute("x", padX);
    pad.setAttribute("y", padY);
    /*
    // Victory ?
    if (destroyedBricksCount == bricks.length) {
        win();
    }
	*/
}

function generateBricks() {
    // Removing previous ones
    for (var index = 0; index < bricks.length; index++) {
        bricks[index].remove();
    }

    // Creating new ones
    var brickID = 0;

    var offset = (window.innerWidth - bricksCols * (brickWidth + bricksMargin)) / 2.0;

    for (var x = 0; x < bricksCols; x++) {
        for (var y = 0; y < bricksRows; y++) {
            bricks[brickID++] = new Brick(offset + x * (brickWidth + bricksMargin), y * (brickHeight + bricksMargin) + bricksTop);
			//bricks[brickID++] = new Brick(offset + x * (brickWidth + bricksMargin), y * (brickHeight + bricksMargin) + bricksTop , svg,hit);
        }
    }
}

var gameIntervalID = -1;
function lost() {
	clearInterval(gameIntervalID);
    gameIntervalID = -1;
    
    message.innerHTML = "Game over !";
    message.style.visibility = "visible";
}

function win() {
	clearInterval(gameIntervalID);
    gameIntervalID = -1;

    var end = (new Date).getTime();

    message.innerHTML = "Victory ! (" + Math.round((end - startDate) / 1000) + "s)";
    message.style.visibility = "visible"; 
}

function initGame() {
    message.style.visibility = "hidden";

    checkWindow();
    
    padX = (window.innerWidth - padWidth) / 2.0;

    ballX = window.innerWidth / 2.0;
    ballY = maxY - 95;

    previousBallPosition.x = ballX;
    previousBallPosition.y = ballY;
    
    padSpeed = 0;

    ballDirectionX = Math.random();
    ballDirectionY = -1.0;

    generateBricks();
    gameLoop();
}

function startGame() {
    destroyedBricksCount = 0;
	initGame();
    if (gameIntervalID > -1)
        clearInterval(gameIntervalID);

    startDate = (new Date()).getTime(); ;
    gameIntervalID = setInterval(gameLoop, 16);
}

document.getElementById("newGame").onclick = startGame;
window.onresize = initGame;

initGame();

// Actuators
//TODO: This code should be moved to the saved project content.
/*
bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['colorBrickGold']});
		
		if(hit) {
			hit.isGold = true;
			hit.setColor("gold");
			hit.color = "gold";
		}
	}
})

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['colorBrickGreen']});
		
		if(hit) {
			hit.setColor("green");
			hit.color = "green";
		}
	}
})
*/

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['acceleratePadLeft']});
        padSpeed -= 10;
	}
})

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['acceleratePadRight']});
        padSpeed += 10;
	}
})

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['startGame']});
        startGame();
	}
})

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['reverseBallXDirection']});
        ballDirectionX *= -1.0;
	}
})


bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['reverseBallYDirection']});
        ballDirectionY *= -1.0;
	}
})

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['destroyCurrentBricks']});
		if(hit) {
			hit.remove();
			destroyedBricksCount++;
		}
	}
});

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['changeXSpeedRelativeToPad']});
		
		var dist = ballX - (padX + padWidth / 2);

		ballDirectionX = 2.0 * dist / padWidth;
		
		var square = Math.sqrt(ballDirectionX * ballDirectionX + ballDirectionY * ballDirectionY);
		ballDirectionX /= square;
		ballDirectionY /= square;

	}
});

bp.addBThread('', priority++, function() {
	var counter = 0;
	while (true) {
		yield({wait: ['increaseScore']});
		counter = counter + 100;
		var scoreElement = document.getElementById("scoreTextZone");
		scoreElement.innerHTML = "Score: " + counter;
	}
});

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['decreaseScore']});
		var scoreElement = document.getElementById("scoreTextZone");
		destroyedBricksCount--;
		scoreElement.innerHTML = "Score: " + destroyedBricksCount;
	}
});

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['initScore']});
		var scoreElement = document.getElementById("scoreTextZone");
		destroyedBricksCount = 0;
		scoreElement.innerHTML = "Score: " + destroyedBricksCount;
	}
});

//B-thread which listens to setText events.

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: [function(x){
									if(x.indexOf('set_text_') != -1){
										return true;
									}
									else {
										return false;
									}
								}]});
		var debugDiv = document.getElementById("debugTextZone");
		debugDiv.innerHTML = bp.lastEvent.substr(bp.lastEvent.indexOf('set_text_') + 9);
	}
});

//Color brick actuator.
bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: [function(x){
									if(x.indexOf('colorBrick') != -1){
										return true;
									}
									else {
										return false;
									}
								}]});
		
		if(hit) {
			var tColor = bp.lastEvent.substr(bp.lastEvent.indexOf('colorBrick') + 10).toLowerCase();
			hit.setColor(tColor);
			hit.color = tColor;
		}
	}
});

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['gameLost']});
		lost();
	}
});

bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['gameWon']});
		break;
		win();
	}
	var debugDiv = document.getElementById("debugTextZone");
	debugDiv.innerHTML = "You Won the game";
	win();
});
//No More bricks Sensor
bp.addBThread('', priority++, function() {
	var flag = true; 
	while (flag) {
		yield({wait: [function(x){ return true; }]});
		// Victory ?
		if (destroyedBricksCount == bricks.length) {
			yield({request: ['gameWon']});
			flag = false;
		}
		/*TODO: Perhaps remove text or modify.
		else {
			yield({wait: ['destroyCurrentBricks']});
		}
		*/
	}
});


//Show victory message actuator - Duplicate code to win() b-thread
//No More bricks Sensor
/*
bp.addBThread('', priority++, function() {
	while (true) {
		yield({wait: ['showVictoryMessage']});
		win();
	}
});
*/