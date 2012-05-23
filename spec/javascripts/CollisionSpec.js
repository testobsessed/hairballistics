describe("rectangle collistion detection", function() {
    var base = Rect(0, 0, 10, 10);

    var move = function(r, dx, dy) {
        return Rect(r.x + dx, r.y + dy, r.w, r.h);
    };

    it("collides when they are both the same", function() {
        expect(Collision.overlap(base, base)).toBeTruthy();
    });

    describe("when y is constant", function() {
        it("does not overlap when to the left", function() {
            expect(Collision.overlap(base, move(base, -20, 0))).toBeFalsy();
        });
        it("does not overlap when to the right", function() {
            expect(Collision.overlap(base, move(base, 20, 0))).toBeFalsy();
        });
        it("does overlap when vertical edges touching", function() {
            expect(Collision.overlap(base, move(base, 10, 0))).toBeTruthy();
        });
    });

    describe("when x is constant", function() {
        it("does not overlap when above", function() {
            expect(Collision.overlap(base, move(base, 0, 20))).toBeFalsy();
        });
        it("does not overlap when below", function() {
            expect(Collision.overlap(base, move(base, 0, -20))).toBeFalsy();
        });
        it("does overlap when horizontal edges touching", function() {
            expect(Collision.overlap(base, move(base, 0, 10))).toBeTruthy();
        });
    });

    describe("when both coordinates are varied", function() {
        it("does not collide when they are not overlapping", function() {
            expect(Collision.overlap(base, move(base, 20, 20))).toBeFalsy();
        });
    });
});
