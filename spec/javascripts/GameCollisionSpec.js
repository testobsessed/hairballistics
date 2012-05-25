describe("colliding hairballswith boundaries", function () {
    var world, detector;
    var inTheSky = 1000;
    beforeEach(function() {
        world = new World();
        detector = WorldCollisionDetector(world);
    });
    it("splats when it hits the floor", function() {
        var betweenTheWalls = world.rightWall / 2
        world.hairball = Hairball(Point(world.floor, betweenTheWalls));
        detector.checkCollisions();
        expect(world.hairball.splatted()).toBeTruthy();
    });

    it("splats when it hits the right wall", function() {
        world.hairball = Hairball(Point(world.rightWall,inTheSky));
        detector.checkCollisions();
        expect(world.hairball.splatted()).toBeTruthy();
    });

    it("splats when it hits the left wall", function () {
        world.hairball = Hairball(Point(world.leftWall,inTheSky));
        detector.checkCollisions();
        expect(world.hairball.splatted()).toBeTruthy();
    });
});

