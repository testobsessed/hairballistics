var Hairball = function(position, velocity) {
    var applyVelocity = function(position, velocity) {
        return Point(position.x + velocity.x, position.y + velocity.y);
    };
    var splatted = false;

    return {
        position: position,
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
