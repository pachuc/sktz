function Main(game_id, num_controllers){
	var w = $('#Main').width();
	var h = $('#Main').height();
	var elem = document.getElementById('Main');
	var FRAMERATE = 60/1000;//60 fps

    var two = new Two({
    	width: w,
    	height: h
    });
    	var game_state_string = 'http://localhost:8000/get_game_state/' + game_id;


    two.appendTo(elem);
    var game = new Game(two, w, h, num_controllers);

	two.bind('update', function(frameCount){
		var controller_data = JSON.parse($.ajax({type: "GET", url: game_state_string, async:false}).responseText);
                game.update(controller_data);
	});

	setInterval(function() {
  		two.update();
	}, FRAMERATE);

}

