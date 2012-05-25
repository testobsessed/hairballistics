var Renderer = function(container, world) {
    var IMAGES_ARRAY = [
        'bam.png',
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
        'hairballistics_intro.png',
    ];

    var stage = null;
    var layer = null;
    var line = null;
    var kineticImages = null;
    
    var addImage = function(filename) {
        var image = new Image();
        image.src = 'images/' + filename;
        var kineticImage = new Kinetic.Image({
            image: image,
        });
        layer.add(kineticImage);
        return kineticImage;
    };

    var initializeImages = function() {
        var kineticImages = {};
        _.each(IMAGES_ARRAY, function(filename) {
            var image = addImage(filename);
            kineticImages[filename] = image;
            image.hide();
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

    var setCurrentPlayer = function(name) {
        document.getElementById('current_player').src = "images/" + name;
    };

    var setScoreMessage = function(score) {
        document.getElementById('scores').innerHTML = score;
    };


    var convertToCanvasCoords = function(pos) {
        return Point(pos.x, HEIGHT-pos.y);
    };

    var drawTargettingLine = function(kitten) {
        var endPos = Vector.add(
                kitten.headPosition(),
                Vector.scale(world.currentPower(), 3));
        var screenHeadPos = convertToCanvasCoords(kitten.headPosition());
        var screenEndPos = convertToCanvasCoords(endPos);

        line.setPoints([screenHeadPos.x, screenHeadPos.y, screenEndPos.x, screenEndPos.y]);
    };

    var drawIntroScreen = function() {
        if (world.introScreenVisible) {
            drawImage("hairballistics_intro.png", 0, 0);
        } else {
            kineticImages["hairballistics_intro.png"].hide();
        }
    };

    var drawHairball = function(hairball) {
        var pos = convertToCanvasCoords(hairball.position());
        drawImage('hairball.png', pos.x, pos.y);
    };

    var drawKitten = function(kitten) {
        var prop = kitten.properties;
        var bodyPos = convertToCanvasCoords(kitten.position);
        drawImage(prop.bodyImage, bodyPos.x, bodyPos.y);

        var kittenHeadWidth = 28;
        var kittenHeadHeight = 40;

        kineticImages[kitten.properties.headImage].setCenterOffset([kittenHeadWidth / 2, kittenHeadHeight / 2]);

        var headPos = convertToCanvasCoords(kitten.headPosition());

        drawImage(prop.headImage, headPos.x, headPos.y);

        if (kitten.fainted()) {
            var bamPos = Vector.add(bodyPos, prop.bamOffset);
            drawImage('bam.png', bamPos.x, bamPos.y);
            animator.draw("stars", bodyPos.x, bodyPos.y - 20);
        }
    };

    var drawTerrain = function(terrain) {
        // 0, 0, 0, 1

        var terrain = [0, 0, 0, 1, 2, 3, 2];
        _.each(terrain, function(height, idx) {
            var pos = convertToCanvasCoords(Point(60*idx + world.left_wall + world.positioningFudgeFactor, 0));

            if (height === 1) {
                var image = addImage('terrain_low.png');
                image.setX(pos.x);
                image.setY(pos.y-33-world.floor);
            }
            if (height === 2) {
                var image = addImage('terrain_medium.png');
                image.setX(pos.x);
                image.setY(pos.y-60-world.floor);
            }
            if (height === 3) {
                var image = addImage('terrain_high.png');
                image.setX(pos.x);
                image.setY(pos.y-93-world.floor);
            }
        });
    };

    var rotateKittenHead = function(degrees) {
        var kitten = world.currentKitten();

        kineticImages[kitten.properties.headImage].rotate(Math.degreeInRadians(degrees));
    };

    var rotateKittenHeadClockwise = function() {
        rotateKittenHead(1);
    };

    var rotateKittenHeadCounterClockwise = function() {
        rotateKittenHead(-1);
    };

    initializeCanvas();

    if (FEATURE_FLAGS.terrain) {
        world.withTerrain(drawTerrain);
    }

    var renderer = {
        redraw: function() {
            setCurrentPlayer(world.currentKitten().properties.headImage);
            setScoreMessage(world.currentKitten().score());
            world.withHairball(drawHairball);
            world.withKittens(drawKitten);
            drawTargettingLine(world.currentKitten());
            drawIntroScreen();
            layer.draw();
        },
        drawImage: drawImage,
        rotateKittenHeadClockwise: rotateKittenHeadClockwise,
        rotateKittenHeadCounterClockwise: rotateKittenHeadCounterClockwise,
    };
    var animator = Animator(renderer, kineticImages);
    animator.addAnimation("stars", 8);
    return renderer;
};
