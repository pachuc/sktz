"use strict";


function Main(game_id) {

    var w = $('#Main').width();
	var h = $('#Main').height();
	var elem = document.getElementById('Main');
	var FRAMERATE = 60/1000;//60 fps
    var two = new Two({
    	width: w,
    	height: h
    });
    var game = new Game(two, w, h, game_id);
    two.appendTo(elem);
	two.bind('update', function(frameCount){game.update();});
    
    setInterval(function() {
        two.update();
    }, FRAMERATE);
}

class Game{

	constructor(two, w, h, game_id){

        // required game vars
		this.two = two;
		this.height = h;
        this.width = w;
        this.game_id = game_id
        this.num_controllers = 5;
        // required game state vars
        this.game_state = {};
        this.game_state['CAN_CONNECT'] = true;
        this.game_state['NUM_CONTROLLERS'] = this.num_controllers;
        this.game_state['CONTROLLER_TEMPLATE'] = 'trivia_controller.html';
        this.game_state['GAME_ID'] = game_id;

        // trivia game state vars
        this.game_state['game_phase'] = 'waiting';


        this.controller_state = [];
        this.post_game_data();
        this.init_player_vars();


        // drawing variables
        this.hinc = this.height/10;
        this.winc = this.width/10;

        
    }
    
    post_game_data() {
        fetch('/post-game-data/' + this.game_id, {
                method: 'post',
                body: JSON.stringify(this.game_state)
        })
    }

    get_controller_data() {
        fetch('/get-controller-data/' + this.game_id)
		.then(
    		response => { return response.json(); }
		)
		.then(
    		json => { this.controller_state = json; }
		);
    }

    init_player_vars() {
        this.player_colors = ['red', 'blue', 'green', 'yellow', 'purple'];
        this.player_scores = [];
        for (var i = 0; i < this.num_controllers; i++) {
            this.player_scores[i] = 0;
        }
    }

    draw_players() {
        var controller_id = 0;
        var username_text = [];
        var score_text = [];
        for (var controller in this.controller_state) {
            var score = this.player_scores[controller_id];
            var username = controller['username'];
            var color = this.player_colors[controller_id];
            var score_label = 'Score: ' + score;

            username_text[controller_id] = this.two.makeText(username, 
                                                             this.winc * (controller_id + 1), 
                                                             this.hinc*7);
            score_text[controller_id] = this.two.makeText(score_label,
                                                          this.winc * (controller_id + 1),
                                                          this.hinc*7.5);
            username_text[controller_id].stroke = color;
            username_text[controller_id].fill = color;
            score_text[controller_id].stroke = color;
            score_text[controller_id].fill = color;
        }
    }

    draw(){
        var game_id_text = this.two.makeText(this.game_id, this.width/2, this.height/4);
        game_id_text.size = 40;
        game_id_text.stroke = 'white';
        game_id_text.fill = 'white';
        this.draw_players();
	}
    update(){


        if (this.game_state['game_phase'] == 'waiting') {
            // draw start game
            this.draw();
            // poll for controller state.
            this.get_controller_data();

            // need to check controller data to see if we can change phases.
            // if game is ready to start:
            this.game_state['game_phase'] = 'START';
            this.game_state['CAN_CONNECT'] = false;
            //update server
            this.post_game_data();

        }
    }
}
