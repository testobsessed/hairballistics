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

    var pressKey = function(which) {
        keyHandler.keyDownHandler({ keyCode: which });
        keyHandler.keyUpHandler({ keyCode: which });
    };

    beforeEach(function() {
        world = World();
        ticker = Ticker(world);
        detector = WorldCollisionDetector(world);
        keyHandler = KeyHandler(world);
    });

    describe('cheat mode', function() {
        beforeEach(function() {
            givenWorldInGameState();
        });
        it('is disabled by default', function() {
            expect(world.inCheatMode).toBeFalsy();
        });
        describe('when disabled', function() {
            beforeEach(function() {
                world.inCheatMode = false;
            });
            it('is enabled after c is pressed', function() {
                pressKey(KEYS.C);
                expect(world.inCheatMode).toBeTruthy();
            });

            it('does not allow movement via cheat keys', function() {
                world.launchHairball(Point(1, 1));
                var hairballPos = world.hairball.position();
                pressKey(KEYS.L);
                var newPosition = world.hairball.position();
                expect(newPosition).toEqual(hairballPos);
            });
        });
        describe("When enabled", function() {
            beforeEach(function() {
                world.inCheatMode = true;
            });
            it('disables after c is pressed', function() {
                pressKey(KEYS.C);
                expect(world.inCheatMode).toBeFalsy();
            });

            it("disables gravity", function() {
                world.launchHairball(Point(1, 1));
                var hairballPos = world.hairball.position();
                ticker.tick();
                var nextPosition = world.hairball.position();
                expect(hairballPos).toEqual(nextPosition);
            });

            describe('moving the hairball with keys', function() {
                var hairballPos;
                beforeEach(function() {
                    world.launchHairball(Point(1, 1));
                    hairballPos = world.hairball.position();
                });

                it('Moves up on k', function() {
                    pressKey(KEYS.K);
                    var newPosition = world.hairball.position();
                    expect(newPosition).toEqual(Point(hairballPos.x, hairballPos.y + 10));
                });

                it('moves down on j', function() {
                    pressKey(KEYS.J);
                    var newPosition = world.hairball.position();
                    expect(newPosition).toEqual(Point(hairballPos.x, hairballPos.y - 10));
                });

                it('moves left on h', function() {
                    pressKey(KEYS.H);
                    var newPosition = world.hairball.position();
                    expect(newPosition).toEqual(Point(hairballPos.x - 10, hairballPos.y));
                });

                it('moves right on l', function() {
                    pressKey(KEYS.L);
                    var newPosition = world.hairball.position();
                    expect(newPosition).toEqual(Point(hairballPos.x + 10, hairballPos.y));
                });

            });
        });
    });

    describe('intro screen', function() {
        it('is visible at start of game', function() {
            expect(world.introScreenVisible).toBeTruthy();
        });
        it('is invisible after any keypress', function() {
            pressKey(22);
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
                expect(newHairball.position()).toNotEqual(oldHairball.position());
            });
        });
        it('does not splat before it hits anything', function() {
          splatHairBallToward(Point(10,10));
          world.withHairball(function(hairball) {
            expect(hairball.splatted()).toBeFalsy();
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
            keyHandler.keyDownHandler({ keyCode: KEYS.SPACE })
            expect(world.hairballsExist()).toBeFalsy();
        });

        it("does not launch when there is a hairball already in the air", function() {
            spyOn(world, 'getHairball').andReturn({splatted: function() { false; }});
            spyOn(world, 'launchHairball');

            pressKey(KEYS.SPACE);

            expect(world.launchHairball).not.toHaveBeenCalled();
        });

        it("increases power while space is pressed", function() {
            oldMagnitude = Vector.magnitude(world.currentPower())
            keyHandler.keyDownHandler({ keyCode: KEYS.SPACE })
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
            keyHandler.keyDownHandler({ keyCode: KEYS.SPACE })
            _(10).times(function() {
              advanceWorld();
            })
            pressKey(KEYS.SPACE);
            expect(Vector.magnitude(world.currentPower())).toEqual(oldPower);
        });

        it("launches after holding and then releasing space", function() {
            pressKey(KEYS.SPACE);
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
