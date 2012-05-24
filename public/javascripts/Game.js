var WIDTH = 1000;
var HEIGHT = 500;

$(document).ready(function() {
    var hairballistics = Hairballistics();
    var world = hairballistics.worldState;
    var ticker = Ticker(world);
    var detector = CollisionDetector(world);

    $(document).on('keydown', hairballistics.keyDownHandler);
    $(document).on('keyup', hairballistics.keyUpHandler);
    // If we are in test, do not set the game loop/create a renderer
    if(document.getElementById('game')) {

        var renderer = Renderer("game", world);

        var redraw = function() {
            detector.checkCollisions();
            ticker.tick();
            renderer.redraw();
        };
        hairballistics.onRotateClockwise(renderer.rotateKittenHeadClockwise);
        hairballistics.onRotateCounterClockwise(renderer.rotateKittenHeadCounterClockwise);
        setInterval(redraw, 24); // ~48 fps
    }
});
