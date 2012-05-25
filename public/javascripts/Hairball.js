var Hairball = function(position, velocity) {
    var applyVelocity = function(position, velocity) {
        return Point(position.x + velocity.x, position.y + velocity.y);
    };
    var splatted = false;
    var splattedKitten = false;

    return {
        boundingRectangle: function() {
            return Rect(position.x, position.y, 28, 28);
        },
        splat: function() {
          splatted = true;
        },
        setPosition: function(newPosition) {
            position = newPosition;
        },
        position: function() {
            return position;
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
        splatKitten: function() {
            splattedKitten = true;
        },
        hasNotSplattedAKitten: function(){
            return !splattedKitten;
        }
    }
};

var Physics = {
    GRAVITY: 1, // in pixels per tick

    applyGravity: function(velocity) {
        return Vector.add(velocity, Point(0, Physics.GRAVITY * -1))
    }
};
