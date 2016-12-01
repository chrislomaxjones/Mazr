/*
	camera.js
	Camera object
	---------
	Written on the 29/10/2014 by Chris Jones.

	This file represents the Camera data structure represented in the Data
	Structures section of the design specification.

	The function Camera represents a function from which a Camera object can be
	instantiated. This will represent the Camera data structure.

	This class is used by the Maze object to keep track of the current position
	of the player's view at any given time. It also allows the focus of the maze
	to be adjusted and not fixed at a given position.

	The camera has 4 attributes:
		- x: The pixel coordinate of the camera's position in the x axis.
		- y: The pixel coordinate of the camera's position in the y axis.
		- width: The width of the camera's viewport in pixels
		- height: The height of the camera's viewport in pixels.
*/
function Camera(x, y, width, height) {
	
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

	// Check if the width supplied is of primitive type Number
	if (typeof width === "number") {
		// Assign value of parameter width to attribute width
		this.width = width;
	}
	// Check if no parameter was passed (undefined) or a null parameter was passed
	else if (width === undefined || width === null) {
		// Assign width attribute default value of 512
		this.width = 512;
	}
	else {
		// Throw an error if above conditions are not met.
		// Note errors will be caught in the main game loop.
		throw "Argument error. Width must a number."
	}

	// Check if the height supplied is of primitive type Number
	if (typeof height === "number") {
		// Assign value of parameter height to attribute he
		this.height = height;
	}
	// Check if no parameter was passed (undefined) or a null parameter was passed
	else if (height === undefined || height === null) {
		// Assign height attribute default value of 512
		this.height = 512;
	}
	else {
		// Throw an error if above conditions are not met.
		// Note errors will be caught in the main game loop.
		throw "Argument error. Height must a number."
	}

}





























