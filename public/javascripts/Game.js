
var WIDTH = 1000;
var HEIGHT = 600;

var Renderer = function(context) {
    var HAIRBALL_SIZE = 20;
    var KITTEN_SIZE = 40;
    return {
        clearCanvas: function() {
            context.fillStyle = "white";
            context.fillRect(0, 0, WIDTH, HEIGHT);
        },

        drawHairball: function(hairball) {
            var pos = hairball.position;
            context.fillStyle = "red";
            context.fillRect(pos.x, pos.y, HAIRBALL_SIZE, HAIRBALL_SIZE);
        },

        drawKitten: function(kitten) {
            var pos = kitten.position;
            var body = new Image();
            body.onload = function() {
                context.drawImage(body, pos.x, 400-pos.y);
            };
            body.src = 'images/orange_body.png';
            var head = new Image();
            head.onload = function() {
                context.drawImage(head, pos.x+100, 400-pos.y-80);
            };
            head.src = 'images/orange_head.png';
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
            return Mover.moveX(pos, tick);
        }
    };
};

var Mover = {
    moveX: function(position, offset) {
        return Point(position.x + offset, position.y);
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
