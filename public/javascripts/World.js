var World = function() {
    var kittenWidth = 59;
    var margin = 25;
    var leftWall = margin;
    var rightWall = WIDTH - margin;
    var floor = margin;
    var positioningFudgeFactor = 30;

    var getHairball = function() {
        return stateObject.hairball;
    };

    var opponentKitten = function() {
        return stateObject.kitten2;
    };
    var stateObject = {
        margin: margin,
        floor: floor,
        leftWall: leftWall,
        rightWall: rightWall,
        positioningFudgeFactor: positioningFudgeFactor,
        hairball: null,
        spacePressed: false,
        introScreenVisible: true,
        kitten1: Kitten(leftWall + positioningFudgeFactor, 70, {
            headImage: "orange_head.png",
            bodyImage: "orange_body.png",
            headOffset: Point(39, 0),
            mouthOffset: Point(50, 25),
            bamOffset: Point(80, -90),
            targetingLine: Point(2, 1),
        }),
        kitten2: Kitten(rightWall-kittenWidth - positioningFudgeFactor, 70, {
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
            $(this).trigger('switchPlayerEvent');
        },
        onSwitchPlayer: function(callback) {
            $(this).on('switchPlayerEvent', callback);
        },
        currentKitten: function() {
            return stateObject.kitten1;
        },
        opponentKitten: opponentKitten,
        faintKitten: function() {
            $(this).trigger('faintEvent', opponentKitten());
        },
        onFaintKitten: function(callback) {
            $(this).on('faintEvent', callback);
        },
        hairballSplat: function() {
            stateObject.hairball.splat();
            $(this).trigger('splatEvent');
        },
        onHairballSplat: function(callback) {
            $(this).on('splatEvent', callback);
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

        terrainRectangles: [],
        withTerrain: function(fn) {
            var terrain = [0, 1, 2, 5, 3, 2, 1, 4, 5, 2, 4, 3, 1];
            fn(terrain);
        },
        setTerrain: function(terrainRectangles) {
            stateObject.terrainRectangles = terrainRectangles;
        },
        getTerrain: function() {
            return stateObject.terrainRectangles;
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
    _.each([0, 1, 2, 5, 3, 2, 1, 4, 5, 2, 4, 3, 1], function(height, i) {
        var heights = {
            0: 0,
            1: 33,
            2: 60,
            3: 93,
            4: 117,
            5: 141,
        };
        stateObject.terrainRectangles.push(
            Rect(
                60*i + leftWall + positioningFudgeFactor,
                floor,
                60,
                heights[height]));
    });
    return stateObject;
};
