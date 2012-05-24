var Renderer = function(container, world) {
    var stage = new Kinetic.Stage({
        container: container,
        width: WIDTH,
        height: HEIGHT,
    });

    var layer = new Kinetic.Layer();

    stage.add(layer)
    var drawImage = function(filename, x, y) {
        var imageObj = new Image();
        imageObj.src = 'images/' + filename;

        var image = new Kinetic.Image({
          x: x,
          y: y,
          image: imageObj,
        });

        layer.add(image);
    }

    var Animator = function() {
        var DELAY = 10;
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
                incrementAnimation(id);
                drawImage(id + '_0' + animations[id].imageNumber + '.png', x, y);
            },
        };
    };

    var animator = Animator();
    animator.addAnimation("stars", 8);

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

        var line = new Kinetic.Line({
          points: [screenMouthPos.x, screenMouthPos.y, screenEndPos.x, screenEndPos.y],
          stroke: "black",
          strokeWidth: 1,
          lineCap: "butt"
        });

        layer.add(line);
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
    return {
        redraw: function() {
            var oldLayer = layer;
            layer = new Kinetic.Layer();
            world.withHairball(drawHairball);
            world.withKittens(drawKitten);
            drawTargettingLine(world.currentKitten());
            stage.add(layer);
            stage.remove(oldLayer);
        }
    };
};

