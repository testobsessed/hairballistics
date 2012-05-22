
var WIDTH = 200;
var HEIGHT = 200;

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
            context.fillStyle = "pink";
            context.fillRect(pos.x, pos.y, KITTEN_SIZE, KITTEN_SIZE);
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
        launchHairball: function(x,y) {
            hairball = Hairball(x,y);
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

var Hairball = function(x,y) {
    var position = Point(x,y);
    var trajectory = Trajectory(position);
    return {
        position: position,
        atTime: function(tick) {
            var position = trajectory.atTime(tick);
            return Hairball(position.x, position.y);
        }
    }
};
var Trajectory = function(pos) {
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
            hairballistics.launchHairball(0, 0);
        });
        var redraw = function() {
            hairballistics.tick();
            renderer.clearCanvas();
            hairballistics.withHairball(renderer.drawHairball);
            hairballistics.withKittens(renderer.drawKitten);
        };

        setInterval(redraw, 500);
    }
});
