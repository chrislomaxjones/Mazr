/*
	timer.js
	Timer object
	---------
	Written on the 02/01/2014 by Chris Jones

	This is a class function that will be used to instantiate Timer
	objects. These represent the Timer data structures in the 
	nature of the solution section of Design.

	Timers are used in a variety of methods and objects in the game to
	keep track of timing. This is crucial to a variety of areas including
	camera panning, player animation and the fading of the player's
	colour.

	Timer has 2 local variables:
		- lastTime: Stores the current number of ms at the last call
					of the run method.

		- elapsedTime: Stores the amount of time that has elapsed since
					   the last call of the run method.

	Timer has 1 method:
		- run: This method will only return true when the Number parameter
			   wait_time has elapsed (wait_time is in milliseconds). To
			   call something periodically, call it with a constant wait_time
			   enclosed in an if loop that has a boolean conditional of the
			   return value of this run method.
*/
function Timer() {
	
	// Declare lastTime with the value of the time when timer is initialised
	// Set lastTime equal to the current milliseconds on timer
	var lastTime = new Date().getTime();

	// elapsedTime stores the time taken between calls of the run method
	// Set to zero on declaration
	var elapsedTime = 0;

	// Method returns true every period of 'wait_time'
	// For this to work this method must be polled
	// By repeatedly calling the run method and over given intervals,
	// time changes can be tracked
	this.run = function(wait_time) {
		// Set now to current ms
		var now = new Date().getTime();

		// Add the difference between now and last check of ms to elapsedTime
		elapsedTime += (now - lastTime);
		// Let lastTime equal now
		lastTime = now;
		
		// If the elapsedTime since last poll of function 
		// is greater than the wait
		if (elapsedTime >= wait_time) {
			// Set elapsedTime to zero
			elapsedTime = 0;
			// Return a true value
			return true;
		}
	}
}



