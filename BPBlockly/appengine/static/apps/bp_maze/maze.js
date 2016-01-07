/**
 * Blockly Demo: Maze
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
 * @fileoverview Demonstration of Blockly: Solving a maze.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Maze = {};

Maze.MAX_LEVEL = 10;
var level = window.location.search.match(/[?&]level=(\d+)/);
level = level ? level[1] : 1;
level = Math.min(Math.max(1, level), Maze.MAX_LEVEL);
var frameSrc = (level > 9 ? frameSrc10 : frameSrc9).join('&');
document.write(mazepage.start({}, null,
    {MSG: MSG, level: level, frameSrc: frameSrc}));
var maxBlocks = [undefined, // Level 0.
    Infinity, Infinity, 6, Infinity, 6, 6, 10, 7, 10, Infinity][level];//Change level 4 to 3 again

/**
 * Milliseconds between each animation frame.
 */
Maze.STEP_SPEED = 150;

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
 /* Original
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 1, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
  */
 // Level 1 - Adiel Version 1
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 /* 
 // Level 2. 
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 3, 0, 0, 0],
  [0, 0, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],*/
  // Level 2 - Adiel Version 2
  [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 1, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 // Level 3.-commented
 /*
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 1, 1, 1, 1, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],*/
  // Level 3 - Adiel Version 3
  [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0 , 0, 0, 0],
  [0, 0, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 // Level 4. -Commented out
 /*[[0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 1, 3, 0],
  [0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0],
  [0, 2, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0]],
  */
  // Level 4 - Adiel
  [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 1, 1, 1, 1, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 // Level 5.
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 3, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
  [0, 2, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 // Level 6.
 /*[[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 2, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 1, 3, 0, 1, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],*/
  // Level 6 - Adiel
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 3, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
  [0, 2, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 // Level 7.
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0],
  [0, 2, 1, 1, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 // Level 8.
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [3, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 2, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 // Level 9.
 [[0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 3, 0, 1, 0],
  [0, 1, 1, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [0, 2, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]],
 // Level 10.  This is a dummy maze, to be replaced by a dynamic maze
 // of the same size generated by Maze.randomizeMaze().
  [[0, 1, 1, 1, 1, 1, 1, 3],
  [0, 1, 0, 0, 0, 1, 0, 0], 
  [0, 1, 0, 1, 1, 1, 1, 1],
  [0, 1, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 2, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1]],

 [[0, 1, 1, 1, 1, 1, 1, 3],
  [0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 1, 1, 1],
  [0, 1, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 0],
  [1, 0, 2, 1, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 0]],
 
  
  [[0, 1, 1, 1, 1, 1, 1, 3],
  [0, 1, 0, 0, 0, 1, 0, 0], 
  [0, 1, 0, 1, 1, 1, 1, 1],
  [0, 1, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1]],
  
][level];

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
 * Starting direction.
 */
Maze.startDirection = Maze.DirectionType.EAST;

/**
 * PIDs of animation tasks currently executing.
 */
Maze.pidList = [];

Maze.deadEnd = function(x, y, angle) {
  var path = document.createElementNS(Blockly.SVG_NS, 'path');
  path.setAttribute('d',
      'M' + (x + Maze.PATH_WIDTH) + ',' + (y + Maze.SQUARE_SIZE) +
      ' v' + -Maze.SQUARE_SIZE / 2 +
      ' a' + (Maze.PATH_WIDTH / 2) + ',' + (Maze.PATH_WIDTH / 2) + ' 0 0,1 ' +
          Maze.PATH_WIDTH + ',0' +
      ' v' + Maze.SQUARE_SIZE / 2);
  path.setAttribute('fill', 'yellow');
  path.setAttribute('stroke-width', 1);
  path.setAttribute('stroke', '#C8BEAE');
  path.setAttribute('transform', 'rotate(' + angle + ' ' +
      (x + Maze.SQUARE_SIZE / 2) + ' ' + (y + Maze.SQUARE_SIZE / 2) + ')');
  return path;
};

Maze.thru = function(x, y, angle) {
  var rect = document.createElementNS(Blockly.SVG_NS, 'rect');
  rect.setAttribute('x', x + Maze.PATH_WIDTH);
  rect.setAttribute('y', y);
  rect.setAttribute('width', Maze.PATH_WIDTH);
  rect.setAttribute('height', Maze.SQUARE_SIZE);
  rect.setAttribute('fill', 'yellow');
  rect.setAttribute('stroke-width', 1);
  rect.setAttribute('stroke', '#C8BEAE');
  rect.setAttribute('transform', 'rotate(' + angle + ' ' +
      (x + Maze.SQUARE_SIZE / 2) + ' ' + (y + Maze.SQUARE_SIZE / 2) + ')');
  return rect;
};

Maze.elbow = function(x, y, angle) {
  var rx = Maze.PATH_WIDTH / 2;
  var path = document.createElementNS(Blockly.SVG_NS, 'path');
  path.setAttribute('fill', 'yellow');
  path.setAttribute('stroke-width', 1);
  path.setAttribute('stroke', '#C8BEAE');
  path.setAttribute('d',
      'M' + (x + Maze.PATH_WIDTH) + ',' + (y + Maze.SQUARE_SIZE) +
      ' v' + -(Maze.SQUARE_SIZE / 2) +
      ' a' + rx + ',' + rx + ' 0 0,1 ' + rx + ',' + -rx +
      ' h' + (Maze.SQUARE_SIZE / 2) +
      ' v' + Maze.PATH_WIDTH +
      ' h' + -Maze.PATH_WIDTH +
      ' v' + Maze.PATH_WIDTH);
  path.setAttribute('transform', 'rotate(' + angle + ' ' +
      (x + Maze.SQUARE_SIZE / 2) + ' ' + (y + Maze.SQUARE_SIZE / 2) + ')');
  return path;
};

Maze.junction = function(x, y, angle) {
  var path = document.createElementNS(Blockly.SVG_NS, 'path');
  path.setAttribute('fill', 'yellow');
  path.setAttribute('stroke-width', 1);
  path.setAttribute('stroke', '#C8BEAE');
  path.setAttribute('d', 'M' + (x + Maze.PATH_WIDTH) + ',' + y +
      ' h' + Maze.PATH_WIDTH + ' v' + Maze.PATH_WIDTH +
      ' h' + Maze.PATH_WIDTH + ' v' + Maze.PATH_WIDTH +
      ' h' + -Maze.PATH_WIDTH + ' v' + Maze.PATH_WIDTH +
      ' h' + -Maze.PATH_WIDTH + ' v' + -Maze.SQUARE_SIZE);
  path.setAttribute('transform', 'rotate(' + angle + ' ' +
      (x + Maze.SQUARE_SIZE / 2) + ' ' + (y + Maze.SQUARE_SIZE / 2) + ')');
  return path;
};

Maze.cross = function(x, y, angle) {
  var path = document.createElementNS(Blockly.SVG_NS, 'path');
  path.setAttribute('fill', 'yellow');
  path.setAttribute('stroke-width', 1);
  path.setAttribute('stroke', '#C8BEAE');
  path.setAttribute('d', 'M' + (x + Maze.PATH_WIDTH) + ',' + y +
      ' h' + Maze.PATH_WIDTH + ' v' + Maze.PATH_WIDTH +
      ' h' + Maze.PATH_WIDTH + ' v' + Maze.PATH_WIDTH +
      ' h' + -Maze.PATH_WIDTH + ' v' + Maze.PATH_WIDTH +
      ' h' + -Maze.PATH_WIDTH + ' v' + -Maze.PATH_WIDTH +
      ' h' + -Maze.PATH_WIDTH + ' v' + -Maze.PATH_WIDTH +
      ' h' + Maze.PATH_WIDTH + ' v' + -Maze.PATH_WIDTH);
  path.setAttribute('transform', 'rotate(' + angle + ' ' +
      (x + Maze.SQUARE_SIZE / 2) + ' ' + (y + Maze.SQUARE_SIZE / 2) + ')');
  return path;
};

Maze.tile_SHAPES = {
  '10010': [Maze.deadEnd, 0],
  '10001': [Maze.deadEnd, 90],
  '11000': [Maze.deadEnd, 180],
  '10100': [Maze.deadEnd, -90],
  '11010': [Maze.thru, 0],
  '10101': [Maze.thru, 90],
  '10110': [Maze.elbow, 0],
  '10011': [Maze.elbow, 90],
  '11001': [Maze.elbow, 180],
  '11100': [Maze.elbow, -90],
  '11110': [Maze.junction, 0],
  '10111': [Maze.junction, 90],
  '11011': [Maze.junction, 180],
  '11101': [Maze.junction, -90],
  '11111': [Maze.cross, -90]
};

Maze.drawMap = function() {
  var svg = document.getElementById('svgMaze');

  // On subsequent calls within a level, the map must first be cleared.
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  // Draw the outer square.
  var square = document.createElementNS(Blockly.SVG_NS, 'rect');
  square.setAttribute('width', Maze.MAZE_WIDTH);
  square.setAttribute('height', Maze.MAZE_HEIGHT);
  square.setAttribute('fill', '#F1EEE7');
  square.setAttribute('stroke-width', 1);
  square.setAttribute('stroke', '#C8BEAE');
  svg.appendChild(square);

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
  for (var y = 0; y < Maze.ROWS; y++) {
    for (var x = 0; x < Maze.COLS; x++) {
      // Compute the tile index.
      var tile = normalize(x, y) +
          normalize(x, y - 1) +  // North.
          normalize(x + 1, y) +  // West.
          normalize(x, y + 1) +  // South.
          normalize(x - 1, y);   // East.

      // Draw the tile (or nothing, if wall).
      if (Maze.tile_SHAPES[tile]) {
        var shape = Maze.tile_SHAPES[tile][0];
        var angle = Maze.tile_SHAPES[tile][1];
        svg.appendChild(shape(x * Maze.SQUARE_SIZE,
                              y * Maze.SQUARE_SIZE, angle));
      }
    }
  }

  // Draw the grid lines.
  for (var k = 1; k < Maze.ROWS; k++) {
    var h_line = document.createElementNS(Blockly.SVG_NS, 'line');
    h_line.setAttribute('y1', k * Maze.SQUARE_SIZE);
    h_line.setAttribute('x2', Maze.MAZE_WIDTH);
    h_line.setAttribute('y2', k * Maze.SQUARE_SIZE);
    h_line.setAttribute('stroke', '#C8BEAE');
    h_line.setAttribute('stroke-width', 2);
    svg.appendChild(h_line);
  }
  for (var k = 1; k < Maze.COLS; k++) {
    var v_line = document.createElementNS(Blockly.SVG_NS, 'line');
    v_line.setAttribute('x1', k * Maze.SQUARE_SIZE);
    v_line.setAttribute('x2', k * Maze.SQUARE_SIZE);
    v_line.setAttribute('y2', Maze.MAZE_HEIGHT);
    v_line.setAttribute('stroke', '#C8BEAE');
    v_line.setAttribute('stroke-width', 2);
    svg.appendChild(v_line);
  }

  // Add finish marker.
  var finishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
  finishMarker.setAttribute('id', 'finish');
  finishMarker.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      'marker.png');
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

  // Add pegman.
  var pegmanIcon = document.createElementNS(Blockly.SVG_NS, 'image');
  pegmanIcon.setAttribute('id', 'pegman');
  pegmanIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      'pegman.png');
  pegmanIcon.setAttribute('height', Maze.PEGMAN_HEIGHT);
  pegmanIcon.setAttribute('width', Maze.PEGMAN_WIDTH * 18); // 49 * 18 = 882
  pegmanIcon.setAttribute('clip-path', 'url(#pegmanClipPath)');
  svg.appendChild(pegmanIcon);
};

/**
 * Initialize Blockly and the maze.  Called on page load.
 * @param {!Blockly} blockly Instance of Blockly from iframe.
 */
Maze.init = function(blockly) {
  window.Blockly = blockly;
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  Maze.checkTimeout(%1);\n';
  if (level === 10) {
    //Maze.randomizeMaze(); // Gera: To allow us to draw the maze for level 10
  }
  Maze.drawMap();

  //window.onbeforeunload = function() {
  //  if (Blockly.mainWorkspace.getAllBlocks().length > 1 &&
  //      window.location.hash.length <= 1) {
  //    return 'Leaving this page will result in the loss of your work.';
  //  }
  //  return null;
  //};

  if (!('BlocklyStorage' in window)) {
    document.getElementById('linkButton').className = 'disabled';
  }
  // An href with #key trigers an AJAX call to retrieve saved blocks.
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else {
    // Load the editor with a starting block.
    /*
	if (level < Maze.MAX_LEVEL) {
      var xml = Blockly.Xml.textToDom(
          '<xml>' +
          '  <block type="maze_moveForward" x="250" y="70"></block>' +
          '</xml>');
    } else {
      var xml = Blockly.Xml.textToDom(
          '<xml>' +
          '  <block type="maze_move" x="100" y="70"></block>' +
          '</xml>');
    }
	*/
	
	if (level <= 2) {
      var xml = Blockly.Xml.textToDom(
          '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="scoped_request" inline="false" x="213" y="68"><value name="REQUEST"><block type="bp_forward"></block></value></block></xml>');
		  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    }
	else if(level === 4)
	{
		var xml = Blockly.Xml.textToDom(
          '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_doForever" x="203" y="103"></block></xml>');
		  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
		
	}
	else if(level === 5)
	{
		var xml = Blockly.Xml.textToDom(
          '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="bp_doForever" x="260" y="126"><statement name="DO"><block type="scoped_request" inline="false"><value name="REQUEST"><block type="bp_forward"></block></value><next><block type="maze_if"><title name="DIR">isPathLeft</title></block></next></block></statement></block></xml>');
		  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
	
	}
    // Configure any level-specific buttons.
	else if (level > 8) {
		restore_blocks(); //Gera - use restore blocks only for level 8 and more
		var randomizeButton = document.getElementById('randomizeButton');
		randomizeButton.style.display = 'inline';
		randomizeButton.title = level === 9 ?
        MSG.randomizeTooltip1 : MSG.randomizeTooltip2;
    }
    //Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  }

  // Locate the start and finish squares.
  for (var y = 0; y < Maze.ROWS; y++) {
    for (var x = 0; x < Maze.COLS; x++) {
      if (Maze.map[y][x] == Maze.SquareType.START) {
        Maze.start_ = {x: x, y: y};
      } else if (Maze.map[y][x] == Maze.SquareType.FINISH) {
        Maze.finish_ = {x: x, y: y};
      }
    }
  }

  Maze.reset();

  function onchange() {
    var cap = Blockly.mainWorkspace.remainingCapacity();
    var p = document.getElementById('capacity');
    if (cap == Infinity) {
      p.innerHTML = '';
    } else if (cap == 0) {
      p.innerHTML = MSG.capacity0;
    } else if (cap == 1) {
      p.innerHTML = MSG.capacity1;
    } else {
      cap = Number(cap);
      p.innerHTML = MSG.capacity2.replace('%1', cap);
    }
	
	backup_blocks(); // Gera
  }

  Blockly.addChangeListener(onchange);
};

/**
 * Reset the maze to the start position and kill any pending animation tasks.
 */
Maze.reset = function() {
  // Move Pegman into position.
  Maze.pegmanX = Maze.start_.x;
  Maze.pegmanY = Maze.start_.y;
  Maze.pegmanD = Maze.startDirection;
  Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4);

  // Move the finish icon into position.
  var finishIcon = document.getElementById('finish');
  finishIcon.setAttribute('x', Maze.SQUARE_SIZE * (Maze.finish_.x + 0.5) -
      finishIcon.getAttribute('width') / 2);
  finishIcon.setAttribute('y', Maze.SQUARE_SIZE * (Maze.finish_.y + 0.6) -
      finishIcon.getAttribute('height'));

  // Kill all tasks.
  for (var x = 0; x < Maze.pidList.length; x++) {
    window.clearTimeout(Maze.pidList[x]);
  }
  Maze.pidList = [];
};

/**
 * Click the run button.  Start the program.
 */
Maze.runButtonClick = function() {
  // Only allow a single top block on levels 1 and 2.
  if (level <= 2 && Blockly.mainWorkspace.getTopBlocks().length > 1) {
    window.alert(MSG.oneTopBlock);
    return;
  }
  document.getElementById('runButton').style.display = 'none';
  document.getElementById('resetButton').style.display = 'inline';
  Blockly.mainWorkspace.traceOn(true);
  Maze.execute();
};

/**
 * Click the reset button.  Reset the maze.
 */
Maze.resetButtonClick = function() {
  document.getElementById('runButton').style.display = 'inline';
  document.getElementById('resetButton').style.display = 'none';
  Blockly.mainWorkspace.traceOn(false);
  Maze.reset();
};

// Randomization.

/**
 * Move the start and finish to random locations.
 * Set the starting direction randomly.
 */
Maze.randomizeMarkers = function() {
  /**
   * Find a random point that's a dead-end on the maze.
   * Set this point to be the given SquareType.
   * This function is a closure, but does not reference any outside variables.
   * @param {Maze.SquareType} state Should be either Maze.SquareType.START or
   *     Maze.SquareType.FINISH.
   * @return {!Object} X-Y coordinates of new point.
   */
  function findCorner(state) {
    while (true) {
      var x = Math.floor(Math.random() * (Maze.map[0].length - 2)) + 1;
      var y = Math.floor(Math.random() * (Maze.map.length - 2) + 1);
      if (Maze.map[y][x] == Maze.SquareType.OPEN) {
        // Count the walls.
        var walls = 0;
        if (Maze.map[y + 1][x] == Maze.SquareType.WALL) {
          walls++;
        }
        if (Maze.map[y - 1][x] == Maze.SquareType.WALL) {
          walls++;
        }
        if (Maze.map[y][x + 1] == Maze.SquareType.WALL) {
          walls++;
        }
        if (Maze.map[y][x - 1] == Maze.SquareType.WALL) {
          walls++;
        }
        if (walls == 3) {
          Maze.map[y][x] = state;
          return {x: x, y: y};
        }
      }
    }
  }

  // Clear the existing start and finish locations.
  Maze.map[Maze.start_.y][Maze.start_.x] = Maze.SquareType.OPEN;
  Maze.map[Maze.finish_.y][Maze.finish_.x] = Maze.SquareType.OPEN;

  Maze.start_ = findCorner(Maze.SquareType.START);
  Maze.finish_ = findCorner(Maze.SquareType.FINISH);
  Maze.startDirection = Math.floor(Math.random() * 4);
  Maze.reset();
};

/**
 * Generate a random maze.  This mutates Maze.map, Maze.start_, and
 * Maze.finish_.
 */
Maze.randomizeMaze = function() {
  function create2dArray(rows, cols, initial) {
    var col = new Array(rows);
    for (var i = 0; i < rows; i++) {
      col[i] = initial;
    }
    var arr = new Array(cols);
    for (var i = 0; i < cols; i++) {
      arr[i] = [].concat(col);
    }
    return arr;
  }
  function expand(x, y, visited) {
    visited[y][x] = true;
    var neighbors = getUnvisitedNeighbors(x, y, visited);
    if (neighbors.length == 0) {
      return;
    }
    var newCell = neighbors[Math.floor(Math.random() * neighbors.length)];
    var newX = newCell[0];
    var newY = newCell[1];
    Maze.map[newY][newX] = 1;  // Dig through adjacent cell.
    expand(newX, newY, visited);
  }
  function getUnvisitedNeighbors(x, y, visited) {
    var results = [];
    var width = visited.length;
    var height = visited[0].length;

    // East
    if (x + 1 < width && !visited[y][x + 1]) {
      results.push([x + 1, y]);
    }
    // West
    if (x - 1 >= 0 && !visited[y][x - 1]) {
      results.push([x - 1, y]);
    }
    // North
    if (y - 1 >= 0 && !visited[y - 1][x]) {
      results.push([x, y - 1]);
    }
    // South
    if (y + 1 < height && !visited[y + 1][x]) {
      results.push([x, y + 1]);
    }

    return results;
  }
  // Start with an empty maze and random coordinates.
  Maze.map = create2dArray(Maze.ROWS, Maze.COLS, 0);
  var visited = create2dArray(Maze.ROWS, Maze.COLS, false);
  var x = Math.floor(Math.random() * Maze.COLS);
  var y = Math.floor(Math.random() * Maze.ROWS);
  Maze.map[y][x] = Maze.SquareType.START;
  visited[y][x] = true;
  Maze.start_ = {x: x, y: y};

  // Randomly expand the maze.
  expand(x, y, visited);

  // Choose a random finish square.
  while (Maze.map[y][x] != Maze.SquareType.OPEN) {
    x = Math.floor(Math.random() * Maze.COLS);
    y = Math.floor(Math.random() * Maze.ROWS);
  }
  Maze.map[y][x] = Maze.SquareType.FINISH;
  Maze.finish_ = {x: x, y: y};

  // Choose a random direction.
  Maze.startDirection = Math.floor(Math.random() * 4);
};

/**
 * Respond to a click of randomizeButton.  If level is 9, this randomizes the
 * markers.  If level is 10, this randomizes the entire maze.
 */
Maze.randomize = function() {
  if (level === 9) {
    Maze.randomizeMarkers();
  } else if (level === 10) {
   Maze.randomizeMaze();
    Maze.drawMap();
    Maze.reset();
  }
};

/**
 * Execute the user's code.  Heaven help us...
 */
Maze.execute = function() {
  Maze.path = [];
  Maze.ticks = 400; //Adiel - key limitation that can affect whther or not we can solve the maze
  var code = Maze.workspaceToCode('JavaScript');
  //var code = Blockly.Generator.workspaceToCode('JavaScript');
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
function logger() {\
  while(true){\
 	yield({wait: [function(x){return true;}]});\
	console.log('event log:'+bp.lastEvent);\
	Maze.checkTimeout();\
  }\
}\
bp.addBThread('logger', priority++, logger);\
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
  
//Adiel -stopeed logger here   Add this line if we want it after yield- console.log('event log:'+bp.lastEvent);\  
     eval('var priority=1; var bp = new BProgram();\n'+extraCode+code+";bp.event('start');");  // GERA: Added Behavioral Programming here
  } catch (e) {
    // A boolean is thrown for normal termination.
    // Abnormal termination is a user error.
    if (typeof e != 'boolean') {
      alert(e);
    }
  }
  // Maze.path now contains a transcript of all the user's actions.
  // Reset the maze and animate the transcript.
  Maze.reset();
  Maze.pidList.push(window.setTimeout(Maze.animate, 100));
};

/**
 * Iterate through the recorded path and animate pegman's actions.
 */
Maze.animate = function() {
  // All tasks should be complete now.  Clean up the PID list.
  Maze.pidList = [];

  var action = Maze.path.shift();
  if (!action) {
    Blockly.mainWorkspace.highlightBlock(null);
    return;
  }
  Blockly.mainWorkspace.highlightBlock(action[1]);

  switch (action[0]) {
    case 'north':
      Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX, Maze.pegmanY - 1, Maze.pegmanD * 4]);
      Maze.pegmanY--;
      break;
    case 'east':
      Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX + 1, Maze.pegmanY, Maze.pegmanD * 4]);
      Maze.pegmanX++;
      break;
    case 'south':
      Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX, Maze.pegmanY + 1, Maze.pegmanD * 4]);
      Maze.pegmanY++;
      break;
    case 'west':
      Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX - 1, Maze.pegmanY, Maze.pegmanD * 4]);
      Maze.pegmanX--;
      break;
    case 'fail_forward':
      Maze.scheduleFail(true);
      break;
    case 'fail_backward':
      Maze.scheduleFail(false);
      break;
    case 'left':
      Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4 - 4]);
      Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD - 1);
      break;
    case 'right':
      Maze.schedule([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4 + 4]);
      Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD + 1);
      break;
    case 'finish':
      Maze.scheduleFinish();
      window.setTimeout(Maze.congratulations, 1000);
  }

  Maze.pidList.push(window.setTimeout(Maze.animate, Maze.STEP_SPEED * 5));
};

