var someProperties = {
    targetingLine: Point(0, 0),
    headOffset: Point(0, 0),
};

describe('Hairballistics', function() {
    var worldState;
    var kitten1;
    var kitten2;
    var ticker;
    var detector;
    var keyHandler;

    var advanceWorld = function() {
        detector.checkCollisions();
        ticker.tick();
    };

    var givenWorldInGameState = function() {
        worldState.introScreenVisible = false;
    };

    var splatHairBallToward = function(point) {
      // point value will determine number of ticks needed to splat
      // hairball hits floor immediately if kitten is at y=0
      worldState.launchHairball(point);
      advanceWorld();
    };

    var setUpDefaultGame = function() {
      kitten1 = Kitten(0, 0, someProperties);
      kitten2 = Kitten(0, 0, someProperties);
      worldState.setCurrentKitten(kitten1);
      worldState.setOpponentKitten(kitten2);
    }

    beforeEach(function() {
        var world = Hairballistics();
        ticker = Ticker(world.worldState);
        detector = CollisionDetector(world.worldState);
        worldState = world.worldState;
        keyHandler = KeyHandler(worldState, function() {});
    });

    describe('intro screen', function() {
        it('is visible at start of game', function() {
            expect(worldState.introScreenVisible).toBeTruthy();
        });
        it('is invisible after any keypress', function() {
            var anyKey = { keyCode: 22 };
            keyHandler.keyUpHandler(anyKey);
            expect(worldState.introScreenVisible).toBeFalsy();
        });
    });

    describe('with no hairballs', function() {

        it("does not call the callback in 'withHairball'", function() {
            var callback = jasmine.createSpy();
            worldState.withHairball(callback);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    it("has a kitten", function() {
        var numKittens = 0;
        worldState.withKittens(function() {
            numKittens += 1;
        });
        expect(numKittens).toEqual(2);
    });

    describe("advancing the world", function() {
        it("moves a hairball somewhere", function() {
            var oldHairball = worldState.launchHairball(Point(10,10));
            advanceWorld();
            worldState.withHairball(function(newHairball) {
                expect(newHairball.position).toNotEqual(oldHairball.position);
            });
        });
        it('does not splat before it hits anything', function() {
          splatHairBallToward(Point(10,10));
          worldState.withHairball(function(hairball) {
            expect(hairball.splatted()).toBeFalsy();
          });
        });

        it("splats when it hits the floor", function() {
            worldState.launchHairball(Point(10,10));
            _(10000).times(function() {
              advanceWorld();
            });
            worldState.withHairball(function(hairball) {
              expect(hairball.splatted()).toBeTruthy();
            });
        });

        it("splats when it hits the wall", function() {
            worldState.launchHairball(Point(490,900));
            _(10).times(function() {
              advanceWorld();
            });
            worldState.withHairball(function(hairball) {
              expect(hairball.splatted()).toBeTruthy();
            });
        });

    });

    describe("Launching a hairball", function() {
        beforeEach(function() {
            givenWorldInGameState();
        });

        it("does not launch while holding space", function() {
            keyHandler.keyDownHandler({ keyCode: 32 })
            var hairball = worldState.hairballs()[0]
            expect(hairball).toBeNull();
        });

        it("increases power while space is pressed", function() {
            oldMagnitude = Vector.magnitude(worldState.currentPower())
            keyHandler.keyDownHandler({ keyCode: 32 })
            advanceWorld();
            expect(Vector.magnitude(worldState.currentPower())).toBeGreaterThan(oldMagnitude);
        });

        it("keeps power constant when space is not pressed", function() {
            oldMagnitude = Vector.magnitude(worldState.currentPower())
            advanceWorld();
            expect(Vector.magnitude(worldState.currentPower())).toEqual(oldMagnitude);
        });

        it("resets the power when space is released", function() {
            var oldPower = Vector.magnitude(worldState.currentPower());
            keyHandler.keyDownHandler({ keyCode: 32 })
            _(10).times(function() {
              advanceWorld();
            })
            keyHandler.keyUpHandler({ keyCode: 32 })
            expect(Vector.magnitude(worldState.currentPower())).toEqual(oldPower);
        });

        it("launches after holding and then releasing space", function() {
            keyHandler.keyDownHandler({ keyCode: 32 })
            keyHandler.keyUpHandler({ keyCode: 32 })
            var hairball = worldState.hairballs()[0]
            expect(hairball).toBeDefined();
            expect(hairball).not.toBeNull();
        });

        it("faints the opponent kitten when it hits it", function() {
            setUpDefaultGame();
            splatHairBallToward(Point(1,1));
            expect(kitten2.fainted()).toBeTruthy();
        });

        it("kitten not fainted if not hairball launched", function() {
            var newKitten = Kitten(1, 1, someProperties);
            worldState.setHairball(Hairball(newKitten.position,Point(1,1)));
            worldState.setOpponentKitten(newKitten);
            expect(newKitten.fainted()).toBeFalsy();
        });
    });

    describe("turns", function() {

        beforeEach(function(){
          setUpDefaultGame();
        })

        it("changes after launched hairball hits something", function() {
            splatHairBallToward(Point(0,1))
            expect(worldState.currentKitten()).toBe(kitten2);
        });

        it("does not change until hairball hits something", function() {
            worldState.launchHairball(Point(1, 1));
            expect(worldState.currentKitten()).toBe(kitten1);
        });
    });

    describe("scores", function() {

        beforeEach(function(){
          setUpDefaultGame();
        });

        it("registers kitty score on direct hit", function() {
            splatHairBallToward(Point(0,1));
            expect(kitten1.score()).toEqual(1);
        });

        it("does not register kitty score on no hit", function() {
            var farAwayKitty = Kitten(100, 100, someProperties);
            worldState.setOpponentKitten(farAwayKitty);
            splatHairBallToward(Point(0, 0));
            expect(kitten1.score()).toEqual(0);
        });
    });

});

describe('Physics', function() {
    describe("gravity", function() {
        it('causes an object to fall', function() {
           var result = Physics.applyGravity(Point(5, 5));

           expect(result).toEqual(Point(5, 4))
        });
    });
});
