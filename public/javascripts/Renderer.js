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
        'black-kitteh-turn.png',
        'orange-kitteh-turn.png',
        'splat.gif',
        'stars_01.png',
        'stars_02.png',
        'stars_03.png',
        'stars_04.png',
        'stars_05.png',
        'stars_06.png',
        'stars_07.png',
        'stars_08.png',
        'terrain1.png',
        'terrain2.png',
        'terrain3.png',
        'terrain4.png',
        'terrain5.png',
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
    var boundingBoxes = {};

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
        _(['black_head.png','orange_head.png','hairball']).each(function(name) {
            var n = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: 10,
                height: 10,
                stroke: "black",
                strokeWidth: 1,
            });
            layer.add(n);
            boundingBoxes[name] = n;
        });
    };

    var moveImage = function(filename, x, y) {
        kineticImages[filename].setX(x);
        kineticImages[filename].setY(y);
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
    var toggleBoundingBoxes = function(enabled) {
        if(enabled) {
            _.each(boundingBoxes, function(box) {
                box.show();
            })
        } else {
            _.each(boundingBoxes, function(box) {
                box.hide();
            })

        }
    }

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

        var r = hairball.boundingRectangle();
        var screenPos = Point(r.x, r.y);
        boundingBoxes.hairball.setX(screenPos.x);
        boundingBoxes.hairball.setY(screenPos.y);
        boundingBoxes.hairball.setWidth(r.w);
        boundingBoxes.hairball.setHeight(r.h);
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

        animator.draw("stars", bodyPos.x, bodyPos.y - 20);

        var r = kitten.boundingRectangle();
        var screenPos = Point(r.x, r.y);
        boundingBoxes[kitten.properties.headImage].setX(screenPos.x);
        boundingBoxes[kitten.properties.headImage].setY(screenPos.y);
        boundingBoxes[kitten.properties.headImage].setWidth(r.w);
        boundingBoxes[kitten.properties.headImage].setHeight(r.h);
    };

    var drawTerrain = function(terrain) {
        _.each(terrain, function(height, idx) {
            var pos = convertToCanvasCoords(Point(60*idx + world.leftWall + world.positioningFudgeFactor, 0));

            if (height === 1) {
                var image = addImage('terrain1.png');
                image.setX(pos.x);
                image.setY(pos.y-33-world.floor);
                image.setZIndex(-1000);
            }
            if (height === 2) {
                var image = addImage('terrain2.png');
                image.setX(pos.x);
                image.setY(pos.y-60-world.floor);
                image.setZIndex(-1000);
            }
            if (height === 3) {
                var image = addImage('terrain3.png');
                image.setX(pos.x);
                image.setY(pos.y-93-world.floor);
                image.setZIndex(-1000);
            }
            if (height === 4) {
                var image = addImage('terrain4.png');
                image.setX(pos.x);
                image.setY(pos.y-117-world.floor);
                image.setZIndex(-1000);
            }
            if (height === 5) {
                var image = addImage('terrain5.png');
                image.setX(pos.x);
                image.setY(pos.y-141-world.floor);
                image.setZIndex(-1000);
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
    world.withTerrain(drawTerrain);

    var renderer = {
        redraw: function() {
            setCurrentPlayer(world.currentKitten().properties.headImage);
            setScoreMessage(world.currentKitten().score());
            world.withHairball(drawHairball);
            world.withKittens(drawKitten);
            drawTargettingLine(world.currentKitten());
            drawIntroScreen();
            layer.draw();
            toggleBoundingBoxes(world.inCheatMode);
        },
        drawImage: drawImage,
        moveImage: moveImage,
        rotateKittenHeadClockwise: rotateKittenHeadClockwise,
        rotateKittenHeadCounterClockwise: rotateKittenHeadCounterClockwise,
        hideStars: function() {
            animator.hide();
        },
        hideBam: function() {
            kineticImages['bam.png'].hide();
        },
        faintKitten: function(event, kitten) {
            var bodyPos = convertToCanvasCoords(kitten.position);
            var bamPos = Vector.add(bodyPos, kitten.properties.bamOffset);
            drawImage('bam.png', bamPos.x, bamPos.y);
            animator.show();
            animator.draw("stars", bodyPos.x, bodyPos.y - 20);
        },
    };
    var animator = Animator(renderer, kineticImages);
    animator.addAnimation("stars", 8);

    var showArrow = function() {
      var kitteh = world.currentKitten();
      var properties = kitteh.properties;
      var pos = convertToCanvasCoords(Vector.add(kitteh.position, properties.arrowOffset));
      drawImage(properties.arrowImage, pos.x, pos.y);
    };

    var hideArrow = function() {
      var kitteh = world.currentKitten();
      kineticImages[kitteh.properties.arrowImage].hide();
    };

    world.onSwitchPlayer(showArrow);
    world.onLaunchHairball(hideArrow);

    return renderer;
};
