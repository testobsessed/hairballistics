describe('Hairballistics', function() {
    var world;
    beforeEach(function() {
        world = Hairballistics();
    });
    describe('with no hairballs', function() {
        it("doesn't throw an exception on 'tick'", function() {
            world.tick();
        });
        it("does not call the callback in 'withHairball'", function() {
            var callback = jasmine.createSpy();
            world.withHairball(callback);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    it("has a kitten", function() {
        var numKittens = 0;
        world.withKittens(function() {
            numKittens += 1;
        });
        expect(numKittens).toEqual(2);
    });

    describe("tick", function() {
        describe("moves a hairball", function() {
            it("somewhere after a tick()", function() {
                var oldHairball = world.launchHairball(Point(10,10));
                world.tick();
                world.withHairball(function(newHairball) {
                    expect(newHairball.position).toNotEqual(oldHairball.position);
                });
            });
            it('does not splat before it hits anything', function() {
              world.launchHairball(Point(10,10));
              world.tick();
              world.withHairball(function(hairball) {
                expect(hairball.splatted()).toBeFalsy();
              });
            });

            it("splats when it hits the floor", function() {
                world.launchHairball(Point(10,10));
                _(10000).times(function() {
                  world.tick();
                });
                world.withHairball(function(hairball) {
                  expect(hairball.splatted()).toBeTruthy();
                });
            });

            it("splats when it hits the wall", function() {
                world.launchHairball(Point(490,900));
                _(10).times(function() {
                  world.tick();
                });
                world.withHairball(function(hairball) {
                  expect(hairball.splatted()).toBeTruthy();
                });
            });

            it("faints the kitten when it hits it", function() {
                var newKitten = Kitten(1,1,'black');
                world.setHairball(Hairball(newKitten.position,Point(1,1)));
                world.setCurrentKitten(newKitten);
                world.tick();
                expect(newKitten.fainted()).toBeTruthy();
            });

            it("kitten not fainted if not hairball launched", function() {
                var newKitten = Kitten(1,1,'black');
                world.setHairball(Hairball(newKitten.position,Point(1,1)));
                world.setCurrentKitten(newKitten);
                expect(newKitten.fainted()).toBeFalsy();
            });
        });
    });

    describe("Launching a hairball", function() {
        it("does not launch while holding space", function() {
            world.keyDownHandler({ keyCode: 32 })
            var hairball = world.hairballs()[0]
            expect(hairball).toBeNull();
        });

        it("increases power while space is pressed", function() {
            oldMagnitude = Vector.magnitude(world.currentPower())
            world.keyDownHandler({ keyCode: 32 })
            world.tick();
            expect(Vector.magnitude(world.currentPower())).toBeGreaterThan(oldMagnitude);
        });

        it("keeps power constant when space is not pressed", function() {
            oldMagnitude = Vector.magnitude(world.currentPower())
            world.tick();
            expect(Vector.magnitude(world.currentPower())).toEqual(oldMagnitude);
        });

        it("starts the power at some small value", function() {
            expect(Vector.magnitude(world.currentPower())).toBeLessThan(2);
        });

        it("resets the power when space is released", function() {
            world.keyDownHandler({ keyCode: 32 })
            _(10).times(function() {
              world.tick();
            })
            world.keyUpHandler({ keyCode: 32 })
            expect(Vector.magnitude(world.currentPower())).toBeLessThan(2);
        });

        it("launches after holding then releasing space", function() {
            world.keyDownHandler({ keyCode: 32 })
            world.keyUpHandler({ keyCode: 32 })
            var hairball = world.hairballs()[0]
            expect(hairball).toBeDefined();
            expect(hairball).not.toBeNull();
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

