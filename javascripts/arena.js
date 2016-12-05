"use strict";

/**
 * Arena class.
 */
class Game_Arena{

	/**
	 * Init the area for the game based on wxh
	 */
	constructor(two, width, height, color){
		this.two = two;
		this.width = width;
		this.height = height;

		//divided by 5 is 20 percent
		//we can use this value to pad free space on all sides.
		this.height_buf = height/40;
		this.width_buf = width/40;

		this.arena_height = (this.height - this.height_buf);
		this.arena_width = (this.width - this.width_buf);

		this.line1 = two.makeLine(this.width_buf, this.height_buf, this.arena_width, this.height_buf);
		this.line1.stroke = color;
		this.line2 = two.makeLine(this.arena_width, this.height_buf, this.arena_width, this.arena_height);
		this.line2.stroke = color;
		this.line3 = two.makeLine(this.arena_width, this.arena_height, this.width_buf, this.arena_height);
		this.line3.stroke = color;
		this.line4 = two.makeLine(this.width_buf, this.arena_height, this.width_buf, this.height_buf);
		this.line4.stroke = color;
		//this.makeRythum();






	}

	getArenaWidth(){
		return this.arena_width;
	}

	getArenaHeight(){
		return this.arena_height;
	}

	getArenaWMin(){
		return this.width_buf;
	}

	getArenaHMin(){
		return this.height_buf;
	}

	makeRythum(){

		//make an array to hold all the points on each side of the arena
		var left = [];
		var right = [];

		var total_height = this.arena_height - this.height_buf;
		var total_width = this.arena_width - this.arena_buf;

		var total_height_points = total_height/3;

		for(var i = 0; i<total_height_points; i++){
			var y = i*3 + this.height_buf;
			var line = this.two.makeLine(this.arena_width, y, this.arena_width+10, y);
			line.stroke = 'blue';
		}
	}
}