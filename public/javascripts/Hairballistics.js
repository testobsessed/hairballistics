var kittenWidth = 59;
var margin = 25;
var left_wall = margin;
var right_wall = WIDTH - margin;
var floor = margin;
var positioningFudgeFactor = 30;

var Ticker = function(world) {
    return {
        tick: function() {
            if(world.hairball && !world.hairball.splatted()) {
                world.hairball = world.hairball.tick();
            }
            if(world.spacePressed) {
                world.currentKitten().incrementPower();
            }
        },
    };
};
