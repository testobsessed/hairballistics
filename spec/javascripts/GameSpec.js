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

            it("based on it's velocity", function() {
                world.launchHairball(Point(5,5), Point(10,10));
                world.tick();
                world.withHairball(function(h) {
                    expect(h.position).toEqual(Point(15, 15));
                });
            });
        });
    });
});

describe('A hairball', function() {
});

