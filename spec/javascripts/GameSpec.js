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

    it("can tick itself", function() {
        world.launchHairball(Point(5,5), null);
        world.tick();
        world.withHairball(function(h) {
            expect(h.position).toEqual(Point(6, 5));
        });
    });
});

describe('A hairball', function() {
    it('is at the original position at time = 0', function() {
        var x = 5;
        var y = 5;
        expect(Hairball(Point(x,y), null).atTime(0).position).toEqual(Point(5,5));
    });

    it('moves in linear fashion', function() {
        expect(Hairball(Point(0,0), null).atTime(1).position).toEqual(Point(1,0));
    });
});

