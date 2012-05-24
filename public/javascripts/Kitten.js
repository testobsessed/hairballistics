var Kitten = function(x, y, properties) {
    var targetingLine;
    var ANGLE_INCREMENT = 1;
    var angle = Vector.angleInDegrees(properties.targetingLine);
    var resetPower = function() {
        targetingLine = Vector.turnToDegrees(
                properties.targetingLine, angle);
    }
    resetPower();
    var fainted = false;
    var score = 0;

    var updateTargetingLine = function() {
        targetingLine = Vector.turnToDegrees(targetingLine, angle);
    };

    return {
        position: Point(x, y),
        properties: properties,
        boundingRectangle: function() {
            return Rect(x, y+20, 60, 70);
        },
        mouthPosition: function() {
            return Point(x+properties.mouthOffset.x, y+properties.mouthOffset.y);
        },
        targetingLine: function() {
            return targetingLine;
        },
        incrementPower: function() {
           mag = Vector.magnitude(targetingLine);
           targetingLine = Vector.setMagnitude(targetingLine, ((mag + .2) % 50) + 1);
        },
        resetPower: resetPower,
        faint: function() {
            fainted = true;
        },
        fainted: function() {
            return fainted;
        },
        score: function() {
            return score;
        },
        scoredHit: function() {
            score += 1;
        },
        rotateTargetingLineCounterClockwise: function() {
            angle = angle + ANGLE_INCREMENT;
            updateTargetingLine();
        },
        rotateTargetingLineClockwise: function() {
            angle = angle - ANGLE_INCREMENT;
            updateTargetingLine();
        },
    };
};
