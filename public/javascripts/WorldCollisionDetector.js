var WorldCollisionDetector = function(world) {
    var detectCollision = function(object1, object2) {
        return Collision.overlap(object1.boundingRectangle(), object2.boundingRectangle());
    };
    return {
        checkCollisions: function() {
            if (world.hairball) {
                if (detectCollision(world.hairball, world.opponentKitten())) {
                    world.currentKitten().scoredHit();
                    world.opponentKitten().faint();
                }
            }

            if(world.hairball && !world.hairball.splatted()) {
                if(world.hairball.position.y <= (floor + margin) || world.hairball.position.x >= (right_wall - margin)) {
                    world.hairball.splat();
                    world.switchPlayer();
                }
            }
        }
    };
};

