var someProperties = {
    targetingLine: Point(0, 0),
    headOffset: Point(0, 0),
};

describe('Hairballistics', function() {
    var world;
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
        world.introScreenVisible = false;
    };

    var splatHairBallToward = function(point) {
      // point value will determine number of ticks needed to splat
      // hairball hits floor immediately if kitten is at y=0
      world.launchHairball(point);
      advanceWorld();
    };

    var setUpDefaultGame = function() {
      kitten1 = Kitten(0, 0, someProperties);
      kitten2 = Kitten(0, 0, someProperties);
      world.setCurrentKitten(kitten1);
      world.setOpponentKitten(kitten2);
    }

    beforeEach(function() {
        world = WorldState();
        ticker = Ticker(world);
        detector = CollisionDetector(world);
        keyHandler = KeyHandler(world, function() {});
    });

    describe('intro screen', function() {
        it('is visible at start of game', function() {
            expect(world.introScreenVisible).toBeTruthy();
        });
        it('is invisible after any keypress', function() {
            var anyKey = { keyCode: 22 };
            keyHandler.keyUpHandler(anyKey);
            expect(world.introScreenVisible).toBeFalsy();
        });
    });

    describe('with no hairballs', function() {

        it("does not call the callback in 'withHairball'", function() {
            var callback = jasmine.createSpy();
            world.withHairball(callback);
            expect(callback).not.toHaveBeenCalled();
        });

        describe("the world", function () {
          it("reports that there are no hairballs", function() {
            expect(world.hairballsExist()).toBeFalsy();
          });
        });
    });

    it("has a kitten", function() {
        var numKittens = 0;
        world.withKittens(function() {
            numKittens += 1;
        });
        expect(numKittens).toEqual(2);
    });

    describe("advancing the world", function() {
        it("moves a hairball somewhere", function() {
            var oldHairball = world.launchHairball(Point(10,10));
            advanceWorld();
            world.withHairball(function(newHairball) {
                expect(newHairball.position).toNotEqual(oldHairball.position);
            });
        });
        it('does not splat before it hits anything', function() {
          splatHairBallToward(Point(10,10));
          world.withHairball(function(hairball) {
            expect(hairball.splatted()).toBeFalsy();
          });
        });

        it("splats when it hits the floor", function() {
            world.launchHairball(Point(10,10));
            _(10000).times(function() {
              advanceWorld();
            });
            world.withHairball(function(hairball) {
              expect(hairball.splatted()).toBeTruthy();
            });
        });

        it("splats when it hits the wall", function() {
            world.launchHairball(Point(490,900));
            _(10).times(function() {
              advanceWorld();
            });
            world.withHairball(function(hairball) {
              expect(hairball.splatted()).toBeTruthy();
            });
        });

    });

    describe("launching a hairball", function() {
        beforeEach(function() {
            givenWorldInGameState();
        });

        describe("the world", function() {
          it("reports that there is a hairball after launching", function() {
            world.launchHairball(Point(1, 1));
            expect(world.hairballsExist()).toBeTruthy();
          });
        });

        it("does not launch while holding space", function() {
            keyHandler.keyDownHandler({ keyCode: 32 })
            expect(world.hairballsExist()).toBeFalsy();
        });

        it("does not launch when there is a hairball already in the air", function() {
            spyOn(world, 'getHairball').andReturn({splatted: function() { false; }});
            spyOn(world, 'launchHairball');

            keyHandler.keyUpHandler({ keyCode: 32 });

            expect(world.launchHairball).not.toHaveBeenCalled();
        });

        it("increases power while space is pressed", function() {
            oldMagnitude = Vector.magnitude(world.currentPower())
            keyHandler.keyDownHandler({ keyCode: 32 })
            advanceWorld();
            expect(Vector.magnitude(world.currentPower())).toBeGreaterThan(oldMagnitude);
        });

        it("keeps power constant when space is not pressed", function() {
            oldMagnitude = Vector.magnitude(world.currentPower())
            advanceWorld();
            expect(Vector.magnitude(world.currentPower())).toEqual(oldMagnitude);
        });

        it("resets the power when space is released", function() {
            var oldPower = Vector.magnitude(world.currentPower());
            keyHandler.keyDownHandler({ keyCode: 32 })
            _(10).times(function() {
              advanceWorld();
            })
            keyHandler.keyUpHandler({ keyCode: 32 })
            expect(Vector.magnitude(world.currentPower())).toEqual(oldPower);
        });

        it("launches after holding and then releasing space", function() {
            keyHandler.keyDownHandler({ keyCode: 32 })
            keyHandler.keyUpHandler({ keyCode: 32 })
            expect(world.hairballsExist()).toBeTruthy();
        });

        it("faints the opponent kitten when it hits it", function() {
            setUpDefaultGame();
            splatHairBallToward(Point(1,1));
            expect(kitten2.fainted()).toBeTruthy();
        });

        it("kitten not fainted if not hairball launched", function() {
            var newKitten = Kitten(1, 1, someProperties);
            world.setHairball(Hairball(newKitten.position,Point(1,1)));
            world.setOpponentKitten(newKitten);
            expect(newKitten.fainted()).toBeFalsy();
        });
    });

    describe("turns", function() {

        beforeEach(function(){
          setUpDefaultGame();
        })

        it("changes after launched hairball hits something", function() {
            splatHairBallToward(Point(0,1))
            expect(world.currentKitten()).toBe(kitten2);
        });

        it("does not change until hairball hits something", function() {
            world.launchHairball(Point(1, 1));
            expect(world.currentKitten()).toBe(kitten1);
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
            world.setOpponentKitten(farAwayKitty);
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
