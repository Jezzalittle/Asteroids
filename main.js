var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var player = document.createElement("img");
player.src = "ship.png";


var spawnTimer = 0;
var shootTimer = 0;
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var ASTEROID_SPEED = 0.8;
var PLAYER_SPEED = 8;
var PLAYER_TURN_SPEED = 0.08;
var score = 0;

var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_SPACE = 32;


var keyIsDown = false;
var leftKeyIsDown = false;
var rightKeyIsDown = false;


var powerUp = {
going: false,
shootTimer: 1.5,
recharge: 3
};


function Restartgame()
{
player.x = SCREEN_WIDTH/2;
player.y = SCREEN_HEIGHT/2;
player.rotation = 0;
asteroids.length = 0;
bullets.length = 0;
score = 0;
player.speed = 0;
powerUp.recharge = 3;
}


var stateMenu = 0;
var stateGame = 1;
var stateEnd = 2;
var startGame = false;
var gameState = stateMenu;
var TextScrollX = 800;
var TextScrollXHE = 700;
 
 
window.addEventListener('keydown', function(evt) { onKeyDown(evt); }, false);
window.addEventListener('keyup', function(evt) { onKeyUp(evt); }, false);
window.addEventListener('onresize', function()
{
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});


var startFrameMillis = Date.now();
var endFrameMillis = Date.now();



function getDeltaTime() // Only call this function once per frame
{
endFrameMillis = startFrameMillis;
startFrameMillis = Date.now();
var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
if (deltaTime > 1) // validate that the delta is within range
{
deltaTime = 1;
}
return deltaTime;
}



var grass = document.createElement("img");
grass.src = "space1.png";

var player = {
image: document.createElement("img"),
x: SCREEN_WIDTH/2,
y: SCREEN_HEIGHT/2,
width: 93,
height: 80,
directionX: 0,
directionY: 0,
angularDirection: 0,
rotation: 0,
speed: 0
};
player.image.src = "ship.png";



function drawImage (cText, img, ang, newX, newY)
{
	cText.save();
		cText.translate(newX , newY );
		cText.rotate(ang);
		cText.drawImage(img,-img.width/2, -img.height/2);
	cText.restore();
}





function onKeyDown(event)
{
if(event.keyCode == KEY_UP)
{
player.directionY = 1;
keyIsDown = true;
}

if(event.keyCode == KEY_LEFT)
{
player.angularDirection = -1;
leftKeyIsDown = true;
}

if(event.keyCode == KEY_RIGHT)
{
player.angularDirection = 1;
rightKeyIsDown = true;
}


if(event.keyCode == 16)
{
	
	if(powerUp.recharge <= 0 && powerUp.shootTimer > 0)
	{
	powerUp.going = true;
	}
	
}



if(event.keyCode == 13)
{
	
	
	
	
	if(gameState == stateMenu)
	{
	gameState = stateGame;
	}
	
	if(gameState == stateEnd)
	{
	Restartgame()
	gameState = stateGame;
	}
	
	
}
}
  




function onKeyUp(event)
{
if(event.keyCode == KEY_UP)
{
keyIsDown = false;
}

if(event.keyCode == KEY_LEFT)
{
player.angularDirection = 0;
}

if(event.keyCode == KEY_RIGHT)
{
player.angularDirection = 0;
}

if(event.keyCode == KEY_SPACE && shootTimer <= 0)
{
shootTimer += 0.3;
playerShoot();
}
}



var asteroids = []


var bullets = [];


