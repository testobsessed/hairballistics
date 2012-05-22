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

        it("can tick itself", function() {
            var world = Hairballistics();
            world.launchHairball(5,5);
            world.tick();
            world.withHairball(function(h) {
                expect(h.position).toEqual(Position(6, 5));
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
