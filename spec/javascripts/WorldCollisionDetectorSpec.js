describe('Collisions in the world:', function() {
    it('hairball can collide with terrain', function() {
        var world = World();
        var detector = WorldCollisionDetector(world);

        world.setHairball(Hairball(Point(100, 100)));
        world.setTerrain([
            Rect(0, 0, 101, 101),
        ]);

        detector.checkCollisions();
        expect(world.hairball.splatted()).toBeTruthy();
    });
    it('hairball colliding with terrain switchesPlayer', function() {
        var world = World();
        spyOn(world, 'hairballSplat');
        var detector = WorldCollisionDetector(world);

        world.setHairball(Hairball(Point(100, 100)));
        world.setTerrain([
            Rect(0, 0, 101, 101),
        ]);

        detector.checkCollisions();
        expect(world.hairballSplat).toHaveBeenCalled();
    });
    it('hairball colliding with terrain switches player only once', function() {
        var world = World();
        spyOn(world, 'hairballSplat');
        var detector = WorldCollisionDetector(world);

        world.setHairball(Hairball(Point(100, 100)));
        world.setTerrain([
            Rect(0, 0, 101, 101),
        ]);

        detector.checkCollisions();
        detector.checkCollisions();
        expect(world.hairballSplat.callCount).toEqual(1);
    });
});
