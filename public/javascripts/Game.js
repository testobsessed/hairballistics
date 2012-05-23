
var WIDTH = 1000;
var HEIGHT = 500;

var Renderer = function(context) {
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

        var endPos = Vector.add(mouthPos, kitten.targettingLine());
        var screenMouthPos = translate(mouthPos);
        var screenEndPos = translate(endPos);

        context.moveTo(screenMouthPos.x, screenMouthPos.y);
        context.lineTo(screenEndPos.x, screenEndPos.y);

        context.stroke();
    };

    var kittenImageMap = {
        yellow: {
            head: "orange_head.png",
            body: "orange_body.png",
        },
        gray: {
            head: "black_head.png",
            body: "black_body.png",
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
            var headPos = translate(Vector.add(kitten.position, Point(25, 20)));
            var bodyPos = translate(kitten.position);
            drawTargettingLine(kitten)
            var kittenImage = kittenImageMap[kitten.color];
            drawImage(kittenImage.head, headPos.x, headPos.y);
            drawImage(kittenImage.body, bodyPos.x, bodyPos.y);
        }

    };
};

var Kitten = function(x, y, color) {
    var targettingLine = Point(30, 30);

    return {
        position: Point(x, y),
        color: color,
        mouthPosition: function() {
            return Point(x+50, y+25);
        },
        targettingLine: function() {
            return targettingLine;
        },
        tick: function() {
           mag = Vector.magnitude(targettingLine);
           targettingLine = Vector.setMagnitude(targettingLine, ((mag + 1) % 150) + 1)

           return this;
        },
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
        var renderer = Renderer(context);
        var hairballistics = Hairballistics();
        $(document).on('keydown', hairballistics.keydownHandler);
        var redraw = function() {
            hairballistics.tick();
            renderer.clearCanvas();
            hairballistics.withHairball(renderer.drawHairball);
            hairballistics.withKittens(renderer.drawKitten);
        };

        setInterval(redraw, 24); // ~48 fps
    }
});
