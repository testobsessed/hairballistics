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

    setMagnitude: function(v, mag) {
        var unitVector = Vector.unitVector(v);
        return Point(unitVector.x * mag, unitVector.y * mag);
    },

    unitVector: function(v) {
        var mag = Vector.magnitude(v);
        return Point(v.x / mag, v.y / mag);
    },
}

