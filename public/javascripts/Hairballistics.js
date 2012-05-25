var kittenWidth = 59;
var margin = 25;
var left_wall = margin;
var right_wall = WIDTH - margin;
var floor = margin;
var positioningFudgeFactor = 30;

var KeyHandler = function(world, triggerEvent) {
    var SPACE = 32;
    var LEFT_ARROW = 37;
    var RIGHT_ARROW = 39;

    var keyUpEvents = {};
    var keyDownEvents = {};

    keyDownEvents[SPACE] = function() {
        world.spacePressed = true;
    };
    keyUpEvents[SPACE] = function() {
        world.spacePressed = false;
        if (!world.getHairball() || world.getHairball().splatted()) {
            world.launchHairball(world.currentKitten().targetingLine());
        }
        world.currentKitten().resetPower();
    };

    keyDownEvents[LEFT_ARROW] = function() {
        triggerEvent({ type: 'rotateCounterClockwise'});
        world.currentKitten().rotateTargetingLineCounterClockwise();
    };
    keyDownEvents[RIGHT_ARROW] = function() {
        triggerEvent({ type: 'rotateClockwise'});
        world.currentKitten().rotateTargetingLineClockwise();
    };

    return {
        keyDownHandler: function(event) {
            if (world.introScreenVisible) {
                return;
            }
            if (keyDownEvents[event.keyCode]) {
                keyDownEvents[event.keyCode]();
            }
        },
        keyUpHandler: function(event) {
            if (world.introScreenVisible) {
                world.introScreenVisible = false;
            } else {
                if (keyUpEvents[event.keyCode]) {
                    keyUpEvents[event.keyCode]();
                }
            }
        },
    };
};

var CollisionDetector = function(world) {
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

var Ticker = function(world) {
    return {
        tick: function() {
            if(world.hairball && !world.hairball.splatted()) {
                world.hairball = world.hairball.tick();
            }
            if(world.spacePressed) {
                world.currentKitten().incrementPower();
            }
        },
    };
};

var Hairballistics = function() {
    var worldState = World();

    var world = {
        worldState: worldState,
    };

    var keyHandler = KeyHandler(worldState, function(e) {
        $(world).trigger(e);
    });
    world.keyDownHandler = keyHandler.keyDownHandler;
    world.keyUpHandler = keyHandler.keyUpHandler;

    world.onRotateClockwise = function(handler) {
        $(world).on('rotateClockwise', handler);
    };
    world.onRotateCounterClockwise = function(handler) {
        $(world).on('rotateCounterClockwise', handler);
    };

    return world;
};
