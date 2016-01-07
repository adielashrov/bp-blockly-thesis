/**
 * Blockly Apps: Maze
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview JavaScript for Blockly's Maze application.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Maze = {};

// Supported languages.
BlocklyApps.LANGUAGES = {
    // Format: ['Language name', 'direction', 'XX_compressed.js']
    ca: ['Català', 'ltr', 'en_compressed.js'],
    cs: ['Čeština', 'ltr', 'en_compressed.js'],
    da: ['Dansk', 'ltr', 'en_compressed.js'],
    de: ['Deutsch', 'ltr', 'de_compressed.js'],
    el: ['Eλληνικά', 'ltr', 'en_compressed.js'],
    en: ['English', 'ltr', 'en_compressed.js'],
    es: ['Español', 'ltr', 'en_compressed.js'],
    eu: ['Euskara', 'ltr', 'en_compressed.js'],
    fr: ['Français', 'ltr', 'en_compressed.js'],
    hu: ['Magyar', 'ltr', 'en_compressed.js'],
    ia: ['Interlingua', 'ltr', 'en_compressed.js'],
    it: ['Italiano', 'ltr', 'en_compressed.js'],
    ko: ['한국어', 'ltr', 'en_compressed.js'],
    lv: ['Latviešu', 'ltr', 'en_compressed.js'],
    mk: ['Македонски', 'ltr', 'en_compressed.js'],
    nl: ['Nederlands', 'ltr', 'en_compressed.js'],
    pl: ['Polski', 'ltr', 'en_compressed.js'],
    pms: ['Piemontèis', 'ltr', 'en_compressed.js'],
    pt: ['Português', 'ltr', 'pt_br_compressed.js'],
    ru: ['Русский', 'ltr', 'en_compressed.js'],
    sr: ['Српски', 'ltr', 'en_compressed.js'],
    sv: ['Svenska', 'ltr', 'en_compressed.js'],
    sw: ['Kishwahili', 'ltr', 'en_compressed.js'],
    th: ['ภาษาไทย', 'ltr', 'en_compressed.js'],
    tr: ['Türkçe', 'ltr', 'en_compressed.js'],
    uk: ['Українська', 'ltr', 'en_compressed.js'],
    vi: ['Tiếng Việt', 'ltr', 'vi_compressed.js'],
    'zh-hans': ['简体字', 'ltr', 'zh_tw_compressed.js'],
    'zh-hant': ['中文', 'ltr', 'zh_tw_compressed.js']
};
BlocklyApps.LANG = BlocklyApps.getLang();
/**
 * Static function which extracts address  'ver' variable.
 */
var getUrlVars = function() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
};

//Check which version is this and load an appropriate en.js file.
var tVersionController = null; //versionController object
var tMsgDisplay = null; //msgDisplay object.
var tVersion = getUrlVars()["ver"];
var _logger = new Logger();
/**Random selection of version.*/
if (typeof tVersion === 'undefined') {
    var tDrawnNumber = Math.random();
    if (tDrawnNumber < 0.5) {
        tVersion = "1";
    } else {
        tVersion = "2";
    }
};

if (tVersion == "1") {
    tVersionController = new versionControllerHigh();
    tMsgDisplay = new msgDisplayHigh();
    document.write(tVersionController.getTemplateDocument());

} else if (tVersion == "2") {
    tVersionController = new versionControllerLow();
    tMsgDisplay = new msgDisplayLow();
    document.write(tVersionController.getTemplateDocument());

}

Maze.MAX_LEVEL = 9; //Original value is 10 - levels
Maze.LEVEL = BlocklyApps.getNumberParamFromUrl('level', 1, Maze.MAX_LEVEL);

var maxBlocks = [undefined, // Level 0.
    Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity
][Maze.LEVEL];

Maze.SKINS = [
    // sprite: A 1029x51 set of 21 avatar images.
    // tiles: A 250x200 set of 20 map images.
    // marker: A 20x34 goal image.
    // background: An optional 400x450 background image, or false.
    // graph: Colour of optional grid lines, or false.
    // look: Colour of sonar-like look icon.
    {
        sprite: 'pegman.png',
        tiles: 'tiles_pegman.png',
        marker: 'marker.png',
        background: false,
        graph: false,
        look: '#000'
    }, {
        sprite: 'astro.png',
        tiles: 'tiles_astro.png',
        marker: 'marker.png',
        background: 'bg_astro.jpg',
        // Coma star cluster, photo by George Hatfield, used with permission.
        graph: false,
        look: '#fff'
    }, {
        sprite: 'panda.png',
        tiles: 'tiles_panda.png',
        marker: 'marker.png',
        background: 'bg_panda.jpg',
        // Spring canopy, photo by Rupert Fleetingly, CC licensed for reuse.
        graph: false,
        look: '#000'
    }
];
Maze.SKIN_ID = BlocklyApps.getNumberParamFromUrl('skin', 0, Maze.SKINS.length);
Maze.SKIN = Maze.SKINS[Maze.SKIN_ID];

/**
 * Milliseconds between each animation frame.
 */
Maze.stepSpeed;
Maze.stepSpeedOriginalValue = null; //Used to reset the fast forward feature.need to reset it.


/**
 * The types of squares in the maze, which is represented
 * as a 2D array of SquareType values.
 * @enum {number}
 */
Maze.SquareType = {
    WALL: 0,
    OPEN: 1,
    START: 2,
    FINISH: 3
};

// The maze square constants defined above are inlined here
// for ease of reading and writing the static mazes.
Maze.map = [
    // Level 0.
    undefined,
    // Level 1.
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 1, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // Level 2.
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 3, 0, 0, 0],
        [0, 0, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // Level 3.
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // Level 4.
    /**
     * Note, the path continues past the start and the goal in both directions.
     * This is intentionally done so users see the maze is about getting from
     * the start to the goal and not necessarily about moving over every part of
     * the maze, 'mowing the lawn' as Neil calls it.
     */
    [
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 1, 3, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0],
        [0, 2, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0]
    ],
    // Level 5.
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 3, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 2, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 2, 1, 1, 0, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // Level 7.
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [2, 1, 1, 1, 0, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // Level 8.
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 2, 1, 1, 0, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // Level 9.  
    /* BP old Map
    [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 2, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 1, 3, 0, 1, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],*/
    /* - Neil's level 10 map*/
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 3, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0, 0, 1, 0],
        [2, 1, 1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // Level 10.
    /* - Neil's map*/
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 3, 0, 1, 0],
        [0, 1, 1, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 1, 0],
        [0, 2, 1, 1, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]

][Maze.LEVEL];

/**
 * Measure maze dimensions and set sizes.
 * ROWS: Number of tiles down.
 * COLS: Number of tiles across.
 * SQUARE_SIZE: Pixel height and width of each maze square (i.e. tile).
 */
Maze.ROWS = Maze.map.length;
Maze.COLS = Maze.map[0].length;
Maze.SQUARE_SIZE = 50;
Maze.PEGMAN_HEIGHT = 52;
Maze.PEGMAN_WIDTH = 49;

Maze.MAZE_WIDTH = Maze.SQUARE_SIZE * Maze.COLS;
Maze.MAZE_HEIGHT = Maze.SQUARE_SIZE * Maze.ROWS;
Maze.PATH_WIDTH = Maze.SQUARE_SIZE / 3;

/**
 * Constants for cardinal directions.  Subsequent code assumes these are
 * in the range 0..3 and that opposites have an absolute difference of 2.
 * @enum {number}
 */
Maze.DirectionType = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
};

/**
 * Outcomes of running the user program.
 */
Maze.ResultType = {
    UNSET: 0,
    SUCCESS: 1,
    FAILURE: -1,
    TIMEOUT: 2,
    ERROR: -2
};

/**
 * Result of last execution - default is unset.
 */
Maze.result = Maze.ResultType.UNSET;

/**
 * Starting direction.
 */
Maze.startDirection = Maze.DirectionType.EAST;

/**
 * PIDs of animation tasks currently executing.
 */
Maze.pidList = [];

/**
 * Pseudo-random identifier used for tracking user progress within a level.
 */
Maze.LEVEL_ID = Math.random();

// Map each possible shape to a sprite.
// Input: Binary string representing Centre/North/West/South/East squares.
// Output: [x, y] coordinates of each tile's sprite in tiles.png.
Maze.tile_SHAPES = {
    '10010': [4, 0], // Dead ends
    '10001': [3, 3],
    '11000': [0, 1],
    '10100': [0, 2],
    '11010': [4, 1], // Vertical
    '10101': [3, 2], // Horizontal
    '10110': [0, 0], // Elbows
    '10011': [2, 0],
    '11001': [4, 2],
    '11100': [2, 3],
    '11110': [1, 1], // Junctions
    '10111': [1, 0],
    '11011': [2, 1],
    '11101': [1, 2],
    '11111': [2, 2], // Cross
    'null0': [4, 3], // Empty
    'null1': [3, 0],
    'null2': [3, 1],
    'null3': [0, 3],
    'null4': [1, 3]
};

/**------------------------------------------------------------------------------------------------------------------------------------------------------
*-----------------------------------------------------BP added static variables--------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Level 7 coordinates - 3,3
//Level 8 coordinates - 1,4
Maze.barrierLocation = [3, 3]; //TODO: Two barriers in the same level requires refactoring this code
Maze.barrierLocations = [
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [3, 3],
    [1, 3]
];


//TODO: Check if this variable is used, and if not remove this
//A flag telling us if we should initialize localStorage with layouts.
Maze.storageIntialized = function() {
    if (window.localStorage.getItem("reset") != null) {
        return (window.localStorage.getItem("reset").length > 0);
    } else {
        return false;
    }
};
//TODO: Check if this variable is used, and if not remove this
//This is the default bit array counter initialize value
Maze.storageBitArray = '0,0,0,0,0,0,0,0,0,0'; //TODO: Is this used?

//This array keeps track on which block is highlighted s.t. only one block will be highlighted in each b-thread.
Maze.currentHighlightedBlock = null;

Maze.slowMotionState = null;

Maze.counterOfRightTurns = 0;

/**------------------------------------------------------------------------------------------------------------------------------------------------------
*-----------------------------------------------------BP added static variables ---- End --------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * This function places the barrier in a random location inside the maze.
 * TODO: Remove this function
 */
Maze.randomizeBarrierLocation = function(level) {
    var i;
    for (var i = 0; j < Maze.ROWS; j++) {
        for (var j = 0; i < Maze.COLS; i++) {
            i = Maze.map[i][j];
            console.log(i);
        }
    }
};

/**
 * Create and layout all the nodes for the path, scenery, Pegman, and goal.
 */