function playerShoot()
{
var bullet = {
image: document.createElement("img"),
x: player.x,
y: player.y,
width: 5,
height: 5,
velocityX: 0,
velocityY: 0,
rotation: 2,
bulletPlusSpeed: 15,
toggledOn: true
};
bullet.image.src = "beams.png";
bullet.bulletPlusSpeed = bullet.bulletPlusSpeed + player.speed
var velX = 0;
var velY = 1;
var s = Math.sin(player.rotation);
var c = Math.cos(player.rotation);
var xVel = (velX * c) - (velY * s);
var yVel = (velX * s) + (velY * c);
bullet.velocityX = xVel * bullet.bulletPlusSpeed;
bullet.velocityY = yVel * bullet.bulletPlusSpeed;
bullet.rotation = player.rotation;
bullets.push(bullet);
}





function rand(floor, ceil)
{
return Math.floor( (Math.random()* (ceil-floor)) +floor );
}
function spawnAsteroid()
{
var type = rand(0, 3);
var asteroid = {};
asteroid.image = document.createElement("img");
asteroid.image.src = "rock_large.png";
asteroid.width = 69;
asteroid.height = 75;
var x = SCREEN_WIDTH/2;
var y = SCREEN_HEIGHT/2;
var dirX = rand(-10,10);
var dirY = rand(-10,10);
var magnitude = (dirX * dirX) + (dirY * dirY);
if(magnitude != 0)
{
var oneOverMag = 1 / Math.sqrt(magnitude);
dirX *= oneOverMag;
dirY *= oneOverMag;
}
var movX = dirX * SCREEN_WIDTH;
var movY = dirY * SCREEN_HEIGHT;
asteroid.x = x + movX;
asteroid.y = y + movY;
asteroid.velocityX = -dirX * ASTEROID_SPEED;
asteroid.velocityY = -dirY * ASTEROID_SPEED;
asteroids.push(asteroid);
}


function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
if(y2 + h2 < y1 ||
x2 + w2 < x1 ||
x2 > x1 + w1 ||
y2 > y1 + h1)
{
return false;
}
return true;
}





/*#############
##GAME MENU####
#############*/



function runSplash(deltaTime)
{
context.fillStyle = "#000";
context.drawImage(grass,0,0);
context.font="bold 60px Arial";
context.fillStyle = "white"
context.fillText("Astroids", TextScrollX,250);
context.font="bold 60px Arial";
context.fillStyle = "white"
context.fillText("Hit Enter To Start", TextScrollXHE, 400)
}



/*#############
##GAME LOOP####
#############*/

