var Kitten = function(x, y, properties) {
    var targettingLine = null;
    var angle = 45;
    var resetPower = function() {
        targettingLine = properties.targettingLine;
    }
    resetPower();
    var fainted = false;

    return {
        position: Point(x, y),
        properties: properties,
        boundingRectangle: function() {
            return Rect(x, y+20, 60, 70);
        },
        mouthPosition: function() {
            return Point(x+properties.mouthOffset.x, y+properties.mouthOffset.y);
        },
        targettingLine: function() {
            //deprecated because of misspelling
            return targettingLine;
        },
        targetingLine: function() {
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
        rotateTargetingLineClockwise: function() {
            angle = angle - 1;

            distance = Vector.magnitude(targettingLine);

            angleInPi = angle/180*Math.PI;
            var newX = distance * Math.cos(angleInPi);
            var newY = distance * Math.sin(angleInPi);
            targettingLine = Point(newX, newY);
        },
    };
};