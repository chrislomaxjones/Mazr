/* 
    engine.js
    Global scope file
    ---------
    Written on the 04/01/2014 by Chris Jones
*/

// GLOBAL CONSTANTS
// These are immutable and do not change over course of program
//-----------------------------------------------------------------------------
const WIDTH 	= 512;	// Width of the viewport
const HEIGHT 	= 512;	// Height of the viewport
const TILE_SIZE = 32;	// The size of the tiles

const FPS = 30;   // The fixed FPS (frames per second)
                  // Controls the number of times screen is redrawn per second

const STATE = {   // This is an object literal used as an 'enumeration'
    MENU: 0,      // This is the state of the game
    MAZE: 1       // Used when it is necessary to check the current page
};

const BACKGROUND_COLOUR = "#333333";    // The colour of the background in hex
const WALL_COLOUR = "#222222";          // The colour of the walls in hex
const EXIT_COLOUR = "#ff8000";   // Colour of the exit in rgb 
//-----------------------------------------------------------------------------


// INSTANTIATE GLOBAL VARIABLES
// These are implicity defined to be global 
// As they are in the global scope
//-----------------------------------------------------------------------------
// GAME is the object that wraps up the main functionality
// Methods and variables are added to this object later in the file
var GAME = {};

// Reference to the canvas element extracted from the HTML
var canvas = document.getElementById('canvas');

// Set the canvas dimensions equal to the constant dimensions
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Reference to the drawing context of the canvas
var canvasContext = canvas.getContext('2d');

// The width of the maze initialised to 8
var mazeWidth = 4;

// The height of the maze initialised to 8
var mazeHeight = 4;

// Stores the level the player is on, starting at 1
var level = 1;

// Create a new maze object and store in variable maze
var maze = new Maze(
    mazeWidth, 
    mazeHeight, 
    canvasContext, 
    new Camera()
);

var currentState = STATE.MENU;

// Initialise the newly instantiated maze
maze.initialise();
//-----------------------------------------------------------------------------


// NAVIGATION FUNCTIONS
//-----------------------------------------------------------------------------
// Instantiate the page stack as an empty array
// This will act as a stack of pages visited by the user
var pageStack = [];

function showPage(pageString) {
    // First hide all of the pages
    $('.page').css('display', 'none');

    // Then display the desired page
    $(pageString).css('display', 'inline-flex');
}

// Navigate to page with HTML id pageString
function navigateTo(pageString) {
    if (pageString == ".main-menu") {
        // This clause attempts to try the block of code
        // Any SecurityErrors will be caught in the catch block
        try {
            // If the currently stored level is one
            if (localStorage["level"] == 1 || localStorage["level"] == undefined) {
                // Disable the continue button
                $('.btn-continue').attr('disabled', 'disabled');    
                // Set the text within the button to 'Continue'
                // This is incase it contains a level number 
                $('.btn-continue').html('Continue');
            } else {   
                // Otherwise insert the level the player is currently on
                $('.btn-continue').removeAttr('disabled');    
                $('.btn-continue').html(
                    'Continue <br><p class="under-text">From level ' +
                     localStorage["level"] + "</p>"
                );
            }
        }
        // This clause executes when SecurityError is thrown in the game
        catch(SecurityError) {
            // Hide the section
            $('section').css('display', 'none');

            // Display the error message
            $('.local-storage-error-messsage').css('display', 'block');
        }    
    } 

    // If navigating away from the canvas
    if (pageStack[pageStack.length-1] == "#canvas") {
        // Disable the player
        maze.player.disabled = true;
        // Switch the current state to menu
        currentState = STATE.MENU;
    }

    // If navigating to the canvas
    if (pageString == "#canvas") {
        // Enable the player
        maze.player.disabled = false;    

        // Switch the current state to game
        currentState = STATE.MAZE;
    }

    // Show the page that is being navigated to
    showPage(pageString);

    // Push it to the top of the pageStack
    pageStack.push(pageString);
}

