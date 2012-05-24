var WIDTH = 1000;
var HEIGHT = 500;

$(document).ready(function() {
    var world = Hairballistics();

    $(document).on('keydown', world.keyDownHandler);
    $(document).on('keyup', world.keyUpHandler);
    var renderer = Renderer("game", world);

    var redraw = function() {
        world.tick();

        renderer.redraw();
    };

    setInterval(redraw, 24); // ~48 fps
});
