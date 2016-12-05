"use strict";

/**
 * The player class.
 */

class Player {

        /**
         * Contructor
         * @param  int xpos x-position of the player
         * @param  int ypos y-position of the player
         * @param  text color color of the player
         * @param  radians theta heading of the player
         * @param  int size size of the player
         * @param  int speed speed of the player
         */
        constructor(xpos, ypos, color, theta, size, speed, two, hmin, hmax, wmin, wmax){
	       
            //player variables
            this.xpos = xpos;
            this.ypos = ypos;
            this.color = color;
            this.theta = theta;
            this.size = size;
            this.speed = speed;
            this.numPoints = 3;
            this.two = two;
            this.hmin = hmin;
            this.hmax = hmax;
            this.wmin = wmin;
            this.wmax = wmax;
            this.init = false;
            this.aim = false;
            this.aimTheta = theta;
            this.aimDir = "";
            this.cor_points = new Array();

            this.makeBody();
            this.makeCorridor();

            this.init = true;
            this.aimrendered = false;
            this.shoot = false;
            this.shootcd = 0;


                

	   }

       aimShot(){
            if(this.aimDir == "clockwise"){
                this.aimTheta -= .025;
            }

            if(this.aimDir == "counterclockwise"){
                this.aimTheta += .025;
            }

            this.drawAim();
       }

       clearAim(){
            if(this.aimrendered){
                this.two.remove(this.aimline);
                this.aimrendered = false;
            }
       }

       drawAim(){

            if(this.aimrendered){
                this.two.remove(this.aimline);
            }

            //calculate slope
            var tan = Math.tan(this.aimTheta);
            var b = this.ypos - (this.xpos * tan);

            var x1 = this.xpos;
            var x2 = this.xpos + this.size * 2 * Math.cos(this.aimTheta);
            var y1 = this.ypos;
            var y2 = this.ypos + this.size * 2 * Math.sin(this.aimTheta);

            this.aimline = this.two.makeLine(x1, y1, x2, y2);
            this.aimline.stroke = this.color;
            this.aimrendered = true;



       }

       shootOnCD(){
            this.shootcd = 5;
       }
       shootCoolingDown(){
            if(this.shootcd > 0){
                this.shootcd--;
            }
       }

       setShoot(){
            if(this.shootcd == 0){
                this.shoot = true;
            }
            
       }

       update(){

            if(this.aim){

                this.aimShot();
                if(this.shoot){
                    this.theta = this.aimTheta;
                    this.shoot = false;
                }

            }
            else{
                this.clearAim();
                this.aimTheta = this.theta;
            }
            
            this.move();
            this.makeCorridor();
       }

       setAim(isaim, aimdir){
            this.aim = isaim;
            this.aimDir = aimdir;
       }

       move(){
            this.xpos = (Math.cos(this.theta) * this.speed) + this.xpos;
            this.ypos = (Math.sin(this.theta) * this.speed) + this.ypos;
            this.makeBody();

       }

       getScore(){
            return this.numPoints;
       }

       getColor(){
            return this.color;
       }

       resetScore(){
            this.numPoints = 3;
       }

        score(){
            if(this.numPoints < 10){
                this.numPoints++;   
                this.makeBody();
            }
        }

        dethrone(){
            if(this.numPoints > 3){
                this.numPoints--;
                this.makeBody();
            }
        }

        getCorridor(){
            return this.cor_points;
        }

        makeCorridor(){

            if(this.init){
                this.two.remove(this.corridor);
            }

                if(this.theta == Math.PI/2 || this.theta == (3*Math.PI)/2){
                        this.corridor = this.two.makeLine(this.xpos, this.hmin, this.xpos, this.hmax);
                        this.corridor.stroke = this.color;
                        this.cor_points[0] = this.xpos;
                        this.cor_points[1] = this.hmin;
                        this.cor_points[2] = this.xpos;
                        this.cor_points[3] = this.hmax;
                }
                else{

                        //coridor line:
                        var tan = Math.tan(this.theta);
                        var b = this.ypos - (this.xpos * tan);

                        //find intersections walls.
                        var LEFT, RIGHT, TOP, BOT = false;
                        //LEFT WALL
                        //x = wmin
                        var pot_y = this.wmin * tan + b;
                        //now, is this y within the bounds?
                        if(pot_y >= this.hmin && pot_y <= this.hmax){
                            LEFT = true;
                        }
                        //RIGHT WALL
                        //x = wmax
                        var pot_y2 = this.wmax * tan + b;

                        if(pot_y2 >= this.hmin && pot_y2 <= this.hmax){
                            RIGHT = true;
                        }

                        //TOP WALL
                        //y = hmin
                        var pot_x = (this.hmin - b)/tan;

                        if(pot_x >= this.wmin && pot_x <= this.wmax){
                            TOP = true;
                        }
                        
                        //BOTTOM WALL
                        //y = hmax
                        var pot_x2 = (this.hmax - b)/tan;

                        if(pot_x2 >= this.wmin && pot_x2 <= this.wmax){
                            BOT = true;
                        }

                        var x1 = 0;
                        var x2 = 0;
                        var y1 = 0;
                        var y2 = 0;

                        if(LEFT){
                            x1 = this.wmin;
                            y1 = pot_y;

                            if(RIGHT){
                                x2 = this.wmax;
                                y2 = pot_y2;
                            }
                            else if(TOP){
                                x2 = pot_x;
                                y2 = this.hmin;
                            }
                            else if(BOT){
                                x2 = pot_x2;
                                y2 = this.hmax;

                            }

                        }
                        else if(RIGHT){
                            x1 = this.wmax;
                            y1 = pot_y2;

                            if(TOP){
                                x2 = pot_x;
                                y2 = this.hmin;

                            }
                            else if(BOT){
                                x2 = pot_x2;
                                y2 = this.hmax;

                            }

                        }
                        else if(TOP){
                            x1 = pot_x;
                            y1 = this.hmin;

                            x2 = pot_x2;
                            y2 = this.hmax;

                        }

                        this.corridor = this.two.makeLine(x1, y1, x2, y2);
                        this.corridor.stroke = this.color;
                        this.cor_points[0] = x1;
                        this.cor_points[1] = y1;
                        this.cor_points[2] = x2;
                        this.cor_points[3] = y2;


                }

                
                

        }

        setTheta(th){
            this.theta = th;
            this.makeBody();
            this.makeCorridor();
        }

        getTheta(){
            return this.theta;
        }

        setX(x){
            this.xpos = x;
        }

        setY(y){
            this.ypos = y;
        }

        getX(){
            return this.xpos;
        }

        getY(){
            return this.ypos;
        }



        /**
         * Make the player body.
         */
        makeBody(){

            if(this.init){
                this.two.remove(this.lines);
            }

        	var points = [];
        	var PI = Math.PI;
        	var angleInc = (2*PI)/this.numPoints;
        	var starting = this.theta;

        	for(var i = 0; i < this.numPoints; i++){
        		var x = this.size * Math.cos(starting) + this.xpos;
        		var y = this.size * Math.sin(starting) + this.ypos;
        		points[i] = {x: x, y: y};
        		starting = starting + angleInc;

        	}

            this.lines = [];

        	for(i = 0; i < this.numPoints; i++){
        		var k = i + 1;

        		if( k >= this.numPoints){
        			k = 0;
        		}

        		this.lines[i] = this.two.makeLine(points[i].x, points[i].y, points[k].x, points[k].y);
        		this.lines[i].stroke = this.color;
        	}


        }

}