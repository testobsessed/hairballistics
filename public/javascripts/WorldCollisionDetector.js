var WorldCollisionDetector = function(world) {
    var boundaries = {
        left: world.leftWall + world.margin,
        right: world.rightWall - world.margin,
        bottom: world.floor + world.margin,
    }

    var detectCollisionWithBoundaries = function(hairball) {
        var position = hairball.position();

        return position.y <= boundaries.bottom ||
               position.x <= boundaries.left ||
               position.x >= boundaries.right;

    }
    var detectCollision = function(object1, object2) {
        return Collision.overlap(object1.boundingRectangle(), object2.boundingRectangle());
    };
    return {
        checkCollisions: function() {
            if (world.hairball) {
                if (detectCollision(world.hairball, world.opponentKitten())) {
                    world.currentKitten().scoredHit();
                    world.faintKitten();
                }
            }

            if(world.hairball && !world.hairball.splatted()) {
                if(detectCollisionWithBoundaries(world.hairball)) {
                    world.hairball.splat();
                    world.switchPlayer();
                }
            }
        }
    };
};

