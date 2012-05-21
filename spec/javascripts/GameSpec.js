var Hairballistics = function() {
    return { kittens: ['bla'] };
};
describe('Hairballistics', function() {
    it("has a kitten in the game", function() {
        game = Hairballistics();
        expect(game.kittens.length).toEqual(1);
    });
});