Maze.drawMap = function() {
    var svg = document.getElementById('svgMaze');

    // Draw the outer square.
    var square = document.createElementNS(Blockly.SVG_NS, 'rect');
    square.setAttribute('width', Maze.MAZE_WIDTH);
    square.setAttribute('height', Maze.MAZE_HEIGHT);
    square.setAttribute('fill', '#F1EEE7');
    square.setAttribute('stroke-width', 1);
    square.setAttribute('stroke', '#CCB');
    svg.appendChild(square);

    if (Maze.SKIN.background) {
        var tile = document.createElementNS(Blockly.SVG_NS, 'image');
        tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
            Maze.SKIN.background);
        tile.setAttribute('height', Maze.MAZE_HEIGHT);
        tile.setAttribute('width', Maze.MAZE_WIDTH);
        tile.setAttribute('x', 0);
        tile.setAttribute('y', 0);
        svg.appendChild(tile);
    }

    if (Maze.SKIN.graph) {
        // Draw the grid lines.
        // The grid lines are offset so that the lines pass through the centre of
        // each square.  A half-pixel offset is also added to as standard SVG
        // practice to avoid blurriness.
        var offset = Maze.SQUARE_SIZE / 2 + 0.5;
        for (var k = 0; k < Maze.ROWS; k++) {
            var h_line = document.createElementNS(Blockly.SVG_NS, 'line');
            h_line.setAttribute('y1', k * Maze.SQUARE_SIZE + offset);
            h_line.setAttribute('x2', Maze.MAZE_WIDTH);
            h_line.setAttribute('y2', k * Maze.SQUARE_SIZE + offset);
            h_line.setAttribute('stroke', Maze.SKIN.graph);
            h_line.setAttribute('stroke-width', 1);
            svg.appendChild(h_line);
        }
        for (var k = 0; k < Maze.COLS; k++) {
            var v_line = document.createElementNS(Blockly.SVG_NS, 'line');
            v_line.setAttribute('x1', k * Maze.SQUARE_SIZE + offset);
            v_line.setAttribute('x2', k * Maze.SQUARE_SIZE + offset);
            v_line.setAttribute('y2', Maze.MAZE_HEIGHT);
            v_line.setAttribute('stroke', Maze.SKIN.graph);
            v_line.setAttribute('stroke-width', 1);
            svg.appendChild(v_line);
        }
    }

    // Draw the tiles making up the maze map.

    // Return a value of '0' if the specified square is wall or out of bounds,
    // '1' otherwise (empty, start, finish).
    var normalize = function(x, y) {
        if (x < 0 || x >= Maze.COLS || y < 0 || y >= Maze.ROWS) {
            return '0';
        }
        return (Maze.map[y][x] == Maze.SquareType.WALL) ? '0' : '1';
    };

    // Compute and draw the tile for each square.
    var tileId = 0;
    for (var y = 0; y < Maze.ROWS; y++) {
        for (var x = 0; x < Maze.COLS; x++) {
            // Compute the tile index.
            var tile = normalize(x, y) +
                normalize(x, y - 1) + // North.
                normalize(x + 1, y) + // West.
                normalize(x, y + 1) + // South.
                normalize(x - 1, y); // East.

            // Draw the tile.
            if (!Maze.tile_SHAPES[tile]) {
                // Empty square.  Use null0 for large areas, with null1-4 for borders.
                // Add some randomness to avoid large empty spaces.
                if (tile == '00000' && Math.random() > 0.3) {
                    tile = 'null0';
                } else {
                    tile = 'null' + Math.floor(1 + Math.random() * 4);
                }
            }
            var left = Maze.tile_SHAPES[tile][0];
            var top = Maze.tile_SHAPES[tile][1];
            // Tile's clipPath element.
            var tileClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
            tileClip.setAttribute('id', 'tileClipPath' + tileId);
            var clipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
            clipRect.setAttribute('width', Maze.SQUARE_SIZE);
            clipRect.setAttribute('height', Maze.SQUARE_SIZE);

            clipRect.setAttribute('x', x * Maze.SQUARE_SIZE);
            clipRect.setAttribute('y', y * Maze.SQUARE_SIZE);

            tileClip.appendChild(clipRect);
            svg.appendChild(tileClip);
            // Tile sprite.
            var tile = document.createElementNS(Blockly.SVG_NS, 'image');
            tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                Maze.SKIN.tiles);
            // Position the tile sprite relative to the clipRect.
            tile.setAttribute('height', Maze.SQUARE_SIZE * 4);
            tile.setAttribute('width', Maze.SQUARE_SIZE * 5);
            tile.setAttribute('clip-path', 'url(#tileClipPath' + tileId + ')');
            tile.setAttribute('x', (x - left) * Maze.SQUARE_SIZE);
            tile.setAttribute('y', (y - top) * Maze.SQUARE_SIZE);
            svg.appendChild(tile);
            tileId++;
        }
    }

    // Add finish marker.
    var finishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
    finishMarker.setAttribute('id', 'finish');
    finishMarker.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
        Maze.SKIN.marker);
    finishMarker.setAttribute('height', 34);
    finishMarker.setAttribute('width', 20);
    svg.appendChild(finishMarker);

    // Pegman's clipPath element, whose (x, y) is reset by Maze.displayPegman
    var pegmanClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
    pegmanClip.setAttribute('id', 'pegmanClipPath');
    var clipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
    clipRect.setAttribute('id', 'clipRect');
    clipRect.setAttribute('width', Maze.PEGMAN_WIDTH);
    clipRect.setAttribute('height', Maze.PEGMAN_HEIGHT);
    pegmanClip.appendChild(clipRect);
    svg.appendChild(pegmanClip);

    // Add BP Barrier
    /*TODO: Remove code if transition to image is successful
    var barrierSVG = document.createElementNS(Blockly.SVG_NS, 'circle');
    barrierSVG.setAttribute('id', 'circleBarrier');
    barrierSVG.setAttribute('cx', 10);
    barrierSVG.setAttribute('cy', 10); // 49 * 21 = 1029
    barrierSVG.setAttribute('r', 8);
    barrierSVG.setAttribute('fill', "red");
    barrierSVG.setAttribute('visibility', "hidden"); //Let's see the barrier only if it's on the appropriate level
    //Finish barrier here
    svg.appendChild(barrierSVG);
    */
    // Add BP Barrier
    var barrierSVG = document.createElementNS(Blockly.SVG_NS, 'image');
    barrierSVG.setAttribute('id', 'circleBarrier');
    barrierSVG.setAttribute('x', 10);
    barrierSVG.setAttribute('y', 10); // 49 * 21 = 1029
    barrierSVG.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "../../media/barrier.png");
    barrierSVG.setAttribute('width', "100");
    barrierSVG.setAttribute('height', "50");
    barrierSVG.setAttribute('visibility', "hidden"); //Let's see the barrier only if it's on the appropriate level
    //Finish barrier here
    svg.appendChild(barrierSVG);

    // Add Pegman.
    var pegmanIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    pegmanIcon.setAttribute('id', 'pegman');
    pegmanIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
        Maze.SKIN.sprite);
    pegmanIcon.setAttribute('height', Maze.PEGMAN_HEIGHT);
    pegmanIcon.setAttribute('width', Maze.PEGMAN_WIDTH * 21); // 49 * 21 = 1029
    pegmanIcon.setAttribute('clip-path', 'url(#pegmanClipPath)');
    svg.appendChild(pegmanIcon);

};

/**--------------------------------------------------------------------------------------------------------------------------------
* ----------------------------------------------Slow motion button functions - Start-----------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------*/
//TODO: Extract this code to other file/module.
Maze.initSingleStepButtonState = function() {
    Maze.slowMotionState = new Object();
    Maze.slowMotionState['singleStepClicked'] = 0;
    Maze.slowMotionState['pauseClicked'] = 0;
    Maze.hideSingleStepButton();
    Maze.hidePauseButton();
    Maze.hideContinueButton();
}

Maze.saveStepSpeed = function(stepSpeed) {
    Maze.slowMotionState['stepSpeed'] = stepSpeed;
}

Maze.showSingleStepButton = function() {
    var button = document.getElementById('singleStepButton');
    if (button.style.display == "none") {
        button.style.display = "inline";
    }
}

Maze.hideSingleStepButton = function() {
    var button = document.getElementById('singleStepButton');
    button.style.display = "none";
}

Maze.showPauseButton = function() {
    var button = document.getElementById('pauseMotionButton');
    button.style.display = "inline";
}

Maze.hidePauseButton = function() {
    var button = document.getElementById('pauseMotionButton');
    button.style.display = "none";
}


Maze.showContinueButton = function() {
    var button = document.getElementById('continueButton');
    button.style.display = "inline";
};

Maze.hideContinueButton = function() {
    var button = document.getElementById('continueButton');
    button.style.display = "none";
};

Maze.showFastForwardButton = function() {
    var button = document.getElementById('fastForwardButton');
    button.style.display = "inline";
};

Maze.hideFastForwardButton = function() {
    var button = document.getElementById('fastForwardButton');
    button.style.display = "none";
};

Maze.singleStepButtonClicked = function() {

    //  Maze.stepSpeed = Maze.stepSpeedOriginalValue;
    Maze.slowMotionState['singleStepClicked'] = 1; //TODO:reset inside continue
    Maze.showContinueButton();
    Maze.animate();
}

Maze.pauseMotionButtonClicked = function() {

    Maze.stepSpeed = Maze.stepSpeedOriginalValue;
    Maze.slowMotionState['singleStepClicked'] = 1; //TODO:reset inside continue
    Maze.hideFastForwardButton();
    Maze.hidePauseButton();
    Maze.showSingleStepButton();
    Maze.showContinueButton();
    Maze.animate();
}

Maze.continueButtonClicked = function() {
    Maze.hideContinueButton();
    Maze.hideSingleStepButton();
    Maze.showFastForwardButton();
    Maze.showPauseButton();
    Maze.slowMotionState['singleStepClicked'] = 0;
    Maze.animate();
};

Maze.fastForwardButtonClicked = function() {
    Maze.stepSpeed = (Maze.stepSpeed * (3 / 4));
};

Maze.hideAllSingleStepButtons = function() {
    Maze.hideSingleStepButton();
    Maze.hidePauseButton();
    Maze.hideContinueButton();
    Maze.hideFastForwardButton();
}

//TODO: Do we need this code? Remove. Check id this code is used?
Maze.resetSlowMovionButtonClicked = function() {
        if (Maze.slowMotionState['buttonClicked'] == 1) {
            Maze.slowMotionState['buttonClicked'] = 0;
        }
    }
    /**--------------------------------------------------------------------------------------------------------------------------------
    * ----------------------------------------------Slow motion button functions - end-------------------------------------------------
    ---------------------------------------------------------------------------------------------------------------------------------*/

//TODO : Extract to message display object.
Maze.showMessagesListener = function(e) {
    if (!Maze.checkIfMazeExecutedWithoutSuccess()) {
        //TODO: Extract to msgDisplay
        var tKey = "Level_help";
        window.localStorage.setItem(tKey, Maze.storageBitArray);
        Maze.levelHelp();
        /*
        if ((Maze.LEVEL >= 6) && (Maze.LEVEL < 10)) { //High level don't display help for every change, only in Maze.init
                Maze.levelHelp();
        }
        */
    } else { //TODO: Alert with a beautiful message.
        //alert("Click reset before explanation");
        tMsgDisplay.showMessagesClickReset();
    }
}

/**
 * BP hot key listener.
 * If the key pressed is s we will see the code using Maze.showCode
 * If the key pressed is r , the localStorage is in reset to it's default values.
 */
Maze.keyUpListener = function(e) {
    if (!Maze.checkIfMazeExecutedWithoutSuccess()) {
        if ((e.keyCode == 83) && (e.shiftKey)) { //Shift +  S - is for show code
            Maze.showCode(this);
        } else if ((e.keyCode == 82) && (e.shiftKey)) { // Shift + R - for reset localStorage

            //Reset localStorage values of saved workspaces to default values.
            //tVersionController.resetLocalStorage();
            //tVersionController.resetMembers(true);TODO: Remove call to unused method
            tVersionController.prepareLocalStorgae(true);
            tVersionController.restoreBlocksFromVersionController(); //TODO: Change name of function
            //TODO: Smelly code, re factor
            //Other levels have onChange listener which responds to this click, very poor design.
            if ((Maze.LEVEL >= 6) && (Maze.LEVEL <= 10)) { //High level don't display help for every change, only in Maze.init
                Maze.levelHelp();
            }
            //Maze.levelHelp();
        } else if ((e.keyCode == 56) && (e.shiftKey)) { // Shift + 8 - is for solve level_8.
            tVersionController.cheat_Level_8();
        } else if ((e.keyCode == 76) && (e.shiftKey)) { // Shift + L - is for left hand rule
            tVersionController.cheat_Level_10();
        }
    }
};

