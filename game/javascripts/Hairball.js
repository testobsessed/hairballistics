var Hairball = function(position, velocity) {
    var applyVelocity = function(position, velocity) {
        return Point(position.x + velocity.x, position.y + velocity.y);
    };
    var splatted = false;

    return {
        position: position,
        boundingRectangle: function() {
            return Rect(position.x, position.y, 28, 28);
        },
        splat: function() {
          splatted = true;
        },
        tick: function() {
            if(splatted) { return this }
            var newVelocity = Physics.applyGravity(velocity);
            var newPosition = applyVelocity(position, newVelocity)
            return Hairball(newPosition, newVelocity);
        },
        splatted: function() {
          return splatted;
        },
    }
};

var Physics = {
    GRAVITY: 1, // in pixels per tick

    applyGravity: function(velocity) {
        return Vector.add(velocity, Point(0, Physics.GRAVITY * -1))
    }
};
