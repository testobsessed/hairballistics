var Hairballistics = function() {
    return {
        kittens: ['bla']
    };
};

var Trajectory = function(pos) {
    return {
        atTime: function(tick) {
            return Mover.moveX(pos, tick);
        }
    };
};

var Mover = {
    moveX: function(position, offset) {
        return Position(position.x + offset, position.y);
    }
}
var Position = function(x, y) {
    return {
        x: x,
        y: y,
    };
};

describe('Hairballistics', function() {
    it("has a kitten in the game", function() {
        game = Hairballistics();
        expect(game.kittens.length).toEqual(1);
    });

    describe('A hairball', function() {
        it('is at the original position at time = 0', function() {
            var x = 5;
            var y = 5;
            expect(Trajectory(Position(x, y)).atTime(0)).toEqual(Position(5,5));
        });
        it('moves in linear fashion', function() {
            expect(Trajectory(Position(0, 0)).atTime(1)).toEqual(Position(1,0));
        });
    });
});