/**
 * This function handles autosave workspace to remote storage
 * When there is a change in the workspace we back the result to the remote storage
 * The result is a storage key which will keep in Maze.storageKey
 * TODO: Not working right now.
 */
Maze.changeListenerRemoteStorage = function() {
    BlocklyStorage.saveWorkspaceRemoteBP(Maze.storageKey); //Debug
};

/**
 * If this is the first time we have loaded the level we do nothing
 * Else we load the workspace from the remote value with the key Maze.storageKey
 * TODO: Not working right now.
 */
Maze.loadWorkspaceFromRemoteStorage = function() {
    //if (Maze.storageKey.length > 0) { TODO: Keep storageKey inside Maze. 
    BlocklyStorage.retrieveXmlBP(Maze.storageKey);
    //}
};

/**
 * Checks if Maze.LEVEL == index help has been fully seen.
 */

Maze.checkIfLevelHelpMarked = function(index) {
    var tAnswer = null;
    if ('localStorage' in window) {
        var tLevelHelpString = window.localStorage.getItem("Level_help");
        if (tLevelHelpString != null) {
            var bitsArray = tLevelHelpString.split(",");
            if (bitsArray[index] == "0") {
                tAnswer = false;
            } else if (bitsArray[index] == "1") {
                tAnswer = true;
            } else {
                console.log("bitsArray[" + index + "]: is not 0,1. Inside Maze.checkIfLevelHelpMarked");
            }
        } else {
            console.log("Key value is null" + "Level_help " + ", inside Maze.checkIfLevelHelpMarked");
        }
    }
    return tAnswer;
}


/**
 * Mark levelHelp has been seen in localStorage
 */
Maze.markLevelHelp = function() {
    if ('localStorage' in window) {
        var tLevelHelpString = window.localStorage.getItem("Level_help");
        if (tLevelHelpString != null) {
            var bitsArray = tLevelHelpString.split(",");
            if (bitsArray[Maze.LEVEL] == "0") {
                bitsArray[Maze.LEVEL] = "1";
            }
            tLevelHelpString = bitsArray.join();
            window.localStorage.setItem("Level_help", tLevelHelpString);
        } else {
            console.log("Key value is null" + "Level_help " + ", inside Maze.markLevelHelpSeen");
        }
    } else {
        console.log("No LocalStorage, Error restoring level_help flag from localStorage, inside Maze.markLevelHelp");
    }
};

/**
 * This function restores the saved Maze.LEVEL workspace from the localStorage
 */
Maze.restoreBlocksFromLocalStorage = function() {
    if ('localStorage' in window) {
        var tXmlText = window.localStorage.getItem("Level_" + Maze.LEVEL);
        //Extract last XML tree from the local storage.
        var tXmlTrees = tXmlText.split("<&>");
        var tXmlTextLastVersion = tXmlTrees[tXmlTrees.length - 1];
        if (tXmlTextLastVersion != null) {
            var tXml = Blockly.Xml.textToDom(tXmlTextLastVersion);
            // Clear the workspace to avoid merge.
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
        } else {
            console.log("Key value is null" + "Level_" + Maze.LEVEL + ", inside Maze.restoreBlocksFromLocalStorage");
        }
    } else {
        console.log("No LocalStorage, Error restoring blocks from localstorage");
    }
};

/**
 * This function listens to changes in the workspace and backs them to the localstorage
 * TODO: Move to another file/module
 * TODO: We moved it to versionController ?
 */
Maze.backUpWorkspaceBlocks = function() { //TODO: When is this function called?
    //Mark that the values in the workspace have changed    
    tVersionController.flagLocalStorageInitialized();

    //Perhaps check if there is a change between the xml before changing.
    var tXml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace); //XML representing the blocks in the workspace
    var tText = Blockly.Xml.domToText(tXml); //Translating this XML to text representation
    var tKey = "Level_" + Maze.LEVEL;
    var current_XML_tree = window.localStorage.getItem(tKey);
    var updated_XML_tree;
    var current_XML_tree_parsed = current_XML_tree.split("<&>");
    //TODO: perhaps we save to much detail, perhaps only save the latest version of workspace??
    if (tText != current_XML_tree_parsed[current_XML_tree_parsed.length - 1]) //Check if current workspace is not already backed up.
    {
        updated_XML_tree = current_XML_tree + "<&>" + tText;
        window.localStorage.setItem(tKey, updated_XML_tree);
    }
};
/**
Init text log area 
*/
Maze.initLogTextArea = function() {

    if (Maze.LEVEL < 5) {
        document.getElementById("loggerTextArea").style.visibility = "hidden"; //This is the better way to change visibility for an object
    } else {
        document.getElementById("loggerTextArea").style.visibility = "visible";
    }

};

/**
 * Initialize Blockly and the maze.  Called on page load.
 */
Maze.init = function() {
    // Measure the height of arrow characters.
    // Firefox on Vista creates enormously high arrows (80px) for no reason.
    // TODO: Detect if arrow is printed, or Unicode square is printed.
    var textElement = document.getElementById('arrowTest');
    var height = textElement.getBBox().height;
    if (height < Blockly.BlockSvg.MIN_BLOCK_Y) {
        // Append arrows to direction messages.
        Blockly.Language.maze_turn.DIRECTIONS[0][0] += ' \u27F2';
        Blockly.Language.maze_turn.DIRECTIONS[1][0] += ' \u27F3';
        Blockly.Language.maze_if.DIRECTIONS[1][0] += ' \u27F2';
        Blockly.Language.maze_if.DIRECTIONS[2][0] += ' \u27F3';
    }
    var svg = textElement.ownerSVGElement
    svg.parentNode.removeChild(svg);

    BlocklyApps.init();

    // Setup the Pegman menu.
    var pegmanImg = document.querySelector('#pegmanButton>img');
    pegmanImg.style.backgroundImage = 'url(' + Maze.SKIN.sprite + ')';
    var pegmanMenu = document.getElementById('pegmanMenu');
    var handlerFactory = function(n) {
        return function() {
            Maze.changePegman(n);
        };
    };
    for (var i = 0; i < Maze.SKINS.length; i++) {
        if (i == Maze.SKIN_ID) {
            continue;
        }
        var div = document.createElement('div');
        var img = document.createElement('img');
        img.src = '../../media/1x1.gif';
        img.style.backgroundImage = 'url(' + Maze.SKINS[i].sprite + ')';
        div.appendChild(img);
        pegmanMenu.appendChild(div);
        Blockly.bindEvent_(div, 'mousedown', null, handlerFactory(i));
    }
    Blockly.bindEvent_(window, 'resize', null, Maze.hidePegmanMenu);

    var rtl = BlocklyApps.LANGUAGES[BlocklyApps.LANG][1] == 'rtl';
    var toolbox = document.getElementById('toolbox');
    Blockly.inject(document.getElementById('blockly'), {
        path: '../../',
        maxBlocks: maxBlocks,
        rtl: rtl,
        toolbox: toolbox,
        trashcan: true
    });
    //Blockly.loadAudio_(['apps/maze/win.mp3', 'apps/maze/win.ogg'], 'win');
    //Blockly.loadAudio_(['apps/maze/whack.mp3', 'apps/maze/whack.ogg'], 'whack');

    Blockly.JavaScript.INFINITE_LOOP_TRAP = '  BlocklyApps.checkTimeout(%1);\n';
    Maze.drawMap();

    var blocklyDiv = document.getElementById('blockly');
    var visualization = document.getElementById('visualization');
    var onresize = function(e) {
        var top = visualization.offsetTop;
        blocklyDiv.style.top = Math.max(10, top - window.scrollY) + 'px';
        blocklyDiv.style.left = rtl ? '10px' : '420px';
        blocklyDiv.style.width = (window.innerWidth - 440) + 'px';
    };
    window.addEventListener('scroll', function() {
        onresize();
        Blockly.fireUiEvent(window, 'resize');
    });
    window.addEventListener('resize', onresize);
    onresize();
    Blockly.fireUiEvent(window, 'resize');

    // Locate the start and finish squares.
    for (var y = 0; y < Maze.ROWS; y++) {
        for (var x = 0; x < Maze.COLS; x++) {
            if (Maze.map[y][x] == Maze.SquareType.START) {
                Maze.start_ = {
                    x: x,
                    y: y
                };
            } else if (Maze.map[y][x] == Maze.SquareType.FINISH) {
                Maze.finish_ = {
                    x: x,
                    y: y
                };
            }
        }
    }

    Maze.reset(true);
    Blockly.addChangeListener(function() {
        Maze.updateCapacity()
    });

    //BP - Removed the listener for pegman spinning in the end of the level explanation.
    document.body.addEventListener('mousemove', Maze.updatePegSpin_, true);

    //BP - Added a hot key listener for the show Code function. showCode button is not compiled into the en.js file
    //document.getElementById('showCodeButton').setAttribute("style", "visibility:hidden;");
    document.onkeyup = Maze.keyUpListener;

    if (Maze.LEVEL == 1) {
        // Make connecting blocks easier for beginners.
        Blockly.SNAP_RADIUS *= 2;
    }
    //TODO: Remove code here, after checking that it's in another place
    if (Maze.LEVEL == 7) {
        //Maze.barrierLocation = window.jQuery.extend(true, {}, Maze.barrierLocations[Maze.LEVEL]);
    }
    //TODO: Remove code here, after checking that it's in another place
    if (Maze.LEVEL == 8) {
        //Maze.barrierLocation = window.jQuery.extend(true, {}, Maze.barrierLocations[Maze.LEVEL]);
    }

    //Initialize the Maze.barrierLocation.
    Maze.barrierLocation = window.jQuery.extend(true, {}, Maze.barrierLocations[Maze.LEVEL]);

    //Initialize the workspace with default/last saved session of blocks.
    tVersionController.restoreBlocksFromVersionController();

    //TODO: Re factor this , change all messages to a form of ongoing messages like level 5.
    if (Maze.LEVEL < 6) {
        Blockly.addChangeListener(function() { //TODO : Perhaps listen to other events? perhaps keyUp listener
            Maze.levelHelp();
            //Maze.saveToStorageOneTime();//TODO: Remove code here.
        });
    } else if ((Maze.LEVEL >= 6) && (Maze.LEVEL <= 10)) { //High level don't display help for every change, only in Maze.init
        Maze.levelHelp();
    }

    //Attaching an onChange listener to produce automatic save of workspace.
    Blockly.addChangeListener(tVersionController.backUpWorkspaceBlocks);

    //Init slow motion button state.
    Maze.initSingleStepButtonState();

    //Init event logger text box
    Maze.initLogTextArea();

    //Init versionController
    //tVersionController.listenToTabSwitch();//TODO : Remove this call to method.

    //Code for changing the href in the tab elements of the maze.
    Maze.addOnClickToTabElements();
    //Init logger
    _logger.initLoggerForMaze();
    _logger.logMsg(1, "BP Maze - Current Level: " + Maze.LEVEL + " version: " + tVersion);
    // Lazy-load the syntax-highlighting.
    window.setTimeout(BlocklyApps.importPrettify, 1);
};

