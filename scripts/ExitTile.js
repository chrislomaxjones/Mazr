/*
    ExitTile.js
    ExitTile object
    ---------
    Written on the 01/01/2014 by Chris Jones

    This file represents the ExitTile data structure represented in the Data
    Structures section of the design specification.

    The function ExitTile represents a function from which the ExitTile
    object can be instantiated. This will represent the ExitTile data 
    structure. 

    An ExitTile represents the end of a maze - the tile to which the player
    must move in order to complete any given maze. Therefore, it must be
    drawn to the maze as would any sprite.

    An ExitTile object is instantiated by the Maze object and controlled
    within the body of that object. This allows for it be controlled and
    its position used in conjuction with the Player's in order to determine
    if the maze has been completed

    ExitTile has 1 attribute:
        - sprite: The sprite object that is drawn to the canvas that
                  represents the ExitTile in the maze.

    ExitTile has 2 pairs of getter / setter methods:
        - x: This is a getter / setter pair that reference the x coordinate
             of the sprite. This is effectively assigning the reference
             ExitTile.x to ExitTile.sprite.x. This makes it easier to get and 
             set values of the ExitTile's position without accessing the
             sprite.
        - y: This is a getter / setter pair that reference the y coordinate
             of the sprite. This is effectively assigning the reference
             ExitTile.y to ExitTile.sprite.y. This makes it easier to get and 
             set values of the ExitTile's position without accessing the
             sprite.
*/ 
function ExitTile(sprite) {
    // Define getter and setter for x position property
    // These make it easier to reference the position of an ExitTile
    this.__defineGetter__("x", function() {
        // Return the value of the sprite's x property
        return this.sprite.x;    
    });
    this.__defineSetter__("x", function(x) {
        // Set the value of the sprite's x property to the parameter x
        this.sprite.x = x;
    });

    // Define getter and setter for y position property
    // These make it easier to reference the position of an ExitTile
    this.__defineGetter__("y", function() {
        // Return the value of the sprite's y property
        return this.sprite.y;    
    });
    this.__defineSetter__("y", function(y) {
        // Set the value of the sprite's y property to the parameter y
        this.sprite.y = y;
    });

    // Check if sprite parameter is of type Sprite
    if (sprite instanceof Sprite) {
        // Assign value to parameter sprite to property sprite
        this.sprite = sprite;
    // Otherwise throw an error
    } else {
        throw "Argument error. sprite must be a Sprite object."
    }
}
