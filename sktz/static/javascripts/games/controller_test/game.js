"use strict";

/**
Game object class, that renders a game to a twojs canvas.
**/
class Game{

	constructor(two, w, h, num_controllers, game_id){

		this.two = two;
	        this.height = h;
                this.width = w;
      	 	this.controllers = num_controllers;
		this.circles = [];
		this.controls;
		this.ycords = [];
		for(var i = 0; i<this.controllers; i++){
			this.ycords[i] = this.height/2;
		}
	}
	updateControls(controls){
		this.controls = controls;
	}
	jump(controller_name){
		console.log(controller_name + ' input is ' + this.controls[controller_name]['input']);
		return this.controls[controller_name]['input']['A'];	
	}
        connected(controller_name){
		return (this.controls[controller_name]['status'] == 'CONNECTED');
	}
        draw(){
        	var xinc = this.width/(this.controllers+1);
		var default_ycord = this.height/2;
		var jump_val = this.height/4;               
		var radius = this.width/(this.controllers*4);
		var color = 'red';
		for(var i = 0; i<this.controllers; i++){
			var xcord = (i+1) * xinc;
			if(this.circles[i]){
				this.two.remove(this.circles[i]);
			}
			if(this.controls){
				var controller_name = 'controller' + i;
                        	if(this.connected(controller_name)){
                                	color = 'green';
                        	}
                        	else{
                                	color = 'red';
                        	}
				if(this.ycords[i] != default_ycord){
					this.ycords[i] = this.ycords[i] - 1;
				}
				else if(this.jump(controller_name)){
					console.log('Test');
					this.ycords[i] = this.ycords[i] + jump_val;
				}
				else{
					console.log('Bad test');
				}
			}
			else{
				color = 'red';
				this.ycords[i] = default_ycord;
			}
			this.circles[i] = this.two.makeCircle(xcord, this.ycords[i], radius); 
			this.circles[i].stroke = color;
			this.circles[i].fill = color;
			
		}
		var gamename = this.two.Text('game_id', this.width/2, this.height/4);
		gamename.size = 20;
	}
        update(){
		this.draw();
        }
}
