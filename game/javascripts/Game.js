var WIDTH = 1000;
var HEIGHT = 500;

$(document).ready(function() {
    var world = Hairballistics();
    var ticker = Ticker(world.worldState);
    var detector = CollisionDetector(world.worldState);

    $(document).on('keydown', world.keyDownHandler);
    $(document).on('keyup', world.keyUpHandler);
    // If we are in test, do not set the game loop/create a renderer
    if(document.getElementById('game')) {

        var renderer = Renderer("game", world.worldState);

        var redraw = function() {
            detector.checkCollisions();
            ticker.tick();
            renderer.redraw();
        };
        world.onRotateClockwise(renderer.rotateKittenHeadClockwise);
        world.onRotateCounterClockwise(renderer.rotateKittenHeadCounterClockwise);
        setInterval(redraw, 24); // ~48 fps
    }
});
