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

    /* Does not rely on any other Vector functions */
    magnitude: function(v1) {
        return Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2));
    },

    /* Does not rely on any other Vector functions */
    scale: function(vector, scalar) {
        return Point(vector.x * scalar, vector.y * scalar);
    },

    setMagnitude: function(v, mag) {
        return Vector.scale(v, mag/Vector.magnitude(v));
    },

    unitVector: function(v) {
        return Vector.scale(v, 1/Vector.magnitude(v));
    },

    turnToDegrees: function(v, degrees) {
        var angleInRadians = Math.degreeInRadians(degrees);
        var unitVector = Point(Math.cos(angleInRadians), Math.sin(angleInRadians));
        return Vector.scale(unitVector, Vector.magnitude(v));
    },

    angleInDegrees: function(v) {
        return Math.radiansInDegrees(Math.atan2(v.y, v.x));
    },
};

