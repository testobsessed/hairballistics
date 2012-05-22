
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
            var headPos = translate(Point(kitten.position.x+25, kitten.position.y+20));
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

var Hairballistics = function() {
    var hairball = null;
    var kitten = Kitten(25, 70);
    return {
        tick: function() {
            if(hairball) {
                hairball = hairball.tick();
            }
        },
        launchHairball: function(vector) {
            hairball = Hairball(kitten.mouthPosition(), vector);
            return hairball;
        },
        withHairball: function(fn) {
            if (hairball) {
                fn(hairball);
            }
        },
        withKittens: function(fn) {
            fn(kitten);
        }
    };
};

var Physics = {
    GRAVITY: 1, // in pixels per tick

    applyGravity: function(velocity) {
        return Point(velocity.x, velocity.y - Physics.GRAVITY);
    }
};

var Hairball = function(position, velocity) {
    var applyVelocity = function(position, velocity) {
        return Point(position.x + velocity.x, position.y + velocity.y);
    };

    return {
        position: position,
        tick: function() {
            var newVelocity = Physics.applyGravity(velocity);
            var newPosition = applyVelocity(position, newVelocity)
            return Hairball(newPosition, newVelocity);
        },
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
        $(document).on('keypress', function() {
            hairballistics.launchHairball(Point(10, 10));
        });
        var redraw = function() {
            hairballistics.tick();
            renderer.clearCanvas();
            hairballistics.withHairball(renderer.drawHairball);
            hairballistics.withKittens(renderer.drawKitten);
        };

        setInterval(redraw, 42); // ~24 fps
    }
});
