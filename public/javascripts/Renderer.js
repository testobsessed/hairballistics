var Renderer = function(container, world) {
    var IMAGES_ARRAY = [
        'black_body.png',
        'black_head.png',
        'hairbaillistics_roomBG.png',
        'hairball.png',
        'its_full_of_stars.gif',
        'orange_body.png',
        'orange_head.png',
        'splat.gif',
        'stars_01.png',
        'stars_02.png',
        'stars_03.png',
        'stars_04.png',
        'stars_05.png',
        'stars_06.png',
        'stars_07.png',
        'stars_08.png',
        'terrain_high.png',
        'terrain_low.png',
        'terrain_medium.png',
    ]

    var stage = null;
    var layer = null;
    var line = null;
    var kineticImages = null;

    initializeImages = function() {
        var kineticImages = {};
        _.each(IMAGES_ARRAY, function(filename) {
            var imageObj = new Image();
            imageObj.src = 'images/' + filename;

            var image = new Kinetic.Image({
                image: imageObj,
            });

            kineticImages[filename] = image;
            image.hide();

            layer.add(image);
        });

        return kineticImages;
    };

    var initializeCanvas = function() {
        stage = new Kinetic.Stage({
            container: container,
            width: WIDTH,
            height: HEIGHT,
        });
        layer = new Kinetic.Layer();
        stage.add(layer)

        kineticImages = initializeImages(layer);

        line = new Kinetic.Line({
            points: [0, 0, 0, 0],
            stroke: "black",
            strokeWidth: 1,
            lineCap: "butt"
        });

        layer.add(line);
    };

    var drawImage = function(filename, x, y) {
        kineticImages[filename].setX(x);
        kineticImages[filename].setY(y);
        kineticImages[filename].show();
    };

    var Animator = function() {
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
                drawImage(id + '_0' + animations[id].imageNumber + '.png', x, y);
            },
        };
    };

    var convertToCanvasCoords = function(pos) {
        return Point(pos.x, HEIGHT-pos.y);
    };

    var drawTargettingLine = function(kitten) {

        var mouthPos = kitten.mouthPosition();

        //fudge positioning to look good
        mouthPos.x += 10
        mouthPos.y -= 15

        var endPos = Vector.add(mouthPos, world.currentPower());
        var screenMouthPos = convertToCanvasCoords(mouthPos);
        var screenEndPos = convertToCanvasCoords(endPos);

        line.setPoints([screenMouthPos.x, screenMouthPos.y, screenEndPos.x, screenEndPos.y]);
    };

    var drawHairball = function(hairball) {
        var pos = convertToCanvasCoords(hairball.position);
        drawImage('hairball.png', pos.x, pos.y);
    };

    var drawKitten = function(kitten) {
        var prop = kitten.properties;
        var bodyPos = convertToCanvasCoords(kitten.position);
        drawImage(prop.bodyImage, bodyPos.x, bodyPos.y);

        var headPos = convertToCanvasCoords(Vector.add(kitten.position, prop.headOffset));
        drawImage(prop.headImage, headPos.x, headPos.y);

        if (kitten.fainted()) {
            animator.draw("stars", bodyPos.x, bodyPos.y - 20);
        }
    };


    initializeCanvas();
    var animator = Animator();
    animator.addAnimation("stars", 8);

    return {
        redraw: function() {
            world.withHairball(drawHairball);
            world.withKittens(drawKitten);
            drawTargettingLine(world.currentKitten());
            layer.draw();
        }
    };
};

