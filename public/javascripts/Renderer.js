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
        var animations = {};
        return {
            addAnimation: function(id, numFrames) {
                animations[id] = {
                    id: id,
                    numFrames: numFrames,
                    counter: 0
                };
            },
            draw: function(id, x, y) {
                animations[id].counter += 1;
                animations[id].counter = (animations[id].counter % 80) + 1;
                drawImage(id + '_0' + (Math.floor(animations[id].counter/10)) + '.png', x, y);
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

    var kittenProperties = {
        yellow: {
            headImage: "orange_head.png",
            bodyImage: "orange_body.png",
            headOffset: Point(25, 20),
        },
        gray: {
            headImage: "black_head.png",
            bodyImage: "black_body.png",
            headOffset: Point(0, 20),
        },
    };

    var drawHairball = function(hairball) {
        var pos = convertToCanvasCoords(hairball.position);
        drawImage('hairball.png', pos.x, pos.y);
    };

    var drawKitten = function(kitten) {
        var prop = kittenProperties[kitten.color];
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

