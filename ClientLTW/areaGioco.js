
function startGame(){
	myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
}
/*
The function startGame() invokes the method start() of the myGameArea object.

The start() method creates a <canvas> element and inserts it as the first childnode of the <body> element.
*/
