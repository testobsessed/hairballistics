
var WIDTH = 1000;
var HEIGHT = 500;

var Renderer = function(context, world) {
    var drawImage = function(filename, x, y) {
        var image = new Image();
        image.src = 'images/' + filename;
        context.drawImage(image, x, y);
    }

    var translate = function(pos) {
        return Point(pos.x, HEIGHT-pos.y);
    };

    var drawTargettingLine = function(kitten) {
        context.beginPath();
        var mouthPos = kitten.mouthPosition();

        //fudge positioning to look good
        mouthPos.x += 10
        mouthPos.y -= 15

        var endPos = Vector.add(mouthPos, world.currentPower());
        var screenMouthPos = translate(mouthPos);
        var screenEndPos = translate(endPos);

        context.moveTo(screenMouthPos.x, screenMouthPos.y);
        context.lineTo(screenEndPos.x, screenEndPos.y);

        context.stroke();
    };

    var kittenProperties = {
        yellow: {
            headImage: "orange_head.png",
            bodyImage: "orange_body.png",
            headOffset: Point(25, 20),
        },
        gray: {
            headImage: "black_head.png",
            bodyImage: "black_body.png",
            headOffset: Point(0, 20),
        },
    };

    return {
        clearCanvas: function() {
            context.fillStyle = "white";
            context.fillRect(0, 0, WIDTH, HEIGHT);
        },

        drawHairball: function(hairball) {
            var pos = translate(hairball.position);
            drawImage('hairball.png', pos.x, pos.y);
        },

        drawKitten: function(kitten) {
            var prop = kittenProperties[kitten.color];
            var headPos = translate(Vector.add(kitten.position, prop.headOffset));
            var bodyPos = translate(kitten.position);
            drawImage(prop.bodyImage, bodyPos.x, bodyPos.y);
            drawImage(prop.headImage, headPos.x, headPos.y);
        },
        drawTargettingLine: drawTargettingLine

    };
};

var Kitten = function(x, y, color) {
    var targettingLine = null;
    var resetPower = function() {
        targettingLine = Point(1, 1);
    }
    resetPower();

    return {
        position: Point(x, y),
        color: color,
        mouthPosition: function() {
            return Point(x+50, y+25);
        },
        targettingLine: function() {
            return targettingLine;
        },
        incrementPower: function() {
           mag = Vector.magnitude(targettingLine);
           targettingLine = Vector.setMagnitude(targettingLine, ((mag + .2) % 50) + 1)
        },
        resetPower: resetPower,
    };
};

var Physics = {
    GRAVITY: 1, // in pixels per tick

    applyGravity: function(velocity) {
        return Vector.add(velocity, Point(0, Physics.GRAVITY * -1))
    }
};

$(document).ready(function() {
    var canvas = document.getElementById("game");
    if (canvas) {
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        var context = canvas.getContext("2d");
        var hairballistics = Hairballistics();
        var renderer = Renderer(context, hairballistics);

        $(document).on('keydown', hairballistics.keyDownHandler);
        $(document).on('keyup', hairballistics.keyUpHandler);

        var redraw = function() {
            hairballistics.tick();
            renderer.clearCanvas();
            hairballistics.withHairball(renderer.drawHairball);
            hairballistics.withKittens(renderer.drawKitten);
            renderer.drawTargettingLine(hairballistics.currentKitten())
        };

        setInterval(redraw, 24); // ~48 fps
    }
});
