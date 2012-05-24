var Hairballistics = function() {
    var margin = 25;
    var kittenWidth = 59;
    var right_wall = WIDTH - margin;
    var left_wall = margin;
    var ceiling = HEIGHT - margin;
    var floor = margin;

    var hairball = null;
    var kitten1 = Kitten(left_wall, 70, "yellow");
    var kitten2 = Kitten(right_wall-kittenWidth, 70, "gray");

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

