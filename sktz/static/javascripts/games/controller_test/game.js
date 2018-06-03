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
		this.game_id = game_id
		this.circles = [];
		this.controls;
		this.ycords = [];

		// player vars
		this.usernames = [];
		this.messages = [];
		this.messageText = [];
		this.usernameText = [];

		for(var i = 0; i<this.controllers; i++){
			this.ycords[i] = this.height/2;
		}
	}
	updateControls(controls){
		this.controls = controls;

		console.log(this.controls);
	}
	updateMessages(controller_name, controller_num) {
		this.messages[controller_num] = this.controls[controller_name]['input'];
	}
	updateUsernames(controller_name, controller_num) {
		this.usernames[controller_num] = this.controls[controller_name]['username'];
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
				this.updateMessages(controller_name, i);
				this.updateUsernames(controller_name, i);
                if(this.connected(controller_name)){
                    color = 'green';
                }
            	else{
                    color = 'red';
            	}
				if(this.ycords[i] != default_ycord){
					this.ycords[i] = this.ycords[i] - 1;
				}
			}
			else{
				color = 'red';
				this.ycords[i] = default_ycord;
			}
			this.circles[i] = this.two.makeCircle(xcord, this.ycords[i], radius); 
			this.circles[i].stroke = color;
			this.circles[i].fill = color;

			this.usernameText[i] = this.two.makeText(this.usernames[i], xcord, this.height*3/4);
			this.usernameText[i].size = 20;
			this.usernameText[i].stroke = color;
			this.usernameText[i].fill = color;

			this.messageText[i] = this.two.makeText(this.messages[i], xcord, this.ycords[i]);
			this.messageText[i].size = 20;
			this.messageText[i].stroke = 'white';
			this.messageText[i].fill = 'white';
			
		}
		var gamename = this.two.makeText(this.game_id, this.width/2, this.height/4);
		gamename.size = 40;
		gamename.stroke ='red';
		gamename.fill = 'red';
	}
    update(){
		this.draw();
    }
}
