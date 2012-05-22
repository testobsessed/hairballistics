
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
            drawImage('orange_head.png', headPos.x, headPos.y);
            drawImage('orange_body.png', bodyPos.x, bodyPos.y);
        }

    };
};

var Kitten = function(x, y) {
    return {
        position: Point(x, y),
        mouthPosition: function() {
            return Point(x+50, y+25);
        },
    };
};

var Vector = {
    add : function(v1, v2) {
        return Point(v1.x + v2.x, v1.y + v2.y);
    },
}

var Physics = {
    GRAVITY: 1, // in pixels per tick

    applyGravity: function(velocity) {
        return Vector.add(velocity, Point(0, Physics.GRAVITY * -1))
    }
};

var Point = function(x, y) {
    return {
        x: x,
        y: y
    };
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
