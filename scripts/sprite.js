/*
	sprite.js
	Sprite object
	---------
	Written on the 29/10/2014 by Chris Jones.

	This file represents the Sprite data structure represented in the Data
	Structures section of the design specification.

	The function Sprite represents a function from which the Sprite object
	can be instantiated. This will represent the sprite data structure.
	
	The sprite object represents a coloured square with 4 optional walls
	(borders) that can be drawn to the screen.

	This is used by the Sprite Batch to maintain an array of objects that
	have data which can drawn to the screen. It exposes properties such as
	coordinates and colour in order to do this.

	Sprite has 4 attributes:
		- colour: The colour with which the sprite is drawn. This is a
				  string that would be used to define a colour in CSS
				  for example "#000000" or "rgb(255, 0, 255)".

		- x: The pixel coordinate of the sprite's position in the x axis.

		- y: The pixel coordinate of the sprite's position in the y axis.

		- walls: This is an array that contains 4 boolean values (true or
				 false). This represents whether there is a wall on each
				 side of the square sprite. The array represents each 
				 side in a clockwise order (e.g. [north, east, south west])
				 For example a walls attribute with value [true, false,
				 true, false] has a north and south wall but no east or 
				 west wall.
*/
function Sprite(colour, x, y, walls) {

	// Check if x supplied is of primitive type Number
	if (typeof x === "number") {
		// Assign value of parameter x to attribute x 
		this.x = x;
	}
	// Check if no parameter was passed (undefined) or a null parameter was passed
	else if (x === undefined || x === null) {
		// Assign x attribute default value of 0
		this.x = 0;
	}
	else {
		// Throw an error if above conditions are not met
		// Note errors will be caught in the main game loop.
		throw "Argument error. x coordinate must a number.";
	}

	// Check if y supplied is of primitive type Number
	if (typeof y === "number") {
		// Assign value of parameter y to attribute y
		this.y = y;
	}
	// Check if no parameter was passed (undefined) or a null parameter was passed
	else if (y === undefined || y === null) {
		// Assign x attribute default value of 0
		this.y = 0;
	}
	else {
		// Throw an error if above conditions are not met.
		// Note errors will be caught in the main game loop.
		throw "Argument error. y coordinate must a number."
	}

	// Set the colour of the sprite
	if (typeof colour === "string") {
		// Assign value of parameter colour to attribute colour
		this.colour = colour;
	}
	// Check if no parameter was passed (undefined) or a null parameter was passed
	else if (colour === undefined || colour === null) {
		// Assign colour attribute default value of "#000000" (black)
		this.colour = "#000000";
	}
	else {
		// Throw an error if above conditions are not met.
		// Note errors will be caught in the main game loop.
		throw "Argument error. colour must a string."
	}

	// Set the value of the attribute walls
	if (walls instanceof Array && walls.length == 4) {
		// Declare local variable correctType as true
		// Assume at this point the elements of walls are all boolean data-types
		var correctType = true;

		// Iterate through each element of walls with index i
		for (var i = 0; i < walls.length; i++) {
			// Check whether the type is NOT boolean
			if (typeof walls[i] !== "boolean") {
				// Set correctType to false if not a boolean
				correctType = false;
				// Break from the loop if a non-boolean type is detected
				break;
			}
		}

		// If correctType is true (when all 4 elements are boolean)
		if (correctType)
			// Assign parameter walls to attribute walls
			this.walls = walls;
		else 
			// Throw an error at this point if not all data types are boolean
			// Note errors will be caught in the main game loop.
			throw "Argument error. walls must be an array with 4 boolean elements"
	}
	// Check if no parameter was passed (undefined) or a null parameter was passed
	else if (walls === undefined || walls === null) {
		// Assign walls attribute default value of [false, false, false, false]
		this.walls = [false, false, false, false];
	}
	else {
		// Throw an error if above conditions are not met.
		// Note errors will be caught in the main game loop.
		throw "Argument error. walls must be an array with 4 boolean elements"
	}
}

function randomFloor() {
   	var g =  255 - Math.floor((Math.random() * 50) + 1);
   	return "rgb(" + g + "," + g + "," + g + ")";
}