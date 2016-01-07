var circlesCount = 100; // Circles count used by the wormhole
var offsetX = 70; // Wormhole center offset (X)
var offsetY = 40; // Wormhole center offset (Y)
var maxDepth = 1.5; // Maximal distance for a circle
var circleDiameter = 10.0; // Circle diameter
var depthSpeed = 0.001; // Circle speed
var angleSpeed = 0.05; // Circle angular rotation speed

var canvas = document.getElementById("backgroundCanvas");
var context = canvas.getContext("2d");
var stats = document.getElementById("stats");

// Fonction de projection 
function perspective(fov, aspectRatio, x, y) {
    var yScale = Math.pow(Math.tan(fov / 2.0), -1);
    var xScale = yScale / aspectRatio;

    var M11 = xScale;
    var M22 = yScale;

    var outx = x * M11 + canvas.width / 2.0;
    var outy = y * M22 + canvas.height / 2.0;

    return { x: outx, y: outy };
}

// Définition de la function cercle
function Circle(initialDepth, initialAngle, intensity) {
    var angle = initialAngle;
    this.depth = initialDepth;
    var color = intensity;

    this.draw = function () {
        var x = offsetX * Math.cos(angle);
        var y = offsetY * Math.sin(angle);

        var project = perspective(0.9, canvas.width / canvas.height, x, y);
        var diameter = circleDiameter / this.depth;

        var ploX = project.x - diameter / 2.0;
        var ploY = project.y - diameter / 2.0;

        context.beginPath();
        context.arc(ploX, ploY, diameter, 0, 2 * Math.PI, false);
        context.closePath();

        var opacity = 1.0 - this.depth / maxDepth;
        context.strokeStyle = "rgba(" + color + "," + color + "," + color + "," + opacity + ")";
        context.lineWidth = 4;

        context.stroke();

        this.depth -= depthSpeed;
        angle += angleSpeed;

        if (this.depth < 0) {
            this.depth = maxDepth + this.depth;
        }
    };
};

// Initialization
var circles = [];

var angle = Math.random() * Math.PI * 2.0;

var depth = maxDepth;
var depthStep = maxDepth / circlesCount;
var angleStep = (Math.PI * 2.0) / circlesCount;
for (var index = 0; index < circlesCount; index++) {
    circles[index] = new Circle(depth, angle, index % 5 == 0 ? 200 : 255);

    depth -= depthStep;
    angle -= angleStep;
}

// FPS
var previous = [];
function computeFPS() {
    if (previous.length > 60) {
        previous.splice(0, 1);
    }
    var start = (new Date).getTime();
    previous.push(start);
    var sum = 0;

    for (var id = 0; id < previous.length - 1; id++) {
        sum += previous[id + 1] - previous[id];
    }

    var diff = 1000.0 / (sum / previous.length);

    stats.innerHTML = diff.toFixed() + " fps";
}

// Drawing & Animation
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function wormHole() {
    computeFPS();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 130 - 40;
    clearCanvas();
    for (var index = 0; index < circlesCount; index++) {
        circles[index].draw();
    }

    circles.sort(function (a, b) {
        if (a.depth > b.depth)
            return -1;
        if (a.depth < b.depth)
            return 1;
        return 0;
    });
}

var wormHoleIntervalID = -1;

function startWormHole() {
    if (wormHoleIntervalID > -1)
        clearInterval(wormHoleIntervalID);

    wormHoleIntervalID = setInterval(wormHole, 16);

    document.getElementById("wormHole").onclick = stopWormHole;
    document.getElementById("wormHole").innerHTML = "Standard Mode";
}

function stopWormHole() {
    if (wormHoleIntervalID > -1)
        clearInterval(wormHoleIntervalID);

    clearCanvas();
    document.getElementById("wormHole").onclick = startWormHole;
    document.getElementById("wormHole").innerHTML = "Wormhole Mode";
}

stopWormHole();