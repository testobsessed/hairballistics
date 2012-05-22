var WIDTH = 200;
var HEIGHT = 200;

window.onload = function () {
    var canvas = document.getElementById("game");
    if (canvas) {
        var tick = 0;
        var redraw = function() {
            tick += 1;

            var context = canvas.getContext("2d");

            context.fillStyle = "white";
            context.fillRect(0, 0, WIDTH, HEIGHT);

            context.fillStyle = "red";
            var pos = Hairball(30,30).atTime(tick).position;
            context.fillRect(pos.x, pos.y, 50, 50);
        };
        setInterval(redraw, 500);
    }
};

var Hairballistics = function() {
    return {
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