function runGame(deltaTime)
{
context.fillStyle = "#ccc";
context.fillRect(0, 0, canvas.width, canvas.height);
context.drawImage(grass,0,0);
context.font="bold 30px Arial";
context.fillText("Your Score Is " + score,10, 30)
if (powerUp.recharge <= 0)
{
 context.font="bold 30px Arial";
 context.fillText("Power Up Ready",10, 60)
}
if (powerUp.recharge > 0)
{
 context.font="bold 30px Arial";
 context.fillText("Power Up Ready In " + Math.floor(powerUp.recharge) + " Seconds",10, 60)
}



if (powerUp.recharge > 0)
{
	powerUp.recharge -= deltaTime;
}

	if(powerUp.shootTimer <= 0)
	{
	powerUp.going = false;
	powerUp.recharge = 15;
	powerUp.shootTimer = 1.5;
	}



if(powerUp.going)
{
	
if (powerUp.shootTimer >= 0)
 {
	powerUp.shootTimer -= deltaTime;
 }
	playerShoot()
}


if (keyIsDown == true && player.speed <= 8)
{
player.speed += 0.1;
}



if (keyIsDown == false)
{
	if (player.speed > 0)
	{
		player.speed = player.speed - 0.1;
	}
}



for(var i=0; i<asteroids.length; i++)
{
for(var j=0; j<bullets.length; j++)
{
if(intersects(
bullets[j].x, bullets[j].y,
bullets[j].width, bullets[j].height,
asteroids[i].x, asteroids[i].y,
asteroids[i].width, asteroids[i].height) == true)
{
asteroids.splice(i, 1);
bullets.splice(j, 1);
score ++;
break;
}
}
}








if(shootTimer > 0)
shootTimer -= deltaTime;
for(var i=0; i<bullets.length; i++)
{
bullets[i].x += bullets[i].velocityX;
bullets[i].y += bullets[i].velocityY;
}
for(var i=0; i<bullets.length; i++)
{
if(bullets[i].x < -bullets[i].width ||
bullets[i].x > SCREEN_WIDTH ||
bullets[i].y < -bullets[i].height ||
bullets[i].y > SCREEN_HEIGHT)

{
bullets.splice(i, 1);
break;
}
}



for(var i=0; i<bullets.length; i++)
{
drawImage(context, bullets[i].image, bullets[i].rotation, bullets[i].x - bullets[i].width/2, bullets[i].y - bullets[i].height/2);
}


for(var i=0; i<asteroids.length; i++)
{
asteroids[i].x = asteroids[i].x + asteroids[i].velocityX;
asteroids[i].y = asteroids[i].y + asteroids[i].velocityY;
}

for(var i=0; i<asteroids.length; i++)
{
context.drawImage(asteroids[i].image, asteroids[i].x, asteroids[i].y);
}
spawnTimer -= deltaTime;
if(spawnTimer <= 0)
{
spawnTimer = 1;
spawnAsteroid();
}

var s = Math.sin(player.rotation);
var c = Math.cos(player.rotation);

var xDir = (player.directionX * c) - (player.directionY * s);
var yDir = (player.directionX * s) + (player.directionY * c);
var xVel = xDir * player.speed;
var yVel = yDir * player.speed;
player.x += xVel;
player.y += yVel;
player.rotation += player.angularDirection * PLAYER_TURN_SPEED;




if (player.x >= canvas.width + 93)
{

	player.x = 0;
}

if (player.x <= 0  - 93)
{
	player.x = canvas.width + 93;
}


if (player.y >= canvas.height + 80)
{
	player.y = 0;
}

if (player.y <= 0 - 80)
{
	player.y = canvas.height + 80;
}


if (player.isDead == true)
{
gameState = stateEnd;
}




for(var i=0; i<asteroids.length; i++)
{
if (intersects(player.x, player.y, player.width, player.height, asteroids[i].x, asteroids[i].y, asteroids[i].width, asteroids[i].height) == true)
{
	gameState = stateEnd;
}
}


drawImage(context, player.image, player.rotation, player.x, player.y) 

}


/*###############
##GAME OVER######
###############*/


function runGameOver(deltaTime)
{
context.fillStyle = "#000";
context.drawImage(grass,0,0);
context.font="bold 60px Arial";
context.fillStyle = "white"
context.fillText("GameOver!", 800,250);
context.font="bold 60px Arial";
context.fillStyle = "white"
context.fillText("Hit Enter To Restart", 700, 400)
context.fillText("your score was " + score , 750, 550)
}




function run()
{
context.fillStyle = "#ccc";
context.fillRect(0, 0, canvas.width, canvas.height);

var deltaTime = getDeltaTime();
TextScrollX += 3;
if (TextScrollX >= SCREEN_WIDTH)
{
 TextScrollX = 0 - 300;
}

TextScrollXHE += -3;
if (TextScrollXHE <= 0 - 500)
{
 TextScrollXHE = SCREEN_WIDTH + 200;
}


switch(gameState)
{
case stateMenu:
runSplash(deltaTime);
break;
case stateGame:
runGame(deltaTime);
break;
case stateEnd:
runGameOver(deltaTime);
break;
}
}











(function() {
var onEachFrame;
if (window.requestAnimationFrame) {
onEachFrame = function(cb) {
var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
_cb();
};
} else if (window.mozRequestAnimationFrame) {
onEachFrame = function(cb) {
var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
_cb();
};
} else {
onEachFrame = function(cb) {
setInterval(cb, 1000 / 60);
}
}
window.onEachFrame = onEachFrame;
})();
window.onEachFrame(run);