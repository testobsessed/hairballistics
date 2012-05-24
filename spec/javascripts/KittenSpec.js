describe('Kitten', function() {
    describe("score", function() {      
      it("starts kittens with a score of 0", function(){
        var kitten = Kitten(0, 0, someProperties);
        expect(kitten.score()).toEqual(0);
      });
      
      it("increments the score", function(){
        var kitten = Kitten(0, 0, someProperties);
        kitten.scoredHit();
        expect(kitten.score()).toEqual(1);        
      })
    });
    
});
