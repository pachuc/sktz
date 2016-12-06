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
		//yeah apparently i shouldn't be making synchronous ajax calls as I'm basically blocking the UI thread with a get
		//and could possibly cause the browser to hang/crash
		//var controller_data = JSON.parse($.ajax({type: "GET", url: game_state_string, async:false}).responseText);
                $.ajax({type: "GET", url: game_state_string, success: function(data){game.updateControls(JSON.parse(data));}, asyc:true});
		game.update();
	});

	setInterval(function() {
  		two.update();
	}, FRAMERATE);

}