if (window.location.pathname.match(/readonly.html$/)) {
    window.addEventListener('load', BlocklyApps.initReadonly);
} else {
    window.addEventListener('load', Maze.init);
}

/**
 * When the workspace changes, update the help as needed.
 */
Maze.levelHelp = function() {
    if (Blockly.Block.dragMode_ != 0) {
        // Don't change helps during drags.
        return;
    }
    /*TODO: Remove this code once we are sure the mechanism for displaying 'please reset the maze' message is working properly.
    //User has finished but didn't click the reset button, don't display help
    else if(document.getElementById('runButton').style.display == 'none') {
        return;
    }
    */
    //TODO: Do we want to user to see help if she solved the maze?
    /*else if (Maze.result == Maze.ResultType.SUCCESS) {// The user has already won.  They are just playing around. don't display help.
           return;
       }*/
    var userBlocks = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
    var toolbar;
    if (Maze.LEVEL < 6) //No categories 
    {
        toolbar = Blockly.mainWorkspace.flyout_.workspace_.getTopBlocks(true);
    } else if (Maze.LEVEL >= 6) {
        toolbar = document.getElementsByClassName("blocklyTreeLabel"); //BP try to relocate help message
    }
    var content = null;
    var origin = null;
    var style = null;

    //BP Levels
    var flag = true;
    if (!Maze.checkIfLevelHelpMarked(Maze.LEVEL)) { //TODO: Refactor this code. Use design pattern
        if (Maze.LEVEL == 1) {
            tMsgDisplay.level_1(content, style, origin, toolbar); //TODO: Think of the vars here, are they needed?We want polymorphism
        } else if (Maze.LEVEL == 2) {
            tMsgDisplay.level_2(content, style, origin, toolbar);
        } else if (Maze.LEVEL == 3) {
            tMsgDisplay.level_3(content, style, origin, toolbar, userBlocks);
        } else if (Maze.LEVEL == 4) {
            //tMsgDisplay.explainAboutSlowMotion(content, style, origin, toolbar, userBlocks);//Explaining about the buttons first.
            tMsgDisplay.level_4(content, style, origin, toolbar, userBlocks);
            //tMsgDisplay.level_3(content, style, origin, toolbar,userBlocks);
        } else if (Maze.LEVEL == 5) {
            tMsgDisplay.level_5(content, style, origin, toolbar, userBlocks);
        } else if (Maze.LEVEL == 6) {
            tMsgDisplay.level_6(content, style, origin, toolbar, userBlocks);
        } else if (Maze.LEVEL == 7) {
            tMsgDisplay.level_7(content, style, origin, toolbar, userBlocks);
        } else if (Maze.LEVEL == 8) {
            tMsgDisplay.level_8(content, style, origin, toolbar, userBlocks);
        } else if (Maze.LEVEL == 9) {
            tMsgDisplay.level_10(content, style, origin); //TODO: Extract into the msgDisplay object.
        } else if (Maze.LEVEL == 10) {
            tMsgDisplay.level_10(content, style, origin); //TODO: Extract into the msgDisplay object.
        }
    } else { //This Maze.level has been seen
        tMsgDisplay.hideMsg(); //Hide previous message if it has been seen by the user already, started making changes to the workspace.
        if (Maze.LEVEL <= 2) { //We want to display help reset message. TODO: Re factor this code
            if (Maze.checkIfMazeExecutedWithoutSuccess()) {
                tMsgDisplay.showResetMsg(content, style, origin);
            }
        }
    }
};

/**
 * Reload with a different Pegman skin.
 * @param {number} newSkin ID of new skin.
 */
Maze.changePegman = function(newSkin) {
    Maze.saveToStorageOneTime();
    window.location = window.location.protocol + '//' +
        window.location.host + window.location.pathname +
        '?lang=' + BlocklyApps.LANG + '&level=' + Maze.LEVEL + '&skin=' + newSkin;
};

/**
 * Save the blocks for a one-time reload.
 */
Maze.saveToStorageOneTime = function(defaultWorkspace) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
};

/**
 * Load blocks from the local storage
 * TODO: Remove function, not needed.
 */
Maze.loadBlocks = function() {
    var url = window.location.href.split('#')[0];
    if ('localStorage' in window && window.localStorage[url]) {
        var xml = Blockly.Xml.textToDom(window.localStorage[url]);
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    }
};

/**
 * Display the Pegman skin-change menu.
 */
Maze.showPegmanMenu = function() {
    var menu = document.getElementById('pegmanMenu');
    if (menu.style.display == 'block') {
        return; // Menu is already open.
    }
    var button = document.getElementById('pegmanButton');
    Blockly.addClass_(button, 'buttonHover');
    menu.style.top = (button.offsetTop + button.offsetHeight) + 'px';
    menu.style.left = button.offsetLeft + 'px';
    menu.style.display = 'block';
    window.setTimeout(function() {
        Maze.pegmanMenuMouse_ = Blockly.bindEvent_(document.body, 'mousedown',
            null, Maze.hidePegmanMenu);
    }, 0);
};

/**
 * Hide the Pegman skin-change menu.
 */
Maze.hidePegmanMenu = function() {
    document.getElementById('pegmanMenu').style.display = 'none';
    Blockly.removeClass_(document.getElementById('pegmanButton'), 'buttonHover');
    if (Maze.pegmanMenuMouse_) {
        Blockly.unbindEvent_(Maze.pegmanMenuMouse_);
        delete Maze.pegmanMenuMouse_;
    }
};

/**
 * Reset the maze to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
Maze.reset = function(first) {
    // Kill all tasks.
    for (var x = 0; x < Maze.pidList.length; x++) {
        window.clearTimeout(Maze.pidList[x]);
    }
    Maze.pidList = [];

    // Move Pegman into position.
    Maze.pegmanX = Maze.start_.x;
    Maze.pegmanY = Maze.start_.y;

    if (first) {
        Maze.pegmanD = Maze.startDirection + 1;
        Maze.scheduleFinish(false);
        Maze.pidList.push(window.setTimeout(function() {
            Maze.stepSpeed = 100;
            Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4 - 4]);
            Maze.pegmanD++;
        }, Maze.stepSpeed * 5));
    } else {
        Maze.pegmanD = Maze.startDirection;
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4);
    }

    // Move the finish icon into position.
    var finishIcon = document.getElementById('finish');
    finishIcon.setAttribute('x', Maze.SQUARE_SIZE * (Maze.finish_.x + 0.5) -
        finishIcon.getAttribute('width') / 2);
    finishIcon.setAttribute('y', Maze.SQUARE_SIZE * (Maze.finish_.y + 0.6) -
        finishIcon.getAttribute('height'));

    // Make 'look' icon invisible and promote to top.
    var lookIcon = document.getElementById('look');
    lookIcon.style.display = 'none';
    lookIcon.parentNode.appendChild(lookIcon);
    var paths = lookIcon.getElementsByTagName('path');
    for (var i = 0, path; path = paths[i]; i++) {
        path.setAttribute('stroke', Maze.SKIN.look);
    }
};

/**
 * Click the run button.  Start the program.
 */
Maze.runButtonClick = function() {
    BlocklyApps.hideDialog(false);
    // Only allow a single b-thread block on level 1-5.
    if (Maze.LEVEL < 5 && Blockly.mainWorkspace.getTopBlocks().length > 1) { //BP - this is why no execution with 2 bthreads.
        tMsgDisplay.showOnlyOneGroupMsg();
        return;
    }
    var runButton = document.getElementById('runButton');
    var resetButton = document.getElementById('resetButton');
    // Ensure that Reset button is at least as wide as Run button.
    if (!resetButton.style.minWidth) {
        resetButton.style.minWidth = runButton.offsetWidth + 'px';
    }
    runButton.style.display = 'none';
    resetButton.style.display = 'inline';

    Blockly.mainWorkspace.traceOn(true);
    Maze.reset(false);
    Maze.execute();
};

/**
 * Updates the document's 'capacity' element with a message
 * indicating how many more blocks are permitted.  The capacity
 * is retrieved from Blockly.mainWorkspace.remainingCapacity().
 */
Maze.updateCapacity = function() {
    var cap = Blockly.mainWorkspace.remainingCapacity();
    var p = document.getElementById('capacity');
    if (cap == Infinity) {
        p.style.display = 'none';
    } else {
        p.style.display = 'inline';
        p.innerHTML = '';
        cap = Number(cap);
        var capSpan = document.createElement('span');
        capSpan.className = 'capacityNumber';
        capSpan.appendChild(document.createTextNode(cap));
        if (cap == 0) {
            var msg = BlocklyApps.getMsg('Maze_capacity0');
        } else if (cap == 1) {
            var msg = BlocklyApps.getMsg('Maze_capacity1');
        } else {
            var msg = BlocklyApps.getMsg('Maze_capacity2');
        }
        var parts = msg.split(/%\d/);
        for (var i = 0; i < parts.length; i++) {
            p.appendChild(document.createTextNode(parts[i]));
            if (i != parts.length - 1) {
                p.appendChild(capSpan.cloneNode(true));
            }
        }
    }
};

/**
 * This function clears the event text log area.
 */
Maze.resetEventTextLog = function() {
    var textLogDiv = document.getElementById("loggerTextArea");
    while (textLogDiv.firstChild) {
        textLogDiv.removeChild(textLogDiv.firstChild);
    }
    var startParagraph = document.createElement("p");
    startParagraph.innerHTML = "Events logs will appear here";
    startParagraph.style.margin = '7px';
    textLogDiv.appendChild(startParagraph);
};

/**
 * Click the reset button.  Reset the maze.
 */
Maze.resetButtonClick = function() {
    document.getElementById('runButton').style.display = 'inline';
    document.getElementById('resetButton').style.display = 'none';
    Blockly.mainWorkspace.traceOn(false);
    Maze.reset(false);
    //BP - reset state regarding bp vars
    Maze.resetBarrier();
    Maze.resetCurrentHighlightedBlockHighlight();
    Maze.hideAllSingleStepButtons();
    Maze.resetEventTextLog();
    _logger.reset();
    //BP - reset end
    Maze.displayHiddenElements();;
    Maze.levelHelp(); //BP - Be careful with this call to Maze.levelHelp.
};

/**
 * Adiel - Our workspace to Code function , and required functions
 */

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
function myFinish(code) {
    // Convert the definitions dictionary into a list.
    var definitions = [];
    for (var name in Blockly.JavaScript.definitions_) {
        definitions.push(Blockly.JavaScript.definitions_[name]);
    }
    return definitions.join('\n\n'); /* + '\n\n\n' + code;*/
};

