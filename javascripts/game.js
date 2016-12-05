"use strict";

/**
Game object class, that renders a game to a twojs canvas.
**/
class Game{

	//init game
	constructor(two, w, h){

		//hold our two.js instance.
		this.two = two;
	        this.height = h;
                this.width = w;
                this.init();	
	}
        init(){
                this.circle = this.two.makeCircle(300, 300, 50);
                this.circle.fill = 'red';
                this.circle.stroke = 'red';
        }
        update(color){
                this.two.remove(this.circle);
        	this.circle = this.two.makeCircle(300, 300, 50);
                this.circle.fill = color;
                this.circle.stroke = color;

        }
}
