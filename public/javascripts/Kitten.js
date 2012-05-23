var Kitten = function(x, y, color) {
    var targettingLine = null;
    var resetPower = function() {
        targettingLine = Point(1, 1);
    }
    resetPower();
    var fainted = false;

    return {
        position: Point(x, y),
        color: color,
        boundingRectangle: function() {
            return Rect(x, y+20, 60, 70);
        },
        mouthPosition: function() {
            return Point(x+50, y+25);
        },
        targettingLine: function() {
            return targettingLine;
        },
        incrementPower: function() {
           mag = Vector.magnitude(targettingLine);
           targettingLine = Vector.setMagnitude(targettingLine, ((mag + .2) % 50) + 1)
        },
        resetPower: resetPower,
        faint: function() {
            fainted = true;
        },
        fainted: function() {
            return fainted;
        },
    };
};
