
var WIDTH = 1000;
var HEIGHT = 600;

var Renderer = function(context) {
    var drawImage = function(filename, x, y) {
        var image = new Image();
        image.src = 'images/' + filename;
        context.drawImage(image, x, y);
    }
    return {
        clearCanvas: function() {
            context.fillStyle = "white";
            context.fillRect(0, 0, WIDTH, HEIGHT);
        },

        drawHairball: function(hairball) {
            var pos = hairball.position;
            drawImage('hairball.png', pos.x, pos.y);
        },

        drawKitten: function(kitten) {
            var pos = kitten.position;
            drawImage('orange_body.png', pos.x, 400-pos.y);
            drawImage('orange_head.png', pos.x+25, 450-pos.y-70);
        }

    };
};
var Hairballistics = function() {
    var hairball = null;
    var time = 0;
    return {
        tick: function() {
            time += 1;
            if(hairball) {
                hairball = hairball.tick();
            }
        },
        launchHairball: function(position, vector) {
            hairball = Hairball(position, vector);
        },
        withHairball: function(fn) {
            if (hairball) {
                fn(hairball);
            }
        },
        withKittens: function(fn) {
            fn({position: Point(25, 10)});
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
            hairballistics.launchHairball(Point(0, 0), Point(10, 10));
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