Maze.workspaceToCode = function(name) {
    var code = [];
    var generator = Blockly.Generator.get(name);
    generator.init();
    var blocks = Blockly.mainWorkspace.getTopBlocks(true);

    for (var x = 0, block; block = blocks[x]; x++) {
        Blockly.JavaScript.bp_reset_breakupon(); //Reset breakupon counter.Very important!
        var line = generator.blockToCode(block);
        if (line instanceof Array) {
            // Value blocks return tuples of code and operator order.
            // Top-level blocks don't care about operator order.
            line = line[0];
        }
        if (line) {
            if (block.outputConnection && generator.scrubNakedValue) {
                // This block is a naked value.  Ask the language's code generator if
                // it wants to append a semicolon, or something.
                line = generator.scrubNakedValue(line);
            }
            if (line.indexOf("yield") !== -1) { //check if code segment could be a b-thread, otherwise ignore.
                code.push("bp.addBThread('', priority++, function() {"); // Priority based
                //code.push("bp.addBThread('', 100, function() {"); // Round Robin
                code.push("var blocked_events = [];");
                code.push("var breakupon_events = [];");
                code.push(myFinish(line));
                code.push(line);
                code.push("});");
            } else {
                console.log("Code doesn't contain yield cannot execute: " + line);
            }
        }
    }
    code = code.join('\n'); // Blank line between each section.
    //Added code - adiel - commented this part out var definitions are inline now
    //Problems could subside from here
    //code = generator.finish(code);

    // Final scrubbing of whitespace.
    code = code.replace(/^\s+\n/, '');
    code = code.replace(/\n\s+$/, '\n');
    code = code.replace(/[ \t]+\n/g, '\n');
    return code;
};

/**
 * Execute the user's code.  Heaven help us...
 */
Maze.execute = function() {
    BlocklyApps.log = [];
    BlocklyApps.ticks = 500; //This affect the time-out of infinity loop.
    //var code = Blockly.Generator.workspaceToCode('JavaScript');

    //Initialize the currentHighlightedBlock Hash.
    Maze.initCurrentHighlightedBlock();

    //How to use show Code
    //BlocklyApps.showCode(this);
    var code = Maze.workspaceToCode('JavaScript');
    Maze.result = Maze.ResultType.UNSET;

    // Try running the user's code.  There are four possible outcomes:
    // 1. If pegman reaches the finish [SUCCESS], true is thrown.
    // 2. If the program is terminated due to running too long [TIMEOUT],
    //    false is thrown.
    // 3. If another error occurs [ERROR], that error is thrown.
    // 4. If the program ended normally but without solving the maze [FAILURE],
    //    no error or exception is thrown.
    try {

        var extraCode = "\
bp.addBThread('forward actuator', priority++, function() {  while (true) {\
    yield({request:[], wait:[('move forward')], block:[]});\
    Maze.moveForward('1');\
  }\
});\
bp.addBThread('right actuator', priority++, function() {  while (true) {\
    yield({request:[], wait:[('turn right')], block:[]});Maze.turnRight('1');\
  }\
});\
bp.addBThread('left actuator', priority++, function() {  while (true) {\
    yield({request:[], wait:[('turn left')], block:[]});Maze.turnLeft('1');\
  }\
});\
bp.addBThread('wall sensor pathForward', priority++, function() {  \
    while (true) {\
        if (Maze.isPathForward()) {\
            yield({request:['path ahead'], wait:[], block:[]});\
        }\
        yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
    }\
});\
bp.addBThread('wall sensor pathRight', priority++, function() {\
    while (true) {\
        if (Maze.isPathRight()) {\
            yield({request:['path right'], wait:[], block:[]});\
        }\
        yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
    }\
});\
bp.addBThread('wall sensor pathLeft', priority++, function() {  \
    while (true) {\
        if (Maze.isPathLeft()) {\
            yield({request:['path left'], wait:[], block:[]});\
        }\
        yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
    }\
});\
function barrierFlicker() {\
  var c = 0;\
  while(true){\
    yield({wait: ['move forward','tick']});\
    c++;\
    if(((c % 3) == 0 && (c < 4)) || \
        ((c % 3) == 0 && (c > 14))) {\
            Maze.removeBarrier();\
        }\
    if(((c % 3) == 1) && (Maze.pegmanX != 3 || Maze.pegmanY != 3)) {\
        Maze.addBarrier();\
    }\
  }\
};\
function waitForPegmanCircle(){\
    yield({request:[], wait:['barrier ahead'], block:[]});\
    yield({request:[], wait:['turn left'], block:[]});\
    yield({request:[], wait:['turn left'], block:[]});\
    yield({request:[], wait:['turn left'], block:[]});\
    yield({request:[], wait:['turn left'], block:[]});\
    yield({request:[], wait:['barrier ahead'], block:[]});\
    console.log('Going to removeBarrier inside  waitForPegmanCircle b-thread');\
    Maze.removeBarrier();\
}\
if((Maze.LEVEL == 7) || (Maze.LEVEL == 8)){\
    bp.addBThread('barrier ahead sensor', priority++, function() {\
        while (true) {\
            if (Maze.isBarrierAhead()) {\
                yield({request:['barrier ahead'], wait:[], block:[]});\
            }\
            else {\
                yield({request:['no barrier ahead'], wait:[], block:[]});\
            }\
            yield({request:[], wait:[function(x){return true;}], block:[]});\
        }\
    });\
    if(Maze.LEVEL == 7){\
        bp.addBThread('barrier Flicker', priority++, barrierFlicker);\
    }\
    else if(Maze.LEVEL == 8){\
        bp.addBThread('Wait for Pegman dance', priority++, waitForPegmanCircle);\
    }\
}\
if(Maze.LEVEL == 9) {\
    bp.addBThread('wall sensor NoPathForward', priority++, function() {  \
        while (true) {\
            if (!Maze.isPathForward()) {\
                yield({request:['no path ahead'], wait:[], block:[]});\
            }\
            yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
        }\
    });\
    bp.addBThread('wall sensor noPathLeft', priority++, function() {  \
        while (true) {\
            if (!Maze.isPathLeft()) {\
                yield({request:['no path left'], wait:[], block:[]});\
            }\
            yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
        }\
    });\
    bp.addBThread('wall sensor noPathRight', priority++, function() {  \
        while (true) {\
            if (!Maze.isPathRight()) {\
                yield({request:['no path right'], wait:[], block:[]});\
            }\
            yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
        }\
    });\
}\
function logger() {\
  while(true){\
    yield({request:['tick'] , wait: [function(x){return true;}]});\
    BlocklyApps.checkTimeout();\
    BlocklyApps.log.push(['stop' , bp.lastEvent]);\
  }\
}\
bp.addBThread('logger', 1000, logger);\
bp.addBThread('', priority++, function(){\
    var blocked_events = [];\
    var breakupon_events = [];\
    while (true) {\
        level_1: {\
            breakupon_events.push(('move forward'));\
            blocked_events.push([]);\
            yield ({\
                request: [],\
                wait: breakupon_events.concat(('turn right')),\
                block: [].concat.apply([], blocked_events)\
            });\
            if (findEvent(breakupon_events[0], bp.lastEvent) && ([].indexOf(bp.lastEvent) == -1) && (('turn right').indexOf(bp.lastEvent) == -1)) {\
                break level_1;\
            }\
            yield ({\
                request: [],\
                wait: breakupon_events.concat(('path left')),\
                block: [].concat.apply([], blocked_events)\
            });\
            if (findEvent(breakupon_events[0], bp.lastEvent) && ([].indexOf(bp.lastEvent) == -1) && (('path left').indexOf(bp.lastEvent) == -1)) {\
                break level_1;\
            }\
            yield ({\
                request: [],\
                wait: breakupon_events.concat(([('no path ahead'), ('path ahead')])),\
                block: [].concat.apply([], blocked_events)\
            });\
            if (findEvent(breakupon_events[0], bp.lastEvent) && ([].indexOf(bp.lastEvent) == -1) && (('no path ahead').indexOf(bp.lastEvent) == -1)) {\
                break level_1;\
            }\
            yield ({\
                request: [],\
                wait: breakupon_events.concat(('path right')),\
                block: [].concat.apply([], blocked_events)\
            });\
            if (findEvent(breakupon_events[0], bp.lastEvent) && ([].indexOf(bp.lastEvent) == -1) && (('path right').indexOf(bp.lastEvent) == -1)) {\
                break level_1;\
            }\
            yield ({\
                request: [],\
                wait: breakupon_events.concat(('turn left')),\
                block: [].concat.apply([], blocked_events)\
            });\
            if (findEvent(breakupon_events[0], bp.lastEvent) && ([].indexOf(bp.lastEvent) == -1) && (('turn left').indexOf(bp.lastEvent) == -1)) {\
                break level_1;\
            }\
            Maze.counterOfRightTurns = Maze.counterOfRightTurns + 1;\
        }\
        breakupon_events = breakupon_events.slice(0, 0);\
        blocked_events = blocked_events.slice(0, 0);\
    }\
});\
"

        /* - BThreads' code. not needed now TODO: Extract to module or something.
        //Add logger code
        bp.addBThread('logger', 1000, logger);\

        //noPathAhead Sensor code
        bp.addBThread('wall sensor NoPathForward', priority++, function() {  \
            while (true) {\
                if (!Maze.isPathForward()) {\
                    yield({request:['no path ahead'], wait:[], block:[]});\
                }\
                yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
            }\
        });\
        //Wall sensor noPathLeft
        bp.addBThread('wall sensor noPathLeft', priority++, function() {  \
            while (true) {\
                if (!Maze.isPathLeft()) {\
                    yield({request:['no path left'], wait:[], block:[]});\
                }\
                yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
            }\
        });\

        //wall sensor noPathRight
        bp.addBThread('wall sensor noPathRight', priority++, function() {  \
            while (true) {\
                if (!Maze.isPathRight()) {\
                    yield({request:['no path right'], wait:[], block:[]});\
                }\
                yield({request:[], wait:['turn left','turn right','move forward','backward'], block:[]});\
            }\
        });\

        bp.addBThread('barrier ahead actuator', priority++, function() {  \
            while (true) {\
                yield({request:[], wait:['barrier ahead'], block:[]});\
            }\
        });\
        bp.addBThread('remove barrier actuator', priority++, function() {\
            while (true) {\
                yield({request:[], wait:['removeBarrierAhead'], block:[]});\
                Maze.removeBarrier();\
            }\
        });\
        bp.addBThread('add barrier actuator', priority++, function() {\
            while (true) {\
                yield({request:[], wait:['addBarrierAhead'], block:[]});\
                Maze.addBarrier();\
            }\
        });\
        function logger() {\
          while(true){\
            yield({request:['tick'] , wait: [function(x){return true;}]});\
            console.log('event log:'+ bp.lastEvent);\
            BlocklyApps.checkTimeout();\
          }\
        }\

        /Find event in the array function/
        function findEvent(array,event){\
                var tAnswer = 0;\
                if(typeof array == 'string')\
                {\
                  if(array.indexOf(event) != -1)\
                  {\
                      tAnswer = 1;\
                  }\
                }\
                else if(array instanceof Array)\
                {\
                    for(var i=0; i < array.length ;i++)\
                    {\
                        if(array[i].indexOf(event) != -1)\
                        {\
                            tAnswer = 1;\
                        }\
                    }\
                }\
                return tAnswer;\
        }\
        */

        //BP -stopped logger here   Add this line if we want it after yield- console.log('event log:'+bp.lastEvent);\  

        //eval(code);
        //Backing up log to remote storage, consult with Gera.
        //_logger.sendLogTextToRemoteStorage();
        Maze.counterOfRightTurns = 0;
        eval('var priority=1; var bp = new BProgram();\n' + extraCode + code + ";bp.event('start');");
        Maze.result = Maze.ResultType.FAILURE;
    } catch (e) {
        // A boolean is thrown for normal termination.
        // Abnormal termination is a user error.
        if (e === Infinity) {
            Maze.result = Maze.ResultType.TIMEOUT;
        } else if (e === true) {
            Maze.result = Maze.ResultType.SUCCESS;
        } else if (e === false) {
            Maze.result = Maze.ResultType.ERROR;
        } else {
            // Syntax error, can't happen.
            Maze.result = Maze.ResultType.ERROR;
            window.alert(e);
        }
    }
    // Fast animation if execution is successful.  Slow otherwise.//BP - changed to 125 if not successfully
    //BP - If we want a faster execution upon success, reduce the length of a step.
    Maze.stepSpeed = (Maze.result == Maze.ResultType.SUCCESS) ? 50 : 65;
    Maze.stepSpeedOriginalValue = Maze.stepSpeed; //Backing up for use in fast forward button.
    // BlocklyApps.log now contains a transcript of all the user's actions.
    // Reset the maze and animate the transcript.

    //Note - A call to animate the recorded path
    Maze.reset(false);
    Maze.pidList.push(window.setTimeout(Maze.animate, 100));
    //Maze.pidList.push(window.setTimeout(Maze.levelHelp, 300));

    //Init slow motion object
    Maze.initSingleStepButtonState();
    //Show slow motion button and continue button, only if we are in level 2 and up.
    if (Maze.LEVEL > 3) {
        //Maze.showSingleStepButton();
        Maze.showFastForwardButton();
        Maze.showPauseButton();
    }
    //Maze.showContinueButton();
};

