function Main(game_id, num_controllers, server_url){
	var w = $('#Main').width();
	var h = $('#Main').height();
	var elem = document.getElementById('Main');
	var FRAMERATE = 60/1000;//60 fps
	
	var two = new Two({
    	width: w,
    	height: h
    });    
    two.appendTo(elem);
    var game = new Game(two, w, h, num_controllers, game_id);

	two.bind('update', function(frameCount){
		game.update();
	});

	setInterval(function() {
  		two.update();
	}, FRAMERATE);

}

