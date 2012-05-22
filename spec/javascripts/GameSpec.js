describe('Hairballistics', function() {

    describe('the world', function() {
        it("has a kitten", function() {
            var game = Hairballistics();
            var numKittens = 0;
            game.withKittens(function() {
                numKittens += 1;
            });
            expect(numKittens).toEqual(1);
        });
        describe('Ticking with a new hairballistic', function() {
            it('doesnt throw an exception', function() {
                var game = Hairballistics();
                game.tick();
            });
        });

        it("can tick itself", function() {
            var world = Hairballistics();
            world.launchHairball(5,5);
            world.tick();
            world.withHairball(function(h) {
                expect(h.position).toEqual(Position(6, 5));
            });
        });
        describe('withHairball', function() {
            describe('with no hairball', function() {
                it('does not call the callback', function() {
                    var callback = jasmine.createSpy();
                    var world = Hairballistics();
                    world.withHairball(callback);
                    expect(callback).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('A hairball', function() {
        it('is at the original position at time = 0', function() {
            var x = 5;
            var y = 5;
            expect(Hairball(x,y).atTime(0).position).toEqual(Position(5,5));
        });

        it('moves in linear fashion', function() {
            expect(Hairball(0,0).atTime(1).position).toEqual(Position(1,0));
        });
    });
});
