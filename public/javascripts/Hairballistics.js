var Hairballistics = function() {
    var height = HEIGHT;
    var width = WIDTH;
    var hairball = null;
    var kitten = Kitten(25, 70);

    var launchHairball = function(vector) {
        hairball = Hairball(kitten.mouthPosition(), vector);
        return hairball;
    };

    return {
        tick: function() {
            if(hairball) {
                hairball = hairball.tick();
            }
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
                launchHairball(Point(20, 20));
            }
        },
        launchHairball: launchHairball,
        hairballs: function() { return [hairball]; },
    };
};

