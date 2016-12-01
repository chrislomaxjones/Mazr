/*
	maze.js
	Maze object
	---------
	Written on the 14/11/2014 by Chris Jones

	This file represents the Maze data structure represented in the Data
	Structures section of the design specification.

	The function Maze represents a function from which the Maze object
	can be instantiated. This will represent the Maze data structure.

	A maze object encapsulates all of the functionality necessary with
	generating, updating and drawing a maze and all of its
	constituents, including the player and exit tile.

	The Maze is instantiated in the global scope and used to control
	the maze that is generated. The maze is reinstantiated at a 
	larger size when a previous maze is completed.
	
	Maze has 13 attributes:
		-	complete: Boolean value that stores whether the maze is
					  completed or not.

		-	maxX: Stores the maximum number of tiles wide (in the
				  horizontal direction) the maze will be.

		-	maxY: Stores the maximum number of tiles high (in the 
				  vertical direction) the maze will be.

		-	camera: A reference to the camera through which the maze
					is viewed. Used to contorol view of the player /
					panning.

		-	tiles: An array that stores the tiles as Sprite objects
		           in the maze.

		-	player: Reference to the Player object that will be 
				    controlled in the maze.

		- exitTile: Reference to the ExitTile object that will be
		   		    set as the player's goal.

		- spriteBatch: Reference to a SpriteBatch object that will
					   be instantiated and used to draw the maze
					   to the canvas.

		- animationTimer: Controls timing of player movement 
						  animations.

		- movementTimer: Controls timing of the movmenet of player.

		- panningTimer: Controls the panning of the camera.

		- completionTimer: Records time taken to complete maze.
						   (in seconds).

		- stepsTaken: Stores the number of steps required to complete
		 			  the maze.

	Maze has 2 local variables:
		- playerX: A temporary variable that stores a random x
				   coordinate in the maze for the player.
		
		- playerY: A temporary variable that stores a random y
					coordinate in the maze for the player.

		- panning: stores whether the camera is currently independent
				   of player movement.

		- fixedMap: Stores whether the level fits within the camera
		 			window and therefore disables the camera.

	Maze has 5 methods:
		- initialise: Set all the state to default. Must be called
					  when a maze is instiated. This allows maze
					  to be re-instantiated with more integrity then
					  just a simple instantiation.

		- draw: Draws all of the sprites to the canvas.

		- update: Updates all of the maze state and data. This needs to
				  be called approx. 30 times a second.

		- updatePlayerPosition: Called when input is entered into the
								system. Updates the position of the
								player.

		- colourTrail: Colours the trail the player leaves when movement
			 		   occurs. Called by updatePlayerPosition when
			 		   movement occurs.

		- newMaze: Generates a new maze with a randomised depth first
				   search algorithm. 
*/
function Maze(width, height, canvasContext, camera) {
	// Boolean stores whether grid is finished
	// Set to false by default
	this.complete = false;

	// Array of tiles that make up grid
	this.tiles = new Array();

	// Set the maze's exit initially to null
	// This is instantiated properly in the init() method
	this.exitTile = null;

	
	// Various timer objects used to control time-dependent updates
	this.animationTimer =  new Timer(); // Controls all animations
	this.movementTimer =   new Timer(); // Controls movement of player
	this.panningTimer =    new Timer(); // Controls panning of camera
	this.completionTimer = new Timer(); // Records time taken to complete maze

	// Stores the number of seconds taken to complete the maze
	this.completedSeconds = 0;     

	// Stores the number of steps taken in the maze since it has begun
	this.stepsTaken = 0;

	// Check if the width supplied is of primitive type Number
	if (typeof width === "number") {
		// Assign value of parameter width to attribute maxX
		this.maxX = width;
	}
	// Check if no parameter was passed (undefined) or a null parameter was passed
	else if (width === undefined || width === null) {
		// Assign maxX attribute default value of 8
		this.maxX = 8;
	}
	else {
		// Throw an error if above conditions are not met.
		// Note errors will be caught in the main game loop.
		throw "Argument error. width must a number."
	}

	// Check if the height supplied is of primitive type Number
	if (typeof height === "number") {
		// Assign value of parameter width to attribute maxX
		this.maxY = height;
	}
	// Check if no parameter was passed (undefined) or a null parameter was passed
	else if (height === undefined || height === null) {
		// Assign maxY attribute default value of 8
		this.maxY = 8;
	}
	else {
		// Throw an error if above conditions are not met.
		// Note errors will be caught in the main game loop.
		throw "Argument error. height must a number."
	}
	
	// Reference to camera through which maze is viewed
	// Note there is no defaulting code path for the camera
	if (camera === undefined || camera === null) {
		throw "Argument error. Improper camera specified.";
	// Otherwise correctly assign parameter to attribute
	} else {
		// Assign camera parameter to camera attribute
		this.camera = camera;
	}

	// Stores whether the camera is currently panning 
	// independent of player movement
	var panning = true;

	// Stores whether the level fits within the camera window and
	// therefore disables the camera
    var fixedMap = false;

    // The sprite batch that will draw the grid
	this.spriteBatch = new SpriteBatch(canvasContext, this.camera);

	// Create a random position in the maze for the player
    var playerX = Math.floor((Math.random() * this.maxX-1) + 1) * TILE_SIZE;
	var playerY = Math.floor((Math.random() * this.maxY-1) + 1) * TILE_SIZE;

	// Instantiate a new player attribute
	// at the random position (playerX,playerY)
	this.player = new Player(
		new Sprite("hsl(145, 80%, 40%)",
			playerX, 
			playerY, 
			[false,false,false,false]
		)
	);

    this.initialise = function() {
    	// Generate a new random maze
		var maze  = this.newMaze();
		
		// Iterate from zero to max tile size in x direction
		for (var i = 0; i < this.maxX; i++) {
			// Instantiate a nested array of length maxY inside tiles attribute
			this.tiles[i] = new Array(this.maxy);

			
			// Iterate from zero to max tile size in y direction
			for (var j = 0; j < this.maxY; j++) {
				// Instantiate new sprite at ith,jth index
				this.tiles[i][j] = new Sprite(
					this.randomFloor(), 
					i*TILE_SIZE, 
					j*TILE_SIZE,
					[maze[i][j][3] == false,
					 maze[i][j][2] == false,
					 maze[i][j][1] == false,
					 maze[i][j][0] == false
					]
				);
			}
			
		}
		// Select an acceptable exit zone
		// randomExitX and randomExitY represent random coordinates
		// acceptable being true represents an acceptable set of coordinates
        var randomExitX = 0,
            randomExitY = 0,
            acceptable = false;

        // Repeat until an acceptable value is found
        while (!acceptable) {
            // Generate a random value
            randomExitX = Math.floor((Math.random() * this.maxX-1) + 1);
            randomExitY = Math.floor((Math.random() * this.maxY-1) + 1);
			
            // If the absolute distance between player and exit is third of map, values are acceptable
            if (Math.abs(randomExitX - (this.player.x/TILE_SIZE)) > this.maxX/3 &&
            	Math.abs(randomExitY - (this.player.y/TILE_SIZE)) > this.maxY/3) acceptable = true;
        }

    	// Instantiate the exitTile attribute at the coordinates that were generated above
    	this.exitTile = new ExitTile(
    		new Sprite(
    			EXIT_COLOUR, 
    			randomExitX*TILE_SIZE, 
    			randomExitY*TILE_SIZE, 
    			[false,false,false,false]
    		)
    	);

    	// Push all of the cell sprites to the batch
    	// This is so they can be drawn to canvas
    	for (var x = 0; x < this.maxX; x++) {
			for (var y = 0; y < this.maxY; y++) {
				this.spriteBatch.batch.push(this.tiles[x][y]);
			}
		}

		// Push the player and exit tile last
		// They will therefore be drawn on top of tiles
		this.spriteBatch.batch.push(this.exitTile.sprite);
		this.spriteBatch.batch.push(this.player.sprite);

		// Determine if the grid wholly fits in the viewport
        if (this.maxX * TILE_SIZE <= this.camera.width &&
            this.maxY* TILE_SIZE <= this.camera.height) {
        	// If it does, declare the map fixed and centre the grid on the viewport
            panning = false; fixedMap = true; 

            // Centre the camera on the maze
            this.camera.x = (this.maxX*TILE_SIZE/2) - (this.camera.width/2);
            this.camera.y = (this.maxY*TILE_SIZE/2) -(this.camera.height/2);

        } else {
            // Start the camera looking at the exit zone
            // (Camera will then pan to player in update loop)
            this.camera.x = (randomExitX*TILE_SIZE * 2 + TILE_SIZE)/2 - (this.camera.width/2);
            this.camera.y = (randomExitY*TILE_SIZE * 2 + TILE_SIZE)/2 - (this.camera.height/2);   
        }



    }

    // Method draws all of the sprites to the canvas
  	this.draw = function() { 
  		// Call draw on spriteBatch attribute
		// Draws all the sprites in the batch
		this.spriteBatch.draw();
	}

	// Method updates all of the maze state and data
	this.update = function() {
		// Wait every 1 second (1000ms) for completionTimer to elapse
		if (this.completionTimer.run(1000)) {
			// Increment the second counter by 1 every second
			this.completedSeconds+=1;
		}

		// Update the player's colour
        // This colour changes over time so must be assigned on every update cycle
		this.player.sprite.colour = this.player.fadeColour();

		// If the camera is not currently panning from exit to player
		if (!panning) {			
			// Execute every 0.01 seconds (10ms)
			if(this.animationTimer.run(10)) {
                // Animate sprite's position movement
                this.player.animatePosition();
			}
			// Clamp the centre of the camera viewport to the player
			// If the maze isn't small enough to be fixed to the centre
            if (!fixedMap) {
            	// Set x and y coordinates of camera to centre of player
                this.camera.x = (2*this.player.x + TILE_SIZE)/2 - (WIDTH/2);
                this.camera.y = (2*this.player.y + TILE_SIZE)/2 - (HEIGHT/2);
            }
       	// Else execute this if camera is panning
		} else {
			// Execute every 0.01 seconds (10ms)
			if (this.panningTimer.run(10)) {
				// Update the x pos of the camera to pan towards player
				// If the camera has a lower x coordinate than the player
				// Move the camera right
				if (this.camera.x < (this.player.x *2 + TILE_SIZE)/2 - (WIDTH/2)) {
					// Move eigth of width of tile (4px) towards the player in positive x
					this.camera.x += TILE_SIZE/8;
				// If the camera has a greater x coordinate than the player
				// Move the camera left
				} else if (this.camera.x > (this.player.x *2 + TILE_SIZE)/2 - (WIDTH/2)) {
					this.camera.x -= TILE_SIZE/8;
				}

				// Update the y pos of the camera to pan towards player
				// If the camera has a lower y coordinate than the player
				// Move the camera down
				if (this.camera.y < (this.player.y + this.player.y + TILE_SIZE)/2 - (HEIGHT/2)) {
					this.camera.y+= TILE_SIZE/8;	
				// If the camera has a greater y coordinate than the player
				// Move the camera up
				} else if (this.camera.y > (this.player.y + this.player.y + TILE_SIZE)/2 - (HEIGHT/2)) {
					this.camera.y-= TILE_SIZE/8;	
				} 

				// Check when the camera is centered on the sprite then cease to pan
				// Compare position of camera to that of player
				if (this.camera.y == (this.player.y + this.player.y + TILE_SIZE)/2 - (HEIGHT/2) &&
					this.camera.x == (this.player.x + this.player.x + TILE_SIZE)/2 - (WIDTH/2) ) {
						// Cease to pan when positions are the same
						// by setting panning to false
						panning = false;
				}	
			}
		}

		// Check if the game has been completed
		// Compare position of player with the exit tile
		if (this.player.x == this.exitTile.x &&
			this.player.y == this.exitTile.y) {
			// If they are equal treat the maze as completed
			// Set complete to true
			this.complete = true;
		}
	}

	// Methods generates a random shade of grey
	this.randomFloor = function() {
			// Generate random numerical rgb value
		   	var g = 255 - Math.floor((Math.random() * 50) + 1);
		   	// Concatenate into a colour string and return
   			return "rgb(" + g + "," + g + "," + g + ")";
	}

	// Updates the position of the player within the maze
	this.updatePlayerPosition = function(direction) { 
		if (direction == "up") {
			// Check the player isn't moving by comparing new position to
    		// current position and that player is not disabled
			if ((this.player.newPositionY == this.player.y && 
				 this.player.newPositionX == this.player.x) &&
				 !this.player.disabled ) {

				// Colour in the tile player is on
				this.colourTrail();

				// Check there are no walls blocking the path of the player
				if (this.tiles[this.player.x/TILE_SIZE][this.player.y/TILE_SIZE].walls[0] == false &&
					this.tiles[this.player.x/TILE_SIZE][(this.player.y-TILE_SIZE)/TILE_SIZE].walls[2] == false) {
					
					// Update the player's new y position 
					// Subtract TILE_SIZE from y property of player
					this.player.newPositionY = this.player.y - TILE_SIZE;

					// Increment the number of steps taken
					this.stepsTaken += 1;

				}
			}
		} else if (direction == "down") {
			// Check the player isn't moving and isn't at bottom of map or disabled
    		if ( (this.player.newPositionY == this.player.y &&
    			  this.player.newPositionX == this.player.x) && 
    			  !this.player.disabled ) {

    			// Colour in the square the player is on    			
				this.colourTrail();

				// Check there are no walls blocking the path of the player
				if (this.tiles[this.player.x/TILE_SIZE][this.player.y/TILE_SIZE].walls[2] == false &&
					this.tiles[this.player.x/TILE_SIZE][(this.player.y+TILE_SIZE)/TILE_SIZE].walls[0] == false) {

					// Update the player's new y position
					this.player.newPositionY = this.player.y + TILE_SIZE;
					this.stepsTaken += 1;
				}

			}
		} else if (direction == "left") {
			// Check the player isn't moving and isn't at leftmost y tiles of map or disabled
    		if ( (this.player.newPositionY == this.player.y &&
    		      this.player.newPositionX == this.player.x) &&
    			  !this.player.disabled ) {

    			// Colour the square the player is on
				this.colourTrail();

				// Check there are no walls blocking the path of the player
				if (this.tiles[this.player.x/TILE_SIZE][this.player.y/TILE_SIZE].walls[3] == false &&
					this.tiles[(this.player.x-TILE_SIZE)/TILE_SIZE][this.player.y/TILE_SIZE].walls[1] == false) {
					
					// Update the player's new x position
					this.player.newPositionX = this.player.x - TILE_SIZE;
					this.stepsTaken += 1;				

				}

			}
		} else if (direction == "right") {
			// Check the player isn't moving and isn't at rightmost y tiles of map or disabled
    		if ( (this.player.newPositionY == this.player.y &&
    		      this.player.newPositionX == this.player.x) && 
    			  !this.player.disabled ) {
				
				// Colour the square the player is on
				this.colourTrail();

				// Check there are no walls blocking the path of the player
				if (this.tiles[this.player.x/TILE_SIZE][this.player.y/TILE_SIZE].walls[1] == false &&
					this.tiles[(this.player.x+TILE_SIZE)/TILE_SIZE][this.player.y/TILE_SIZE].walls[3] == false) {
					
					// Update the player's new x position
					this.player.newPositionX = this.player.x + TILE_SIZE;
					this.stepsTaken += 1;

				}
			}	
		} else {
			// Invalid input
    		// Raise invalid argument error here
    		throw "Argument error. Direction specified must be 'up', 'down', 'left', 'right'";
		}
	}

	// This method colours the tile beneath the player with the trail colour
	this.colourTrail = function() {
		// Get x and y position of the player
		// Divide both the tile size so it can be used an an array index
		var playerXPosition = this.player.x / TILE_SIZE;
		var playerYPosition = this.player.y / TILE_SIZE;

		// Use two previously calculated values to set colour attribute of 
		// the sprite beneath player to return value of player's trailColour
		// function
		this.tiles[playerXPosition][playerYPosition].colour =
			this.player.trailColour();
	}

	// Method generates a new maze
    this.newMaze = function() {
    	// Declare tiles as empty array
        var tiles = [];

        // Declare unvisitedTiles tiles as empty array
        var unvisitedTiles = [];

        // Iterate through y tiles up to maxY with counter y
        for (var x = 0; x < this.maxX; x++) {
        	// Set each index in tiles to empty arrays
            tiles[x] = [];
            // Set each index in unvisitedTiles to empty arrays
            unvisitedTiles[x] = [];

            // Iterate through x tiles up to maxX with counter x
            for (var y = 0; y < this.maxY; y++) {
            	// Set the tile at index i,j to a 4 element array of zeroes
                tiles[x][y] = [0,0,0,0];
                // Set the same index in unvisitedTiles to true
                unvisitedTiles[x][y] = true;
            }
		}

        // Determine random x and y positions in the maze
        // Contsrain by values maxX and maxY
        var randomX = Math.floor(Math.random()*this.maxY);
        var randomY = Math.floor(Math.random()*this.maxX);
        // Declare curent cell as array with elements randomX and randomY
        var currentTile = [randomX, randomY];

        // Decalre path as array with one element - currentTile
        var tileStack = [currentTile];

        // Set the current tile as visited
        unvisitedTiles[currentTile[0]][currentTile[1]] = false;

        // Set visitedTiles equal to 1
        var visitedTiles = 1;

        // Loop through all available cell positions
        while (visitedTiles < this.maxX * this.maxY) {
            // Determine potentialNeighboursential neighboring tiles
            var potentialNeighbours = [
            			[currentTile[0]-1, currentTile[1], 0, 2],
                    	[currentTile[0], currentTile[1]+1, 1, 3],
                    	[currentTile[0]+1, currentTile[1], 2, 0],
                    	[currentTile[0], currentTile[1]-1, 3, 1]
                      ];
            var neighbourTiles = [];

            // Determine if each neighboring cell is in game grid, and whether it has already been checked
            for (var l = 0; l < 4; l++) {
                if (potentialNeighbours[l][0] > -1 && 
                	potentialNeighbours[l][0] < this.maxY && 
                	potentialNeighbours[l][1] > -1 && 
                	potentialNeighbours[l][1] < this.maxX && 
                	unvisitedTiles[potentialNeighbours[l][0]][potentialNeighbours[l][1]]) {
                		neighbourTiles.push(potentialNeighbours[l]); 
              	}
            }

            // If at least one active neighboring cell has been found
            if (neighbourTiles.length >= 1) {
                // Choose one of the neighbourTiles at random
                selectedTile = neighbourTiles[Math.floor(Math.random()*neighbourTiles.length)];

                // Remove the wall between the current cell and the chosen neighboring cell
                tiles[currentTile[0]][currentTile[1]][selectedTile[2]] = 1;
                tiles[selectedTile[0]][selectedTile[1]][selectedTile[3]] = 1;

                // Mark the neighbor as visited, and set it as the current cell
                unvisitedTiles[selectedTile[0]][selectedTile[1]] = false;
                
                visitedTiles+=1
                currentTile = [selectedTile[0], selectedTile[1]];
                tileStack.push(currentTile);
            }
            // Otherwise go back up a step and keep going
            else {
                currentTile = tileStack.pop();
            }
        } 
        return tiles;
    }
}
