var WIDTH = 1000;
var HEIGHT = 500;

$(document).ready(function() {
    var world = Hairballistics();

    $(document).on('keydown', world.keyDownHandler);
    $(document).on('keyup', world.keyUpHandler);
    // If we are in test, do not set the game loop/create a renderer
    if(document.getElementById('game')) {

        var renderer = Renderer("game", world);

        var redraw = function() {
            world.tick();

            renderer.redraw();
        };
        setInterval(redraw, 24); // ~48 fps
    }
});
