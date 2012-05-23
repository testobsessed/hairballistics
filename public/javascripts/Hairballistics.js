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

    var launchHairball = function(vector) {
        hairball = Hairball(kitten1.mouthPosition(), vector);
        return hairball;
    };

    return {
        tick: function() {
            if(hairball && !hairball.splatted()) {
                hairball = hairball.tick();
                if(hairball.position.y <= (floor + margin) || hairball.position.x >= (right_wall - margin)) {
                    hairball.splat();
                }
            }

            if(spacePressed) {
                kitten1.incrementPower();
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
                launchHairball(kitten1.targettingLine());
                kitten1.resetPower();
            }
        },
        launchHairball: launchHairball,
        currentPower: function() {
            return kitten1.targettingLine();
        },
        hairballs: function() { return [hairball]; },
    };
};

