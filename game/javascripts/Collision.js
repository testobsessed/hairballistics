var Rect = function(x, y, w, h) {
    return {
        x: x,
        y: y,
        w: w,
        h: h,
        left: x,
        right: x + w,
        bottom: y,
        top: y + h,
    };
};

var Collision = {
    overlap: function(r1, r2) {
        if (!(r1 && r2)) {
            return false;
        }
        if (r2.bottom > r1.top) {
            return false;
        } else if (r2.top < r1.bottom) {
            return false;
        } else if (r2.right < r1.left) {
            return false;
        } else if (r2.left > r1.right) {
            return false;
        } else {
            return true;
        }
    },
};
