var gameFont;
var playing;
var score;

var player, ball, ai;

var MAXBALLSPEED = 10;
var MAXBOUNCEANGLE = 60 * Math.PI / 180;

function preload() {
	gameFont = loadFont('assets/ArcadeClassic.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	console.log("width :: " + windowWidth);
	console.log("height :: " + windowHeight)
	frameRate(60);

	playing = false;

	player = new Paddle(windowHeight - 20, 100, 10);
	player.v = 8;
	ai = new Paddle(10, 100, 10);
	ball = new Ball(10);

	noLoop(); // this needs to be the last thing called
}

function draw() {
	if (!playing) {
		fill(255);
		textSize(75);
		textFont(gameFont);
		textAlign(CENTER, CENTER);
		text("PONG", windowWidth/2, windowHeight/2);
		textSize(30);
		text("press   enter!", windowWidth/2, windowHeight/2+40);
		return;
	}

	background(0);

	fill(255);
	textFont(gameFont);
	textSize(40);
	textAlign(RIGHT, BOTTOM);
	text(ai.score, windowWidth-20, windowHeight/2);
	textAlign(RIGHT, TOP);
	text(player.score, windowWidth-20, windowHeight/2);

	stroke(126);
	line(0, windowHeight/2, windowWidth-20, windowHeight/2); // midway mark

	player.draw();
	updatePlayer();

	ai.draw();
	updateAI();

	ball.draw();
	updateBall();

	if (ball.y > windowHeight/2 - 10 && ball.y < windowHeight/2 + 10) { // neutral zone, re-enable collisions
		ball.collided = false;
	}
}

function toggleGame() {
	playing = !playing;
	if (playing) {
		loop();
	} else {
		noLoop();
	}
}

function updatePlayer() {
	// weird logic because paddle class must also work for AI too
	if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
		if (player.v > 0) {
			player.v *= -1;
		}
		player.update();
	} else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
		if (player.v < 0) {
			player.v *= -1;
		}
		player.update();
	}
}

function updateAI() {
	if (ball.y > 2 * windowHeight / 3) {
		return;
	}
	if (ai.centerX() - 7 > ball.x) {
		ai.v = ai.v < 0 ? ai.v : -ai.v;
		ai.update();
	} else if (ai.centerX() + 7 < ball.x) {
		ai.v = ai.v > 0 ? ai.v : -ai.v;
		ai.update();
	}
}

function updateBall() {
	// if ball hits walls
	if (ball.x > windowWidth - ball.r) {
		ball.velX *= -1;
	} else if (ball.x < ball.r) {
		ball.velX *= -1;
	}

	// if ball hits paddle
	ballCollision(player);
	ballCollision(ai);

	if (ball.lowerBound() <= 0) {
		player.score++;
		ball.reset();
	} else if (ball.upperBound() >= windowHeight) {
		ai.score++;
		ball.reset();
	}

	ball.update();
}

function ballCollision(p) {
	if ((ball.x > p.leftBound()) && (ball.x < p.rightBound())) {
		if (ball.upperBound() < p.lowerBound() && ball.lowerBound() > p.upperBound()){
			if (!ball.collided) { // avoid "gliding" effect by rate limiting collisions (1 per "zone")
				ball.collided = true;
				var dx = (p.x + p.w / 2) - ball.x; // max value is 1/2 of paddle width (50 px)
				var normalizedIntersect = dx / (p.w / 2); // range -1 to 1;
				ball.velY *= -1;
				ball.velX = -1 * MAXBALLSPEED * normalizedIntersect;
				// if (normalizedIntersect < 0.05 && normalizedIntersect > -0.05){
				// 	ball.velX = 0;
				// } else if (normalizedIntersect > 0) {
				// 	ball.velX += 7 * normalizedIntersect;
				// } else {
				// 	ball.velX += 7 * normalizedIntersect;
				// }
				// ball.velX *= -1;
			}
		}
	}
}

function keyPressed() {
	if (keyCode === ENTER) {
		toggleGame();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	player.setPos(windowWidth/2 - 50, windowHeight - 20);
	ai.setPos(windowWidth/2 - 50, 10);
	ball.reset();
	loop();
}

function mouseMoved() {
	player.x = mouseX;
}

function mouseClicked() {
	toggleGame();
}