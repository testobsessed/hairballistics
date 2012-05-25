var WIDTH = 1000;
var HEIGHT = 500;

$(document).ready(function() {
    var world = World();
    var keyHandler = KeyHandler(world);
    var ticker = Ticker(world);
    var detector = WorldCollisionDetector(world);

    $(document).on('keydown', keyHandler.keyDownHandler);
    $(document).on('keyup', keyHandler.keyUpHandler);
    // If we are in test, do not set the game loop/create a renderer
    if(document.getElementById('game')) {

        var renderer = Renderer("game", world);

        var redraw = function() {
            detector.checkCollisions();
            ticker.tick();
            renderer.redraw();
        };

        var suspendAndResume = function() {
            keyHandler.suspend();
            setTimeout(keyHandler.resume, 2000);
            setTimeout(renderer.hideStars, 2000);
            setTimeout(renderer.hideBam, 2000);
        };

        world.onSwitchPlayer(suspendAndResume);
        world.onFaintKitten(renderer.faintKitten);

        keyHandler.onRotateClockwise(renderer.rotateKittenHeadClockwise);
        keyHandler.onRotateCounterClockwise(renderer.rotateKittenHeadCounterClockwise);
        setInterval(redraw, 24); // ~48 fps
    }
});
