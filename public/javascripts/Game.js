
var WIDTH = 1000;
var HEIGHT = 600;

var Renderer = function(context) {
    var HAIRBALL_SIZE = 20;
    var KITTEN_SIZE = 40;
    var drawImage = function(filename, x, y) {
        var image = new Image();
        image.onload = function() {
            context.drawImage(image, x, y);
        };
        image.src = 'images/' + filename;
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
            drawImage('orange_head.png', pos.x+100, 400-pos.y-80);
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
                hairball = hairball.atTime(time);
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
            fn({position: Point(10, 10)});
        }
    };
};

var Hairball = function(position, vector) {
    var trajectory = Trajectory(position, vector);
    return {
        position: position,
        atTime: function(tick) {
            var position = trajectory.atTime(tick);
            return Hairball(position, vector);
        }
    }
};
var Trajectory = function(pos, vector) {
    return {
        atTime: function(tick) {
            return Point(pos.x + vector.x, pos.y + vector.y);
        }
    };
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
