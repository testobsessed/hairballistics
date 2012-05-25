var World = function() {
    var kittenWidth = 59;
    var margin = 25;
    var left_wall = margin;
    var right_wall = WIDTH - margin;
    var floor = margin;
    var positioningFudgeFactor = 30;

    var getHairball = function() {
        return stateObject.hairball;
    };
    var stateObject = {
        margin: margin,
        floor: floor,
        left_wall: left_wall,
        right_wall: right_wall,
        positioningFudgeFactor: positioningFudgeFactor,
        hairball: null,
        spacePressed: false,
        introScreenVisible: true,
        kitten1: Kitten(left_wall + positioningFudgeFactor, 70, {
            headImage: "orange_head.png",
            bodyImage: "orange_body.png",
            headOffset: Point(39, 0),
            mouthOffset: Point(50, 25),
            bamOffset: Point(80, -90),
            targetingLine: Point(2, 1),
        }),
        kitten2: Kitten(right_wall-kittenWidth - positioningFudgeFactor, 70, {
            headImage: "black_head.png",
            bodyImage: "black_body.png",
            headOffset: Point(12, 0),
            mouthOffset: Point(-10, 25),
            bamOffset: Point(-155, -90),
            targetingLine: Point(-2, 1),
        }),
        switchPlayer: function() {
            var tmp = stateObject.kitten1;
            stateObject.kitten1 = stateObject.kitten2;
            stateObject.kitten2 = tmp;
        },
        currentKitten: function() {
            return stateObject.kitten1;
        },
        opponentKitten: function() {
            return stateObject.kitten2;
        },
        launchHairball: function(vector) {
            var hairballPos = stateObject.currentKitten().headPosition();
            var hairballOffset = Point(-15, 15);

            stateObject.hairball = Hairball(Vector.add(hairballPos, hairballOffset), vector);
            return stateObject.hairball;
        },
        withHairball: function(fn) {
            if (stateObject.hairball) {
                fn(stateObject.hairball);
            }
        },
        withKittens: function(fn) {
            fn(stateObject.kitten1);
            fn(stateObject.kitten2);
        },
        withTerrain: function(fn) {
            var terrain = [0, 0, 0, 1, 2, 3, 2];
            fn(terrain);
        },
        setCurrentKitten: function(newKitten) {
            stateObject.kitten1 = newKitten;
        },
        setOpponentKitten: function(newKitten) {
            stateObject.kitten2 = newKitten;
        },
        setHairball: function(newHairball) {
            stateObject.hairball = newHairball;
        },
        getHairball: getHairball,
        hairballsExist: getHairball,
        currentPower: function() {
            return stateObject.currentKitten().targetingLine();
        },
    };
    return stateObject;
};