// End of BP code
//-------------------------------------------------------------------------------

var flag = false; //TODO: Rename this flag.

/**
 * Iterate through the recorded path and animate pegman's actions.
 */
Maze.animate = function() {
    // All tasks should be complete now.  Clean up the PID list.
    Maze.pidList = [];

    var action = BlocklyApps.log.shift();
    if (!action) {
        Maze.levelHelp(); //BP - This call will re call Maze.levelHelp() after a failed execution. Do we want this?
        return;
    }

    switch (action[0]) {
        case 'highlight':
            Maze.highlightBlockBP(action[1]);
            flag = true;
            break;
        case 'stop':
            _logger.logEvent(action[1]);
            //Stopping animation if necessary - TODO: Understand this code
            if (flag && Maze.slowMotionState['singleStepClicked'] == 1) {
                flag = false;
                return;
            }
            break;
        case 'north':
            Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.pegmanX, Maze.pegmanY - 1, Maze.pegmanD * 4]);
            Maze.pegmanY--;
            break;
        case 'east':
            Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.pegmanX + 1, Maze.pegmanY, Maze.pegmanD * 4]);
            Maze.pegmanX++;
            break;
        case 'south':
            Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.pegmanX, Maze.pegmanY + 1, Maze.pegmanD * 4]);
            Maze.pegmanY++;
            break;
        case 'west':
            Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.pegmanX - 1, Maze.pegmanY, Maze.pegmanD * 4]);
            Maze.pegmanX--;
            break;
        case 'look_north':
            Maze.scheduleLook(Maze.DirectionType.NORTH); //Why scheduleLook is not seen?
            break;
        case 'look_east':
            Maze.scheduleLook(Maze.DirectionType.EAST);
            break;
        case 'look_south':
            Maze.scheduleLook(Maze.DirectionType.SOUTH);
            break;
        case 'look_west':
            Maze.scheduleLook(Maze.DirectionType.WEST);
            break;
        case 'left':
            Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4 - 4]);
            Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD - 1);
            break;
        case 'right':
            Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4 + 4]);
            Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD + 1);
            break;
        case 'show_barrier':
            //TODO: Think if we should remove barrier here or in function remove Barrier.
            Maze.barrierLocation = window.jQuery.extend(true, {}, Maze.barrierLocations[Maze.LEVEL]);
            document.getElementById('circleBarrier').setAttribute("style", "visibility:visible;");
            break;
        case 'hide_barrier':
            //TODO: Think if we should remove barrier here or in function remove Barrier.
            Maze.barrierLocation[0] = 0; //0 - marks off the grid
            Maze.barrierLocation[1] = 0; //0 - marks off the grid
            document.getElementById('circleBarrier').setAttribute("style", "visibility:hidden;");
            break;
        case 'barrierAheadOfPegman':
            Maze.scheduleBarrierAheadOfPegman();
            break;
        case 'fail_forward':
            Maze.scheduleFail(true);
            break;
        case 'fail_backward':
            Maze.scheduleFail(false);
            break;
        case 'finish':
            Maze.resetCurrentHighlightedBlockHighlight(); //Turn off highlighted blocks.
            Maze.scheduleFinish(true);
            //window.setTimeout(Maze.congratulations, 1000);
            //window.setTimeout(Maze.endLevelExplanation, 1000);
            window.setTimeout(tMsgDisplay.endLevelExplanation, 1000);
    }

    if (action[0] == 'stop') {
        Maze.pidList.push(window.setTimeout(Maze.animate, Maze.stepSpeed * 0));
    } else if (action[0] == 'highlight') {
        Maze.pidList.push(window.setTimeout(Maze.animate, Maze.stepSpeed * 2));
    } else {
        Maze.pidList.push(window.setTimeout(Maze.animate, Maze.stepSpeed * 5));
    }
};

/**
 * Init Maze.currentHighlightedBlock DS.
 * This is hash: [b-thread top block id] = [current executed block id]
 */

Maze.initCurrentHighlightedBlock = function() {

    //Unselect currently selected blocks./test this.
    if (Blockly.selected) {
        Blockly.selected.unselect();
    }
    //Initialize the currentHighlightedBlock Hash.
    //Key is the root block of each group.
    Maze.currentHighlightedBlock = new Object();
    var numberOfBlockGroups = Blockly.mainWorkspace.getTopBlocks().length;
    for (var i = 0; i < numberOfBlockGroups; i++) { //Root block is key for learning which block is displayed
        Maze.currentHighlightedBlock[Blockly.mainWorkspace.getTopBlocks()[i].id + '_current'] = null; //Take caution with copying arrays in JavaScript.TODO:test
        Maze.currentHighlightedBlock[Blockly.mainWorkspace.getTopBlocks()[i].id + '_next'] = null; //Take caution with copying arrays in JavaScript.TODO:test
        Maze.currentHighlightedBlock[Blockly.mainWorkspace.getTopBlocks()[i].id + '_highlightCounter'] = 0;
    }
    //Storing the number of groups in our Hash.
    if (Maze.currentHighlightedBlock['numberOfBlockGroups'] == null) {
        var tCount = 0;
        var id = null;
        for (var i = 0; i < Blockly.mainWorkspace.getTopBlocks().length; i++) { //Root block is key for learning which block is displayed
            id = Blockly.mainWorkspace.getTopBlocks()[i].id;
            if (!Blockly.mainWorkspace.getBlockById(id).disabled) {
                tCount = tCount + 1;
            }
        }
        Maze.currentHighlightedBlock['numberOfBlockGroups'] = tCount;
    }
};

Maze.checkHighlightCounter = function() {
    var tCounter = 0;
    var tAnswer = false;
    for (var i = 0; i < Blockly.mainWorkspace.getTopBlocks().length; i++) { //Root block is key for learning which block is displayed
        tCounter = tCounter + Maze.currentHighlightedBlock[Blockly.mainWorkspace.getTopBlocks()[i].id + '_highlightCounter'];
    }
    if ((tCounter % Maze.currentHighlightedBlock['numberOfBlockGroups']) == 0) {
        tAnswer = true;
    }
    return tAnswer;
};

/**
This function highlights the current active block in each b-thread.
*/
Maze.highlightBlockBP = function(id) {
    //Extract the id code from the block_id_ID string
    if (id) {
        var m = id.match(/^block_id_(\d+)$/);
        if (m) {
            id = m[1];
        }
    }
    //if id is defined
    if (id) {
        var block = Blockly.mainWorkspace.getBlockById(id);
        var parentBlockID = block.getRootBlock().id;
        Maze.currentHighlightedBlock[parentBlockID + '_next'] = block.id;
        //TODO: Debug this line. is this how this should work?
        if (Maze.currentHighlightedBlock[parentBlockID + '_highlightCounter'] == 0) {
            Maze.currentHighlightedBlock[parentBlockID + '_highlightCounter'] = 1;
        }
        if (Maze.checkHighlightCounter()) {
            for (var i = 0; i < Blockly.mainWorkspace.getTopBlocks().length; i++) { //Root block is key for learning which block is displayed
                var tParentBlockID = Blockly.mainWorkspace.getTopBlocks()[i].id;
                if (Maze.currentHighlightedBlock[tParentBlockID + '_next'] != null) {
                    if (Maze.currentHighlightedBlock[tParentBlockID + '_current'] != null) {
                        Blockly.mainWorkspace.getBlockById(Maze.currentHighlightedBlock[tParentBlockID + '_current']).svg_.removeSelect();
                    }
                    Maze.currentHighlightedBlock[tParentBlockID + '_current'] = Maze.currentHighlightedBlock[tParentBlockID + '_next'];
                    Maze.currentHighlightedBlock[tParentBlockID + '_next'] = null;
                    //Maze.currentHighlightedBlock[tParentBlockID + '_highlightCounter'] = 0;
                    //Highlight.
                    Blockly.mainWorkspace.getBlockById(Maze.currentHighlightedBlock[tParentBlockID + '_current']).svg_.addSelect();
                }
            }
        }
    }
};

/**
 * This function resets the Maze.currentHighlightedBlock data structure and removes current highlighted blocks
 */
Maze.resetCurrentHighlightedBlockHighlight = function() {

        for (var i = 0; i < Blockly.mainWorkspace.getTopBlocks().length; i++) { //Root block is key for learning which block is displayed
            var tParentBlockID = Blockly.mainWorkspace.getTopBlocks()[i].id;
            if (Maze.currentHighlightedBlock != null) {
                if (Maze.currentHighlightedBlock[tParentBlockID + '_current'] != null) {
                    Blockly.mainWorkspace.getBlockById(Maze.currentHighlightedBlock[tParentBlockID + '_current']).svg_.removeSelect();
                }
            }
        }

        //dereferencing the currentHighlightedBlock object, hopefully will be deallocated.
        Maze.currentHighlightedBlock = null;

    }
    /**
     * Congratulates the user for completing the level and offers to
     * direct them to the next level, if available.
     */

//TODO: Extract method to message display and think about dual version idea.
Maze.endLevelExplanation = function() {

    tMsgDisplay.endLevelExplanation();

};

/**
 * Commented out for now.
 * Congratulates the user for completing the level and offers to
 * direct them to the next level, if available.
 */
Maze.congratulations = function() {
    var content = document.getElementById('dialogDone');
    var buttonDiv = document.getElementById('dialogDoneButtons');
    buttonDiv.textContent = '';
    var style = {
        width: '40%',
        height: '60%', //A hard-coded bug override, let because after we displayed BP help with timeout and buttons , height was different.
        left: '30%',
        top: '5em'
    };
    if (Maze.LEVEL < Maze.MAX_LEVEL) {
        var text = BlocklyApps.getMsg('Maze_nextLevel')
            .replace('%1', Maze.LEVEL + 1);
        var cancel = document.createElement('button');
        cancel.appendChild(
            document.createTextNode(BlocklyApps.getMsg('dialogCancel')));
        cancel.addEventListener('click', BlocklyApps.hideDialog, true);
        cancel.addEventListener('touchend', BlocklyApps.hideDialog, true);
        buttonDiv.appendChild(cancel);

        var ok = document.createElement('button');
        ok.className = 'secondary';
        ok.appendChild(document.createTextNode(BlocklyApps.getMsg('dialogOk')));
        ok.addEventListener('click', Maze.nextLevel, true);
        ok.addEventListener('touchend', Maze.nextLevel, true);
        buttonDiv.appendChild(ok);

        BlocklyApps.showDialog(content, null, false, true, style,
            function() {
                document.body.removeEventListener('keydown',
                    BlocklyApps.congratulationsKeyDown_, true);
            });
        document.body.addEventListener('keydown',
            BlocklyApps.congratulationsKeyDown_, true);

    } else {
        var text = BlocklyApps.getMsg('Maze_finalLevel');
        var ok = document.createElement('button');
        ok.className = 'secondary';
        ok.addEventListener('click', BlocklyApps.hideDialog, true);
        ok.addEventListener('touchend', BlocklyApps.hideDialog, true);
        ok.appendChild(document.createTextNode(BlocklyApps.getMsg('dialogOk')));
        buttonDiv.appendChild(ok);
        BlocklyApps.showDialog(content, null, false, true, style,
            BlocklyApps.stopDialogKeyDown);
        BlocklyApps.startDialogKeyDown();
    }
    document.getElementById('dialogDoneText').textContent = text;

    var pegSpin = document.getElementById('pegSpin');
    pegSpin.style.backgroundImage = 'url(' + Maze.SKIN.sprite + ')';
};

