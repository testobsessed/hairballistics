window.onload = function () {
    var canvas = document.getElementById("game");
    if (canvas) {
        var context = canvas.getContext("2d");
        context.fillStyle = "red";
        context.fillRect(30, 30, 50, 50);
    }
}