Maze.congratulations = function() {
  if (level < Maze.MAX_LEVEL) {
    var proceed = window.confirm(MSG.nextLevel.replace('%1', level + 1));
    if (proceed) {
      window.location = window.location.protocol + '//' +
          window.location.hostname + window.location.pathname +
          '?level=' + (level + 1);
    }
  } else {
    alert(MSG.finalLevel);
  }
};

/**
 * Schedule the animations for a move or turn.
 * @param {!Array.<number>} startPos X, Y and direction starting points.
 * @param {!Array.<number>} endPos X, Y and direction ending points.
 */
Maze.schedule = function(startPos, endPos) {
  var deltas = [(endPos[0] - startPos[0]) / 4,
                (endPos[1] - startPos[1]) / 4,
                (endPos[2] - startPos[2]) / 4];
  Maze.displayPegman(startPos[0] + deltas[0],
                     startPos[1] + deltas[1],
                     Maze.constrainDirection16(startPos[2] + deltas[2]));
  Maze.pidList.push(window.setTimeout(function() {
      Maze.displayPegman(startPos[0] + deltas[0] * 2,
          startPos[1] + deltas[1] * 2,
          Maze.constrainDirection16(startPos[2] + deltas[2] * 2));
    }, Maze.STEP_SPEED));
  Maze.pidList.push(window.setTimeout(function() {
      Maze.displayPegman(startPos[0] + deltas[0] * 3,
          startPos[1] + deltas[1] * 3,
          Maze.constrainDirection16(startPos[2] + deltas[2] * 3));
    }, Maze.STEP_SPEED * 2));
  Maze.pidList.push(window.setTimeout(function() {
      Maze.displayPegman(endPos[0], endPos[1],
          Maze.constrainDirection16(endPos[2]));
    }, Maze.STEP_SPEED * 3));
};