/**
 * If the user preses enter, escape, or space, hide the dialog.
 * Enter and space move to the next level, escape does not.
 * @param {!Event} e Keyboard event.
 * @private
 */
BlocklyApps.congratulationsKeyDown_ = function(e) {
    if (e.keyCode == 13 ||
        e.keyCode == 27 ||
        e.keyCode == 32) {
        BlocklyApps.hideDialog(true);
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode != 27) {
            Maze.nextLevel();
        }
    }
};

/**
 * Go to the next level.
 */
Maze.nextLevel = function() {

    //Dump log text to localStorage
    _logger.backUpLogToStorage();
    
    //Send log text to Remote storage
    //_logger.sendLogTextToRemoteStorage();

    //Dump documentation of workspace to the localStorage
    //tVersionController.dumpDataToLocalStorage();TODO: Remove method call here.
    if (tVersion != null) { //We are in version 1 or 2
        var tLocation = window.location.protocol + '//' +
            window.location.host + window.location.pathname +
            '?lang=' + BlocklyApps.LANG + '&level=' + (Maze.LEVEL + 1) +
            '&skin=' + Maze.SKIN_ID + '&ver=' + tVersion;
        //Concatenating the key of the remote storage to the location address/
        tLocation = tLocation + _logger.getRemoteStorageKeyHashString();
        window.location = tLocation;
        //TODO: Add support for hash key value to be passed along.
    } else { //Version variable is not defined
        window.location = window.location.protocol + '//' +
            window.location.host + window.location.pathname +
            '?lang=' + BlocklyApps.LANG + '&level=' + (Maze.LEVEL + 1) +
            '&skin=' + Maze.SKIN_ID;
    }
};

/**
 * Point the congratulations Pegman to face the mouse.
 * @param {Event} e Mouse move event.
 * @private
 */
Maze.updatePegSpin_ = function(e) {
    if (document.getElementById('dialogDoneBP').className ==
        'dialogHiddenContent') {
        return;
    }
    var pegSpin = document.getElementById('pegSpinBP');
    var bBox = BlocklyApps.getBBox_(pegSpin);
    var x = bBox.x + bBox.width / 2 - window.scrollX;
    var y = bBox.y + bBox.height / 2 - window.scrollY;
    var dx = e.clientX - x;
    var dy = e.clientY - y;
    var angle = Math.atan(dy / dx);
    // Convert from radians to degrees because I suck at math.
    angle = angle / Math.PI * 180;
    // 0: North, 90: East, 180: South, 270: West.
    if (dx > 0) {
        angle += 90;
    } else {
        angle += 270;
    }
    // Divide into 16 quads.
    var quad = Math.round(angle / 360 * 16);
    if (quad == 16) {
        quad = 15;
    }
    // Display correct Pegman sprite.
    pegSpin.style.backgroundPosition = (-quad * Maze.PEGMAN_WIDTH) + 'px 0px';
};

/**
 * Schedule the animations for a move or turn.
 * @param {!Array.<number>} startPos X, Y and direction starting points.
 * @param {!Array.<number>} endPos X, Y and direction ending points.
 */
Maze.schedule = function(startPos, endPos) {
    var deltas = [(endPos[0] - startPos[0]) / 4, (endPos[1] - startPos[1]) / 4, (endPos[2] - startPos[2]) / 4];
    Maze.displayPegman(startPos[0] + deltas[0],
        startPos[1] + deltas[1],
        Maze.constrainDirection16(startPos[2] + deltas[2]));
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(startPos[0] + deltas[0] * 2,
            startPos[1] + deltas[1] * 2,
            Maze.constrainDirection16(startPos[2] + deltas[2] * 2));
    }, Maze.stepSpeed));
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(startPos[0] + deltas[0] * 3,
            startPos[1] + deltas[1] * 3,
            Maze.constrainDirection16(startPos[2] + deltas[2] * 3));
    }, Maze.stepSpeed * 2));
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(endPos[0], endPos[1],
            Maze.constrainDirection16(endPos[2]));
    }, Maze.stepSpeed * 3));
};

/**
 * Schedule the animations and sounds for a failed move.
 * @param {boolean} forward True if forward, false if backward.
 */
Maze.scheduleFail = function(forward) {
    var deltaX = 0;
    var deltaY = 0;
    switch (Maze.pegmanD) {
        case Maze.DirectionType.NORTH:
            deltaY = -0.25;
            break;
        case Maze.DirectionType.EAST:
            deltaX = 0.25;
            break;
        case Maze.DirectionType.SOUTH:
            deltaY = 0.25;
            break;
        case Maze.DirectionType.WEST:
            deltaX = -0.25;
            break;
    }
    if (!forward) {
        deltaX = -deltaX;
        deltaY = -deltaY;
    }
    var direction16 = Maze.constrainDirection16(Maze.pegmanD * 4);
    Maze.displayPegman(Maze.pegmanX + deltaX,
        Maze.pegmanY + deltaY,
        direction16);
    Blockly.playAudio('whack', .5);
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX,
            Maze.pegmanY,
            direction16);
    }, Maze.stepSpeed));
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX + deltaX,
            Maze.pegmanY + deltaY,
            direction16);
        Blockly.playAudio('whack', .5);
    }, Maze.stepSpeed * 2));
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
    }, Maze.stepSpeed * 3));
};

/**
 * Schedule the animations and sound for a victory dance.
 * @param {boolean} sound Play the victory sound.
 */
Maze.scheduleFinish = function(sound) {
    var direction16 = Maze.constrainDirection16(Maze.pegmanD * 4);
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
    if (sound) {
        Blockly.playAudio('win', .5);
    }
    Maze.stepSpeed = 150; // Slow down victory animation a bit.
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 18);
    }, Maze.stepSpeed));
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
    }, Maze.stepSpeed * 2));
    Maze.pidList.push(window.setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
    }, Maze.stepSpeed * 3));
};


//TODO: Extract to msgDisplay object
Maze.pegmanTranspassBarrier = function() {

    var toolbar;
    if (Maze.LEVEL < 6) //No categories 
    {
        toolbar = Blockly.mainWorkspace.flyout_.workspace_.getTopBlocks(true);
    } else if (Maze.LEVEL >= 6) {
        toolbar = document.getElementsByClassName("blocklyTreeLabel"); //BP try to relocate help message
    }
    var content = null;
    var origin = null;
    var style = null;
    content = document.getElementById('dialogPegmanTranspassBarrier_Level_' + Maze.LEVEL + '_BP_ver1'); //dialogPegmanTranspassBarrier_Level_7_BP_ver1
    style = {
        width: '430px',
        top: '300px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '110px';
    //origin = toolbar[0].getSvgRoot();
    origin = toolbar[0];
    var button = document.getElementById('dialogPegmanTranspassBarrier_Level_' + Maze.LEVEL + '_button_BP_ver1'); //dialogPegmanTranspassBarrier_Level_7_button_BP_ver1
    if (button.addEventListener) {
        button.addEventListener("click",
            function() {
                BlocklyApps.hideDialog(false);
            }, false);
    }
    if (content) {
        if (content.parentNode != document.getElementById('dialog')) {
            BlocklyApps.showDialog(content, origin, true, false, style, null);
        }
    } else {
        BlocklyApps.hideDialog(false);
    }
}

/**
 * Schedule the animations and sounds for a failed move.
 * @param {boolean} forward True if forward, false if backward.
 */
Maze.scheduleBarrierAheadOfPegman = function() {
    // Move Pegman into start position.
    //Maze.pegmanX = Maze.start_.x;
    //Maze.pegmanY = Maze.start_.y;
    //Maze.pegmanD = Maze.startDirection;
    //Maze.pegmanX = Maze.barrierLocation[0];
    //Maze.pegmanY = Maze.barrierLocation[1];
    //Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4);
    Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.barrierLocation[0], Maze.barrierLocation[1], Maze.pegmanD * 4]);

    window.setTimeout(function() {
        document.getElementById('pegman').setAttribute("style", "visibility:hidden;");
        Maze.pegmanTranspassBarrier();
    }, 500);
    //throw false;
};

/**
 * Display Pegman at the specified location, facing the specified direction.
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 */
Maze.displayPegman = function(x, y, d) {
    var pegmanIcon = document.getElementById('pegman');
    pegmanIcon.setAttribute('x',
        x * Maze.SQUARE_SIZE - d * Maze.PEGMAN_WIDTH + 1);
    pegmanIcon.setAttribute('y',
        Maze.SQUARE_SIZE * (y + 0.5) - Maze.PEGMAN_HEIGHT / 2 - 8);

    var clipRect = document.getElementById('clipRect');
    clipRect.setAttribute('x', x * Maze.SQUARE_SIZE + 1);
    clipRect.setAttribute('y', pegmanIcon.getAttribute('y'));

    if ((Maze.LEVEL == 7) || (Maze.LEVEL == 8)) //TODO: Re factor this code, smelly code
    {
        Maze.displayHiddenElements();
    }

};

Maze.displayHiddenElements = function() {
        if ((Maze.LEVEL == 7) || (Maze.LEVEL == 8)) //TODO: Re factor this code, smelly code
        {
            if ((Maze.barrierLocation[0] != 0) && (Maze.barrierLocation[1] != 0)) { //If barrier is not removed(Logically) display it in the location designated for it by the Maze.barrierLocation
                var svgBarrier = document.getElementById('circleBarrier');
                //svgBarrier.setAttribute('x', (Maze.barrierLocation[0] + 0.5) * Maze.SQUARE_SIZE); //TODO: Think about how this change could affect remove/add barrier.
                //svgBarrier.setAttribute('y', (Maze.barrierLocation[1] + 0.5) * Maze.SQUARE_SIZE);
                svgBarrier.setAttribute('x', (Maze.barrierLocation[0] - 0.5) * Maze.SQUARE_SIZE); //TODO: Think about how this change could affect remove/add barrier.
                svgBarrier.setAttribute('y', (Maze.barrierLocation[1]) * Maze.SQUARE_SIZE);
                svgBarrier.setAttribute("style", "visibility:visible;");
            }
            //Display the pegman in case it went down the rabbit barrier.
            document.getElementById('pegman').setAttribute("style", "visibility:visible;");
        }
    }
    /**
     * Reset barrier to it's default location.
     */
Maze.resetBarrier = function() {
    Maze.barrierLocation = window.jQuery.extend(true, {}, Maze.barrierLocations[Maze.LEVEL]);
}

