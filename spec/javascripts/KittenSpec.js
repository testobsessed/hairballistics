describe('Kitten', function() {
    describe('#rotateTargetingLineClockwise', function() {
        it('increases angle by 1 degree', function() {
            var kitten = Kitten(undefined, undefined, {
                targettingLine: Point(1, 1),
            });
            _(45).times(function() {
                kitten.rotateTargetingLineClockwise();
            });
            expect(kitten.targetingLine().x).toBeCloseTo(Math.sqrt(2));
            expect(kitten.targetingLine().y).toBeCloseTo(0, 2);
        });
    });
});
