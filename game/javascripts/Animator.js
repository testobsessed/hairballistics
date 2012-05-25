var Animator = function(renderer, kineticImages) {
    var DELAY = 10;
    var STAR_IMAGES = [
        'stars_01.png',
        'stars_02.png',
        'stars_03.png',
        'stars_04.png',
        'stars_05.png',
        'stars_06.png',
        'stars_07.png',
        'stars_08.png'];

    var animations = {};

    var incrementAnimation = function(id) {
        var animation = animations[id];
        animation.counter += 1;
        if (animation.counter > DELAY) {
            animation.counter = 0;
            animation.imageNumber += 1;
            animation.imageNumber %= animation.numFrames;
            animation.imageNumber += 1;
        }
    };

    return {
        addAnimation: function(id, numFrames) {
            animations[id] = {
                id: id,
                numFrames: numFrames,
                counter: 0,
                imageNumber: 1,
            };
        },
            draw: function(id, x, y) {
                _.each(STAR_IMAGES, function(path) {
                    kineticImages[path].hide();
                });
                incrementAnimation(id);
                renderer.drawImage(id + '_0' + animations[id].imageNumber + '.png', x, y);
            },
    };
};
