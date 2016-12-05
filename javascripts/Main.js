function Main(){
	var w = $('#Main').width();
	var h = $('#Main').height();
	var elem = document.getElementById('Main');
	var FRAMERATE = 60/1000;//60 fps

    var two = new Two({
    	width: w,
    	height: h
    });

    two.appendTo(elem);
    var game = new Game(two, w, h);

	two.bind('update', function(frameCount){
		game.update('red');
	});

	setInterval(function() {
  		two.update();
	}, FRAMERATE);

}

