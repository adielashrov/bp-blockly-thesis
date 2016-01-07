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

document.write('<script type="text/javascript" src="generated/' +
    BlocklyApps.LANG + '.js"></script>\n');

Maze.MAX_LEVEL = 8; //Original value is 10 - levels
Maze.LEVEL = BlocklyApps.getNumberParamFromUrl('level', 1, Maze.MAX_LEVEL);
/*
var maxBlocks = [undefined, // Level 0.
    Infinity, 10, 3,11, Infinity, Infinity, Infinity, Infinity, 7, 10][Maze.LEVEL];*/

//BP - removed the limitations number of blocks per level - in all levels
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
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [3, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 2, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // Level 10.
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 3, 0, 1, 0],
        [0, 1, 1, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 1, 0],
        [0, 2, 1, 1, 1, 0, 1, 0],
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
Maze.holeLocation = [3, 3];
Maze.holeLocations = [
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

//A flag telling us if we should initialize localStorage with layouts.
Maze.storageIntialized = function () {
    if (window.localStorage.getItem("reset") != null) {
        return (window.localStorage.getItem("reset").length > 0);
    } else {
        return false;
    }
};

/**------------------------------------------------------------------------------------------------------------------------------------------------------
*-----------------------------------------------------BP added static variables ---- End --------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * This function places the hole in a random location inside the maze.
 * TODO: Remove this function
 */
Maze.randomizeHoleLocation = function (level) {
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
Maze.drawMap = function () {
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
    var normalize = function (x, y) {
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

    // Add BP Hole
    var holeSVG = document.createElementNS(Blockly.SVG_NS, 'circle');
    holeSVG.setAttribute('id', 'circleHole');
    holeSVG.setAttribute('cx', 10);
    holeSVG.setAttribute('cy', 10); // 49 * 21 = 1029
    holeSVG.setAttribute('r', 8);
    holeSVG.setAttribute('fill', "red");
    holeSVG.setAttribute('visibility', "hidden"); //Let's see the hole only if it's on the appropriate level
    //Finish hole here
    svg.appendChild(holeSVG);

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


/**
 * BP hot key listener.
 * If the key pressed is s we will see the code using Maze.showCode
 * If the key pressed is r , the localStorage is in reset to it's default values.
 */
Maze.keyUpListener = function (e) {
    //console.log("I'm inside keyUpListener");
    if (e.keyCode == 83) { // S - is for show code
        Maze.showCode(this);
    } else if (e.keyCode == 82) { // R - for reset localStorage
        //Initialize level_help array
        var tText = '0,0,0,0,0,0,0,0,0'; //an array of bits for seen help, current number of levels is 8, array is size 9. TODO: refactor this code.
        var tKey = "Level_help";
        window.localStorage.setItem(tKey, tText);
		//Mark reset flag inside localStorage
		window.localStorage.setItem("reset", "");
        //Reset localStorage values of saved workspaces to default values.
		Maze.resetLocalStorage();
        Maze.restoreBlocksFromLocalStorage();
		Maze.levelHelp();
	}/* else if(e.keyCode == 77) { // H - if you want to see all help levels.
		
    } */else if (e.keyCode == 56) { // 8 - is for solve level_8.
        var tXmlText = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="42" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="267" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="495" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_holeAhead"></block></value><next><block type="bp_dowhileblocking" inline="false"><value name="events"><block type="bp_forward"></block></value><statement name="code"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_holeAhead"></block></value></block></next></block></next></block></next></block></next></block></statement><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="725" y="50"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
        var tXml = Blockly.Xml.textToDom(tXmlText);
        // Clear the workspace to avoid merge.
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, tXml);
    }
};

/**
 * This function handles autosave workspace to remote storage
 * When there is a change in the workspace we back the result to the remote storage
 * The result is a storage key which will keep in Maze.storageKey
 * TODO: Not working right now.
 */
Maze.changeListenerRemoteStorage = function () {
    BlocklyStorage.saveWorkspaceRemoteBP(Maze.storageKey); //Debug
};

/**
 * If this is the first time we have loaded the level we do nothing
 * Else we load the workspace from the remote value with the key Maze.storageKey
 * TODO: Not working right now.
 */
Maze.loadWorkspaceFromRemoteStorage = function () {
    //if (Maze.storageKey.length > 0) { TODO: Keep storageKey inside Maze. 
    BlocklyStorage.retrieveXmlBP(Maze.storageKey);
    //}
};

/**
 * Checks if Maze.LEVEL == index help has been fully seen.
 */

Maze.checkIfLevelHelpMarked = function (index) {
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
                console.log("bitsArray[" + index + " ]: is not 0,1. Inside Maze.checkIfLevelHelpMarked");
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
Maze.markLevelHelp = function () {
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
}
/**
 * This function initializes the localStorage with default text(Xml translated blocks) layouts.
 * Every level has it's own default layout saved inside the localStorage appropriate key.
 */
Maze.resetLocalStorage = function () {
    var tXml = null;
    var tKey = null;
    if ('localStorage' in window) {
        //Initialize flag for first time in localStorage
        window.localStorage.setItem("reset", "");

        //Initialize level_1 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="scoped_request" inline="false" x="70" y="70"><value name="REQUEST"><block type="bp_forward"></block></value></block></xml>';
        tKey = "Level_1";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_2 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="scoped_request" inline="false" x="111" y="69"><value name="REQUEST"><block type="bp_forward"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value></block></next></block></xml>';
        tKey = "Level_2";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_3 localStorage
        tXml = ' <xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="111" y="69"></block></xml>';
        tKey = "Level_3";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_4 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'; //Empty workspace XML.		
        tKey = "Level_4";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_5 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="217" y="56"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="504" y="82"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
        tKey = "Level_5";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_6 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="150" y="40"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="400" y="40"><statement name="DO"><block type="scoped_wait" inline="false"><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="630" y="40"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
        tKey = "Level_6";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_7 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_repeat_forever" x="42" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="267" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_path_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block></next></block></statement></block><block type="bp_repeat_forever" x="495" y="50"><statement name="DO"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_holeAhead"></block></value><next><block type="bp_dowhileblocking" inline="false"><value name="events"><block type="bp_forward"></block></value><statement name="code"><block type="scoped_wait" inline="false"><value name="WAIT-FOR"><block type="bp_no_holeAhead"></block></value></block></statement></block></next></block></statement></block><block type="bp_repeat_forever" x="725" y="50"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></statement></block></xml>';
        tKey = "Level_7";
        window.localStorage.setItem(tKey, tXml);

        //Initialize level_8 localStorage
        tXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'; //Empty workspace XML.		
        tKey = "Level_8";
        window.localStorage.setItem(tKey, tXml);

        
		
		//Initialize level_help array - only if null! for reset click H.
        var tBitArray = '0,0,0,0,0,0,0,0,0'; //an array of bits for seen help, current number of levels is 8, array is size 9. TODO: refactor this code.
        tKey = "Level_help";
        if(window.localStorage.getItem(tKey) == null) {
			window.localStorage.setItem(tKey, tBitArray);
		}
    } else {
        console.log("No LocalStorage, Error resetting localstorage");
    }
};

/**
 * This function restores the saved Maze.LEVEL workspace from the localStorage
 */
Maze.restoreBlocksFromLocalStorage = function () {
    if ('localStorage' in window) {
        var tXmlText = window.localStorage.getItem("Level_" + Maze.LEVEL);
        if (tXmlText != null) {
            var tXml = Blockly.Xml.textToDom(tXmlText);
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
 * TODO: complete code
 */
Maze.backUpWorkspaceToLocalStorage = function () {
    //Mark that the values in the workspace have changed	
    window.localStorage.setItem("reset", "1");

    //Perhaps check if there is a change betweern the xml before changing.
    var tXml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var tText = Blockly.Xml.domToText(tXml);
    var tKey = "Level_" + Maze.LEVEL;
    window.localStorage.setItem(tKey, tText);
};

/**
 * Initialize Blockly and the maze.  Called on page load.
 */
Maze.init = function () {
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
    var handlerFactory = function (n) {
        return function () {
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
    var onresize = function (e) {
        var top = visualization.offsetTop;
        blocklyDiv.style.top = Math.max(10, top - window.scrollY) + 'px';
        blocklyDiv.style.left = rtl ? '10px' : '420px';
        blocklyDiv.style.width = (window.innerWidth - 440) + 'px';
    };
    window.addEventListener('scroll', function () {
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
    Blockly.addChangeListener(function () {
        Maze.updateCapacity()
    });

    document.body.addEventListener('mousemove', Maze.updatePegSpin_, true);

    //BP - Added a hot key listener for the show Code function. Removing the showCode button.
    document.getElementById('showCodeButton').setAttribute("style", "visibility:hidden;");
    document.onkeyup = Maze.keyUpListener;

    if (!Maze.storageIntialized()) { //First time load of Maze
        Maze.resetLocalStorage();
        window.localStorage.setItem("reset", "true");
    }

    if (Maze.LEVEL == 1) {
        // Make connecting blocks easier for beginners.
        Blockly.SNAP_RADIUS *= 2;
    }

    if (Maze.LEVEL == 7) {
        //Maze.holeLocation = jQuery.extend(true, {}, Maze.holeLocations[Maze.LEVEL]);
    }

    if (Maze.LEVEL == 8) {
        //Maze.holeLocation = jQuery.extend(true, {}, Maze.holeLocations[Maze.LEVEL]);
    }

    //Neil Level 10 - use the left hand rule.
    if (Maze.LEVEL == 10) {
        // Level 10 gets an introductory modal dialog.
        var content = document.getElementById('dialogHelpWallFollow');
        var style = {
            width: '30%',
            left: '35%',
            top: '12em'
        };
        BlocklyApps.showDialog(content, null, false, true, style,
            BlocklyApps.stopDialogKeyDown);
        BlocklyApps.startDialogKeyDown();
    }

    if (Maze.LEVEL < 6) {
        Blockly.addChangeListener(function () {
            Maze.levelHelp();
            //Maze.saveToStorageOneTime();//TODO: Remove code here.
        });
    } else if ((Maze.LEVEL >= 6) && (Maze.LEVEL < 9)) { //High level don't display help for every change, only in Maze.init
        Maze.levelHelp();
    }
    //Initialize the Maze.holeLocation.
    Maze.holeLocation = jQuery.extend(true, {}, Maze.holeLocations[Maze.LEVEL]);

    //Initialize the workspace with default/last saved session of blocks.
    Maze.restoreBlocksFromLocalStorage();

    //Attaching an onchange listener to produce automatic save of workspace.
    Blockly.addChangeListener(Maze.backUpWorkspaceToLocalStorage);

    //Attaching a keyListener for the show code functionality.
    //var showCodeButton = document.getElementById('showCodeButton');
    //showCodeButton.onkeyup = Maze.keyUpListener;

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
Maze.levelHelp = function () {
    if (Blockly.Block.dragMode_ != 0) {
        // Don't change helps during drags.
        return;
    } else if (Maze.result == Maze.ResultType.SUCCESS) {
        // The user has already won.  They are just playing around.
        return;
    }
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
    if (!Maze.checkIfLevelHelpMarked(Maze.LEVEL)) {
        if (Maze.LEVEL == 1) {
            if (Maze.result != Maze.ResultType.UNSET &&
                    document.getElementById('runButton').style.display == 'none') {//TODO: Think on how to clean this code. Duplicate code
                    content = document.getElementById('dialogHelpReset');
                    style = {
                        width: '360px',
                        top: '410px'
                    };
                    style[Blockly.RTL ? 'right' : 'left'] = '400px';
                    origin = document.getElementById('resetButton');
					//Mark All LevelsHelp has been seen
					//Maze.markLevelHelp();
            }
			else if (Blockly.mainWorkspace.getAllBlocks().length < 3) { //Changed to 3 in order to see we need to add new blocks
                content = document.getElementById('dialogHelpStackBP');
                style = {
                    width: '430px',
                    top: '240px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '420px';
                origin = toolbar[0].getSvgRoot();
            } else {
                var topBlocks = Blockly.mainWorkspace.getTopBlocks(true);
                if (topBlocks.length > 1) { //BP - this question tells us how many groups of blocks are there
                    var iframe = document.getElementById('iframeOneTopBlock');
                    //Blocks translated  to XML in order to display them in mini-menu
                    var xml = '<block type="scoped_request" inline="false" x="10" y="10"><value name="REQUEST"><block type="bp_forward"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value></block></next></block>';
                    iframe.src = 'readonly.html' +
                        '?lang=' + encodeURIComponent(BlocklyApps.LANG) +
                        '&xml=' + encodeURIComponent(xml);
                    content = document.getElementById('dialogHelpOneTopBlockBP');
                    style = {
                        width: '360px',
                        top: '120px'
                    };
                    style[Blockly.RTL ? 'right' : 'left'] = '265px';
                    origin = topBlocks[0].getSvgRoot();
                } else if (Maze.result == Maze.ResultType.UNSET) {
                    // Show run help dialogue.
                    content = document.getElementById('dialogHelpRun');
                    style = {
                        width: '360px',
                        top: '410px'
                    };
                    style[Blockly.RTL ? 'right' : 'left'] = '400px';
                    origin = document.getElementById('runButton');
					//Mark All LevelsHelp has been seen
					Maze.markLevelHelp();
                }
            }
        } else if (Maze.LEVEL == 2) {
            if (Blockly.mainWorkspace.getAllBlocks().length < 5) { //Less then 5 blocks ,meaning no added blocks by user show help
                content = document.getElementById('dialogHelpLevel_2_BP');
                style = {
                    width: '400px',
                    top: '240px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '420px';
                origin = toolbar[0].getSvgRoot();
				
				//Mark All LevelsHelp has been seen
				Maze.markLevelHelp();
            } else { //More then 5 blocks ,meaning no the user has added blocks
                var topBlocks = Blockly.mainWorkspace.getTopBlocks(true)
                //TODO: Clean this code and make sure that it is documented
                //if (Blockly.mainWorkspace.getAllBlocks().length < 6)//(topBlocks.length > 1) //More than one group of blocks.
                /*
			if (topBlocks.length > 1)//More than one group of blocks.
			{
				var iframe = document.getElementById('iframeOneTopBlock');
				var xml = 	'<block type="scoped_request" inline="false" x="111" y="69"><value name="REQUEST"><block type="bp_forward"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_right"></block></value><next><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_left"></block></value></block></next></block></next></block></next></block></next></block>';
				iframe.src = 'readonly.html' +
					'?lang=' + encodeURIComponent(BlocklyApps.LANG) +
					'&xml=' + encodeURIComponent(xml);
				content = document.getElementById('dialogHelpOneTopBlock_2_BP');
				style = {width: '350px', top: '350px'};
				style[Blockly.RTL ? 'right' : 'left'] = '450px';
				origin = topBlocks[0].getSvgRoot();
			}
			*/
                //If we have executed one program we now need to be ready for a reset.
                if (Maze.result != Maze.ResultType.UNSET &&
                    document.getElementById('runButton').style.display == 'none') {
                    content = document.getElementById('dialogHelpReset');
                    style = {
                        width: '360px',
                        top: '410px'
                    };
                    style[Blockly.RTL ? 'right' : 'left'] = '400px';
                    origin = document.getElementById('resetButton');
					//Mark All LevelsHelp has been seen
					Maze.markLevelHelp();
                }
            }
        } else if (Maze.LEVEL == 3) {
            if (userBlocks.indexOf('scoped_request') == -1) //Smart - If the user didn't use request we notify with a help message.
            {
                content = document.getElementById('dialogHelpRepeatBP');
                style = {
                    width: '360px',
                    top: '320px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '425px';
                origin = toolbar[3].getSvgRoot();
				//Mark All LevelsHelp has been seen
				Maze.markLevelHelp();
            }
        } else if (Maze.LEVEL == 4) {
            /*TODO: Understand this code, make sure it is documented and delete.
    Blockly.mainWorkspace.getAllBlocks().length < 3 ||
    Blockly.mainWorkspace.getTopBlocks(false).length != 1
	*/
            if (userBlocks.indexOf('bp_repeat_forever') == -1) {
                content = document.getElementById('dialogHelpRepeatManyBP');
                style = {
                    width: '360px',
                    top: '320px'
                };
                style[Blockly.RTL ? 'right' : 'left'] = '425px';
                origin = toolbar[3].getSvgRoot();
				//Mark All LevelsHelp has been seen
				Maze.markLevelHelp();
            }
        } else if (Maze.LEVEL == 5) { //What did I do with all these Or cases, TODO - Understand
            /*//TODO: Document this code and remove this code
	if (userBlocks.indexOf('maze_if') == -1 || //Question if this exact block has been used.
        Blockly.mainWorkspace.getAllBlocks().length < 3 || //Blockly.mainWorkspace.getAllBlocks().length : total number of Blocks used
        Blockly.mainWorkspace.getTopBlocks(false).length != 1) { //Blockly.mainWorkspace.getTopBlocks(false).length : number of modules/b-threads in palate
	*/
            content = document.getElementById('dialogHelp_BP_Level_5_1');
            style = {
                width: '360px',
                height: '80px',
                top: '280px'
            };
            style[Blockly.RTL ? 'right' : 'left'] = '560px';
            origin = toolbar[3].getSvgRoot();
            //Attach a listener to the button-1
            var button = document.getElementById("dialogHelp_BP_Level_5_1_button");
            if (button.addEventListener) {
                button.addEventListener("click",
                    function () {
                        //Hide the first message for the user
                        BlocklyApps.hideDialog(false);
                        content = document.getElementById('dialogHelp_BP_Level_5_2');
                        style = {
                            width: '360px',
                            height: '80px',
                            top: '260px'
                        };
                        style[Blockly.RTL ? 'right' : 'left'] = '860px';
                        var origin2 = toolbar[3].getSvgRoot();
                        //var origin2 = Blockly.mainWorkspace.getTopBlocks(true)[0].getSvgRoot();
                        //Attach a listener to the button-1
                        var button2 = document.getElementById("dialogHelp_BP_Level_5_2_button");
                        if (button2.addEventListener) {
                            button2.addEventListener("click",
                                function () {
                                    //Hide the second message from the user
                                    BlocklyApps.hideDialog(false);
                                    content = document.getElementById('dialogHelp_BP_Level_5_3');
                                    style = {
                                        width: '360px',
                                        height: '80px',
                                        top: '260px'
                                    };
                                    style[Blockly.RTL ? 'right' : 'left'] = '1150px';
                                    //origin = toolbar[3].getSvgRoot();
                                    if (Blockly.mainWorkspace.getTopBlocks(true).length > 0) {
                                        origin = Blockly.mainWorkspace.getTopBlocks(true)[1].getSvgRoot();
                                    }
                                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                                    //TODO: Hide the third message and show click on listener
                                    //BlocklyApps.hideDialog(false);
                                    var button3 = document.getElementById("dialogHelp_BP_Level_5_3_button");
                                    if (button3.addEventListener) {
                                        button3.addEventListener("click",
                                            function () {
                                                BlocklyApps.hideDialog(false);
                                                // Show run help dialog - duplicate code, think about this
                                                content = document.getElementById('dialogHelpRun');
                                                style = {
                                                    width: '360px',
                                                    top: '410px'
                                                };
                                                style[Blockly.RTL ? 'right' : 'left'] = '400px';
                                                var origin4 = document.getElementById('runButton');
                                                BlocklyApps.showDialog(content, origin4, true, false, style, null);
												//Finished 3 message.
												//Mark all help signs have been seen
												Maze.markLevelHelp();
                                            }, false);
                                    }
                                }, false);
                        }
                        //Show the second message
                        BlocklyApps.showDialog(content, origin2, true, false, style, null);
                    }, false);
            }
            //Show the first message on the pallet
            if (content) {
                if (content.parentNode != document.getElementById('dialog')) {
                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                }
            } else {
				console.log('Could not find content element named: dialogHelp_BP_Level_5_1');//TODO: Move to logger package
                BlocklyApps.hideDialog(false);
            }
            flag = false;
        } else if (Maze.LEVEL == 6) {

            //if (userBlocks.indexOf('maze_if') == -1) {TODO: Understand, Document, Delete!
            content = document.getElementById('dialogHelp_BP_Level_6_1');
            //content = null;//This how we disappear first message. TODO: Understand, Document, Delete!
            style = {
                width: '360px',
                top: '255px'
            };
            style[Blockly.RTL ? 'right' : 'left'] = '415px';
            //origin = toolbar[4].getSvgRoot();
            origin = toolbar[0];
            //origin = document.getElementById('runButton');
            var button = document.getElementById("dialogHelp_BP_Level_6_1_button");
            if (button.addEventListener) {
                button.addEventListener("click",
                    function () {
                        BlocklyApps.hideDialog(false);
                        // Show run help dialogue - duplicate code, think about this
                        content = document.getElementById('dialogHelp_BP_Level_6_2');
                        style = {
                            width: '360px',
                            top: '275px'
                        };
                        style[Blockly.RTL ? 'right' : 'left'] = '985px';
                        var origin2 = toolbar[4];
                        var button2 = document.getElementById("dialogHelp_BP_Level_6_2_button");
                        if (button2.addEventListener) {
                            button2.addEventListener("click",
                                function () {
                                    BlocklyApps.hideDialog(false);
									//Finished 2 message.
									//Mark all help signs have been seen
									Maze.markLevelHelp();
                                }, false);
                        }
                        BlocklyApps.showDialog(content, origin2, true, false, style, null);
                    }, false);
            }
            if (content) {
                if (content.parentNode != document.getElementById('dialog')) {
                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                }
            } else {
                console.log('Could not find content element named: dialogHelp_BP_Level_6_1');
                BlocklyApps.hideDialog(false);
            }
            flag = false;
        } else if (Maze.LEVEL == 7) {
            content = document.getElementById('dialogHelp_BP_Level_7_1');
            style = {
                width: '360px',
                top: '285px'
            };
            style[Blockly.RTL ? 'right' : 'left'] = '1080px';
            //origin = toolbar[4].getSvgRoot();
            origin = toolbar[4];
            var button = document.getElementById("dialogHelp_BP_Level_7_1_button");
            if (button.addEventListener) {
                button.addEventListener("click",
                    function () {
                        BlocklyApps.hideDialog(false);
                        content = document.getElementById('dialogHelp_BP_Level_7_2');
                        style = {
                            width: '360px',
                            //height: '160px',
                            top: '285px'
                        };
                        style[Blockly.RTL ? 'right' : 'left'] = '1080px';
                        //origin = toolbar[4].getSvgRoot();
                        origin = toolbar[4];
                        var button2 = document.getElementById("dialogHelp_BP_Level_7_2_button");
                        if (button2.addEventListener) {
                            /*button2.addEventListener("click",
                            function () {
                                BlocklyApps.hideDialog(false);
						}, false);*/
                            button2.addEventListener("click",
                                function () {
                                    BlocklyApps.hideDialog(false);
                                    // Show run help dialog - duplicate code, think about this
                                    content = document.getElementById('dialogHelpRun');
                                    style = {
                                        width: '360px',
                                        top: '410px'
                                    };
                                    style[Blockly.RTL ? 'right' : 'left'] = '400px';
                                    var origin4 = document.getElementById('runButton');
                                    BlocklyApps.showDialog(content, origin4, true, false, style, null);
									//Mark all help signs have been seen (third message)
									Maze.markLevelHelp();
                                }, false);
                        }
                        //Show the second message
                        BlocklyApps.showDialog(content, origin, true, false, style, null);
                    }, false);
            }
            //Show the first message on the pallet - TODO: Repeated code, re-factor this code segment.
            if (content) {
                if (content.parentNode != document.getElementById('dialog')) {
                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                }
            } else {
                console.log('Could not find content element named: dialogHelp_BP_Level_5_1');
                BlocklyApps.hideDialog(false);
            }
            flag = false;//TODO: Re-factor this flag out of here.
        } else if (Maze.LEVEL == 8) {
            content = document.getElementById('dialogHelp_BP_Level_8_1');
            style = {
                width: '360px',
                top: '150px'
            };
            style[Blockly.RTL ? 'right' : 'left'] = '420px';
            //origin = toolbar[4].getSvgRoot();
            origin = toolbar[4];
            var button = document.getElementById("dialogHelp_BP_Level_8_1_button");
            if (button.addEventListener) {
                button.addEventListener("click",
                    function () {
                        BlocklyApps.hideDialog(false);
                        content = document.getElementById('dialogHelp_BP_Level_8_2');
                        style = {
                            width: '360px',
                            //height: '160px',
                            top: '150px'
                        };
                        style[Blockly.RTL ? 'right' : 'left'] = '420px';
                        //origin = toolbar[4].getSvgRoot();
                        origin = toolbar[4];
                        var button2 = document.getElementById("dialogHelp_BP_Level_8_2_button");
                        if (button2.addEventListener) {
                            button2.addEventListener("click",
                                function () {
                                    BlocklyApps.hideDialog(false);
									//Mark all help signs have been seen (third message)
									Maze.markLevelHelp();
                                }, false);
                        }
                        //Show the second message
                        BlocklyApps.showDialog(content, origin, true, false, style, null);
                    }, false);
            }
            //Show the first message on the pallet - TODO: Repeated code, re factor this code segment.
            if (content) {
                if (content.parentNode != document.getElementById('dialog')) {
                    BlocklyApps.showDialog(content, origin, true, false, style, null);
                }
            } else {
                console.log('Could not find content element named: dialogHelp_BP_Level_5_1');
                BlocklyApps.hideDialog(false);
            }
            flag = false;
        }
    }
	else{//This Maze.level has been seen and we want to display help reset message. TODO: Re factor this code
		if (Maze.LEVEL <= 2) {
			 if (Maze.result != Maze.ResultType.UNSET &&
                    document.getElementById('runButton').style.display == 'none') {
                    content = document.getElementById('dialogHelpReset');
                    style = {
                        width: '360px',
                        top: '410px'
                    };
                    style[Blockly.RTL ? 'right' : 'left'] = '400px';
                    origin = document.getElementById('resetButton');
					//Mark All LevelsHelp has been seen
					//Maze.markLevelHelp();
                }
		}
	}
    if (flag) {
        if (content) {
            if (content.parentNode != document.getElementById('dialog')) {
                BlocklyApps.showDialog(content, origin, true, false, style, null);		
            }
        } else {
            BlocklyApps.hideDialog(false);
        }
    }
};

/**
 * Reload with a different Pegman skin.
 * @param {number} newSkin ID of new skin.
 */
Maze.changePegman = function (newSkin) {
    Maze.saveToStorageOneTime();
    window.location = window.location.protocol + '//' +
        window.location.host + window.location.pathname +
        '?lang=' + BlocklyApps.LANG + '&level=' + Maze.LEVEL + '&skin=' + newSkin;
};

/**
 * Save the blocks for a one-time reload.
 */
Maze.saveToStorageOneTime = function (defaultWorkspace) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
};

/**
 * Load blocks from the local storage
 * TODO: Remove function, not needed.
 */
Maze.loadBlocks = function () {
    var url = window.location.href.split('#')[0];
    if ('localStorage' in window && window.localStorage[url]) {
        var xml = Blockly.Xml.textToDom(window.localStorage[url]);
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    }
};

/**
 * Display the Pegman skin-change menu.
 */
Maze.showPegmanMenu = function () {
    var menu = document.getElementById('pegmanMenu');
    if (menu.style.display == 'block') {
        return; // Menu is already open.
    }
    var button = document.getElementById('pegmanButton');
    Blockly.addClass_(button, 'buttonHover');
    menu.style.top = (button.offsetTop + button.offsetHeight) + 'px';
    menu.style.left = button.offsetLeft + 'px';
    menu.style.display = 'block';
    window.setTimeout(function () {
        Maze.pegmanMenuMouse_ = Blockly.bindEvent_(document.body, 'mousedown',
            null, Maze.hidePegmanMenu);
    }, 0);
};

/**
 * Hide the Pegman skin-change menu.
 */
Maze.hidePegmanMenu = function () {
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
Maze.reset = function (first) {
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
        Maze.pidList.push(window.setTimeout(function () {
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
Maze.runButtonClick = function () {
    BlocklyApps.hideDialog(false);
    // Only allow a single top block on level 1.
    if (Maze.LEVEL == 1 && Blockly.mainWorkspace.getTopBlocks().length > 1) {
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
Maze.updateCapacity = function () {
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
 * Click the reset button.  Reset the maze.
 */
Maze.resetButtonClick = function () {
    document.getElementById('runButton').style.display = 'inline';
    document.getElementById('resetButton').style.display = 'none';
    Blockly.mainWorkspace.traceOn(false);
    Maze.reset(false);
    //BP- Hole reset location and display it //TODO: this solution should be cleaner perhaps
    Maze.resetHole();
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

Maze.workspaceToCode = function (name) {
    var code = [];
    var generator = Blockly.Generator.get(name);
    generator.init();
    var blocks = Blockly.mainWorkspace.getTopBlocks(true);

    for (var x = 0, block; block = blocks[x]; x++) {
        Blockly.JavaScript.bp_reset_breakupon(); //Reset breakupon counter
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
			if(line.indexOf("yield") !== -1)
			{
				code.push("bp.addBThread('', priority++, function() {"); // Priority based
				//code.push("bp.addBThread('', 100, function() {"); // Round Robin
				code.push("var blocked_events = [];");
				code.push("var breakupon_events = [];");
				code.push(myFinish(line));
				code.push(line);
				code.push("});");
				//code.push(line);
			}
			else { 
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
Maze.execute = function () {
    BlocklyApps.log = [];
    BlocklyApps.ticks = 500; //This affect the timeout of infinity loop.
    //var code = Blockly.Generator.workspaceToCode('JavaScript');

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
    yield({request:[], wait:[('forward')], block:[]});\
	Maze.moveForward('1');\
  }\
});\
  bp.addBThread('backward actuator', priority++, function() {  while (true) {\
    yield({request:[], wait:[('backward')], block:[]});Maze.moveBackward('1');\
  }\
});\
bp.addBThread('right actuator', priority++, function() {  while (true) {\
    yield({request:[], wait:[('right')], block:[]});Maze.turnRight('1');\
  }\
});\
bp.addBThread('left actuator', priority++, function() {  while (true) {\
    yield({request:[], wait:[('left')], block:[]});Maze.turnLeft('1');\
  }\
});\
\
bp.addBThread('wall sensor pathForward', priority++, function() {  \
	while (true) {\
		if (Maze.isPathForward()) {\
			yield({request:['pathAhead'], wait:[], block:[]});\
		}\
		yield({request:[], wait:['left','right','forward','backward'], block:[]});\
	}\
});\
bp.addBThread('wall sensor NoPathForward', priority++, function() {  \
	while (true) {\
		if (!Maze.isPathForward()) {\
			yield({request:['noPathAhead'], wait:[], block:[]});\
		}\
		yield({request:[], wait:['left','right','forward','backward'], block:[]});\
	}\
});\
bp.addBThread('wall sensor pathRight', priority++, function() {\
	while (true) {\
		if (Maze.isPathRight()) {\
			yield({request:['pathRight'], wait:[], block:[]});\
		}\
		yield({request:[], wait:['left','right','forward','backward'], block:[]});\
	}\
});\
bp.addBThread('wall sensor noPathRight', priority++, function() {  \
	while (true) {\
		if (!Maze.isPathRight()) {\
			yield({request:['noPathRight'], wait:[], block:[]});\
		}\
		yield({request:[], wait:['left','right','forward','backward'], block:[]});\
	}\
});\
bp.addBThread('wall sensor pathLeft', priority++, function() {  \
	while (true) {\
		if (Maze.isPathLeft()) {\
			yield({request:['pathLeft'], wait:[], block:[]});\
		}\
		yield({request:[], wait:['left','right','forward','backward'], block:[]});\
	}\
});\
bp.addBThread('wall sensor noPathLeft', priority++, function() {  \
	while (true) {\
		if (!Maze.isPathLeft()) {\
			yield({request:['noPathLeft'], wait:[], block:[]});\
		}\
		yield({request:[], wait:['left','right','forward','backward'], block:[]});\
	}\
});\
function holeFlicker() {\
  var c = 0;\
  while(true){\
 	yield({wait: ['forward','tick']});\
	c++;\
	if((c % 3) == 0 ) {Maze.removeHole();}\
	if(((c % 3) == 1) && (Maze.pegmanX != 3 || Maze.pegmanY != 3)) {Maze.addHole();}\
  }\
}\
function waitForPegmanCircle(){\
	yield({request:[], wait:['holeAhead'], block:[]});\
	yield({request:[], wait:['left'], block:[]});\
	yield({request:[], wait:['left'], block:[]});\
	yield({request:[], wait:['left'], block:[]});\
	yield({request:[], wait:['left'], block:[]});\
	yield({request:[], wait:['holeAhead'], block:[]});\
	console.log('Going to removeHole inside  waitForPegmanCircle b-thread');\
	Maze.removeHole();\
}\
if(Maze.LEVEL >= 7){\
	bp.addBThread('hole ahead sensor', priority++, function() {  \
		while (true) {\
			if (Maze.isHoleAhead()) {\
				yield({request:['holeAhead'], wait:[], block:[]});\
			}\
			else {\
				yield({request:['noHoleAhead'], wait:[], block:[]});\
			}\
			yield({request:[], wait:[function(x){return true;}], block:[]});\
		}\
	});\
	if(Maze.LEVEL == 7){\
		bp.addBThread('hole Flicker', priority++, holeFlicker);\
	}\
	else if(Maze.LEVEL == 8){\
		bp.addBThread('Wait for Pegman dance', priority++, waitForPegmanCircle);\
	}\
}\
function logger() {\
  while(true){\
 	yield({request:['tick'] , wait: [function(x){return true;}]});\
	console.log('event log: '+ bp.lastEvent);\
	BlocklyApps.checkTimeout();\
  }\
}\
bp.addBThread('logger', 1000, logger);\
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
"

        /* - BThreads' code. not needed now
bp.addBThread('hole ahead actuator', priority++, function() {  \
	while (true) {\
		yield({request:[], wait:['holeAhead'], block:[]});\
	}\
});\
bp.addBThread('remove hole actuator', priority++, function() {\
	while (true) {\
		yield({request:[], wait:['removeHoleAhead'], block:[]});\
		Maze.removeHole();\
	}\
});\
bp.addBThread('add hole actuator', priority++, function() {\
	while (true) {\
		yield({request:[], wait:['addHoleAhead'], block:[]});\
		Maze.addHole();\
	}\
});\
function logger() {\
  while(true){\
 	yield({request:['tick'] , wait: [function(x){return true;}]});\
	console.log('event log:'+ bp.lastEvent);\
	BlocklyApps.checkTimeout();\
  }\
}\
*/

        //BP -stopped logger here   Add this line if we want it after yield- console.log('event log:'+bp.lastEvent);\  

        //eval(code);
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
    Maze.stepSpeed = (Maze.result == Maze.ResultType.SUCCESS) ? 50 : 65;
    // BlocklyApps.log now contains a transcript of all the user's actions.
    // Reset the maze and animate the transcript.

    //Note - A call to animate the recorded path
    Maze.reset(false);
    Maze.pidList.push(window.setTimeout(Maze.animate, 100));
    //Maze.pidList.push(window.setTimeout(Maze.levelHelp, 300));
};

// End of BP code
//-------------------------------------------------------------------------------

/**
 * Iterate through the recorded path and animate pegman's actions.
 */
Maze.animate = function () {
    // All tasks should be complete now.  Clean up the PID list.
    Maze.pidList = [];

    var action = BlocklyApps.log.shift();
    if (!action) {
        //BlocklyApps.highlight(null);  BP - Removed highlight for now
        Maze.levelHelp(); //BP - This call will re call Maze.levelHelp() after a failed execution. Do we want this?
        return;
    }
    //BlocklyApps.highlight(action[1]); BP - Removed highlight for now

    switch (action[0]) {
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
    case 'show_hole':
        //TODO: Think if we should remove hole here or in function remove Hole.
		Maze.holeLocation = jQuery.extend(true, {}, Maze.holeLocations[Maze.LEVEL]);
		document.getElementById('circleHole').setAttribute("style", "visibility:visible;");
        break;
    case 'hide_hole':
		//TODO: Think if we should remove hole here or in function remove Hole.
		Maze.holeLocation[0] = 0; //0 - marks off the grid
		Maze.holeLocation[1] = 0; //0 - marks off the grid
		document.getElementById('circleHole').setAttribute("style", "visibility:hidden;");
        break;
    case 'holeAheadOfPegman':
        Maze.scheduleHoleAheadOfPegman();
        break;
    case 'fail_forward':
        Maze.scheduleFail(true);
        break;
    case 'fail_backward':
        Maze.scheduleFail(false);
        break;
    case 'finish':
        Maze.scheduleFinish(true);
        window.setTimeout(Maze.congratulations, 1000);
    }

    Maze.pidList.push(window.setTimeout(Maze.animate, Maze.stepSpeed * 5));
};

/**
 * Congratulates the user for completing the level and offers to
 * direct them to the next level, if available.
 */
Maze.congratulations = function () {
    var content = document.getElementById('dialogDone');
    var buttonDiv = document.getElementById('dialogDoneButtons');
    buttonDiv.textContent = '';
    var style = {
        width: '40%',
        height: '25%', //A hard-coded bug override, let because after we displayed BP help with timeout and buttons , height was different.
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
            function () {
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
BlocklyApps.congratulationsKeyDown_ = function (e) {
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
Maze.nextLevel = function () {
    window.location = window.location.protocol + '//' +
        window.location.host + window.location.pathname +
        '?lang=' + BlocklyApps.LANG + '&level=' + (Maze.LEVEL + 1) +
        '&skin=' + Maze.SKIN_ID;
};

/**
 * Point the congratulations Pegman to face the mouse.
 * @param {Event} e Mouse move event.
 * @private
 */
Maze.updatePegSpin_ = function (e) {
    if (document.getElementById('dialogDone').className ==
        'dialogHiddenContent') {
        return;
    }
    var pegSpin = document.getElementById('pegSpin');
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
Maze.schedule = function (startPos, endPos) {
    var deltas = [(endPos[0] - startPos[0]) / 4, (endPos[1] - startPos[1]) / 4, (endPos[2] - startPos[2]) / 4];
    Maze.displayPegman(startPos[0] + deltas[0],
        startPos[1] + deltas[1],
        Maze.constrainDirection16(startPos[2] + deltas[2]));
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(startPos[0] + deltas[0] * 2,
            startPos[1] + deltas[1] * 2,
            Maze.constrainDirection16(startPos[2] + deltas[2] * 2));
    }, Maze.stepSpeed));
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(startPos[0] + deltas[0] * 3,
            startPos[1] + deltas[1] * 3,
            Maze.constrainDirection16(startPos[2] + deltas[2] * 3));
    }, Maze.stepSpeed * 2));
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(endPos[0], endPos[1],
            Maze.constrainDirection16(endPos[2]));
    }, Maze.stepSpeed * 3));
};

/**
 * Schedule the animations and sounds for a failed move.
 * @param {boolean} forward True if forward, false if backward.
 */
Maze.scheduleFail = function (forward) {
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
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(Maze.pegmanX,
            Maze.pegmanY,
            direction16);
    }, Maze.stepSpeed));
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(Maze.pegmanX + deltaX,
            Maze.pegmanY + deltaY,
            direction16);
        Blockly.playAudio('whack', .5);
    }, Maze.stepSpeed * 2));
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
    }, Maze.stepSpeed * 3));
};

/**
 * Schedule the animations and sound for a victory dance.
 * @param {boolean} sound Play the victory sound.
 */
Maze.scheduleFinish = function (sound) {
    var direction16 = Maze.constrainDirection16(Maze.pegmanD * 4);
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
    if (sound) {
        Blockly.playAudio('win', .5);
    }
    Maze.stepSpeed = 150; // Slow down victory animation a bit.
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 18);
    }, Maze.stepSpeed));
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
    }, Maze.stepSpeed * 2));
    Maze.pidList.push(window.setTimeout(function () {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
    }, Maze.stepSpeed * 3));
};

Maze.pegmanDownTheRabittHole = function () {

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
    content = document.getElementById('dialogPegmanDownTheHoleBP_Level_' + Maze.LEVEL);
    style = {
        width: '430px',
        top: '300px'
    };
    style[Blockly.RTL ? 'right' : 'left'] = '110px';
    //origin = toolbar[0].getSvgRoot();
    origin = toolbar[0];
	var button = document.getElementById("dialogPegmanDownTheHoleBP_Level_" + Maze.LEVEL + "_button");
	if (button.addEventListener) {
		button.addEventListener("click",
			function () {
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
Maze.scheduleHoleAheadOfPegman = function () {
    // Move Pegman into start position.
    //Maze.pegmanX = Maze.start_.x;
    //Maze.pegmanY = Maze.start_.y;
    //Maze.pegmanD = Maze.startDirection;
    //Maze.pegmanX = Maze.holeLocation[0];
    //Maze.pegmanY = Maze.holeLocation[1];
    //Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4);
    Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4], [Maze.holeLocation[0], Maze.holeLocation[1], Maze.pegmanD * 4]);

    window.setTimeout(function () {
        document.getElementById('pegman').setAttribute("style", "visibility:hidden;");
        Maze.pegmanDownTheRabittHole();
    }, 500);
    //throw false;
};

/**
 * Display Pegman at the specified location, facing the specified direction.
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 */
Maze.displayPegman = function (x, y, d) {
    var pegmanIcon = document.getElementById('pegman');
    pegmanIcon.setAttribute('x',
        x * Maze.SQUARE_SIZE - d * Maze.PEGMAN_WIDTH + 1);
    pegmanIcon.setAttribute('y',
        Maze.SQUARE_SIZE * (y + 0.5) - Maze.PEGMAN_HEIGHT / 2 - 8);

    var clipRect = document.getElementById('clipRect');
    clipRect.setAttribute('x', x * Maze.SQUARE_SIZE + 1);
    clipRect.setAttribute('y', pegmanIcon.getAttribute('y'));

    if (Maze.LEVEL >= 7) //TODO: Re factor this code, not pretty
    {
        Maze.displayHiddenElements();
    }

};

Maze.displayHiddenElements = function () {
    if (Maze.LEVEL >= 7) //TODO: Re factor this code, not pretty
    {
        if ((Maze.holeLocation[0] != 0) && (Maze.holeLocation[1] != 0)) { //If hole is not removed(Logically) display it in the location designated for it by the Maze.holeLocation
            var svgHole = document.getElementById('circleHole');
            svgHole.setAttribute('cx', (Maze.holeLocation[0] + 0.5) * Maze.SQUARE_SIZE); //TODO: Think about how this change could affect remove/add hole.
            svgHole.setAttribute('cy', (Maze.holeLocation[1] + 0.5) * Maze.SQUARE_SIZE);
            svgHole.setAttribute("style", "visibility:visible;");
            if (Maze.LEVEL == 8) {
                svgHole.setAttribute('fill', "green");
            }
        }
        //Display the pegman in case it went down the rabbit hole.
        document.getElementById('pegman').setAttribute("style", "visibility:visible;");
    }
}
/**
 * Reset hole to it's default location.
 */
Maze.resetHole = function () {
    Maze.holeLocation = jQuery.extend(true, {}, Maze.holeLocations[Maze.LEVEL]);
}

/**
 * Display the look icon at Pegman's current location,
 * in the specified direction.
 * @param {!Maze.DirectionType} d Direction (0 - 3).
 */
Maze.scheduleLook = function (d) {
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
Maze.scheduleLookStep = function (path, delay) {
    Maze.pidList.push(window.setTimeout(function () {
        path.style.display = 'inline';
        window.setTimeout(function () {
            path.style.display = 'none';
        }, Maze.stepSpeed * 2);
    }, delay));
};

/**
 * Keep the direction within 0-3, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Maze.constrainDirection4 = function (d) {
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
Maze.constrainDirection16 = function (d) {
    if (d < 0) {
        d += 16;
    } else if (d > 15) {
        d -= 16;
    }
    return d;
};

// API
// Human-readable aliases.

Maze.moveForward = function (id) {
    Maze.move(0, id);
};

Maze.moveBackward = function (id) {
    Maze.move(2, id);
};

Maze.turnLeft = function (id) {
    Maze.turn(0, id);
};

Maze.turnRight = function (id) {
    Maze.turn(1, id);
};

Maze.isPathForward = function (id) {
    return Maze.isPath(0, id);
};

Maze.isPathRight = function (id) {
    return Maze.isPath(1, id);
};

Maze.isPathBackward = function (id) {
    return Maze.isPath(2, id);
};

Maze.isPathLeft = function (id) {
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
Maze.move = function (direction, id) {
    if (!Maze.isPath(direction, null)) {
        BlocklyApps.log.push(['fail_' + (direction ? 'backward' : 'forward'), id]);
        //throw false; // Put this back if you want the run to stop of a failed move.
    } else if (Maze.isHoleAhead(id)) {
        BlocklyApps.log.push(['holeAheadOfPegman', id]);
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
Maze.turn = function (direction, id) {
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
Maze.isPath = function (direction, id) {
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
/** Is there a Hole forward to the pegman
 * 	isHoleAhead
 */
Maze.isHoleAhead = function (id) {
    return Maze.isHoleAdjacent(0, id); //because the direction is 0, we actually ask if there is a hole before the pegman.
};

/**
 * Is there a Hole next to pegman?
 * @param {number} direction Direction to look
 *     (0 = forward, 1 = right, 2 = backward, 3 = left).
 * @param {?string} id ID of block that triggered this action.
 *     Null if called as a helper function in Maze.move().
 * @return {boolean} True if there is a path.
 */
Maze.isHoleAdjacent = function (direction, id) {
    var effectiveDirection = Maze.pegmanD + direction;
    //var square;
    var command;
    var bool = false;
    switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
        if (Maze.pegmanX == Maze.holeLocation[0]) {
            if ((Maze.pegmanY - 1) == Maze.holeLocation[1]) {
                bool = true;
            }
        }
        //square = Maze.map[Maze.pegmanY - 1] && Maze.map[Maze.pegmanY - 1][Maze.pegmanX];
        command = 'hole_north';
        break;
    case Maze.DirectionType.EAST:
        if ((Maze.pegmanX + 1) == Maze.holeLocation[0]) {
            if (Maze.pegmanY == Maze.holeLocation[1]) {
                bool = true;
            }
        }
        //square = Maze.map[Maze.pegmanY][Maze.pegmanX + 1];
        command = 'hole_east';
        break;
    case Maze.DirectionType.SOUTH:
        if (Maze.pegmanX == Maze.holeLocation[0]) {
            if ((Maze.pegmanY + 1) == Maze.holeLocation[1]) {
                bool = true;
            }
        }
        //square = Maze.map[Maze.pegmanY + 1] && Maze.map[Maze.pegmanY + 1][Maze.pegmanX];
        command = 'hole_south';
        break;
    case Maze.DirectionType.WEST:
        if ((Maze.pegmanX - 1) == Maze.holeLocation[0]) {
            if (Maze.pegmanY == Maze.holeLocation[1]) {
                bool = true;
            }
        }
        //square = Maze.map[Maze.pegmanY][Maze.pegmanX - 1];
        command = 'hole_west';
        break;
    }
    if (id) {
        BlocklyApps.log.push([command, id]);
    }
    return bool;
    //return square !== Maze.SquareType.WALL && square !== undefined;
};

/**
 * This function removes the hole from the pegman's path
 */
Maze.removeHole = function () {
    
	Maze.holeLocation[0] = 0; //0 - marks off the grid
    Maze.holeLocation[1] = 0; //0 - marks off the grid
    BlocklyApps.log.push(['hide_hole']);
}
/**
 * This function adds the hole to the pegman's path
 */
Maze.addHole = function () {
    Maze.holeLocation = jQuery.extend(true, {}, Maze.holeLocations[Maze.LEVEL]);
    BlocklyApps.log.push(['show_hole']);
    //document.getElementById('circleHole').setAttribute("style","visibility:visible;");
}

/**
 * BP show code function.
 * Show the user's code in raw JavaScript.
 * @param {Element} origin Animate the dialog opening/closing from/to this
 *     DOM element.  If null, don't show any animations for opening or closing.
 */
Maze.showCode = function (origin) {
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

/*Show code hot key listener
 */