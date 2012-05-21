var WIDTH = 200;
var HEIGHT = 200;

window.onload = function () {
    var canvas = document.getElementById("game");
    if (canvas) {
        var context = canvas.getContext("2d");
        var hairballistics = Hairballistics();
        hairballistics.launchHairball(0, 0);
        var redraw = function() {
            hairballistics.tick();
            clearCanvas(context);
            hairballistics.withHairball(function (h) {
                drawHairball(context, h);
            });
        };

        setInterval(redraw, 500);
    }
};

function clearCanvas(context) {
    context.fillStyle = "white";
    context.fillRect(0, 0, WIDTH, HEIGHT);
};

function drawHairball(context, hairball) {
    var SIZE = 20;
    var pos = hairball.position;
    context.fillStyle = "red";
    context.fillRect(pos.x, pos.y, SIZE, SIZE);
};

var Hairballistics = function() {
    var hairball = null;
    var time = 0;
    return {
        tick: function() {
            time += 1;
            hairball = hairball.atTime(time);
        },
        launchHairball: function(x,y) {
            hairball = Hairball(x,y);
        },
        withHairball: function(fn) {
            fn(hairball);
        },
        kittens: ['bla']
    };
};

var Hairball = function(x,y) {
    var position = Position(x,y);
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
        return Position(position.x + offset, position.y);
    }
};

var Position = function(x, y) {
    return {
        x: x,
        y: y
    };
};
