var Hairballistics = function() {
    var margin = 25;
    var kittenWidth = 59;
    var right_wall = WIDTH - margin;
    var left_wall = margin;
    var ceiling = HEIGHT - margin;
    var floor = margin;

    var hairball = null;

    var positioningFudgeFactor = 70;
    var kitten1 = Kitten(left_wall + positioningFudgeFactor, 70, {
        headImage: "orange_head.png",
        bodyImage: "orange_body.png",
        headOffset: Point(25, 20),
        mouthOffset: Point(50, 25),
        targettingLine: Point(1, 1),
    });

    var positioningFudgeFactor = 30;
    var kitten2 = Kitten(right_wall-kittenWidth - positioningFudgeFactor, 70, {
        headImage: "black_head.png",
        bodyImage: "black_body.png",
        headOffset: Point(0, 20),
        mouthOffset: Point(-10, 25),
        targettingLine: Point(-1, 1),
    });

    var spacePressed = false;

    var switchPlayer = function() {
        var tmp = kitten1;
        kitten1 = kitten2;
        kitten2 = tmp;
    };

    var launchHairball = function(vector) {
        hairball = Hairball(currentKitten().mouthPosition(), vector);
        return hairball;
    };

    var currentKitten = function() {
        return kitten1;
    };

    var opponentKitten = function() {
        return kitten2;
    };

    var detectCollision = function(object1, object2) {
        return Collision.overlap(object1.boundingRectangle(), object2.boundingRectangle());
    };

    return {
        tick: function() {
            if (hairball) {
                if (detectCollision(hairball, opponentKitten())) {
                    opponentKitten().faint();
                }
            }

            if(hairball && !hairball.splatted()) {
                hairball = hairball.tick();
                if(hairball.position.y <= (floor + margin) || hairball.position.x >= (right_wall - margin)) {
                    hairball.splat();
                    switchPlayer();
                }
            }

            if(spacePressed) {
                currentKitten().incrementPower();
            }
        },
        withHairball: function(fn) {
            if (hairball) {
                fn(hairball);
            }
        },
        withKittens: function(fn) {
            fn(kitten1);
            fn(kitten2);
        },
        keyDownHandler: function(event) {
            if (event.keyCode == 32) {
                spacePressed = true;
            }
        },
        keyUpHandler: function(event) {
            if (event.keyCode == 32) {
                spacePressed = false;
                launchHairball(currentKitten().targettingLine());
                currentKitten().resetPower();
            }
        },
        launchHairball: launchHairball,
        currentPower: function() {
            return currentKitten().targettingLine();
        },
        currentKitten: currentKitten,
        hairballs: function() { return [hairball]; },
        setHairball: function(newHairball) {
            hairball = newHairball;
        },
        setCurrentKitten: function(newKitten) {
            kitten1 = newKitten;
        },
        setOpponentKitten: function(newKitten) {
            kitten2 = newKitten;
        },
    };
};

