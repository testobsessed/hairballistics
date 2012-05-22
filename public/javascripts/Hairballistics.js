var Hairballistics = function() {
    var height = HEIGHT;
    var width = WIDTH;
    var hairball = null;
    var kitten = Kitten(25, 70);
    return {
        tick: function() {
            if(hairball) {
                hairball = hairball.tick();
            }
        },
        launchHairball: function(vector) {
            hairball = Hairball(kitten.mouthPosition(), vector);
            return hairball;
        },
        withHairball: function(fn) {
            if (hairball) {
                fn(hairball);
            }
        },
        withKittens: function(fn) {
            fn(kitten);
        }
    };
};

