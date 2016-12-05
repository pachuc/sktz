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
    var game = new Manatee(two, w, h);

	two.bind('update', function(frameCount){
		if(!game.endgame){
			game.update(frameCount);
		}
		else{
			audio.pause();
			audio.currentTime = 0;
			window.alert(game.winner + ' Wins!');
			game.restartGame();
			audio.play();
		}
		
	});

	setInterval(function() {
  		two.update();
	}, FRAMERATE);

}

