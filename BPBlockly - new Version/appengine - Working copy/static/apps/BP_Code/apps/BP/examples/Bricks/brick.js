// Brick function
function Brick(x, y, svgR, hit) {
    this.isDead = false;
    this.isGold = false; //TODO: Refactor , add Color member and remove this variable
    this.position = {
        x: x,
        y: y
    };
    this.color = "";
    this.rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg = svgR;
    this.svg.appendChild(this.rect);

    this.rect.setAttribute("width", brickWidth);
    this.rect.setAttribute("height", brickHeight);

    // Random green color
    //var colors = ["gold", "red", "green", "blue", "red", "green", "blue"];
    //var colors = ["gold", "red", "green", "red", "green"];
    this.colors = ["red"];
    var rnd = Math.floor(this.colors.length * Math.random());
    this.rect.setAttribute("fill", this.colors[rnd]);
    this.color = this.colors[rnd]; //Save current color
    this.isGold = (rnd == 0);

};

Brick.prototype.setColor = function() {
    this.rect.setAttribute("fill", color);
};

Brick.prototype.drawAndCollide = function() {
    if (this.isDead)
        return;

    // Drawing
    this.rect.setAttribute("x", this.position.x);
    this.rect.setAttribute("y", this.position.y);


    if (ballX + ballRadius >= this.position.x && ballX - ballRadius <= this.position.x + brickWidth &&
        ballY + ballRadius >= this.position.y && ballY - ballRadius <= this.position.y + brickHeight
    ) {

        hit = this;
        bp.event("ballCollidesWithBrick");

        if (this.color == "gold") {
            bp.event("ballCollidesWithGoldBrick");
        } else if (this.color == "red") {
            bp.event("ballCollidesWithRedBrick");
        } else if (this.color == "green") {
            bp.event("ballCollidesWithGreenBrick");
        }

        if (approxEqual(ballX + ballRadius, position.x, 10) && ballDirectionX > 0 ||
            approxEqual(ballX - ballRadius, position.x + brickWidth, 10) && ballDirectionX < 0) {
            bp.event("verticalCollisionOfBallAndBrick");
        }

        if (approxEqual(ballY + ballRadius, position.y, 10) && ballDirectionY > 0 ||
            approxEqual(ballY - ballRadius, position.y + brickHeight, 10) && ballDirectionY < 0) {
            bp.event("horizontalCollisionOfBallAndBrick");
        }
    }
};

Brick.prototype.remove = function() {
    if (this.isDead)
        return;
    this.svg.removeChild(this.rect);
    this.isDead = true;
};