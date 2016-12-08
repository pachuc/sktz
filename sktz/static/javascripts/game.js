"use strict";

/**
Game object class, that renders a game to a twojs canvas.
**/
class Game{

	//init game
	constructor(two, w, h, num_controllers){

		//hold our two.js instance.
		this.two = two;
	        this.height = h;
                this.width = w;
      	 	this.controllers = num_controllers;
		this.circles = [];
		this.controls;
	}
	updateControls(controls){
		console.log('Got updated controls');
		this.controls = controls;
	}
        draw(){
        	var xinc = this.width/(this.controllers+1);
		var ycord = this.height/2;
		var radius = this.width/(this.controllers*4);
		var color = 'red';
		for(var i = 0; i<this.controllers; i++){
			var xcord = (i+1) * xinc;
			if(this.circles[i]){
				this.two.remove(this.circles[i]);
			}
			if(this.controls){
				var controller_name = 'controller' + i;
                        	if(this.controls[controller_name]['status'] == 'CONNECTED'){
					//console.log(controller_name + ': CONNECTED');
                                	color = 'green';
                        	}
                        	else{
					//console.log(controller_name + ': DISCONNECTED');
                                	color = 'red';
                        	}
			}
			else{
				color = 'red';
			}
			this.circles[i] = this.two.makeCircle(xcord, ycord, radius); 
			this.circles[i].stroke = color;
			this.circles[i].fill = color;
			
		}
	}
        update(){
		this.draw();
        }
}
