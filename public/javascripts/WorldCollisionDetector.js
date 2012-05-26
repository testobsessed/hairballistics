var WorldCollisionDetector = function(world) {
    var boundaries = {
        left: world.leftWall + world.margin,
        right: world.rightWall - world.margin,
        bottom: world.floor + world.margin,
    }

    var detectCollisionWithBoundaries = function(hairball) {
        if (!hairball) {
            return false;
        }
        var position = hairball.position();

        return position.y <= boundaries.bottom ||
               position.x <= boundaries.left ||
               position.x >= boundaries.right;

    }
    var detectCollision = function(object1, object2) {
        if(!(object1 && object2)) {
            return false;
        }
        return Collision.overlap(object1.boundingRectangle(), object2.boundingRectangle());
    };
    var enabled = true;

    var disable = function() {
        enabled = false;
    };

    var enable = function() {
        enabled = true;
    };

    world.onLaunchHairball(enable);

    return {
        checkCollisions: function() {
            if (!enabled) { return; }

            if (detectCollision(world.hairball, world.opponentKitten())) {
                world.currentKitten().scoredHit();
                world.hairballSplat();
                world.faintKitten();
                disable();
            }

            var terrain = world.getTerrain();
            _.each(terrain, function(terrainPiece) {
                if (detectCollision({ boundingRectangle: function() { return terrainPiece }}, world.hairball)) {
                    world.hairballSplat();
                    disable();
                }
            });

            if(detectCollisionWithBoundaries(world.hairball)) {
                world.hairballSplat();
                disable();
            }
        },
    };
};