/**
 * Schedule the animations for a failed move.
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
    deltaX = - deltaX;
    deltaY = - deltaY;
  }
  var direction16 = Maze.constrainDirection16(Maze.pegmanD * 4);
  Maze.displayPegman(Maze.pegmanX + deltaX,
                     Maze.pegmanY + deltaY,
                     direction16);
  Maze.pidList.push(window.setTimeout(function() {
    Maze.displayPegman(Maze.pegmanX,
                       Maze.pegmanY,
                       direction16);
    }, Maze.STEP_SPEED));
  Maze.pidList.push(window.setTimeout(function() {
    Maze.displayPegman(Maze.pegmanX + deltaX,
                       Maze.pegmanY + deltaY,
                       direction16);
    }, Maze.STEP_SPEED * 2));
  Maze.pidList.push(window.setTimeout(function() {
      Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
    }, Maze.STEP_SPEED * 3));
};

/**
 * Schedule the animations for a victory dance.
 */
Maze.scheduleFinish = function() {
  var direction16 = Maze.constrainDirection16(Maze.pegmanD * 4);
  Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
  Maze.pidList.push(window.setTimeout(function() {
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 17);
    }, Maze.STEP_SPEED));
  Maze.pidList.push(window.setTimeout(function() {
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
    }, Maze.STEP_SPEED * 2));
  Maze.pidList.push(window.setTimeout(function() {
      Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
    }, Maze.STEP_SPEED * 3));
};