// Go back to the last visited page
function goBack() {
    // Check there are at least two pages in the stack
    // Otherwise there is no menu to navigate back to
    if (pageStack.length >= 2) {
        // Pop the top page off of the stack.
        // This has the effect of navigating back a page
        pageStack.pop();

        // Navigate to the new top of the stack
        // Note this is popped off here
        // and pushed back on in navigation
        navigateTo(pageStack.pop());
    }
}
//-----------------------------------------------------------------------------


// DEFINE THE FUNCTIONS / VARIABLES THAT CONTROL THE GAME
// These are bound to the object GAME
// This is instantiated above
//-----------------------------------------------------------------------------
// This function handles saving the state of the GAME to localStorage
GAME.save = function() {
    // Store the value of level in key "level" of localStorage
    localStorage["level"] = level;

    // Store the value of mazeWidth in the key "x" of localStorage
    localStorage["x"] = mazeWidth;

    // Store the value of mazeHeight in the key "y" of localStorage
    localStorage["y"] = mazeHeight;
}

// This function handles loading GAME state from localStorage
GAME.load = function() {
    // Retrieve the width of the maze stored
    mazeWidth = parseInt(localStorage["x"]);

    // Retrieve the height of the maze store
    mazeHeight = parseInt(localStorage["y"]);

    // Retrieve the level that is stored
    level = parseInt(localStorage["level"]);
}

// Function handles all of the update logic necessary in the game
GAME.update = function() {
    // Update the logic of the maze
    maze.update();

    // Check if maze is complete
    if (maze.complete) {

        $('#time').html(
            (String(parseInt(maze.completedSeconds / 60)).length > 1 ? parseInt(maze.completedSeconds / 60) : "0" + parseInt(maze.completedSeconds / 60)) + 
            ":" + 
            (String(maze.completedSeconds).length > 1 ? maze.completedSeconds % 60 : "0" + maze.completedSeconds % 60));

        $('#steps').html(String(maze.stepsTaken));

        // If so, generate a new maze with two more cells in each axis
        maze = new Maze(mazeWidth+=2, mazeHeight+=2, canvasContext, new Camera());
        // Initialise this new maze
        maze.initialise();


        // Display the end of level menu
        navigateTo('.end-of-level-menu');

        // Increment level
        level +=1;

        // Save the value of the maze
        this.save();
    }
}

// Draw the maze and associated sprites
GAME.draw = function() {

    // Fill in the background colour
    canvasContext.fillStyle = BACKGROUND_COLOUR;
    canvasContext.fillRect(0,0,WIDTH,HEIGHT);

    // Draw the maze to the canvas
    maze.draw();
}

// Event listener function that deals with input
GAME.doKeyDown = function(e) {
    // Swtich statement must on keyCode variable of the event
    switch(e.keyCode) {
        // Up arrow or W key codes
        case 87:
        case 38:
            // Update player position by moving it up
            maze.updatePlayerPosition("up");
            break;
        // Down arrow or S key codes
        case 83:
        case 40:
            // Update player position by moving it down
            maze.updatePlayerPosition("down");
            break;

        // Down arrow or S key codes
        case 65:
        case 37:
            // Update player position by moving it left
            maze.updatePlayerPosition("left");
            break;

        // Right arrow or D key codes
        case 68:
        case 39:
            // Update player position by moving it right
            maze.updatePlayerPosition("right");
            break;

        // Escape key code
        case 27:
            // If the current page is not the pause menu
            // and the current page is the game canvas
            if (pageStack[pageStack.length-1] == "#canvas") {

                // Navigate to the pause menu
                navigateTo('.pause-menu');    

            } else if (pageStack[pageStack.length-1] == ".pause-menu") {

                // Go back a step in the stack of pages
                goBack();

            }
    }   
}
//-----------------------------------------------------------------------------


