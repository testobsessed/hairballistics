var Ticker = function(world) {
    return {
        tick: function() {
            if(world.hairball && !world.hairball.splatted() && !world.inCheatMode) {
                world.hairball = world.hairball.tick();
            }
            if(world.spacePressed) {
                world.currentKitten().incrementPower();
            }
        },
    };
};
