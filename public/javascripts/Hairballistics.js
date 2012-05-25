var kittenWidth = 59;
var margin = 25;
var left_wall = margin;
var right_wall = WIDTH - margin;
var floor = margin;
var positioningFudgeFactor = 30;

var KeyHandler = function(world) {
    var SPACE = 32;
    var LEFT_ARROW = 37;
    var RIGHT_ARROW = 39;

    var keyUpEvents = {};
    var keyDownEvents = {};

    var keyHandler = {
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
        onRotateClockwise: function(handler) {
            $(keyHandler).on('rotateClockwise', handler);
        },
        onRotateCounterClockwise: function(handler) {
            $(keyHandler).on('rotateCounterClockwise', handler);
        },
    };

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
        $(keyHandler).trigger({ type: 'rotateCounterClockwise'});
        world.currentKitten().rotateTargetingLineCounterClockwise();
    };
    keyDownEvents[RIGHT_ARROW] = function() {
        $(keyHandler).trigger({ type: 'rotateClockwise' });
        world.currentKitten().rotateTargetingLineClockwise();
    };

    return keyHandler;
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
