function Paddle(y, w, h) {
	this.x = windowWidth / 2 - w/2;
	this.y = y;
	this.w = w;
	this.h = h;
	this.v = 6;
	this.score = 0;

	this.draw = function() {
		noStroke()
		fill(0, 255, 0);
		rect(this.x, this.y, this.w, this.h);
	}

	this.update = function() {
		this.x += this.v;
		if (this.x < 0) {
			this.x = 0;
		} else if (this.x + this.w > windowWidth) {
			this.x = windowWidth - this.w;
		}
	}

	this.setPos = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.centerX = function() { return this.x + this.w / 2; }
	this.centerY = function() { return this.y + this.h / 2; }
	this.upperBound = function() { return this.y; }
	this.lowerBound = function() { return this.y + this.h; }
	this.leftBound = function() { return this.x; }
	this.rightBound = function() { return this.x + this.w; }
}

function Ball(r) {
	this.x = windowWidth / 2;
	this.y = windowHeight / 2;
	this.r = r
	this.velX = random(1, 7) * random([1, -1]);
	this.velY = random(1, 7) * random([1, -1]);
	this.timer = frameCount; // waits three seconds before updating
	this.color = 255;
	this.collided = false;

	this.draw = function() {
		noStroke();
		fill(this.color);
		if (frameCount - this.timer <= 60 * 3) {
			var dx = frameCount - this.timer;
			if (dx % 180 === 0) {
				this.color = 255;
			} else if (dx % 60 === 0) {
				this.color = 255;
			} else if(dx % 30 === 0) {
				this.color = [0, 0, 0, 0];
			}
		}
		ellipse(this.x, this.y, this.r * 2);
	}

	this.setPos = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.update = function() {
		if (frameCount - this.timer > 60 * 3) {
			this.x += this.velX;
			this.y += this.velY;
		}
	}

	this.reset = function() {
		this.x = windowWidth / 2;
		this.y = windowHeight / 2;
		this.velX = random(1, 7) * random([1, -1]);
		this.velY = random(1, 7) * random([1, -1]);

		this.timer = frameCount;
	}

	this.upperBound = function() { return this.y - this.r; }
	this.lowerBound = function() { return this.y + this.r; }
	this.leftBound = function() { return this.x - this.r; }
	this.rightBound = function() { return this.x + this.r; }
}