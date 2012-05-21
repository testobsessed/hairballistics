window.onload = function () {
    var canvas = document.getElementById("game");
    if (canvas) {
        var context = canvas.getContext("2d");
        context.fillStyle = "red";
        context.fillRect(30, 30, 50, 50);
    }
}

var Hairballistics = function() {
    return {
        kittens: ['bla']
    };
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
}
var Position = function(x, y) {
    return {
        x: x,
        y: y,
    };
};
