describe("KeyHandler", function() {
    var keyHandler = KeyHandler({ introScreenVisible: false });

    it("does not trigger event when we're in between turns", function() {
        keyHandler.suspend();
        var eventSpy = jasmine.createSpy("handler");
        keyHandler.setKeyUpEvents( { 32 : eventSpy });
        keyHandler.setKeyDownEvents( { 32 : eventSpy });

        keyHandler.keyDownHandler({ keyCode: 32 })
        keyHandler.keyUpHandler({ keyCode: 32 })

        expect(eventSpy).not.toHaveBeenCalled();
    });

    it("triggers event after we start a new turn", function() {
        keyHandler.suspend();
        keyHandler.resume();
        var eventSpy = jasmine.createSpy("handler");
        keyHandler.setKeyUpEvents( { 32 : eventSpy });

        keyHandler.keyDownHandler({ keyCode: 32 })
        keyHandler.keyUpHandler({ keyCode: 32 })

        expect(eventSpy).toHaveBeenCalled();
    });
});
