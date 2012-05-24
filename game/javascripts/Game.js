var WIDTH = 1000;
var HEIGHT = 500;

var Renderer = function(context, world) {
    var drawImage = function(filename, x, y) {
        var image = new Image();
        image.src = 'images/' + filename;
        context.drawImage(image, x, y);
    }

    var Animator = function() {
        var animations = {};
        return {
            addAnimation: function(id, numFrames) {
                animations[id] = {
                    id: id,
                    numFrames: numFrames,
                    counter: 0
                };
            },
            draw: function(id, x, y) {
                animations[id].counter += 1;
                animations[id].counter = (animations[id].counter % 80) + 1;
                drawImage(id + '_0' + (Math.floor(animations[id].counter/10)) + '.png', x, y);
            },
        };
    };

    var animator = Animator();
    animator.addAnimation("stars", 8);

    var convertToCanvasCoords = function(pos) {
        return Point(pos.x, HEIGHT-pos.y);
    };

    var drawTargettingLine = function(kitten) {
        context.beginPath();
        var mouthPos = kitten.mouthPosition();

        //fudge positioning to look good
        mouthPos.x += 10
        mouthPos.y -= 15

        var endPos = Vector.add(mouthPos, world.currentPower());
        var screenMouthPos = convertToCanvasCoords(mouthPos);
        var screenEndPos = convertToCanvasCoords(endPos);

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
            var pos = convertToCanvasCoords(hairball.position);
            drawImage('hairball.png', pos.x, pos.y);
        },

        drawKitten: function(kitten) {
            var prop = kittenProperties[kitten.color];
            var bodyPos = convertToCanvasCoords(kitten.position);
            drawImage(prop.bodyImage, bodyPos.x, bodyPos.y);

            var headPos = convertToCanvasCoords(Vector.add(kitten.position, prop.headOffset));
            drawImage(prop.headImage, headPos.x, headPos.y);

            if (kitten.fainted()) {
                animator.draw("stars", bodyPos.x, bodyPos.y - 20);
            }
        },
        drawTargettingLine: drawTargettingLine,
    };
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