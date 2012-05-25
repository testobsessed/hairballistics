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

    keyDownEvents[KEYS.SPACE] = function() {
        world.spacePressed = true;
    };
    keyUpEvents[KEYS.SPACE] = function() {
        world.spacePressed = false;
        if (!world.getHairball() || world.getHairball().splatted()) {
            world.launchHairball(world.currentKitten().targetingLine());
        }
        world.currentKitten().resetPower();
    };

    keyDownEvents[KEYS.LEFT_ARROW] = function() {
        $(keyHandler).trigger({ type: 'rotateCounterClockwise'});
        world.currentKitten().rotateTargetingLineCounterClockwise();
    };
    keyDownEvents[KEYS.RIGHT_ARROW] = function() {
        $(keyHandler).trigger({ type: 'rotateClockwise' });
        world.currentKitten().rotateTargetingLineClockwise();
    };

    keyDownEvents[KEYS.C] = function() {
        world.inCheatMode = world.inCheatMode ? false : true;
    };

    var cheatCode = function(key,offset) {
        keyDownEvents[key] = function() {
            if(!world.inCheatMode) { return; }
            var pos = world.hairball.position;
            world.hairball.position = Point(pos.x + offset.x, pos.y + offset.y);
        }
    }
    cheatCode(KEYS.K, Point(0,10));
    cheatCode(KEYS.J, Point(0,-10));
    cheatCode(KEYS.H, Point(-10,0));
    cheatCode(KEYS.L, Point(10,0));

    return keyHandler;
};

