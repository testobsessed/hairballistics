describe('Vector', function() {
    describe('#add', function() {
        it("adds two simple vectors", function() {
            var v1 = Point(21, 21);
            var v2 = Point(21, 21);

            var result = Vector.add(v1, v2);

            expect(result).toEqual(Point(42, 42));
        });
    });

    describe('#magnitude', function() {
        it("gets the magnitude for a zero vector", function() {
            expect(Vector.magnitude(Point(0,0))).toEqual(0);
        });

        it("gets the magnitude for nonzero vectors", function() {
            expect(Vector.magnitude(Point(0,1))).toEqual(1);
            expect(Vector.magnitude(Point(1,0))).toEqual(1);
            expect(Vector.magnitude(Point(5,0))).toEqual(5);
            expect(Vector.magnitude(Point(0,5))).toEqual(5);
            expect(Vector.magnitude(Point(5,5))).toEqual(Math.sqrt(50));
        });
    });

    describe("#setMagnitude", function() {
        it("sets magnitude", function() {
            expect(Vector.magnitude(Vector.setMagnitude(Point(0, 1), 10))).toEqual(10)
            expect(Vector.magnitude(Vector.setMagnitude(Point(1, 0), 10))).toEqual(10)
            expect(Vector.magnitude(Vector.setMagnitude(Point(5, 5), 20))).toEqual(20)
            expect(Vector.magnitude(Vector.setMagnitude(Point(2, 7), 42))).toEqual(42)
        });
    });

    describe('#turnTo', function() {
        it('turns the vector', function() {
            var vector = Point(1, 1);
            var newVector = Vector.turnToDegrees(vector, 45+90);
            expect(newVector.x).toBeCloseTo(-1);
            expect(newVector.y).toBeCloseTo(1);
        });
    });
});
