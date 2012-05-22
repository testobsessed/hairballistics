var Point = function(x, y) {
    return {
        x: x,
        y: y
    };
};

var Vector = {
    add : function(v1, v2) {
        return Point(v1.x + v2.x, v1.y + v2.y);
    },
}

