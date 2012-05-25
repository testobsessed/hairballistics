describe('colliding with boundaries', function () {
  it('should collide hairballs with the left wall', function () {
    var world = new World();
    world.hairball = Hairball(Point(-10,100));
    var detector = WorldCollisionDetector(world);
    detector.checkCollisions();
    expect(world.hairball.splatted()).toBeTruthy();
  });
});