/**
 * Display Pegman at a the specified location, facing the specified direction.
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

/**
 * If the user has executed too many actions, we're probably in an infinite
 * loop.  Sadly I wasn't able to solve the Halting Problem for this demo.
 * @param {?string} id ID of loop block to highlight if timeout is reached.
 * @throws {false} Throws an error to terminate the user's program.
 */
Maze.checkTimeout = function(id) {

  if (Maze.ticks-- < 0) {
    if (id) {
      // Highlight an infinite loop on death.
      Maze.path.push(['loop', id]);
	  
  	  alert('timeout!');
    }
    throw false;
  }
};

/**
 * Show the user's code in raw JavaScript.
 */
Maze.showCode = function() {  
  //var code = Blockly.Generator.workspaceToCode('JavaScript');
  var code = Maze.workspaceToCode('JavaScript');
  // Strip out serial numbers.
  //code = code.replace(/'\d+'/g, '');
  //code = code.replace(/\s*Maze\.checkTimeout\(\);/g, '');
  alert(code);
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

Maze.isPathForward = function() {
  return Maze.isPath(0);
};

Maze.isPathRight = function() {
  return Maze.isPath(1);
};

Maze.isPathBackward = function() {
  return Maze.isPath(2);
};

Maze.isPathLeft = function() {
  return Maze.isPath(3);
};

// Core functions.

/**
 * Move pegman forward or backward.
 * @param {number} direction Direction to move (0 = forward, 2 = backward).
 * @param {string} id ID of block that triggered this action.
 */
Maze.move = function(direction, id) {
  if (!Maze.isPath(direction)) {
    Maze.path.push(['fail_' + (direction ? 'backward' : 'forward'), id]);
    return;
  }
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
  Maze.path.push([command, id]);
  if (Maze.pegmanX == Maze.finish_.x && Maze.pegmanY == Maze.finish_.y) {
    // Finished.  Terminate the user's program.
    Maze.path.push(['finish', null]);
    throw true;
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
    Maze.path.push(['right', id]);
  } else {
    // Left turn (counterclockwise).
    Maze.pegmanD--;
    Maze.path.push(['left', id]);
  }
  Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD);
};

