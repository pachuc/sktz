function Main(game_id, num_controllers){
	var w = $('#Main').width();
	var h = $('#Main').height();
	var elem = document.getElementById('Main');
	var FRAMERATE = 60/1000;//60 fps

    	var two = new Two({
    		width: w,
    		height: h
    	});    
    	two.appendTo(elem);
    	var game = new Game(two, w, h, num_controllers);
   	
	var game_state_string = 'ws://localhost:8000/get_game_state_persist/' + game_id;
        var socket = new WebSocket(game_state_string);     
	socket.onmessage = function(event){
        	game.updateControls(JSON.parse(event.data));
        };

	two.bind('update', function(frameCount){
                game.update();
	});
	setInterval(function() {
  		two.update();
	}, FRAMERATE);

}

