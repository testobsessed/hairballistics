var someProperties = {
    targetingLine: Point(0, 0),
    mouthOffset: Point(0, 0),
};

describe('Hairballistics', function() {
    var world;
    var kitten1;
    var kitten2;
    
    var splatHairBallToward = function(point) {
      // point value will determine number of ticks needed to splat
      // hairball hits floor immediately if kitten is at y=0
      world.launchHairball(point);
      world.tick();            
    };
    
    var setUpDefaultGame = function() {
      kitten1 = Kitten(0, 0, someProperties);
      kitten2 = Kitten(0, 0, someProperties);
      world.setCurrentKitten(kitten1);
      world.setOpponentKitten(kitten2);                      
    }
    
    beforeEach(function() {
        world = Hairballistics();
    });
    
    describe('with no hairballs', function() {
      
        it("doesn't throw an exception on 'tick'", function() {
            world.tick();
        });
        
        it("does not call the callback in 'withHairball'", function() {
            var callback = jasmine.createSpy();
            world.withHairball(callback);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    it("has a kitten", function() {
        var numKittens = 0;
        world.withKittens(function() {
            numKittens += 1;
        });
        expect(numKittens).toEqual(2);
    });

    describe("tick", function() {
        it("moves a hairball somewhere", function() {
            var oldHairball = world.launchHairball(Point(10,10));
            world.tick();
            world.withHairball(function(newHairball) {
                expect(newHairball.position).toNotEqual(oldHairball.position);
            });
        });
        it('does not splat before it hits anything', function() {
          splatHairBallToward(Point(10,10));
          world.withHairball(function(hairball) {
            expect(hairball.splatted()).toBeFalsy();
          });
        });

        it("splats when it hits the floor", function() {
            world.launchHairball(Point(10,10));
            _(10000).times(function() {
              world.tick();
            });
            world.withHairball(function(hairball) {
              expect(hairball.splatted()).toBeTruthy();
            });
        });

        it("splats when it hits the wall", function() {
            world.launchHairball(Point(490,900));
            _(10).times(function() {
              world.tick();
            });
            world.withHairball(function(hairball) {
              expect(hairball.splatted()).toBeTruthy();
            });
        });

    });

    describe("Launching a hairball", function() {
        it("does not launch while holding space", function() {
            world.keyDownHandler({ keyCode: 32 })
            var hairball = world.hairballs()[0]
            expect(hairball).toBeNull();
        });

        it("increases power while space is pressed", function() {
            oldMagnitude = Vector.magnitude(world.currentPower())
            world.keyDownHandler({ keyCode: 32 })
            world.tick();
            expect(Vector.magnitude(world.currentPower())).toBeGreaterThan(oldMagnitude);
        });

        it("keeps power constant when space is not pressed", function() {
            oldMagnitude = Vector.magnitude(world.currentPower())
            world.tick();
            expect(Vector.magnitude(world.currentPower())).toEqual(oldMagnitude);
        });

        it("starts the power at some small value", function() {
            expect(Vector.magnitude(world.currentPower())).toBeLessThan(2);
        });

        it("resets the power when space is released", function() {
            world.keyDownHandler({ keyCode: 32 })
            _(10).times(function() {
              world.tick();
            })
            world.keyUpHandler({ keyCode: 32 })
            expect(Vector.magnitude(world.currentPower())).toBeLessThan(2);
        });

        it("launches after holding and then releasing space", function() {
            world.keyDownHandler({ keyCode: 32 })
            world.keyUpHandler({ keyCode: 32 })
            var hairball = world.hairballs()[0]
            expect(hairball).toBeDefined();
            expect(hairball).not.toBeNull();
        });
        
        it("faints the opponent kitten when it hits it", function() {
            setUpDefaultGame();
            splatHairBallToward(Point(1,1));
            expect(kitten2.fainted()).toBeTruthy();
        });

        it("kitten not fainted if not hairball launched", function() {
            var newKitten = Kitten(1, 1, someProperties);
            world.setHairball(Hairball(newKitten.position,Point(1,1)));
            world.setOpponentKitten(newKitten);
            expect(newKitten.fainted()).toBeFalsy();
        });
    });

    describe("turns", function() {
      
        beforeEach(function(){
          setUpDefaultGame();
        })

        it("changes after launched hairball hits something", function() {
            splatHairBallToward(Point(0,1))
            expect(world.currentKitten()).toBe(kitten2);
        });
        
        it("does not change until hairball hits something", function() {
            world.launchHairball(Point(1, 1));
            expect(world.currentKitten()).toBe(kitten1);
        });
    });
    
    describe("scores", function() { 
       
        beforeEach(function(){
          setUpDefaultGame();
        });
        
        it("registers kitty score on direct hit", function() {
            splatHairBallToward(Point(0,1));
            expect(kitten1.score()).toEqual(1);
        }); 
        
        it("does not register kitty score on no hit", function() {
            var farAwayKitty = Kitten(100, 100, someProperties);
            world.setOpponentKitten(farAwayKitty);
            splatHairBallToward(Point(0, 0));
            expect(kitten1.score()).toEqual(0);
        });
    });
    
});

describe('Physics', function() {
    describe("gravity", function() {
        it('causes an object to fall', function() {
           var result = Physics.applyGravity(Point(5, 5));

           expect(result).toEqual(Point(5, 4))
        });
    });
});

