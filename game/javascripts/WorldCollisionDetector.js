var WorldCollisionDetector = function(world) {

    var detectCollisionWithFloor = function(hairball) {
        return hairball.position().y <= (world.floor + world.margin);
    }

    var detectCollisionWithRightWall = function(hairball) {
        return hairball.position().x >= (world.right_wall - world.margin);
    }

    var detectCollisionWithLeftWall = function(hairball) {
        return hairball.position().x <= (world.left_wall + world.margin);
    }

    var detectCollisionWithBoundaries = function(hairball) {
        return detectCollisionWithFloor(hairball) || detectCollisionWithRightWall(hairball) || detectCollisionWithLeftWall(hairball);

    }
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
                if(detectCollisionWithBoundaries(world.hairball)) {
                    world.hairball.splat();
                    world.switchPlayer();
                }
            }
        }
    };
};

