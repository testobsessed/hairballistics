var KEYS = {
    SPACE: 32,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    C: 67,
    J: 74,
    K: 75,
    H: 72,
    L: 76,
}
var KeyHandler = function(world) {
    var enabled = true;
    var upEvents = {};
    var downEvents = {};

    var keyUpEvents = function() { return upEvents; };
    var keyDownEvents = function() { return downEvents; };

    var keyHandler = {
        keyDownHandler: function(event) {
            if (enabled) {
                if (world.introScreenVisible) {
                    return;
                }
                if (downEvents[event.keyCode]) {
                    downEvents[event.keyCode]();
                }
            }
        },
        keyUpHandler: function(event) {
            if (enabled) {
                if (world.introScreenVisible) {
                    world.introScreenVisible = false;
                } else {
                    if (upEvents[event.keyCode]) {
                        upEvents[event.keyCode]();
                    }
                }
            }
        },
        onRotateClockwise: function(handler) {
            $(keyHandler).on('rotateClockwise', handler);
        },
        onRotateCounterClockwise: function(handler) {
            $(keyHandler).on('rotateCounterClockwise', handler);
        },
        suspend: function() {
            enabled = false;
        },
        resume: function() {
            enabled = true;
        },

        setKeyUpEvents: function(value) { upEvents = value },
        setKeyDownEvents: function(value) { downEvents = value },
    };

    downEvents[KEYS.SPACE] = function() {
        world.spacePressed = true;
    };
    upEvents[KEYS.SPACE] = function() {
        world.spacePressed = false;
        if (!world.getHairball() || world.getHairball().splatted()) {
            world.launchHairball(world.currentKitten().targetingLine());
        }
        world.currentKitten().resetPower();
    };

    downEvents[KEYS.LEFT_ARROW] = function() {
        $(keyHandler).trigger({ type: 'rotateCounterClockwise'});
        world.currentKitten().rotateTargetingLineCounterClockwise();
    };
    downEvents[KEYS.RIGHT_ARROW] = function() {
        $(keyHandler).trigger({ type: 'rotateClockwise' });
        world.currentKitten().rotateTargetingLineClockwise();
    };

    downEvents[KEYS.C] = function() {
        world.inCheatMode = world.inCheatMode ? false : true;
    };

    var cheatCode = function(key,offset) {
        downEvents[key] = function() {
            if(!world.inCheatMode) { return; }
            world.hairball.setPosition(Vector.add(world.hairball.position(), offset));
        }
    }
    cheatCode(KEYS.K, Point(0,10));
    cheatCode(KEYS.J, Point(0,-10));
    cheatCode(KEYS.H, Point(-10,0));
    cheatCode(KEYS.L, Point(10,0));

    return keyHandler;
};