/**
 * Display the look icon at Pegman's current location,
 * in the specified direction.
 * @param {!Maze.DirectionType} d Direction (0 - 3).
 */
Maze.scheduleLook = function(d) {
    var x = Maze.pegmanX;
    var y = Maze.pegmanY;
    switch (d) {
        case Maze.DirectionType.NORTH:
            x += 0.5;
            break;
        case Maze.DirectionType.EAST:
            x += 1;
            y += 0.5;
            break;
        case Maze.DirectionType.SOUTH:
            x += 0.5;
            y += 1;
            break;
        case Maze.DirectionType.WEST:
            y += 0.5;
            break;
    }
    x *= Maze.SQUARE_SIZE;
    y *= Maze.SQUARE_SIZE;
    d = d * 90 - 45;

    var lookIcon = document.getElementById('look');
    lookIcon.setAttribute('transform',
        'translate(' + x + ', ' + y + ') ' +
        'rotate(' + d + ' 0 0) scale(.4)');
    var paths = lookIcon.getElementsByTagName('path');
    lookIcon.style.display = 'inline';
    for (var x = 0, path; path = paths[x]; x++) {
        Maze.scheduleLookStep(path, Maze.stepSpeed * x);
    }
};

/**
 * Schedule one of the 'look' icon's waves to appear, then disappear.
 * @param {!Element} path Element to make appear.
 * @param {number} delay Milliseconds to wait before making wave appear.
 */
Maze.scheduleLookStep = function(path, delay) {
    Maze.pidList.push(window.setTimeout(function() {
        path.style.display = 'inline';
        window.setTimeout(function() {
            path.style.display = 'none';
        }, Maze.stepSpeed * 2);
    }, delay));
};

/**
 * Keep the direction within 0-3, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Maze.constrainDirection4 = function(d) {
    if (d < 0) {
        d += 4;
    } else if (d > 3) {
        d -= 4;
    }
    return d;
};

/**
 * Keep the direction within 0-15, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Maze.constrainDirection16 = function(d) {
    if (d < 0) {
        d += 16;
    } else if (d > 15) {
        d -= 16;
    }
    return d;
};

// API
// Human-readable aliases.

Maze.moveForward = function(id) {
    Maze.move(0, id);
};

Maze.moveBackward = function(id) {
    Maze.move(2, id);
};

Maze.turnLeft = function(id) {
    Maze.turn(0, id);
};

Maze.turnRight = function(id) {
    Maze.turn(1, id);
};

Maze.isPathForward = function(id) {
    return Maze.isPath(0, id);
};

Maze.isPathRight = function(id) {
    return Maze.isPath(1, id);
};

Maze.isPathBackward = function(id) {
    return Maze.isPath(2, id);
};

Maze.isPathLeft = function(id) {
    return Maze.isPath(3, id);
};

// Core functions.

/**
 * Attempt to move pegman forward or backward.
 * @param {number} direction Direction to move (0 = forward, 2 = backward).
 * @param {string} id ID of block that triggered this action.
 * @throws {true} If the end of the maze is reached.
 * @throws {false} If Pegman collides with a wall.
 */
Maze.move = function(direction, id) {
    if (!Maze.isPath(direction, null)) {
        BlocklyApps.log.push(['fail_' + (direction ? 'backward' : 'forward'), id]);
        //throw false; // Put this back if you want the run to stop of a failed move.
    } else if (Maze.isBarrierAhead(id)) {
        BlocklyApps.log.push(['barrierAheadOfPegman', id]);
        throw false;
    } else {
        // If moving backward, flip the effective direction.
        var effectiveDirection = Maze.pegmanD + direction;
        var command;
        switch (Maze.constrainDirection4(effectiveDirection)) {
            case Maze.DirectionType.NORTH:
                Maze.pegmanY--;
                command = 'north';
                break;
            case Maze.DirectionType.EAST:
                Maze.pegmanX++;
                command = 'east';
                break;
            case Maze.DirectionType.SOUTH:
                Maze.pegmanY++;
                command = 'south';
                break;
            case Maze.DirectionType.WEST:
                Maze.pegmanX--;
                command = 'west';
                break;
        }
        BlocklyApps.log.push([command, id]);
        if (Maze.pegmanX == Maze.finish_.x && Maze.pegmanY == Maze.finish_.y) {
            // Finished.  Terminate the user's program.
            BlocklyApps.log.push(['finish', null]);
            throw true;
        }
    }
};

/**
 * Turn pegman left or right.
 * @param {number} direction Direction to turn (0 = left, 1 = right).
 * @param {string} id ID of block that triggered this action.
 */
Maze.turn = function(direction, id) {
    if (direction) {
        // Right turn (clockwise).
        Maze.pegmanD++;
        BlocklyApps.log.push(['right', id]);
    } else {
        // Left turn (counterclockwise).
        Maze.pegmanD--;
        BlocklyApps.log.push(['left', id]);
    }
    Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD);
};

/**
 * Is there a path next to pegman?
 * @param {number} direction Direction to look
 *     (0 = forward, 1 = right, 2 = backward, 3 = left).
 * @param {?string} id ID of block that triggered this action.
 *     Null if called as a helper function in Maze.move().
 * @return {boolean} True if there is a path.
 */
Maze.isPath = function(direction, id) {
    var effectiveDirection = Maze.pegmanD + direction;
    var square;
    var command;
    switch (Maze.constrainDirection4(effectiveDirection)) {
        case Maze.DirectionType.NORTH:
            square = Maze.map[Maze.pegmanY - 1] &&
                Maze.map[Maze.pegmanY - 1][Maze.pegmanX];
            command = 'look_north';
            break;
        case Maze.DirectionType.EAST:
            square = Maze.map[Maze.pegmanY][Maze.pegmanX + 1];
            command = 'look_east';
            break;
        case Maze.DirectionType.SOUTH:
            square = Maze.map[Maze.pegmanY + 1] &&
                Maze.map[Maze.pegmanY + 1][Maze.pegmanX];
            command = 'look_south';
            break;
        case Maze.DirectionType.WEST:
            square = Maze.map[Maze.pegmanY][Maze.pegmanX - 1];
            command = 'look_west';
            break;
    }
    if (id) {
        BlocklyApps.log.push([command, id]);
    }
    return square !== Maze.SquareType.WALL && square !== undefined;
};
/** Is there a Barrier forward to the pegman
 *  isBarrierAhead
 */
Maze.isBarrierAhead = function(id) {
    return Maze.isBarrierAdjacent(0, id); //because the direction is 0, we actually ask if there is a barrier before the pegman.
};

/**
 * Is there a Barrier next to pegman?
 * @param {number} direction Direction to look
 *     (0 = forward, 1 = right, 2 = backward, 3 = left).
 * @param {?string} id ID of block that triggered this action.
 *     Null if called as a helper function in Maze.move().
 * @return {boolean} True if there is a path.
 */
Maze.isBarrierAdjacent = function(direction, id) {
    var effectiveDirection = Maze.pegmanD + direction;
    //var square;
    var command;
    var bool = false;
    switch (Maze.constrainDirection4(effectiveDirection)) {
        case Maze.DirectionType.NORTH:
            if (Maze.pegmanX == Maze.barrierLocation[0]) {
                if ((Maze.pegmanY - 1) == Maze.barrierLocation[1]) {
                    bool = true;
                }
            }
            //square = Maze.map[Maze.pegmanY - 1] && Maze.map[Maze.pegmanY - 1][Maze.pegmanX];
            command = 'barrier_north';
            break;
        case Maze.DirectionType.EAST:
            if ((Maze.pegmanX + 1) == Maze.barrierLocation[0]) {
                if (Maze.pegmanY == Maze.barrierLocation[1]) {
                    bool = true;
                }
            }
            //square = Maze.map[Maze.pegmanY][Maze.pegmanX + 1];
            command = 'barrier_east';
            break;
        case Maze.DirectionType.SOUTH:
            if (Maze.pegmanX == Maze.barrierLocation[0]) {
                if ((Maze.pegmanY + 1) == Maze.barrierLocation[1]) {
                    bool = true;
                }
            }
            //square = Maze.map[Maze.pegmanY + 1] && Maze.map[Maze.pegmanY + 1][Maze.pegmanX];
            command = 'barrier_south';
            break;
        case Maze.DirectionType.WEST:
            if ((Maze.pegmanX - 1) == Maze.barrierLocation[0]) {
                if (Maze.pegmanY == Maze.barrierLocation[1]) {
                    bool = true;
                }
            }
            //square = Maze.map[Maze.pegmanY][Maze.pegmanX - 1];
            command = 'barrier_west';
            break;
    }
    if (id) {
        BlocklyApps.log.push([command, id]);
    }
    return bool;
    //return square !== Maze.SquareType.WALL && square !== undefined;
};

/**
 * This function removes the barrier from the pegman's path
 */
Maze.removeBarrier = function() {

        Maze.barrierLocation[0] = 0; //0 - marks off the grid
        Maze.barrierLocation[1] = 0; //0 - marks off the grid
        BlocklyApps.log.push(['hide_barrier']);
    }
    /**
     * This function adds the barrier to the pegman's path
     */
Maze.addBarrier = function() {
    Maze.barrierLocation = window.jQuery.extend(true, {}, Maze.barrierLocations[Maze.LEVEL]);
    BlocklyApps.log.push(['show_barrier']);
    //document.getElementById('circleBarrier').setAttribute("style","visibility:visible;");
}


/**
 * This function checks if the user executed the maze and didn't solve the maze.
 */
Maze.checkIfMazeExecutedWithoutSuccess = function() {
    var tAnswer = false;
    if ((Maze.result != Maze.ResultType.UNSET) && (Maze.result != Maze.ResultType.SUCCESS) &&
        (document.getElementById('runButton').style.display == 'none')) {
        tAnswer = true;
    }
    return tAnswer;
}


/**
 * BP show code function.
 * Show the user's code in raw JavaScript.
 * @param {Element} origin Animate the dialog opening/closing from/to this
 *     DOM element.  If null, don't show any animations for opening or closing.
 */
Maze.showCode = function(origin) {
    var code = Maze.workspaceToCode('JavaScript');
    code = BlocklyApps.stripCode(code);
    var pre = document.getElementById('containerCode');
    pre.textContent = code;
    if (typeof prettyPrintOne == 'function') {
        code = pre.innerHTML;
        //code = styleCode(code, 'js');
        code = prettyPrintOne(code, 'js');

        //Added code to display the XML value
        /*
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var text = Blockly.Xml.domToText(xml);
    alert(text);
    */
        //Added code to display the XML value
        code = code + "\n";
        pre.innerHTML = code;
    }

    var content = document.getElementById('dialogCode');
    var style = {
        width: '40%',
        left: '30%',
        top: '5em'
    };
    BlocklyApps.showDialog(content, origin, true, true, style,
        BlocklyApps.stopDialogKeyDown);
    BlocklyApps.startDialogKeyDown();
};

Maze.addOnClickToTabElements = function() {

    var collection = document.getElementsByClassName('tab');
    for (var i = 0; i < collection.length; i++) {
        collection[i].addEventListener('click', (function(element, logger){ //Anonymous function example.
                                                    return function(){
                                                        //Backup to remote storage
                                                        //logger.sendLogTextToRemoteStorage();
                                                        //Take the string and add to window.location
                                                        element.href = element.href + logger.getRemoteStorageKeyHashString();
                                                    };
                                                })(collection[i] , _logger));
    }
};