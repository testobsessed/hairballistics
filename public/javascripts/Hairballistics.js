var Hairballistics = function() {
    var margin = 25;
    var kittenWidth = 59;
    var right_wall = WIDTH - margin;
    var left_wall = margin;
    var ceiling = HEIGHT - margin;
    var floor = margin;
    var hairball = null;
    var kitten1 = Kitten(left_wall, 70);
    var kitten2 = Kitten(right_wall-kittenWidth, 70);

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

            kitten1 = kitten1.tick();
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
        keydownHandler: function(event) {
            if (event.keyCode == 32) {
                launchHairball(kitten1.targettingLine());
            }
        },
        launchHairball: launchHairball,
        hairballs: function() { return [hairball]; },
    };
};

