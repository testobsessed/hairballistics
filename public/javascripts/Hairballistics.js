var kittenWidth = 59;
var margin = 25;
var left_wall = margin;
var right_wall = WIDTH - margin;
var floor = margin;
var positioningFudgeFactor = 30;

var WorldState = function() {
    var stateObject = {
        hairball: null,
        spacePressed: false,
        kitten1: Kitten(left_wall + positioningFudgeFactor, 70, {
            headImage: "orange_head.png",
            bodyImage: "orange_body.png",
            headOffset: Point(39, 0),
            mouthOffset: Point(50, 25),
            targetingLine: Point(2, 1),
        }),
        kitten2: Kitten(right_wall-kittenWidth - positioningFudgeFactor, 70, {
            headImage: "black_head.png",
            bodyImage: "black_body.png",
            headOffset: Point(12, 0),
            mouthOffset: Point(-10, 25),
            targetingLine: Point(-2, 1),
        }),
        switchPlayer: function() {
            var tmp = stateObject.kitten1;
            stateObject.kitten1 = stateObject.kitten2;
            stateObject.kitten2 = tmp;
        },
        currentKitten: function() {
            return stateObject.kitten1;
        },
        opponentKitten: function() {
            return stateObject.kitten2;
        },
        launchHairball: function(vector) {
            stateObject.hairball = Hairball(stateObject.currentKitten().mouthPosition(), vector);
            return stateObject.hairball;
        },
        withHairball: function(fn) {
            if (stateObject.hairball) {
                fn(stateObject.hairball);
            }
        },
        withKittens: function(fn) {
            fn(stateObject.kitten1);
            fn(stateObject.kitten2);
        },
        setCurrentKitten: function(newKitten) {
            stateObject.kitten1 = newKitten;
        },
        setOpponentKitten: function(newKitten) {
            stateObject.kitten2 = newKitten;
        },
        setHairball: function(newHairball) {
            stateObject.hairball = newHairball;
        },
        currentPower: function() {
            return stateObject.currentKitten().targetingLine();
        },
        hairballs: function() {
            return [stateObject.hairball];
        },
    };
    return stateObject;
};

var KeyHandler = function(worldState, triggerEvent) {
    var SPACE = 32;
    var LEFT_ARROW = 37;
    var RIGHT_ARROW = 39;

    var keyUpEvents = {};
    var keyDownEvents = {};

    keyDownEvents[SPACE] = function() {
        worldState.spacePressed = true;
    };
    keyUpEvents[SPACE] = function() {
        worldState.spacePressed = false;
        worldState.launchHairball(worldState.currentKitten().targetingLine());
        worldState.currentKitten().resetPower();
    };

    keyDownEvents[LEFT_ARROW] = function() {
        triggerEvent({ type: 'rotateCounterClockwise'});
        worldState.currentKitten().rotateTargetingLineCounterClockwise();
    };
    keyDownEvents[RIGHT_ARROW] = function() {
        triggerEvent({ type: 'rotateClockwise'});
        worldState.currentKitten().rotateTargetingLineClockwise();
    };

    return {
        keyDownHandler: function(event) {
            if (keyDownEvents[event.keyCode]) {
                keyDownEvents[event.keyCode]();
            }
        },
        keyUpHandler: function(event) {
            if (keyUpEvents[event.keyCode]) {
                keyUpEvents[event.keyCode]();
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
    var worldState = WorldState();
    var detector = CollisionDetector(worldState);
    var ticker = Ticker(worldState);

    var world = {
        tick: function() {
            detector.checkCollisions();
            ticker.tick();
        },
        withHairball: worldState.withHairball,
        withKittens: worldState.withKittens,
        launchHairball: worldState.launchHairball,
        currentPower: worldState.currentPower,
        currentKitten: worldState.currentKitten,
        hairballs: worldState.hairballs,
        setHairball: worldState.setHairball,
        setCurrentKitten: worldState.setCurrentKitten,
        setOpponentKitten: worldState.setOpponentKitten,
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
