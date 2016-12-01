/* 
    player.js
    Player object
    ---------
    Written on the 31/10/2014 by Chris Jones

    This file represents the Player data structure represented in the Data
    Structures section of the design specification.

    The function Player represents a function from which the Player
    object can be instantiated. This will represent the Player data 
    structure. 

    A player object encapsulates all of the functionality necessary with 
    introducing a player into the game. It exposes getter and setters to 
    make accessing the position of the player more expressive for later
    programming and also ensures the player is correctly coloured and
    animated.

    A player object is instantiated by the Maze object and controlled
    within that object's functionality. This allows it to be added to
    a SpriteBatch, thus be drawn by that and updated by the Maze.

    Player has 4 attributes:
        - disabled: This is a boolean value that is used to control
                    whether the player can move or not. This is so
                    that the player's movement can be disabled
                    when the camera is panning from the exit tile or
                    currently on a menu.

        - sprite: This is the object that is responsible for the visuals
                  and drawing of the player to the canvas. This attribute
                  will be referenced to within a SpriteBatch.

        - newPositionX: This is a Number that represents an x coordinate.
                        This is used to track the exact pixel coordinates of
                        a player in the maze instead of relative to other
                        grid squares. Doing this allows smooth animations to
                        be implemented.

        - newPositionY: This is a Number that represents a y coordinate.
                        This is used to track the exact pixel coordinates of
                        a player in the maze instead of relative to other
                        grid squares. Doing this allows smooth animations to
                        be implemented.

    Player has 2 pairs of getter / setter methods:
        - x: This is a getter / setter pair that reference the x coordinate
             of the sprite. This is effectively assigning the reference
             player.x to player.sprite.x. This makes it easier to get and 
             set values of the player's position without accessing the
             sprite.
        - y: This is a getter / setter pair that reference the y coordinate
             of the sprite. This is effectively assigning the reference
             player.y to player.sprite.y. This makes it easier to get and 
             set values of the player's position without accessing the
             sprite.

    Player has 3 methods:
        - animatePosition: This method updates the position of the player
                           on the screen. This is so that it moves smoothly
                           from tile to tile in maze.

        - fadeColour: This returns a HSL CSS string that varies with respect
                      to time. This can be used to be assigned to the colour
                      values of objects in the maze - in this case the player's
                      sprite.

        - trailColour: Returns a HSL CSS string that is the colour that tiles
                       on which the player is leaving a trail should be
                       coloured.

    Player has 8 local variables:
        - hueOne: This is the initial hue of the fading colour.

        - hueTwo: This is the hue to which the fading colour fades.

        - currentHue: The current hue of the player at any given time.

        - dHue: A change in hue. This is a unit of change in hue with one
                step in time.

        - currentSaturation: The current saturation of the fading colour.

        - currentLightness: The current lightness of the fading colour.

        - fadeDirection: The fading colour will fade from hueOne to hueTwo and
                         then back again in a periodic cycle. This is a boolean
                         that stores in which direction the fading is ocurring.

        - fadingTimer: This is a Timer object that keeps track of the timing
                       with respect to which the colour fades.
*/ 
function Player(sprite) {
    // Define getter and setter for y position property
    // These make it easier to reference the position of player
    this.__defineGetter__("x", function() {
        // Return the value of the sprite's x property
        return this.sprite.x;    
    });
    this.__defineSetter__("x", function(x) {
        // Set the value of the sprite's x property to the parameter x
        this.sprite.x = x;
    });

    // Define getter and setter for y position property
    // These make it easier to reference the position of player
    this.__defineGetter__("y", function() {
        // Return the value of the sprite's y property
        return this.sprite.y;    
    });
    this.__defineSetter__("y", function(y) {
        // Set the value of the sprite's y property to the parameter y
        this.sprite.y = y;
    });

    // Set the disabled property of the player to false by default
    // When disabled is true movement of player is restricted
    // This occurs in the maze.js position updating methods
    this.disabled = false;

    // Check if sprite parameter is of type Sprite
    if (sprite instanceof Sprite) {
        // Assign value to parameter sprite to property sprite
        this.sprite = sprite;
    // Otherwise throw an error
    } else {
        throw "Argument error. sprite must be a Sprite object."
    }

    // We know by validation in the sprite class its properties must be correct
    // Therefore we can assign new values here
    this.newPositionX = this.x;
    this.newPositionY = this.y;

    // This method updates the position of the player on the screen
    // This is so that it moves smoothly from tile to tile in maze
    this.animatePosition = function() {
        // Update the x position of the sprite in small increments
        // This ensures the player moves smoothly
        if (this.newPositionX > this.x) {
            // Increase x coordinate by quarter of the size of game tiles
            this.x += TILE_SIZE/4;
        } else if (this.newPositionX < this.x) {
            // Decrease x coordinate by quarter of the size of tiles
            this.x -= TILE_SIZE/4;
        }

        // Update the y position of the sprite in small increments
        // This ensures the player moves smoothly
        if (this.newPositionY > this.y) {
            // Increase y coordinate by quarter of the size of game tiles
            this.y += TILE_SIZE/4;
        } else if (this.newPositionY < this.y) {
            // Decrease y coordinate by quarter of the size of tiles
            this.y -= TILE_SIZE/4;
        }
    }

    // This is the initial hue of the fading colour.
    var hueOne = 145;
    // This is the hue to which the fading colour fades.
    var hueTwo = 300;
    // The current hue of the player at any given time.
    var currentHue = hueOne;
    // A change in hue. This is a unit of change in hue with one step in time.
    var dHue = (hueTwo - hueOne)/2000;
    // The current saturation of the fading colour.
    var currentSaturation = 80;
    // The current lightness of the fading colour.
    var currentLightness = 40;
    // Stores the direction of fade of colour
    var fadeDirection=true;
    // Keeps track of the timing with respect to which the colour fades.
    var fadingTimer = new Timer();

    // Function handles colour fading of player's colour
    this.fadeColour = function() {
        // Make change every 0.001 seconds
        if (fadingTimer.run(1)) {
            // Choose direction of change
            // If the currentHue is greater the second hue move backs
            if (currentHue >=hueTwo) { fadeDirection = false; }
            // Otherwise if the currenthue is less than the 
            // first hue then move forwards
            else if (currentHue <= hueOne) { fadeDirection = true; }
    
            // If fadeDirection is forward
            if (fadeDirection) {
                // Increment the currentHue by the change in hue
                currentHue += dHue;  
            } else { 
                // Decrement the currentHue by the change in hue
                currentHue -= dHue;   
            }

            // Update the sprite with respect to the change
            return "hsl(" + parseInt(currentHue) + "," + 
                currentSaturation + "%," +  
                currentLightness + "%)";
        }
    }

    this.trailColour = function() {
        return "hsl(" + currentHue + "," + (currentSaturation - 10) + "%," + (currentLightness+20) + "%)";
    } 
}

































