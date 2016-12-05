function Main(){
	var w = $('#middle_pane').width();
	var h = $('#middle_pane').height();
	var elem = document.getElementById('middle_pane');
	var FRAMERATE = 60/1000;//60 fps

    var two = new Two({
    	width: w,
    	height: h
    });

    two.appendTo(elem);
    var game = new Manatee(two, w, h);

    var audio = new Audio('paniq.mp3');
    audio.loop = true;
	audio.play();

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