// INPUT HANDLER
//-----------------------------------------------------------------------------
// Add a keyboard event listener
window.addEventListener( "keydown", GAME.doKeyDown, false);
//-----------------------------------------------------------------------------


// INITIALISE THE MAIN GAME
//-----------------------------------------------------------------------------
// Display the section that contains the game
$('section').css('display', 'block');

// setInterval is a function that takes a function as parameter.
// Takes time interval in milliseconds as second parameter
// Calls the function passed first every period that
// was passed as second parameter
setInterval(function() { // Anonymous function ...
    // Check the game is in maze state before calling functions
    if (currentState == STATE.MAZE) {
        // Call the update method first
        GAME.update();

        // Call the draw method
        GAME.draw();
    }

    //console.log(maze.completedSeconds);

}, 1000/FPS);

// Navigate to the main menu
navigateTo('.main-menu');
//-----------------------------------------------------------------------------


// EVENTS FOR BUTTON CLICKS
//-----------------------------------------------------------------------------
// Continue button click event
$('.btn-continue').click(function() {
    // Load the game state data from storage
    GAME.load();

    // Instantiate a new maze with respect to the loaded data
    maze = new Maze(
        mazeWidth,
        mazeHeight,
        canvasContext,
        new Camera()
    );

    // Initialise the new maze
    maze.initialise();

    // Navigate to the canvas game page
    navigateTo('#canvas');
});

// New game button click event
$('.btn-new-game').click(function() {
    // Set level to 1
    level = 1;

    // Set maze dimensions to 4
    mazeWidth = 4;
    mazeHeight = 4;

    // Instantiate a new maze
    maze = new Maze(
        mazeWidth, 
        mazeHeight, 
        canvasContext, 
        new Camera()
    );

    // Initialise the new maze
    maze.initialise();

    // Save the game, at level one
    // This ensures the continue button is enabled
    GAME.save();

    // Navigate to the game
    navigateTo('#canvas');
});

// Help button click event
$('.btn-help').click(function() {
    // Navigate to the first help page
    navigateTo('.help-1');
});

// Navigate back a page when back button is pressed
$('.btn-back').click(function() {
    // Check if the top of the pageStack is a help page
    // Back behavior is different for help pages
    if (pageStack[pageStack.length-1].indexOf('help') > -1 ) {

        // While there are still help pages in the stack
        while (pageStack[pageStack.length-1].indexOf('help') > -1) {
            // Pop this page off the stack
            pageStack.pop();
        }

        // Navigate to top of the stack
        navigateTo(pageStack.pop());

    // Otherwise go back a page
    } else {
        goBack();
    }
});

// Handle the left arrow button event
$('.left').click(function() {
    // Get the index of the current help page
    var currentPageIndex = 
        pageStack[pageStack.length-1][pageStack[pageStack.length-1].length-1];

    // Subtract one from currentPageIndex
    var nextPage = parseInt(currentPageIndex) - 1;

    // Navigate to the previous help page in the sequence
    navigateTo('.help-' + nextPage);
});

// Handle the right arrow button event
$('.right').click(function() {
    // Get the index of the current help page
    var currentPageIndex = 
        pageStack[pageStack.length-1][pageStack[pageStack.length-1].length-1];

    // Add one to currentPageIndex
    var nextPage = parseInt(currentPageIndex) + 1;

    // Navigate to the next help page in the sequence
    navigateTo('.help-' + nextPage);
});

// Handle the next level button on the end of level menu
$('.btn-next-level').click(function() {
    // Show the canvas game page
    goBack();
});

// Handle the quit button event
$('.btn-quit').click(function() {
    // Jump straight to the root menu
    // Empty the whole page stack
    // Do this by popping off all elements
    // while the array still has elements
    while (pageStack.length != 0) {
        pageStack.pop();
    }

    // Save the game
    GAME.save();
    
    // Navigate to the main menu
    navigateTo('.main-menu');
});
//-----------------------------------------------------------------------------



