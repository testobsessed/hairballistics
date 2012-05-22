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
            it("somewhere after a tick()", function() {
                var oldHairball = world.launchHairball(Point(10,10));
                world.tick();
                world.withHairball(function(newHairball) {
                    expect(newHairball.position).toNotEqual(oldHairball.position);
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

