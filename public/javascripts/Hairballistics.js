var Hairballistics = function() {
    var margin = 25;
    var kittenWidth = 59;
    var right_wall = WIDTH - margin;
    var left_wall = margin;
    var ceiling = HEIGHT - margin;
    var floor = margin;

    var hairball = null;

    var positioningFudgeFactor = 70;
    var kitten1 = Kitten(left_wall + positioningFudgeFactor, 70, {
        headImage: "orange_head.png",
        bodyImage: "orange_body.png",
        headOffset: Point(39, 0),
        mouthOffset: Point(50, 25),
        targetingLine: Point(1, 1),
    });

    var positioningFudgeFactor = 30;
    var kitten2 = Kitten(right_wall-kittenWidth - positioningFudgeFactor, 70, {
        headImage: "black_head.png",
        bodyImage: "black_body.png",
        headOffset: Point(12, 0),
        mouthOffset: Point(-10, 25),
        targetingLine: Point(-1, 1),
    });

    var SPACE = 32;
    var LEFT_ARROW = 37;
    var RIGHT_ARROW = 39;
    var keyUpEvents = {};
    var keyDownEvents = {};

    keyDownEvents[SPACE] = function() {
        spacePressed = true;
    };
    keyUpEvents[SPACE] = function() {
        spacePressed = false;
        launchHairball(currentKitten().targetingLine());
        currentKitten().resetPower();
    };

    keyDownEvents[LEFT_ARROW] = function() {
        $(world).trigger({ type: 'rotateCounterClockwise'});
        currentKitten().rotateTargetingLineCounterClockwise();
    };
    keyDownEvents[RIGHT_ARROW] = function() {
        $(world).trigger({ type: 'rotateClockwise'});
        currentKitten().rotateTargetingLineClockwise();
    };

    var spacePressed = false;

    var switchPlayer = function() {
        var tmp = kitten1;
        kitten1 = kitten2;
        kitten2 = tmp;
    };

    var launchHairball = function(vector) {
        hairball = Hairball(currentKitten().mouthPosition(), vector);
        return hairball;
    };

    var currentKitten = function() {
        return kitten1;
    };

    var opponentKitten = function() {
        return kitten2;
    };

    var detectCollision = function(object1, object2) {
        return Collision.overlap(object1.boundingRectangle(), object2.boundingRectangle());
    };

    var world = {
        tick: function() {
            if (hairball) {
                if (detectCollision(hairball, opponentKitten())) {
                    currentKitten().scoredHit();
                    opponentKitten().faint();
                }
            }

            if(hairball && !hairball.splatted()) {
                hairball = hairball.tick();
                if(hairball.position.y <= (floor + margin) || hairball.position.x >= (right_wall - margin)) {
                    hairball.splat();
                    switchPlayer();
                }
            }

            if(spacePressed) {
                currentKitten().incrementPower();
            }
        },
        withHairball: function(fn) {
            if (hairball) {
                fn(hairball);
            }
        },
        withKittens: function(fn) {
            fn(kitten1);
            fn(kitten2);
        },
        launchHairball: launchHairball,
        currentPower: function() {
            return currentKitten().targetingLine();
        },
        currentKitten: currentKitten,
        hairballs: function() { return [hairball]; },
        setHairball: function(newHairball) {
            hairball = newHairball;
        },
        setCurrentKitten: function(newKitten) {
            kitten1 = newKitten;
        },
        setOpponentKitten: function(newKitten) {
            kitten2 = newKitten;
        },
    };
    world.keyDownHandler = function(event) {
        if (keyDownEvents[event.keyCode]) {
            keyDownEvents[event.keyCode]();
        }
    };
    world.keyUpHandler = function(event) {
        if (keyUpEvents[event.keyCode]) {
            keyUpEvents[event.keyCode]();
        }
    };
    world.onRotateClockwise = function(handler) {
        $(world).on('rotateClockwise', handler);
    };
    world.onRotateCounterClockwise = function(handler) {
        $(world).on('rotateCounterClockwise', handler);
    };
    return world;
};

