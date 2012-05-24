describe('Kitten', function() {
    describe("score", function() {      
        it("starts at 0", function(){
            var kitten = Kitten(0, 0, someProperties);
            expect(kitten.score()).toEqual(0);
        });

        it("hit increments the score", function(){
            var kitten = Kitten(0, 0, someProperties);
            kitten.scoredHit();
            expect(kitten.score()).toEqual(1);        
        })
    });
    
    describe('targetting to the top left', function() {
        var kitten;
        beforeEach(function() {
            kitten = Kitten(undefined, undefined, {
                targetingLine: Point(-1, 1),
            });
            _(90).times(function() {
                kitten.rotateTargetingLineClockwise();
            });
        });

        it('keeps the targeting angle after power is reset', function() {
            kitten.resetPower();
            var v = kitten.targetingLine();
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(1);
        });

        it('rotates targeting line starting with the angle of the initial targeting line', function() {
            var v = kitten.targetingLine();
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(1);
        });
    });
});
