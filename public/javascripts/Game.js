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
            drawHairball(context, hairballistics.hairballs()[0].position);
        };
        setInterval(redraw, 500);
    }
};

function clearCanvas(context) {
    context.fillStyle = "white";
    context.fillRect(0, 0, WIDTH, HEIGHT);
};

function drawHairball(context, pos) {
    var SIZE = 20;
    context.fillStyle = "red";
    context.fillRect(pos.x, pos.y, SIZE, SIZE);
};

var Hairballistics = function() {
    var hairballs = [];
    var time = 0;
    return {
        tick: function() {
            time += 1;
            hairballs[0] = hairballs[0].atTime(time);
        },
        launchHairball: function(x,y) {
            hairballs.push(Hairball(x,y));
        },
        hairballs: function() {
            return hairballs;
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
