"use strict";

/**
 * The main class represeting the game state.
 * Will hold 2 player objects, and reder all aspects of the game to the screen.
 */
class Manatee{

	//init game
	constructor(two, w, h){

		//hold our two.js instance.
		this.two = two;
		var game_arena = new Game_Arena(two, w, h, 'red');
		this.max_width = game_arena.getArenaWidth();
		this.max_height = game_arena.getArenaHeight();
		this.min_height = game_arena.getArenaHMin();
		this.min_width = game_arena.getArenaWMin();
		this.total_width = this.max_width - this.min_width;
		this.total_height = this.max_height - this.min_height;
		this.speed = .3;
		this.onBeat = false;
		this.totalSecs = 0;
		this.resetCounter = 0;
		this.endgame = false;
		this.winner = "";

		//calculate appropriate player size based on arena area
		var area = this.total_height * this.total_width;
		var player_size = area/250;
		player_size = Math.sqrt(player_size);

		//calculate player positions.
		this.player1_starting_X = this.min_width + 100;
		this.player1_starting_Y = this.min_height + 100;

		this.player2_starting_X = this.max_width - 100;
		this.player2_starting_Y = this.max_height - 100;

		//init players in desired location
		this.player1 = new Player(this.player1_starting_X, this.player1_starting_Y, 'red', Math.PI/2, player_size, this.speed, two, 
			this.min_height, this.max_height, this.min_width, this.max_width);
		this.player2 = new Player(this.player2_starting_X, this.player2_starting_Y, 'green', (3*Math.PI)/2, player_size, this.speed, two, 
			this.min_height, this.max_height, this.min_width, this.max_width);

		
	}

	checkWinner(){
		if(this.player1.getScore() == 10){
			this.endgame = true;
			this.winner = "Player 1";
		}

		if(this.player2.getScore() == 10){
			this.endgame = true;
			this.winner = "Player 2";
		}
	}

	restartGame(){
		this.player1.resetScore();
		this.player2.resetScore();
		this.endgame = false;
		this.winner = "";
		this.reset();
	}
	reset() {

		this.player1.setX(this.player1_starting_X);
		this.player1.setY(this.player1_starting_Y);
		this.player1.setTheta(Math.PI/2);
		this.player1.setAim(false, "");


		this.player2.setX(this.player2_starting_X);
		this.player2.setY(this.player2_starting_Y);
		this.player2.setTheta(3*Math.PI/2);
		this.player2.setAim(false, "");

	}

	outofbounds(){
		var p1 = false;
		var p2 = false;

		var p1_x = this.player1.getX();
		var p1_y = this.player1.getY();
		var p2_x = this.player2.getX();
		var p2_y = this.player2.getY();

		var maxX = this.max_width;
		var maxY = this.max_height;
		var minX = this.min_width;
		var minY = this.min_height;

		if(p1_x > maxX || p1_x < minX || p1_y > maxY || p1_y < minY){
			p1 = true;
		}

		if(p2_x > maxX || p2_x < minX || p2_y > maxY || p2_y < minY){
			p2 = true;
		}

		//score first
		if(p1){
			this.player2.score();
		}

		if(p2){
			this.player1.score();
		}

		//then dethrone
		if(p1){
			this.player1.dethrone();
		}

		if(p2){
			this.player2.dethrone();
		}

		if(p1 || p2){
			this.resetCounter = 150;
		}
		


	}

	checkControls(){
		kd.tick();

		if(kd.A.isDown()){
			this.player1.setAim(true, "clockwise")
		}
		else if(kd.D.isDown()){
			this.player1.setAim(true, "counterclockwise");
		}
		else{
			this.player1.setAim(false, "")
		}

		if(kd.LEFT.isDown()){
			this.player2.setAim(true, "clockwise")
		}
		else if(kd.RIGHT.isDown()){
			this.player2.setAim(true, "counterclockwise")
		}
		else{
			this.player2.setAim(false, "")
		}

		if(kd.W.isDown() && this.onBeat){
			this.player1.setShoot();
			this.player1.shootOnCD();
		}
		else if(kd.W.isDown()){
			this.player1.shootOnCD();
		}
		else{
			this.player1.shootCoolingDown();
		}

		if(kd.UP.isDown() && this.onBeat){
			this.player2.setShoot();
			this.player2.shootOnCD();
		}
		else if(kd.UP.isDown()){
			this.player2.shootOnCD();
		}
		else{
			this.player2.shootCoolingDown();
		}

	}
	distance(x1, y1, x2, y2){
		return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
	}
	pointOnCorridor(corridor, x, y, epsilon){
		//check if this point is on the corridor line segement
		
		var x1 = corridor[0];
		var y1 = corridor[1];
		var x2 = corridor[2];
		var y2 = corridor[3];

		//console.log('Checking if point (' + x + ', ' + y + ') is on line: (' + x1 + ', ' + y1 + ') (' + x2 + ', ' + y2 + ')' );

		var cor_dist = this.distance(x1, y1, x2, y2);
		var total_dist = Math.abs(this.distance(x1, y1, x, y)) + Math.abs(this.distance(x2, y2, x, y));
		var diff_dist = Math.abs(cor_dist - total_dist);
		if (diff_dist < epsilon){
			return true;
		}

		return false;


	}
	corridorCollisions(){
		var player1_cor = this.player1.getCorridor();
		var player2_cor = this.player2.getCorridor();
		//console.log('Player 1 corridor: ' + player1_cor);
		//console.log('Player 2 corridor: ' + player2_cor);
		var p1, p2 = false;
		var x1 = this.player1.getX();
		var y1 = this.player1.getY();
		var x2 = this.player2.getX();
		var y2 = this.player2.getY();

		p1 = this.pointOnCorridor(player2_cor, x1, y1, 1);
		p2 = this.pointOnCorridor(player1_cor, x2, y2, 1);
		
		if(p1){
			this.player1.dethrone();
			this.player2.score();
		}

		if(p2){
			this.player2.dethrone();
			this.player1.score();
		}

		if(p1 || p2){
			this.resetCounter = 150;
		}

	}
	//update the game state.
	update(frameCount){

		if(this.resetCounter == 0){
			this.totalSecs = 1.0 * frameCount/60.0;
			var interval = this.totalSecs % .444;
			if(interval <= 0.17 || interval >= .274){
				this.onBeat = true;
			}
			else{
				this.onBeat = false;
			}
			//check controls
			this.checkControls();
			this.player1.update();
			this.player2.update();
			this.outofbounds();
			this.corridorCollisions();
			this.checkWinner();
		}
		else if(this.resetCounter == 1){
			this.reset();
			this.resetCounter--;
		}
		else{
			this.resetCounter--;
		}

	}
}