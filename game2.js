window.onload = function() {
	//start crafty
	Crafty.init(400, 320);
	// Crafty.canvas();
	Crafty.c();
	
	//turn the sprite map into usable components
	Crafty.sprite(32, "village.gif", {
		snowball: [17,9],
		// snowball_Hit: [17,6],
		bomb: [16,9],
		// bomb_blast: [16,6],
		player: [8,13]
	});
	Crafty.sprite(16, "sprite.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1: [0,2],
		bush2: [1,2]
	});
	
	//method to randomy generate the map
	function generateWorld() {
		//generate the grass along the x-axis
		for(var i = 0; i < 25; i++) {
			//generate the grass along the y-axis
			for(var j = 0; j < 20; j++) {
				grassType = Crafty.math.randomInt(1, 4);
				Crafty.e("2D, Canvas, grass"+grassType)
					.attr({x: i * 16, y: j * 16});
				
				// //1/50 chance of drawing a flower and only within the bushes
				// if(i > 0 && i < 24 && j > 0 && j < 19 && Crafty.math.randomNumber(0, 50) > 49) {
				// 	Crafty.e("2D, DOM, SpriteAnimation, flower, Collision")
				// 		.attr({x: i * 16, y: j * 16})
				// 		// .animate("wind", 0, 1, 3)
				// 		// .animate("wind", 50, -1)
				// 		// .collision()
				// 		// .bind("enterframe", function() {
				// 		// 	if(!this.isPlaying())
				// 		// 		this.c.animate("wind", 80);
				// 		// })
				// 		.onHit("bomb", function () {
				// 			this.destroy();
				// 		});
				// }
			}
		}
		
		//create the bushes along the x-axis which will form the boundaries
		for(var i = 0; i < 25; i++) {
			Crafty.e("2D, Canvas, wall_top, bush"+Crafty.math.randomInt(1,2))
				.attr({x: i * 16, y: 0, z: 2});
			Crafty.e("2D, DOM, wall_bottom, bush"+Crafty.math.randomInt(1,2))
				.attr({x: i * 16, y: 304, z: 2});
		}
		
		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < 19; i++) {
			Crafty.e("2D, DOM, wall_left, bush"+Crafty.math.randomInt(1,2))
				.attr({x: 0, y: i * 16, z: 2});
			Crafty.e("2D, Canvas, wall_right, bush"+Crafty.math.randomInt(1,2))
				.attr({x: 384, y: i * 16, z: 2});
		}
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprite.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
		
		//black background with some loading text
		Crafty.background("#FFF");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")
			.css({"text-align": "center"});
	});
	
	//automatically play the loading scene
	Crafty.scene("loading");

	// Crafty.c("SnowAttack", {
	// 	_fired: 0, 
	// 	maxSnowBalls: 5,
	// 	_key: Crafty.keys.ENTER,

	// 	init: function () {
	// 		var attacker = this;
	// 		this.requires("Grid")

	// 		//Create the SnowBall
	// 		.bind("KeyDown", function (e) {
	// 			if(e.key !== this._key) {
	// 				return;
	// 			}

	// 			if(this._fired < this.maxSnowBalls) {
	// 				Crafty.e("Snowball")
	// 					.attr({z:100})
	// 					.col(this.col())
	// 					.row(this.row())
	// 					.SnowBall
	// 					.bind("")
	// 			}
	// 		})
	// 	}
	// });

	Crafty.c("BombDropper", {
		_dropped: 0,
		maxBombs: 2,
		_key: Crafty.keys.SPACE,

		init: function () {
			var dropper = this;
			this.requires("Grid")

			//Create the bomb
			.bind("KeyDown", function (e) {
				if(e.key !== this._key) {
					return;
				}

				if(this._dropped < this.maxBombs) {
					Crafty.e('Bomb')
						.attr({z:100})
						.col(this.col())
						.row(this.row())
						.Bomb()
						.bind("explode", function() {
							dropper._dropped--;
						});
					this._dropped++;
				}
			});
		},
		BombDropper: function(key) {
			this._key = key;
			return this;
		}
	});

	Crafty.c("Bomb", {

        init: function() {
            this.requires("2D, DOM, SpriteAnimation, Grid, bomb, explodable")
                // .animate_y('explode', 9, 16, 13)
                .animate_y('explode', 9, 17, 13)
                .animate_y('explode', 10, -1)
                .timeout(function() {
                    this.trigger("explode");
                }, 4000)
                .bind('explode', function() {
                    this.destroy();

                    //Create fire from the explosion
                    for(var i = this.col() - 2; i < this.col()+3; i++)
                        Crafty.e("BombBlast").attr({ z:9000 }).col(i).row(this.row())
                    for(var i = this.row() - 2; i < this.row()+3; i++)
                        Crafty.e("BombBlast").attr({ z:9000 }).col(this.col()).row(i)
                });
        },

        Bomb: function() {
            //Create shadow fire to help the AI
            for(var i = this.col() - 2; i < this.col()+3; i++)
                Crafty.e("ShadowBombBlast").attr({ z:9000 }).col(i).row(this.row())
            for(var i = this.row() - 2; i < this.row()+3; i++)
                Crafty.e("ShadowBombBlast").attr({ z:9000 }).col(this.col()).row(i)
            return this;
        }
    });

    Crafty.c('BombBlast', {

        init: function() {
            this.requires("2D, DOM, SpriteAnimation, bomb, Grid, Collision, fire")
                // .animate_y('fire', 6, 16, 8)
                .animate_y('fire', 6, 17, 8)
                .animate_y('fire', 10, -1)
                .collision()
                .onHit('explodable', function(o) {
                    for(var i = 0; i < o.length; i++) {
                        o[i].obj.trigger("explode");
                    }
                })
                .timeout(function() {
                    this.destroy();
                }, 380);
        }
    });

    // Helps the AI avoid unsafe tiles. Created when a bomb is dropped and removed after fire is gone
    // Crafty.c('ShadowBombBlast', {

    //     init: function() {
    //         this.requires("2D, Grid, empty, Collision, ShadowFire")
    //             .collision()
    //             .timeout(function() {
    //                 this.destroy();
    //             }, 6100);
    //     }
    // });

    // Crafty.c('Grid', {
    //     _cellSize: 16,
    //     Grid: function(cellSize) {
    //         if(cellSize) this._cellSize = cellSize;
    //         return this;
    //     },
    //     col: function(col) {
    //         if(arguments.length === 1) {
    //             this.x = this._cellSize * col;
    //             return this;
    //         } else {
    //             return Math.round(this.x / this._cellSize);
    //         }
    //     },
    //     row: function(row) {
    //         if(arguments.length === 1) {
    //             this.y = this._cellSize * row;
    //             return this;
    //         } else {
    //             return Math.round(this.y / this._cellSize);
    //         }
    //     },      
    //     snap: function(){
    //         this.x = Math.round(this.x/this._cellSize) * this._cellSize;
    //         this.y = Math.round(this.y/this._cellSize) * this._cellSize;
    //     }
    // });
	
	Crafty.scene("main", function() {
		generateWorld();

		Crafty.c('RightControls', {
			init: function () {
				this.requires('Multiway');
			},

			RightControls: function(speed) {
				this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
				return this;
			}
		});

		Crafty.c('LeftControls', {
			init: function () {
				this.requires('Multiway');
			},

			LeftControls: function(speed) {
				this.multiway(speed, {W: -90, S: 90, D: 0, A: 180})
				return this;
			}
		});
		
		//create our player entity with some premade components
		player1 = Crafty.e("2D, Canvas, player, Controls, LeftControls, SpriteAnimation, Collision, BombDropper, Grid")
			.attr({x: 160, y: 144, z: 1})
			.LeftControls(0.5)
			.enableControl()
			.animate_y("walk_left", 3, 8, 11)
			.animate_y("walk_right", 3, 8, 11)
			.animate_y("walk_up", 0, 8, 2)
			.animate_y("walk_down", 12, 8, 14)
			.bind("NewDirection", function(direction) {
				if(direction.x < 0 ) {
					if(!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 5, -1).flip("X");
				}
				if(direction.x > 0) {
					if(!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 5, -1).unflip("X");
				}
				if(direction.y < 0) {
					if(!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 3, -1);
				}
				if(direction.y > 0) {
					if(!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 3, -1);
				}
				if(!direction.x && !direction.y)
					this.stop();
			})
			.bind("Moved", function(from) {
				if(this.hit("player") || this.hit("flower") || this.hit("wall_left") || this.hit("wall_right") || this.hit("wall_bottom") || this.hit("wall_top"))
					this.attr({x: from.x, y:from.y});
			})
			// .BombDropper(Crafty.keys.ENTER)
			.onHit("fire", function () {
				this.destroy();
				//Subtract life and play scream sound
			});
		// 	return this;

		player2 = Crafty.e("2D, Canvas, player, Controls, RightControls, SpriteAnimation, Collision, BombDropper, Grid")
			.attr({x: 260, y: 244, z: 1})
			.RightControls(0.5)
			.enableControl()
			.animate_y("walk_left", 3, 8, 11)
			.animate_y("walk_right", 3, 8, 11)
			.animate_y("walk_up", 0, 8, 2)
			.animate_y("walk_down", 12, 8, 14)
			.bind("NewDirection", function(direction) {
				if(direction.x < 0 ) {
					if(!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 5, -1).flip("X");
				}
				if(direction.x > 0) {
					if(!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 5, -1).unflip("X");
				}
				if(direction.y < 0) {
					if(!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 3, -1);
				}
				if(direction.y > 0) {
					if(!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 3, -1);
				}
				if(!direction.x && !direction.y)
					this.stop();
			})
			.bind("Moved", function(from) {
				if(this.hit("player") || this.hit("flower") || this.hit("wall_left") || this.hit("wall_right") || this.hit("wall_bottom") || this.hit("wall_top"))
					this.attr({x: from.x, y:from.y});
			})
			.BombDropper(Crafty.keys.ENTER)
			.onHit("fire", function () {
				this.destroy();
				//Subtract life and play scream sound
			});
			return this;
	});
};