/**
 * Is there a path next to pegman?
 * @param {number} direction Direction to look
 *     (0 = forward, 1 = right, 2 = backward, 3 = left).
 * @return {boolean} True if there is a path.
 */
Maze.isPath = function(direction) {
  var effectiveDirection = Maze.pegmanD + direction;
  var square;
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      square = Maze.map[Maze.pegmanY - 1] &&
          Maze.map[Maze.pegmanY - 1][Maze.pegmanX];
      break;
    case Maze.DirectionType.EAST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX + 1];
      break;
    case Maze.DirectionType.SOUTH:
      square = Maze.map[Maze.pegmanY + 1] &&
          Maze.map[Maze.pegmanY + 1][Maze.pegmanX];
      break;
    case Maze.DirectionType.WEST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX - 1];
      break;
  }
  return square !== Maze.SquareType.WALL && square !== undefined;
};

Maze.workspaceToCode = function(name) {
  var code = [];
  var generator = Blockly.Generator.get(name);
  generator.init();
  var blocks = Blockly.mainWorkspace.getTopBlocks(true);  
 
  for (var x = 0, block; block = blocks[x]; x++) {
	Blockly.JavaScript.bp_reset_breakupon();
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
	  
	  //code.push("bp.addBThread('', priority++, function() {"); // Priority based
	  code.push("bp.addBThread('', 100, function() {"); // Round Robin
	  code.push("var blocked_events = [];");
	  code.push("var breakupon_events = [];");
      code.push(myFinish(line));
	  code.push(line);
	  code.push("});");	  
    }
  }

  code = code.join('\n');  // Blank line between each section.
  
  //Added code - adiel - commented this part out var definitions are inline now
  
  //code = generator.finish(code);
  
  // Final scrubbing of whitespace.
  code = code.replace(/^\s+\n/, '');
  code = code.replace(/\n\s+$/, '\n');
  code = code.replace(/[ \t]+\n/g, '\n');
  return code;
};

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
  return definitions.join('\n\n');/* + '\n\n\n' + code;*/
};


/**
* backup code blocks
*/
function backup_blocks() {
  if(typeof(Storage)!=="undefined")
  {
    var xml = Blockly.Xml.workspaceToDom( Blockly.mainWorkspace );
    localStorage.setItem('data',Blockly.Xml.domToText( xml ));
  } else {
    // Sorry! No web storage support..
  }
}

/**
* restore code blocks
*/
function restore_blocks() {
  if(typeof(Storage)!=="undefined"){
    if(localStorage.data!=null){
      var xml = Blockly.Xml.textToDom(localStorage.data);
      Blockly.Xml.domToWorkspace( Blockly.mainWorkspace, xml );
    }
  } else {
    // Sorry! No web storage support..
  }
}
