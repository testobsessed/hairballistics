describe('Kitten', function() {
    describe("score", function() {      
        it("starts kittens with a score of 0", function(){
            var kitten = Kitten(0, 0, someProperties);
            expect(kitten.score()).toEqual(0);
        });

        it("increments the score", function(){
            var kitten = Kitten(0, 0, someProperties);
            kitten.scoredHit();
            expect(kitten.score()).toEqual(1);        
        })
    });
    
    describe('#resetPower', function() {
        it('keeps the targeting angle', function() {
            var kitten = Kitten(undefined, undefined, {
                targettingLine: Point(-1, 1),
            });
            _(90).times(function() {
                kitten.rotateTargetingLineClockwise();
            });
            kitten.resetPower();
            var v = kitten.targetingLine();
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(1)
        });
    });

    it('rotates targeting line starting with the angle of the initial targeting line', function() {
        var kitten = Kitten(undefined, undefined, {
            targettingLine: Point(-1, 1),
        });
        _(90).times(function() {
            kitten.rotateTargetingLineClockwise();
        });
        var v = kitten.targetingLine();
        expect(v.x).toBeCloseTo(1);
        expect(v.y).toBeCloseTo(1);
    });

});
