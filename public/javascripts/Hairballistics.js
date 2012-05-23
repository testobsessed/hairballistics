var Hairballistics = function() {
    var margin = 25;
    var right_wall = WIDTH - margin;
    var left_wall = margin;
    var ceiling = HEIGHT - margin;
    var floor = margin;
    var hairball = null;
    var kitten = Kitten(floor, 70);

    var launchHairball = function(vector) {
        hairball = Hairball(kitten.mouthPosition(), vector);
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

            kitten = kitten.tick();
        },
        withHairball: function(fn) {
            if (hairball) {
                fn(hairball);
            }
        },
        withKittens: function(fn) {
            fn(kitten);
        },
        keydownHandler: function(event) {
            if (event.keyCode == 32) {
                launchHairball(kitten.targettingLine());
            }
        },
        launchHairball: launchHairball,
        hairballs: function() { return [hairball]; },
    };
};

