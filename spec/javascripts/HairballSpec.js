describe('Hairball', function () {
    describe('hasNotSplattedAKitten', function() {
        it('starts out true', function () {
            var hairball = Hairball(Point(1,1));
            expect(hairball.hasNotSplattedAKitten()).toBeTruthy();
        });
        it('becomes false on splatKitten', function () {
            var hairball = Hairball(Point(1,1));
            hairball.splatKitten();
            expect(hairball.hasNotSplattedAKitten()).toBeFalsy();
        });
    })
});

