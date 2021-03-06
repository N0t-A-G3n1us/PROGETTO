var myGamePiece;

function startGame() {
	myGameArea.start();
	myGamePiece = new component(30,30,"red",10,120);
	}

function component (width, height, color, x, y) {
	this.width= width;
	this.height=height;
	this.x=x;
	this.y=y;
	 this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
	}
	
	var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
	
function updateGameArea(){
	myGameArea.clear();
    for(i=0;i<1000;i++)
		myGamePiece.x+=1
	for(i=0;i<1000;i++)
		myGamePiece.y+=1
	for(i=0;i<1000;i++)
		myGamePiece.x-=1
	for(i=0;i<1000;i++)
		myGamePiece.y-=1
    myGamePiece.update();
	}
