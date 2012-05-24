var Point = function(x, y) {
    return {
        x: x,
        y: y
    };
};

var Vector = {
    add: function(v1, v2) {
        return Point(v1.x + v2.x, v1.y + v2.y);
    },

    magnitude: function(v1) {
        return Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2));
    },

    scale: function(vector, scalar) {
        return Vector.setMagnitude(vector, Vector.magnitude(vector) * scalar);
    },

    setMagnitude: function(v, mag) {
        var unitVector = Vector.unitVector(v);
        return Point(unitVector.x * mag, unitVector.y * mag);
    },

    unitVector: function(v) {
        var mag = Vector.magnitude(v);
        return Point(v.x / mag, v.y / mag);
    },

    turnToDegrees: function(v, degrees) {
        var mag = Vector.magnitude(v);
        var angleInRadiants = degrees/180*Math.PI;
        var newX = mag * Math.cos(angleInRadiants);
        var newY = mag * Math.sin(angleInRadiants);
        return Point(newX, newY);
    },

    angleInDegrees: function(v) {
        return Math.atan2(v.y, v.x)/Math.PI*180;
    },
};

