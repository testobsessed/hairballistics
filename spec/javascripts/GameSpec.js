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
        expect(numKittens).toEqual(1);
    });

    describe("tick", function() {
        describe("moves a hairball", function() {
            it('nowhere until tick() is called', function() {
                world.launchHairball(Point(5,5), Point(10,10));
                world.withHairball(function(h) {
                    expect(h.position).toEqual(Point(5, 5));
                });
            });

            it("somewhere after a tick()", function() {
                world.launchHairball(Point(5,5), Point(10,10));
                world.tick();
                world.withHairball(function(h) {
                    expect(h.position).toNotEqual(Point(5, 5));
                });
            });
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

